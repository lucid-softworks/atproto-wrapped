import type { RepoRecord } from "../atproto";

export type RankthatItem = {
  uri: string;
  url?: string;
  order: string;
  collection?: string;
  createdAt: Date | null;
};

export type RankthatCollection = {
  uri: string;
  name: string;
  color?: string;
  items: RankthatItem[];
  createdAt: Date | null;
};

export type RankthatHighlights = {
  totalCollections: number;
  totalItems: number;
  collections: RankthatCollection[];
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export function getRankthatHighlights(
  byCollection: Map<string, RepoRecord[]>,
): RankthatHighlights | null {
  const collectionRecords =
    byCollection.get("net.rankthat.collection") ?? [];
  if (collectionRecords.length === 0) return null;

  const itemRecords = byCollection.get("net.rankthat.item") ?? [];

  const itemsByCollection = new Map<string, RankthatItem[]>();
  for (const r of itemRecords) {
    const v = r.value;
    const collectionUri = strOrUndef(v.collection);
    const item: RankthatItem = {
      uri: r.uri,
      url: strOrUndef(v.url),
      order: strOrNull(v.order) ?? "",
      collection: collectionUri,
      createdAt: r.createdAt,
    };
    if (collectionUri) {
      const list = itemsByCollection.get(collectionUri);
      if (list) list.push(item);
      else itemsByCollection.set(collectionUri, [item]);
    }
  }

  // Sort each collection's items by `order` (fractional-index style strings).
  for (const list of itemsByCollection.values()) {
    list.sort((a, b) => a.order.localeCompare(b.order));
  }

  const collections: RankthatCollection[] = collectionRecords.map((r) => {
    const v = r.value;
    return {
      uri: r.uri,
      name: strOrNull(v.name) ?? "Untitled ranking",
      color: strOrUndef(v.color),
      items: itemsByCollection.get(r.uri) ?? [],
      createdAt: r.createdAt,
    };
  });

  collections.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return {
    totalCollections: collectionRecords.length,
    totalItems: itemRecords.length,
    collections,
  };
}
