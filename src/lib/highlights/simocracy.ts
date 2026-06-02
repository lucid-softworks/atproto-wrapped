import type { RepoStats } from "../atproto";
import { blobUrl, pickBlob } from "./_blob";

export type SimocracySim = {
  name: string;
  imageUrl?: string;
  characterSet?: string;
  createdAt: Date | null;
};

export type SimocracyHighlights = {
  total: number;
  sims: SimocracySim[];
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export function getSimocracyHighlights(
  stats: RepoStats,
): SimocracyHighlights | null {
  const records = stats.byCollection.get("org.simocracy.sim") ?? [];
  if (records.length === 0) return null;

  const sims: SimocracySim[] = records.map((r) => {
    const v = r.value;
    const blob = pickBlob(v.image);
    const settings = v.settings as Record<string, unknown> | undefined;
    return {
      name: strOrNull(v.name) ?? "Unnamed sim",
      imageUrl: blob ? blobUrl(stats.pds, stats.did, blob) : undefined,
      characterSet: settings ? strOrUndef(settings.characterSet) : undefined,
      createdAt: r.createdAt,
    };
  });

  sims.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return {
    total: records.length,
    sims: sims.slice(0, 8),
  };
}
