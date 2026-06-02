import type { RepoRecord } from "../atproto";

export type AtStoreFavorite = {
  subject: string;
  createdAt: Date | null;
};

export type AtStoreReview = {
  subject?: string;
  rating: number | null;
  text?: string;
  createdAt: Date | null;
};

export type AtStoreHighlights = {
  favoritesCount: number;
  reviewsCount: number;
  averageRating: number | null;
  favorites: AtStoreFavorite[];
  reviews: AtStoreReview[];
};

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export function getAtStoreHighlights(
  byCollection: Map<string, RepoRecord[]>,
): AtStoreHighlights | null {
  const favoriteRecords =
    byCollection.get("fyi.atstore.listing.favorite") ?? [];
  const reviewRecords =
    byCollection.get("fyi.atstore.listing.review") ?? [];
  if (favoriteRecords.length === 0 && reviewRecords.length === 0) return null;

  const favorites: AtStoreFavorite[] = favoriteRecords.map((r) => ({
    subject: strOrUndef(r.value.subject) ?? "",
    createdAt: r.createdAt,
  }));
  favorites.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  const reviews: AtStoreReview[] = reviewRecords.map((r) => {
    const v = r.value;
    return {
      subject: strOrUndef(v.subject),
      rating: typeof v.rating === "number" ? v.rating : null,
      text: strOrUndef(v.text) ?? strOrUndef(v.body),
      createdAt: r.createdAt,
    };
  });
  reviews.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  const ratings = reviews
    .map((r) => r.rating)
    .filter((r): r is number => r !== null);
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((s, n) => s + n, 0) / ratings.length
      : null;

  return {
    favoritesCount: favoriteRecords.length,
    reviewsCount: reviewRecords.length,
    averageRating,
    favorites: favorites.slice(0, 12),
    reviews: reviews.slice(0, 8),
  };
}
