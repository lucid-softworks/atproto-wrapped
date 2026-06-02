import type { RepoRecord } from "../atproto";

export type HighFive = {
  subject: string;
  createdAt: Date | null;
};

export type HighFiveHighlights = {
  total: number;
  proofs: number;
  supportProofs: number;
  highFives: HighFive[];
};

export function getHighFiveHighlights(
  byCollection: Map<string, RepoRecord[]>,
): HighFiveHighlights | null {
  const records = byCollection.get("com.atprotofans.high-five.highFive") ?? [];
  if (records.length === 0) return null;

  const proofs = (
    byCollection.get("com.atprotofans.high-five.highFiveProof") ?? []
  ).length;
  const supportProofs = (
    byCollection.get("com.atprotofans.high-five.supportProof") ?? []
  ).length;

  const highFives: HighFive[] = records.map((r) => {
    const subject =
      typeof r.value.subject === "string" ? r.value.subject : "";
    return { subject, createdAt: r.createdAt };
  });
  highFives.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return {
    total: records.length,
    proofs,
    supportProofs,
    highFives: highFives.slice(0, 12),
  };
}
