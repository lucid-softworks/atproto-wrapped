import type { RepoRecord } from "../atproto";

export type Endorsement = {
  subject: string;
  createdAt: Date | null;
};

export type EndorseHighlights = {
  total: number;
  endorsements: Endorsement[];
};

export function getEndorseHighlights(
  byCollection: Map<string, RepoRecord[]>,
): EndorseHighlights | null {
  const records = byCollection.get("fund.at.graph.endorse") ?? [];
  if (records.length === 0) return null;

  const endorsements: Endorsement[] = records.map((r) => {
    const subject =
      typeof r.value.subject === "string" ? r.value.subject : "";
    return { subject, createdAt: r.createdAt };
  });
  endorsements.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return {
    total: records.length,
    endorsements: endorsements.slice(0, 24),
  };
}
