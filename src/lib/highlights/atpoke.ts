import type { RepoRecord } from "../atproto";

export type Poke = {
  subject: string;
  createdAt: Date | null;
};

export type AtPokeHighlights = {
  total: number;
  pokes: Poke[];
};

export function getAtPokeHighlights(
  byCollection: Map<string, RepoRecord[]>,
): AtPokeHighlights | null {
  const records = byCollection.get("xyz.atpoke.graph.poke") ?? [];
  if (records.length === 0) return null;

  const pokes: Poke[] = records.map((r) => {
    const subject =
      typeof r.value.subject === "string" ? r.value.subject : "";
    return { subject, createdAt: r.createdAt };
  });
  pokes.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return { total: records.length, pokes: pokes.slice(0, 12) };
}
