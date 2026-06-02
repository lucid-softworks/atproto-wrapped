import { CarReader } from "@ipld/car";
import * as dagCbor from "@ipld/dag-cbor";
import { CID } from "multiformats/cid";

export type RepoRecord = {
  collection: string;
  rkey: string;
  uri: string;
  value: Record<string, unknown>;
  createdAt: Date | null;
};

export type RepoStats = {
  did: string;
  handle: string;
  pds: string;
  totalRecords: number;
  byCollection: Map<string, RepoRecord[]>;
  carBytes: number;
  firstRecordAt: Date | null;
  latestRecordAt: Date | null;
};

const BSKY_APPVIEW = "https://public.api.bsky.app";
const CACHE_KEY_PREFIX = "atproto-wrapped:repo:";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const CACHE_VERSION = 3;

export async function resolveHandle(handle: string): Promise<string> {
  const clean = handle.replace(/^@/, "").trim();
  if (clean.startsWith("did:")) return clean;

  const url = `${BSKY_APPVIEW}/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(clean)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`couldn't resolve handle "${clean}" (status ${res.status})`);
  }
  const data = (await res.json()) as { did: string };
  return data.did;
}

export async function getDidDocument(did: string): Promise<Record<string, unknown>> {
  let url: string;
  if (did.startsWith("did:plc:")) {
    url = `https://plc.directory/${did}`;
  } else if (did.startsWith("did:web:")) {
    const domain = did.slice("did:web:".length).replace(/:/g, "/");
    url = `https://${domain}/.well-known/did.json`;
  } else {
    throw new Error(`unsupported DID method for ${did}`);
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`couldn't fetch DID doc for ${did} (status ${res.status})`);
  }
  return (await res.json()) as Record<string, unknown>;
}

export function getPdsEndpoint(didDoc: Record<string, unknown>): string {
  const services = (didDoc.service as Array<Record<string, unknown>> | undefined) ?? [];
  for (const svc of services) {
    const id = String(svc.id ?? "");
    const type = String(svc.type ?? "");
    if (id.endsWith("#atproto_pds") || type === "AtprotoPersonalDataServer") {
      const endpoint = String(svc.serviceEndpoint ?? "");
      if (endpoint) return endpoint.replace(/\/$/, "");
    }
  }
  throw new Error("no PDS endpoint found in DID document");
}

export async function fetchRepoCar(
  pds: string,
  did: string,
  onProgress?: (received: number, total: number | null) => void,
): Promise<Uint8Array> {
  const url = `${pds}/xrpc/com.atproto.sync.getRepo?did=${encodeURIComponent(did)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`couldn't fetch repo CAR from ${pds} (status ${res.status})`);
  }

  const totalHeader = res.headers.get("content-length");
  const total = totalHeader ? Number(totalHeader) : null;

  if (!res.body || !onProgress) {
    const buf = await res.arrayBuffer();
    return new Uint8Array(buf);
  }

  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      received += value.byteLength;
      onProgress(received, total);
    }
  }

  const out = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
}

function parseCreatedAt(value: unknown): Date | null {
  if (typeof value !== "string") return null;
  const t = Date.parse(value);
  if (Number.isNaN(t)) return null;
  return new Date(t);
}

/**
 * dag-cbor decodes IPLD CID tags into CID instances from `multiformats`, which
 * are custom classes — they break structuredClone (so IndexedDB caching fails)
 * and don't match the {$link} shape that callers expect. Walk the decoded
 * value and replace any CID with the JSON-style {$link: "<cid>"} form.
 *
 * This recurses through plain objects and arrays. Uint8Array values are
 * preserved as-is — they round-trip through structuredClone fine.
 */
function normalizeCids(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value !== "object") return value;

  const cid = CID.asCID(value);
  if (cid) return { $link: cid.toString() };

  if (value instanceof Uint8Array) return value;

  if (Array.isArray(value)) {
    const out = new Array(value.length);
    for (let i = 0; i < value.length; i++) out[i] = normalizeCids(value[i]);
    return out;
  }

  const obj: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    obj[k] = normalizeCids(v);
  }
  return obj;
}

/**
 * Walk an MST node's entries to produce (key → record CID) pairs.
 *
 * Each MST node has an entry list `e` where the keys are byte-string suffixes
 * compressed against the previous entry in the same node (`p` is the shared
 * prefix length). Subtrees referenced via `l` and `t` are separate nodes whose
 * own entries we visit when we iterate those blocks — there's no cross-node
 * prefix sharing, so we don't need to recurse here.
 *
 * The full key is the path `{collection}/{rkey}`.
 */
function extractMstEntries(
  node: Record<string, unknown>,
  onEntry: (key: string, cidStr: string) => void,
) {
  const entries = node.e;
  if (!Array.isArray(entries)) return;
  const decoder = new TextDecoder();
  let prevKey = "";
  for (const raw of entries) {
    if (!raw || typeof raw !== "object") continue;
    const e = raw as Record<string, unknown>;
    const p = typeof e.p === "number" ? e.p : 0;
    const k = e.k instanceof Uint8Array ? decoder.decode(e.k) : "";
    const key = prevKey.slice(0, p) + k;
    const v = e.v;
    if (v) {
      const cid = CID.asCID(v);
      if (cid) onEntry(key, cid.toString());
    }
    prevKey = key;
  }
}

export async function parseRepoCar(
  car: Uint8Array,
  did: string,
): Promise<{
  totalRecords: number;
  byCollection: Map<string, RepoRecord[]>;
  firstRecordAt: Date | null;
  latestRecordAt: Date | null;
}> {
  const reader = await CarReader.fromBytes(car);
  const byCollection = new Map<string, RepoRecord[]>();
  let firstRecordAt: Date | null = null;
  let latestRecordAt: Date | null = null;
  let totalRecords = 0;

  // Read all blocks into memory so we can do two passes (MST first, then
  // records) without re-streaming.
  type Block = { cidStr: string; bytes: Uint8Array; decoded: unknown };
  const blocks: Block[] = [];
  for await (const b of reader.blocks()) {
    let decoded: unknown;
    try {
      decoded = dagCbor.decode(b.bytes);
    } catch {
      continue;
    }
    blocks.push({ cidStr: b.cid.toString(), bytes: b.bytes, decoded });
  }

  // Pass 1: walk MST nodes to build cid → mst key.
  const cidToKey = new Map<string, string>();
  for (const b of blocks) {
    const d = b.decoded;
    if (
      d &&
      typeof d === "object" &&
      !Array.isArray(d) &&
      Array.isArray((d as Record<string, unknown>).e)
    ) {
      extractMstEntries(d as Record<string, unknown>, (key, cidStr) => {
        cidToKey.set(cidStr, key);
      });
    }
  }

  // Pass 2: process record blocks.
  for (const b of blocks) {
    const d = b.decoded;
    if (!d || typeof d !== "object" || Array.isArray(d)) continue;
    const rawObj = d as Record<string, unknown>;
    const type = rawObj["$type"];
    if (typeof type !== "string") continue;

    const mstKey = cidToKey.get(b.cidStr);
    let collection = type;
    let rkey = "";
    if (mstKey) {
      const slash = mstKey.indexOf("/");
      if (slash > 0) {
        collection = mstKey.slice(0, slash);
        rkey = mstKey.slice(slash + 1);
      }
    }

    const normalized = normalizeCids(rawObj) as Record<string, unknown>;
    const createdAt = parseCreatedAt(normalized.createdAt);
    if (createdAt) {
      if (!firstRecordAt || createdAt < firstRecordAt) firstRecordAt = createdAt;
      if (!latestRecordAt || createdAt > latestRecordAt) latestRecordAt = createdAt;
    }

    const uri = `at://${did}/${collection}/${rkey}`;
    const record: RepoRecord = {
      collection,
      rkey,
      uri,
      value: normalized,
      createdAt,
    };
    const bucket = byCollection.get(collection);
    if (bucket) bucket.push(record);
    else byCollection.set(collection, [record]);
    totalRecords += 1;
  }

  return { totalRecords, byCollection, firstRecordAt, latestRecordAt };
}

export type FetchProgress =
  | { phase: "cache"; message: string }
  | { phase: "resolving"; message: string }
  | { phase: "discovering"; message: string }
  | { phase: "downloading"; received: number; total: number | null }
  | { phase: "parsing"; message: string };

type CachedRepo = { storedAt: number; version: number; stats: RepoStats };

async function readCachedStats(handle: string): Promise<RepoStats | null> {
  if (typeof indexedDB === "undefined") return null;
  try {
    const { get } = await import("idb-keyval");
    const cached = await get<CachedRepo>(CACHE_KEY_PREFIX + handle);
    if (!cached) return null;
    if (cached.version !== CACHE_VERSION) return null;
    if (Date.now() - cached.storedAt > CACHE_TTL_MS) return null;
    return cached.stats;
  } catch {
    return null;
  }
}

async function writeCachedStats(stats: RepoStats): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  try {
    const { set } = await import("idb-keyval");
    const cached: CachedRepo = {
      storedAt: Date.now(),
      version: CACHE_VERSION,
      stats,
    };
    await set(CACHE_KEY_PREFIX + stats.handle, cached);
  } catch {
    // Quota exceeded / private mode / etc. — silently skip caching.
  }
}

export async function fetchRepoStats(
  handle: string,
  onProgress?: (p: FetchProgress) => void,
): Promise<RepoStats> {
  const cleanHandle = handle.replace(/^@/, "").trim();

  const cached = await readCachedStats(cleanHandle);
  if (cached) {
    onProgress?.({ phase: "cache", message: "Loading from cache…" });
    return cached;
  }

  onProgress?.({ phase: "resolving", message: "Resolving handle…" });
  const did = await resolveHandle(cleanHandle);
  onProgress?.({ phase: "discovering", message: "Finding your PDS…" });
  const didDoc = await getDidDocument(did);
  const pds = getPdsEndpoint(didDoc);
  const car = await fetchRepoCar(pds, did, (received, total) =>
    onProgress?.({ phase: "downloading", received, total }),
  );
  onProgress?.({ phase: "parsing", message: "Reading your repo…" });
  const parsed = await parseRepoCar(car, did);

  const stats: RepoStats = {
    did,
    handle: cleanHandle,
    pds,
    carBytes: car.byteLength,
    ...parsed,
  };

  // Fire-and-forget so failures don't break the load.
  void writeCachedStats(stats);

  return stats;
}
