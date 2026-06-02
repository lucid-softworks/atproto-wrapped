import type { RepoStats } from "../atproto";
import { blobUrl, pickBlob } from "./_blob";

export type CdnMedia = {
  kind: "image" | "video";
  url?: string;
  mimeType?: string;
  size: number;
  createdAt: Date | null;
};

export type MadebydannyCdnHighlights = {
  images: number;
  videos: number;
  totalBytes: number;
  media: CdnMedia[];
};

export function getMadebydannyCdnHighlights(
  stats: RepoStats,
): MadebydannyCdnHighlights | null {
  const imageRecords =
    stats.byCollection.get("uk.madebydanny.cdn.img") ?? [];
  const videoRecords =
    stats.byCollection.get("uk.madebydanny.cdn.video") ?? [];
  if (imageRecords.length === 0 && videoRecords.length === 0) return null;

  const media: CdnMedia[] = [];
  let totalBytes = 0;

  const ingest = (kind: "image" | "video", records: typeof imageRecords) => {
    for (const r of records) {
      const v = r.value;
      const blobValue = v.blob as Record<string, unknown> | undefined;
      const blob = pickBlob(blobValue);
      const size =
        blobValue && typeof blobValue.size === "number" ? blobValue.size : 0;
      totalBytes += size;
      media.push({
        kind,
        url: blob ? blobUrl(stats.pds, stats.did, blob) : undefined,
        mimeType:
          blobValue && typeof blobValue.mimeType === "string"
            ? blobValue.mimeType
            : undefined,
        size,
        createdAt: r.createdAt,
      });
    }
  };

  ingest("image", imageRecords);
  ingest("video", videoRecords);

  media.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return {
    images: imageRecords.length,
    videos: videoRecords.length,
    totalBytes,
    media,
  };
}
