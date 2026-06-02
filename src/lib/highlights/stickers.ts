import type { RepoStats } from "../atproto";
import { blobUrl, pickBlob } from "./_blob";

export type BooSticker = {
  imageUrl?: string;
  shortname?: string;
  borderColor?: string;
  borderThickness?: number;
  imageWidth?: number;
  imageHeight?: number;
};

export type StickersHighlights = {
  total: number;
  stickers: BooSticker[];
};

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function numOrUndef(v: unknown): number | undefined {
  return typeof v === "number" ? v : undefined;
}

export function getStickersHighlights(
  stats: RepoStats,
): StickersHighlights | null {
  const records = stats.byCollection.get("boo.sky.sticker") ?? [];
  if (records.length === 0) return null;

  const stickers: BooSticker[] = records.map((r) => {
    const v = r.value;
    const blob = pickBlob(v.image);
    return {
      imageUrl: blob ? blobUrl(stats.pds, stats.did, blob) : undefined,
      shortname: strOrUndef(v.shortname),
      borderColor: strOrUndef(v.borderColor),
      borderThickness: numOrUndef(v.borderThickness),
      imageWidth: numOrUndef(v.imageWidth),
      imageHeight: numOrUndef(v.imageHeight),
    };
  });

  return {
    total: records.length,
    stickers: stickers.slice(0, 16),
  };
}
