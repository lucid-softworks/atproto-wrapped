import type { RepoRecord } from "../atproto";

export type Vouch = {
  subject: string;
  createdAt: Date | null;
};

export type AtVouchHighlights = {
  total: number;
  vouches: Vouch[];
};

export function getAtVouchHighlights(
  byCollection: Map<string, RepoRecord[]>,
): AtVouchHighlights | null {
  const records = byCollection.get("dev.atvouch.graph.vouch") ?? [];
  if (records.length === 0) return null;

  const vouches: Vouch[] = records.map((r) => {
    const subject =
      typeof r.value.subject === "string" ? r.value.subject : "";
    return { subject, createdAt: r.createdAt };
  });
  vouches.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return { total: records.length, vouches: vouches.slice(0, 12) };
}
