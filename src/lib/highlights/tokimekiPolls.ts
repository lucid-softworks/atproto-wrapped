import type { RepoRecord } from "../atproto";

export type TokimekiPoll = {
  options: string[];
  endsAt: Date | null;
  subjectUri?: string;
  createdAt: Date | null;
};

export type TokimekiPollsHighlights = {
  total: number;
  polls: TokimekiPoll[];
};

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function parseDate(v: unknown): Date | null {
  if (typeof v !== "string") return null;
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : new Date(t);
}

export function getTokimekiPollsHighlights(
  byCollection: Map<string, RepoRecord[]>,
): TokimekiPollsHighlights | null {
  const records = byCollection.get("tech.tokimeki.poll.poll") ?? [];
  if (records.length === 0) return null;

  const polls: TokimekiPoll[] = records.map((r) => {
    const v = r.value;
    const rawOptions = Array.isArray(v.options) ? v.options : [];
    const options = rawOptions
      .map((o) => (typeof o === "string" ? o : ""))
      .filter((o) => o.length > 0);
    const subject = v.subject as Record<string, unknown> | undefined;
    return {
      options,
      endsAt: parseDate(v.endsAt),
      subjectUri: subject ? strOrUndef(subject.uri) : undefined,
      createdAt: r.createdAt,
    };
  });
  polls.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return {
    total: records.length,
    polls: polls.slice(0, 12),
  };
}
