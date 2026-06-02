import type { RepoRecord } from "../atproto";

export type ProtoimsgGroup = {
  name: string;
  memberDids: string[];
  isInnerCircle: boolean;
};

export type ProtoimsgHighlights = {
  groups: ProtoimsgGroup[];
  totalGroups: number;
  totalMembers: number;
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

export function getProtoimsgHighlights(
  byCollection: Map<string, RepoRecord[]>,
): ProtoimsgHighlights | null {
  const records = byCollection.get("app.protoimsg.chat.community") ?? [];
  if (records.length === 0) return null;

  const groups: ProtoimsgGroup[] = [];
  let totalMembers = 0;
  for (const r of records) {
    const v = r.value as Record<string, unknown>;
    const raw = Array.isArray(v.groups) ? (v.groups as unknown[]) : [];
    for (const g of raw) {
      if (!g || typeof g !== "object") continue;
      const obj = g as Record<string, unknown>;
      const name = strOrNull(obj.name) ?? "Unnamed group";
      const isInnerCircle = obj.isInnerCircle === true;
      const memberArr = Array.isArray(obj.members)
        ? (obj.members as unknown[])
        : [];
      const memberDids: string[] = [];
      for (const m of memberArr) {
        if (m && typeof m === "object") {
          const did = (m as Record<string, unknown>).did;
          if (typeof did === "string") memberDids.push(did);
        }
      }
      groups.push({ name, memberDids, isInnerCircle });
      totalMembers += memberDids.length;
    }
  }
  if (groups.length === 0) return null;
  return { groups, totalGroups: groups.length, totalMembers };
}
