import type { RepoRecord } from "../atproto";

export type Blip = {
  content: string;
  createdAt: Date | null;
};

export type BlipsHighlights = {
  total: number;
  blips: Blip[];
};

export function getBlipsHighlights(
  byCollection: Map<string, RepoRecord[]>,
): BlipsHighlights | null {
  const records = byCollection.get("stream.thought.blip") ?? [];
  if (records.length === 0) return null;

  const blips: Blip[] = records
    .map((r) => {
      const content =
        typeof r.value.content === "string" ? r.value.content : "";
      return { content, createdAt: r.createdAt };
    })
    .filter((b) => b.content.trim().length > 0);
  blips.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return { total: records.length, blips: blips.slice(0, 8) };
}
