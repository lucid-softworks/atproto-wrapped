import type { RepoRecord } from "../atproto";

export type Spark = {
  text: string;
  createdAt: Date | null;
};

export type SparksHighlights = {
  total: number;
  sparks: Spark[];
};

export function getSparksHighlights(
  byCollection: Map<string, RepoRecord[]>,
): SparksHighlights | null {
  const records = byCollection.get("tech.tokimeki.takibi.spark") ?? [];
  if (records.length === 0) return null;

  const sparks: Spark[] = records
    .map((r) => {
      const text = typeof r.value.text === "string" ? r.value.text : "";
      return { text, createdAt: r.createdAt };
    })
    .filter((s) => s.text.trim().length > 0);
  sparks.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return { total: records.length, sparks: sparks.slice(0, 9) };
}
