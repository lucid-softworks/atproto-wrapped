import type { RepoRecord } from "../atproto";

export type Intro = {
  subject: string;
  body: string;
  tags: string[];
  updatedAt: Date | null;
  createdAt: Date | null;
};

export type IntrosHighlights = {
  total: number;
  intros: Intro[];
};

function parseDateMaybe(v: unknown): Date | null {
  if (typeof v !== "string" || !v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function getIntrosHighlights(
  byCollection: Map<string, RepoRecord[]>,
): IntrosHighlights | null {
  const records =
    byCollection.get("com.skybemoreblue.intro.introduction") ?? [];
  if (records.length === 0) return null;

  const intros: Intro[] = records.map((r) => {
    const v = r.value;
    const tagsRaw = Array.isArray(v.tags) ? v.tags : [];
    const tags = tagsRaw.filter((t): t is string => typeof t === "string");
    return {
      subject: typeof v.subject === "string" ? v.subject : "",
      body: typeof v.body === "string" ? v.body : "",
      tags,
      updatedAt: parseDateMaybe(v.updatedAt),
      createdAt: r.createdAt,
    };
  });
  intros.sort((a, b) => {
    const at = a.updatedAt?.getTime() ?? a.createdAt?.getTime() ?? 0;
    const bt = b.updatedAt?.getTime() ?? b.createdAt?.getTime() ?? 0;
    return bt - at;
  });

  return { total: records.length, intros: intros.slice(0, 8) };
}
