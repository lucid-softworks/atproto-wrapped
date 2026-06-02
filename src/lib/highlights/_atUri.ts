/**
 * Cross-PDS record fetching by AT URI.
 *
 * `public.api.bsky.app/xrpc/com.atproto.repo.getRecord` only proxies records
 * it knows about (bsky lexicons), so for any non-bsky collection (calendar,
 * sidetrail, etc.) we have to resolve the DID to its actual PDS first.
 */

export type ParsedAtUri = {
  did: string;
  collection: string;
  rkey: string;
};

export function parseAtUri(uri: string): ParsedAtUri | null {
  if (!uri.startsWith("at://")) return null;
  const rest = uri.slice("at://".length);
  const parts = rest.split("/");
  if (parts.length < 3) return null;
  const [did, collection, rkey] = parts;
  if (!did || !collection || !rkey) return null;
  return { did, collection, rkey };
}

const pdsCache = new Map<string, Promise<string | null>>();

async function fetchPdsFor(did: string): Promise<string | null> {
  let url: string;
  if (did.startsWith("did:plc:")) {
    url = `https://plc.directory/${did}`;
  } else if (did.startsWith("did:web:")) {
    const domain = did.slice("did:web:".length).replace(/:/g, "/");
    url = `https://${domain}/.well-known/did.json`;
  } else {
    return null;
  }
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const doc = (await res.json()) as {
      service?: Array<{ id?: string; type?: string; serviceEndpoint?: string }>;
    };
    for (const svc of doc.service ?? []) {
      if (
        svc.id?.endsWith("#atproto_pds") ||
        svc.type === "AtprotoPersonalDataServer"
      ) {
        const endpoint = svc.serviceEndpoint;
        if (typeof endpoint === "string") {
          return endpoint.replace(/\/$/, "");
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function resolveDidToPds(did: string): Promise<string | null> {
  let cached = pdsCache.get(did);
  if (!cached) {
    cached = fetchPdsFor(did);
    pdsCache.set(did, cached);
  }
  return cached;
}

export async function fetchRecordByUri<T = Record<string, unknown>>(
  uri: string,
): Promise<T | null> {
  const parsed = parseAtUri(uri);
  if (!parsed) return null;
  const pds = await resolveDidToPds(parsed.did);
  if (!pds) return null;
  const url = `${pds}/xrpc/com.atproto.repo.getRecord?repo=${encodeURIComponent(parsed.did)}&collection=${encodeURIComponent(parsed.collection)}&rkey=${encodeURIComponent(parsed.rkey)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as { value?: T };
    return data.value ?? null;
  } catch {
    return null;
  }
}
