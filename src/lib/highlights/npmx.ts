import type { RepoRecord } from "../atproto";

export type NpmxLike = {
  packageName: string;
  subjectRef: string;
  createdAt: Date | null;
};

export type NpmxHighlights = {
  totalLikes: number;
  likes: NpmxLike[];
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function parseDate(v: unknown): Date | null {
  if (typeof v !== "string") return null;
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : new Date(t);
}

function extractPackageName(subjectRef: string): string {
  // https://npmx.dev/package/<name>
  const marker = "/package/";
  const idx = subjectRef.indexOf(marker);
  if (idx === -1) return subjectRef;
  const tail = subjectRef.slice(idx + marker.length);
  // Strip trailing slash / query / fragment.
  return tail.split(/[?#]/)[0].replace(/\/+$/, "");
}

export function getNpmxHighlights(
  byCollection: Map<string, RepoRecord[]>,
): NpmxHighlights | null {
  const records = byCollection.get("dev.npmx.feed.like") ?? [];
  if (records.length === 0) return null;

  const likes: NpmxLike[] = [];
  for (const r of records) {
    const subjectRef = strOrNull(r.value.subjectRef);
    if (!subjectRef) continue;
    likes.push({
      packageName: extractPackageName(subjectRef),
      subjectRef,
      createdAt: parseDate(r.value.createdAt) ?? r.createdAt,
    });
  }

  likes.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return {
    totalLikes: records.length,
    likes: likes.slice(0, 24),
  };
}
