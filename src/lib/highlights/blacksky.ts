import type { RepoRecord } from "../atproto";

export type BlackskyVote = {
  /** +1 (yea) or -1 (nay) — preserved as-is. */
  value: number;
  /** at:// URI of the community.blacksky.assembly.statement being voted on. */
  subjectUri: string;
  createdAt: Date | null;
};

export type BlackskyHighlights = {
  totalVotes: number;
  yea: number;
  nay: number;
  /** Top 10 most-recent votes (uri + value + createdAt). */
  recentVotes: BlackskyVote[];
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

export function getBlackskyHighlights(
  byCollection: Map<string, RepoRecord[]>,
): BlackskyHighlights | null {
  const voteRecords =
    byCollection.get("community.blacksky.assembly.vote") ?? [];
  if (voteRecords.length === 0) return null;

  let yea = 0;
  let nay = 0;
  const votes: BlackskyVote[] = [];

  for (const r of voteRecords) {
    const v = r.value;
    const value = typeof v.value === "number" ? v.value : 0;
    if (value > 0) yea += 1;
    else if (value < 0) nay += 1;

    const subject = v.subject as Record<string, unknown> | undefined;
    const subjectUri = subject ? strOrNull(subject.uri) : null;
    if (!subjectUri) continue;

    votes.push({
      value,
      subjectUri,
      createdAt: r.createdAt,
    });
  }

  votes.sort(
    (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return {
    totalVotes: voteRecords.length,
    yea,
    nay,
    recentVotes: votes.slice(0, 10),
  };
}
