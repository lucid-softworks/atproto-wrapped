import type { RepoRecord } from "../atproto";

export type BlentoCard = {
  rkey: string;
  cardType: string;
  /** A short display title derived from cardData (handle, collectionRkey,
   *  href, or empty if nothing usable was found). */
  title?: string;
  href?: string;
  updatedAt: Date | null;
  createdAt: Date | null;
};

export type BlentoHighlights = {
  total: number;
  byType: Map<string, number>;
  cards: BlentoCard[];
};

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function parseDate(v: unknown): Date | null {
  if (typeof v !== "string") return null;
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : new Date(t);
}

/**
 * Pick the best human-readable title we can from the loosely-typed cardData
 * blob: prefer a handle, then a collection rkey, then the href, then nothing.
 */
function pickTitle(cardData: Record<string, unknown>): string | undefined {
  return (
    strOrUndef(cardData.handle) ??
    strOrUndef(cardData.title) ??
    strOrUndef(cardData.name) ??
    strOrUndef(cardData.label) ??
    strOrUndef(cardData.collectionRkey) ??
    strOrUndef(cardData.href)
  );
}

export function getBlentoHighlights(
  byCollection: Map<string, RepoRecord[]>,
): BlentoHighlights | null {
  const records = byCollection.get("app.blento.card") ?? [];
  if (records.length === 0) return null;

  const cards: BlentoCard[] = records.map((r) => {
    const v = r.value;
    const cardType = strOrUndef(v.cardType) ?? "unknown";
    const cardData = (v.cardData ?? {}) as Record<string, unknown>;
    const updatedAt = parseDate(v.updatedAt);
    return {
      rkey: r.rkey,
      cardType,
      title: pickTitle(cardData),
      href: strOrUndef(cardData.href),
      updatedAt,
      createdAt: r.createdAt,
    };
  });

  const byType = new Map<string, number>();
  for (const c of cards) {
    byType.set(c.cardType, (byType.get(c.cardType) ?? 0) + 1);
  }

  // Surface cards with hrefs / titles first so the list looks rich; keep
  // a stable secondary sort by updatedAt desc.
  cards.sort((a, b) => {
    const aHas = a.href ? 1 : 0;
    const bHas = b.href ? 1 : 0;
    if (aHas !== bHas) return bHas - aHas;
    return (
      (b.updatedAt?.getTime() ?? b.createdAt?.getTime() ?? 0) -
      (a.updatedAt?.getTime() ?? a.createdAt?.getTime() ?? 0)
    );
  });

  return {
    total: records.length,
    byType,
    cards,
  };
}
