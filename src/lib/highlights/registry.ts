import type { RepoStats } from "../atproto";
import { blobUrl, pickBlob } from "./_blob";

export type WishlistItem = {
  name: string;
  description?: string;
  color?: string;
  priority?: string;
  imageUrl?: string;
};

export type WishlistList = {
  title: string;
  description?: string;
};

export type WishlistHighlights = {
  totalItems: number;
  lists: WishlistList[];
  items: WishlistItem[];
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

const PRIORITY_RANK: Record<string, number> = {
  must: 0,
  high: 1,
  soon: 2,
  someday: 3,
  later: 4,
  maybe: 5,
};

export function getWishlistHighlights(
  stats: RepoStats,
): WishlistHighlights | null {
  const itemRecords = [
    ...(stats.byCollection.get("blue.registry.item") ?? []),
    ...(stats.byCollection.get("blue.registry.listItem") ?? []),
  ];
  const listRecords = stats.byCollection.get("blue.registry.list") ?? [];
  if (itemRecords.length === 0 && listRecords.length === 0) return null;

  const lists: WishlistList[] = listRecords.map((r) => {
    const v = r.value;
    return {
      title: strOrNull(v.title) ?? "Untitled list",
      description: strOrUndef(v.description),
    };
  });

  const items: WishlistItem[] = itemRecords.map((r) => {
    const v = r.value;
    const blob = pickBlob(v.image);
    return {
      name: strOrNull(v.name) ?? "Item",
      description: strOrUndef(v.description),
      color: strOrUndef(v.color),
      priority: strOrUndef(v.priority),
      imageUrl: blob ? blobUrl(stats.pds, stats.did, blob) : undefined,
    };
  });

  items.sort((a, b) => {
    const ra = PRIORITY_RANK[a.priority ?? ""] ?? 99;
    const rb = PRIORITY_RANK[b.priority ?? ""] ?? 99;
    if (ra !== rb) return ra - rb;
    return a.name.localeCompare(b.name);
  });

  return {
    totalItems: itemRecords.length,
    lists,
    items: items.slice(0, 12),
  };
}
