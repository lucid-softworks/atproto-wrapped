import type { RepoRecord } from "../atproto";

export type AsqQuestion = {
  title: string;
  body: string;
  tags: string[];
  createdAt: Date | null;
};

export type AsqHighlights = {
  total: number;
  questions: AsqQuestion[];
};

export function getAsqHighlights(
  byCollection: Map<string, RepoRecord[]>,
): AsqHighlights | null {
  const records = byCollection.get("fyi.asq.question") ?? [];
  if (records.length === 0) return null;

  const questions: AsqQuestion[] = records.map((r) => {
    const v = r.value;
    const tagsRaw = Array.isArray(v.tags) ? v.tags : [];
    const tags = tagsRaw.filter((t): t is string => typeof t === "string");
    return {
      title: typeof v.title === "string" ? v.title : "",
      body: typeof v.body === "string" ? v.body : "",
      tags,
      createdAt: r.createdAt,
    };
  });
  questions.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return { total: records.length, questions: questions.slice(0, 8) };
}
