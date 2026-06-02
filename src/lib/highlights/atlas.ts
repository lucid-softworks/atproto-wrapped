import type { RepoRecord } from "../atproto";

export type AtlasAddress = {
  name: string | null;
  country: string | null;
  region: string | null;
  locality: string | null;
};

export type AtlasLocation = {
  osmId: string | null;
  osmType: string | null;
  atlasKey: string | null;
  isPrimary: boolean;
  address: AtlasAddress;
  addedAt: Date | null;
};

export type AtlasHighlights = {
  locations: AtlasLocation[];
  primary: AtlasLocation | null;
  total: number;
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function parseDate(v: unknown): Date | null {
  if (typeof v !== "string") return null;
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : new Date(t);
}

function readAddress(v: unknown): AtlasAddress {
  if (!v || typeof v !== "object") {
    return { name: null, country: null, region: null, locality: null };
  }
  const o = v as Record<string, unknown>;
  return {
    name: strOrNull(o.name),
    country: strOrNull(o.country),
    region: strOrNull(o.region),
    locality: strOrNull(o.locality),
  };
}

export function getAtlasHighlights(
  byCollection: Map<string, RepoRecord[]>,
): AtlasHighlights | null {
  const records = byCollection.get("city.atlas.actor.location") ?? [];
  if (records.length === 0) return null;

  const locations: AtlasLocation[] = [];
  for (const r of records) {
    const v = r.value;
    const raw = Array.isArray(v.locations) ? v.locations : [];
    for (const item of raw) {
      if (!item || typeof item !== "object") continue;
      const o = item as Record<string, unknown>;
      locations.push({
        osmId: strOrNull(o.osmId),
        osmType: strOrNull(o.osmType),
        atlasKey: strOrNull(o.atlasKey),
        isPrimary: o.isPrimary === true,
        address: readAddress(o.address),
        addedAt: parseDate(o.addedAt) ?? r.createdAt,
      });
    }
  }

  if (locations.length === 0) return null;

  locations.sort((a, b) => {
    // Primary first, then most recently added.
    if (a.isPrimary !== b.isPrimary) return a.isPrimary ? -1 : 1;
    return (b.addedAt?.getTime() ?? 0) - (a.addedAt?.getTime() ?? 0);
  });

  const primary = locations.find((l) => l.isPrimary) ?? null;

  return {
    locations,
    primary,
    total: locations.length,
  };
}
