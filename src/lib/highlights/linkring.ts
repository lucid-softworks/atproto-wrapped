import type { RepoRecord } from "../atproto";

export type LinkringRing = {
  uri: string;
  name: string;
  description?: string;
  color?: string;
  memberCount: number;
  isPublic: boolean;
  createdAt: Date | null;
};

export type LinkringList = {
  uri: string;
  name: string;
  description?: string;
  color?: string;
  linkCount: number;
  isPublic: boolean;
  createdAt: Date | null;
};

export type LinkringHighlights = {
  totalRings: number;
  totalLists: number;
  rings: LinkringRing[];
  lists: LinkringList[];
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export function getLinkringHighlights(
  byCollection: Map<string, RepoRecord[]>,
): LinkringHighlights | null {
  const ringRecords =
    byCollection.get("lol.linkring.webring.ring") ?? [];
  const listRecords =
    byCollection.get("lol.linkring.linklist.list") ?? [];

  if (ringRecords.length === 0 && listRecords.length === 0) return null;

  const rings: LinkringRing[] = ringRecords.map((r) => {
    const v = r.value;
    return {
      uri: r.uri,
      name: strOrNull(v.name) ?? "Untitled ring",
      description: strOrUndef(v.description),
      color: strOrUndef(v.color),
      memberCount: Array.isArray(v.members) ? v.members.length : 0,
      isPublic: v.isPublic === true,
      createdAt: r.createdAt,
    };
  });
  rings.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  const lists: LinkringList[] = listRecords.map((r) => {
    const v = r.value;
    return {
      uri: r.uri,
      name: strOrNull(v.name) ?? "Untitled list",
      description: strOrUndef(v.description),
      color: strOrUndef(v.color),
      linkCount: Array.isArray(v.links) ? v.links.length : 0,
      isPublic: v.isPublic === true,
      createdAt: r.createdAt,
    };
  });
  lists.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return {
    totalRings: ringRecords.length,
    totalLists: listRecords.length,
    rings,
    lists,
  };
}
