import type { RepoStats } from "../atproto";

export type BlueBadge = {
  name: string;
  description?: string;
  issued: Date | null;
};

export type BadgesHighlights = {
  total: number;
  badges: BlueBadge[];
};

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function parseDate(v: unknown): Date | null {
  if (typeof v !== "string") return null;
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : new Date(t);
}

/**
 * blue.badge collection lives under the `blue.badge.collection` prefix on the
 * repo side, but the actual records carry `$type: blue.badge.award` per the
 * sample payload. We accept both NSIDs so we don't miss either.
 */
export function getBadgesHighlights(
  stats: RepoStats,
): BadgesHighlights | null {
  const collected = [
    ...(stats.byCollection.get("blue.badge.collection") ?? []),
    ...(stats.byCollection.get("blue.badge.award") ?? []),
  ];
  if (collected.length === 0) return null;

  const badges: BlueBadge[] = collected.map((r) => {
    const v = r.value;
    const badge = (v.badge as Record<string, unknown> | undefined) ?? {};
    return {
      name: strOrNull(badge.name) ?? "Badge",
      description: strOrUndef(badge.description),
      issued: parseDate(v.issued) ?? r.createdAt,
    };
  });

  badges.sort(
    (a, b) => (b.issued?.getTime() ?? 0) - (a.issued?.getTime() ?? 0),
  );

  return {
    total: collected.length,
    badges: badges.slice(0, 16),
  };
}
