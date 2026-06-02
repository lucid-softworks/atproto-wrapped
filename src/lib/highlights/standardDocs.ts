import type { RepoRecord } from "../atproto";

export type StandardDoc = {
  title: string;
  description?: string;
  tags: string[];
  publishedAt: Date | null;
  createdAt: Date | null;
};

export type StandardDocsHighlights = {
  totalDocs: number;
  totalRecommends: number;
  uniqueTags: number;
  docs: StandardDoc[];
  /** Up to 12 at:// URIs of documents this user has recommended (on other
   *  people's repos). The UI fetches them cross-PDS for rich rendering. */
  recommendedUris: string[];
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function parseDate(v: unknown): Date | null {
  if (typeof v !== "string") return null;
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : new Date(t);
}

export function getStandardDocsHighlights(
  byCollection: Map<string, RepoRecord[]>,
): StandardDocsHighlights | null {
  const docRecords = byCollection.get("site.standard.document") ?? [];
  const recommendRecords =
    byCollection.get("site.standard.graph.recommend") ?? [];
  if (docRecords.length === 0 && recommendRecords.length === 0) return null;

  const tagSet = new Set<string>();
  const docs: StandardDoc[] = docRecords.map((r) => {
    const v = r.value;
    const rawTags = Array.isArray(v.tags) ? v.tags : [];
    const tags = rawTags
      .map((t) => (typeof t === "string" ? t : ""))
      .filter((t) => t.length > 0);
    for (const t of tags) tagSet.add(t);
    const publishedAt = parseDate(v.publishedAt);
    return {
      title: strOrNull(v.title) ?? "Untitled",
      description: strOrUndef(v.description),
      tags,
      publishedAt,
      createdAt: r.createdAt,
    };
  });
  docs.sort((a, b) => {
    const ad = a.publishedAt?.getTime() ?? a.createdAt?.getTime() ?? 0;
    const bd = b.publishedAt?.getTime() ?? b.createdAt?.getTime() ?? 0;
    return bd - ad;
  });

  const recommendedUris: string[] = [];
  for (const r of recommendRecords) {
    const v = r.value;
    const docUri = strOrNull((v as Record<string, unknown>).document);
    if (docUri && docUri.startsWith("at://")) {
      recommendedUris.push(docUri);
      if (recommendedUris.length >= 12) break;
    }
  }

  return {
    totalDocs: docRecords.length,
    totalRecommends: recommendRecords.length,
    uniqueTags: tagSet.size,
    docs: docs.slice(0, 12),
    recommendedUris,
  };
}
