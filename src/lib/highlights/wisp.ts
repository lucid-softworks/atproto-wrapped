import type { RepoRecord } from "../atproto";

export type WispEntry = {
  name: string;
  type: string;
};

export type WispHighlights = {
  domain?: string;
  site?: string;
  fileCount: number;
  topEntries: WispEntry[];
  fsRecords: number;
  domainRecords: number;
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export function getWispHighlights(
  byCollection: Map<string, RepoRecord[]>,
): WispHighlights | null {
  const fsRecords = byCollection.get("place.wisp.fs") ?? [];
  const domainRecords = byCollection.get("place.wisp.domain") ?? [];
  if (fsRecords.length === 0 && domainRecords.length === 0) return null;

  let site: string | undefined;
  let fileCount = 0;
  const topEntries: WispEntry[] = [];
  // Pick the first fs record for preview info.
  const fs = fsRecords[0];
  if (fs) {
    const v = fs.value;
    site = strOrUndef(v.site);
    if (typeof v.fileCount === "number") fileCount = v.fileCount;
    const root = v.root as Record<string, unknown> | undefined;
    const entries = root && Array.isArray(root.entries) ? root.entries : [];
    for (const e of entries) {
      if (!e || typeof e !== "object") continue;
      const eo = e as Record<string, unknown>;
      const name = strOrNull(eo.name);
      if (!name) continue;
      topEntries.push({
        name,
        type: strOrNull(eo.type) ?? "file",
      });
    }
  }

  // Pick the first domain record for the domain hostname.
  let domain: string | undefined;
  const dom = domainRecords[0];
  if (dom) {
    domain = strOrUndef(dom.value.domain);
  }

  return {
    domain,
    site,
    fileCount,
    topEntries: topEntries.slice(0, 16),
    fsRecords: fsRecords.length,
    domainRecords: domainRecords.length,
  };
}
