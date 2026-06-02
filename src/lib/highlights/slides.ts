import type { RepoRecord } from "../atproto";

export type SlidesDeck = {
  rkey: string;
  name: string;
  slideCount: number;
  updatedAt: Date | null;
  createdAt: Date | null;
};

export type SlidesHighlights = {
  totalDecks: number;
  totalSlides: number;
  decks: SlidesDeck[];
};

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function parseDate(v: unknown): Date | null {
  if (typeof v !== "string") return null;
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : new Date(t);
}

export function getSlidesHighlights(
  byCollection: Map<string, RepoRecord[]>,
): SlidesHighlights | null {
  const records = byCollection.get("tech.waow.slides.deck") ?? [];
  if (records.length === 0) return null;

  const decks: SlidesDeck[] = records.map((r) => {
    const v = r.value;
    const slides = Array.isArray(v.slides) ? v.slides : [];
    return {
      rkey: r.rkey,
      name: strOrUndef(v.name) ?? "Untitled deck",
      slideCount: slides.length,
      updatedAt: parseDate(v.updatedAt),
      createdAt: r.createdAt,
    };
  });

  decks.sort(
    (a, b) =>
      (b.updatedAt?.getTime() ?? b.createdAt?.getTime() ?? 0) -
      (a.updatedAt?.getTime() ?? a.createdAt?.getTime() ?? 0),
  );

  const totalSlides = decks.reduce((sum, d) => sum + d.slideCount, 0);

  return {
    totalDecks: decks.length,
    totalSlides,
    decks,
  };
}
