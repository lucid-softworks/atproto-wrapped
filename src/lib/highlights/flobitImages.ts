import type { RepoStats } from "../atproto";
import { blobUrl, pickBlob } from "./_blob";

export type FlobitImage = {
  url?: string;
  width?: number;
  height?: number;
  createdAt: Date | null;
};

export type FlobitImagesHighlights = {
  total: number;
  images: FlobitImage[];
};

export function getFlobitImagesHighlights(
  stats: RepoStats,
): FlobitImagesHighlights | null {
  const records = stats.byCollection.get("dev.flo-bit.image") ?? [];
  if (records.length === 0) return null;

  const images: FlobitImage[] = records.map((r) => {
    const v = r.value;
    const blob = pickBlob(v.image);
    const aspect = v.aspectRatio as Record<string, unknown> | undefined;
    return {
      url: blob ? blobUrl(stats.pds, stats.did, blob) : undefined,
      width:
        aspect && typeof aspect.width === "number" ? aspect.width : undefined,
      height:
        aspect && typeof aspect.height === "number"
          ? aspect.height
          : undefined,
      createdAt: r.createdAt,
    };
  });

  images.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return {
    total: records.length,
    images: images.slice(0, 16),
  };
}
