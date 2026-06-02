import type { RepoStats } from "../atproto";

export type BlobRef = { ref: { $link: string }; mimeType?: string };

/**
 * Construct a `com.atproto.sync.getBlob` URL for a given blob ref. Used by all
 * the image-heavy highlight extractors so they can hand a ready-to-render URL
 * straight to <Cover> / <img>.
 */
export function blobUrl(
  pds: string,
  did: string,
  blob: BlobRef,
): string | undefined {
  const cid = blob.ref.$link;
  if (!cid) return undefined;
  return `${pds.replace(/\/$/, "")}/xrpc/com.atproto.sync.getBlob?did=${encodeURIComponent(did)}&cid=${encodeURIComponent(cid)}`;
}

/**
 * Defensively coerce an arbitrary value into a BlobRef if it looks like one.
 * Returns undefined for anything that isn't shaped like a blob.
 */
export function pickBlob(v: unknown): BlobRef | undefined {
  if (!v || typeof v !== "object") return undefined;
  const c = v as Record<string, unknown>;
  const ref = c.ref as Record<string, unknown> | undefined;
  if (typeof ref?.["$link"] !== "string") return undefined;
  return {
    ref: { $link: ref["$link"] },
    mimeType: typeof c.mimeType === "string" ? c.mimeType : undefined,
  };
}

/** Convenience: combine pickBlob + blobUrl. */
export function blobUrlFrom(
  stats: RepoStats,
  v: unknown,
): string | undefined {
  const blob = pickBlob(v);
  if (!blob) return undefined;
  return blobUrl(stats.pds, stats.did, blob);
}
