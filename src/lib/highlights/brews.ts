import type { RepoRecord } from "../atproto";

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function numOrNull(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

export type BrewItem = {
  kind: "coffee" | "tea";
  /** Resolved bean or tea name via beanRef/teaRef. */
  subjectName: string;
  /** Origin of the bean/tea, if available from the linked record. */
  subjectOrigin?: string;
  /** Roast level (coffee) or category (tea), if available. */
  subjectQualifier?: string;
  rating: number | null;
  tastingNotes?: string;
  /** Brewer (coffee) or vessel (tea) name, if resolvable. */
  gearName?: string;
  /** Brewing style or method label, when present. */
  style?: string;
  /** Temperature in tenths of degrees (raw stored value). */
  temperatureTenths: number | null;
  timeSeconds: number | null;
  /** Coffee:water (or leaf:water) ratio as a display string, e.g. "17g / 60g". */
  ratio?: string;
  createdAt: Date | null;
};

export type BrewBean = {
  uri: string;
  name: string;
  origin?: string;
  roastLevel?: string;
  description?: string;
  closed: boolean;
  roasterName?: string;
};

export type BrewTea = {
  uri: string;
  name: string;
  origin?: string;
  category?: string;
};

export type BrewGear = {
  uri: string;
  kind: "brewer" | "grinder" | "vessel";
  name: string;
  type?: string;
  material?: string;
  notes?: string;
};

export type BrewRoaster = {
  uri: string;
  name: string;
  location?: string;
  website?: string;
};

export type BrewsHighlights = {
  totalBrews: number;
  coffeeBrews: number;
  teaBrews: number;
  averageRating: number | null;
  beanCount: number;
  teaVarietalCount: number;
  brewerCount: number;
  grinderCount: number;
  vesselCount: number;
  roasterCount: number;
  topBrews: BrewItem[];
  beans: BrewBean[];
  teas: BrewTea[];
  gear: BrewGear[];
  roasters: BrewRoaster[];
};

export function getBrewsHighlights(
  byCollection: Map<string, RepoRecord[]>,
): BrewsHighlights | null {
  const coffeeBrewRecords =
    byCollection.get("social.arabica.alpha.brew") ?? [];
  const teaBrewRecords = byCollection.get("social.oolong.alpha.brew") ?? [];

  if (coffeeBrewRecords.length === 0 && teaBrewRecords.length === 0) {
    return null;
  }

  const beanRecords = byCollection.get("social.arabica.alpha.bean") ?? [];
  const brewerRecords = byCollection.get("social.arabica.alpha.brewer") ?? [];
  const grinderRecords =
    byCollection.get("social.arabica.alpha.grinder") ?? [];
  const roasterRecords =
    byCollection.get("social.arabica.alpha.roaster") ?? [];
  const teaRecords = byCollection.get("social.oolong.alpha.tea") ?? [];
  const vesselRecords = byCollection.get("social.oolong.alpha.vessel") ?? [];

  // --- Build URI lookup maps for ref-resolving. ---
  const roasterByUri = new Map<string, Record<string, unknown>>();
  for (const r of roasterRecords) roasterByUri.set(r.uri, r.value);

  const beanByUri = new Map<string, Record<string, unknown>>();
  for (const r of beanRecords) beanByUri.set(r.uri, r.value);

  const teaByUri = new Map<string, Record<string, unknown>>();
  for (const r of teaRecords) teaByUri.set(r.uri, r.value);

  const brewerByUri = new Map<string, Record<string, unknown>>();
  for (const r of brewerRecords) brewerByUri.set(r.uri, r.value);

  const grinderByUri = new Map<string, Record<string, unknown>>();
  for (const r of grinderRecords) grinderByUri.set(r.uri, r.value);

  const vesselByUri = new Map<string, Record<string, unknown>>();
  for (const r of vesselRecords) vesselByUri.set(r.uri, r.value);

  // --- Beans (with resolved roaster name). ---
  const beans: BrewBean[] = beanRecords.map((r) => {
    const v = r.value;
    const roasterRefUri = strOrNull(v.roasterRef);
    const roaster = roasterRefUri ? roasterByUri.get(roasterRefUri) : undefined;
    return {
      uri: r.uri,
      name: strOrNull(v.name) ?? "Untitled bean",
      origin: strOrNull(v.origin) ?? undefined,
      roastLevel: strOrNull(v.roastLevel) ?? undefined,
      description: strOrNull(v.description) ?? undefined,
      closed: v.closed === true,
      roasterName: roaster ? strOrNull(roaster.name) ?? undefined : undefined,
    };
  });
  beans.sort((a, b) => a.name.localeCompare(b.name));

  // --- Teas. ---
  const teas: BrewTea[] = teaRecords.map((r) => {
    const v = r.value;
    return {
      uri: r.uri,
      name: strOrNull(v.name) ?? "Untitled tea",
      origin: strOrNull(v.origin) ?? undefined,
      category: strOrNull(v.category) ?? undefined,
    };
  });
  teas.sort((a, b) => a.name.localeCompare(b.name));

  // --- Gear (brewers + grinders + vessels). ---
  const gear: BrewGear[] = [];
  for (const r of brewerRecords) {
    const v = r.value;
    gear.push({
      uri: r.uri,
      kind: "brewer",
      name: strOrNull(v.name) ?? "Brewer",
      type: strOrNull(v.brewerType) ?? undefined,
      notes: strOrNull(v.description) ?? undefined,
    });
  }
  for (const r of grinderRecords) {
    const v = r.value;
    const burr = strOrNull(v.burrType);
    const gtype = strOrNull(v.grinderType);
    const combined = [gtype, burr].filter(Boolean).join(" · ") || undefined;
    gear.push({
      uri: r.uri,
      kind: "grinder",
      name: strOrNull(v.name) ?? "Grinder",
      type: combined,
      notes: strOrNull(v.notes) ?? undefined,
    });
  }
  for (const r of vesselRecords) {
    const v = r.value;
    gear.push({
      uri: r.uri,
      kind: "vessel",
      name: strOrNull(v.name) ?? "Vessel",
      type: strOrNull(v.style) ?? undefined,
      material: strOrNull(v.material) ?? undefined,
    });
  }

  // --- Roasters. ---
  const roasters: BrewRoaster[] = roasterRecords.map((r) => {
    const v = r.value;
    return {
      uri: r.uri,
      name: strOrNull(v.name) ?? "Roaster",
      location: strOrNull(v.location) ?? undefined,
      website: strOrNull(v.website) ?? undefined,
    };
  });
  roasters.sort((a, b) => a.name.localeCompare(b.name));

  // --- Brews (coffee + tea, resolved). ---
  const allBrews: BrewItem[] = [];

  for (const r of coffeeBrewRecords) {
    const v = r.value;
    const beanRefUri = strOrNull(v.beanRef);
    const bean = beanRefUri ? beanByUri.get(beanRefUri) : undefined;
    const brewerRefUri = strOrNull(v.brewerRef);
    const brewer = brewerRefUri ? brewerByUri.get(brewerRefUri) : undefined;

    const coffeeAmount = numOrNull(v.coffeeAmount);
    const waterAmount = numOrNull(v.waterAmount);
    const ratio =
      coffeeAmount !== null && waterAmount !== null
        ? `${coffeeAmount}g / ${waterAmount}g`
        : undefined;

    allBrews.push({
      kind: "coffee",
      subjectName: bean
        ? strOrNull(bean.name) ?? "Unknown bean"
        : "Unknown bean",
      subjectOrigin: bean ? strOrNull(bean.origin) ?? undefined : undefined,
      subjectQualifier: bean
        ? strOrNull(bean.roastLevel) ?? undefined
        : undefined,
      rating: numOrNull(v.rating),
      tastingNotes: strOrNull(v.tastingNotes) ?? undefined,
      gearName: brewer ? strOrNull(brewer.name) ?? undefined : undefined,
      style: undefined,
      temperatureTenths: numOrNull(v.temperature),
      timeSeconds: numOrNull(v.timeSeconds),
      ratio,
      createdAt: r.createdAt,
    });
  }

  for (const r of teaBrewRecords) {
    const v = r.value;
    const teaRefUri = strOrNull(v.teaRef);
    const tea = teaRefUri ? teaByUri.get(teaRefUri) : undefined;
    const vesselRefUri = strOrNull(v.vesselRef);
    const vessel = vesselRefUri ? vesselByUri.get(vesselRefUri) : undefined;

    const leafGrams = numOrNull(v.leafGrams);
    const waterAmount = numOrNull(v.waterAmount);
    const ratio =
      leafGrams !== null && waterAmount !== null
        ? `${leafGrams}g / ${waterAmount}g`
        : undefined;

    allBrews.push({
      kind: "tea",
      subjectName: tea
        ? strOrNull(tea.name) ?? "Unknown tea"
        : "Unknown tea",
      subjectOrigin: tea ? strOrNull(tea.origin) ?? undefined : undefined,
      subjectQualifier: tea
        ? strOrNull(tea.category) ?? undefined
        : undefined,
      rating: numOrNull(v.rating),
      tastingNotes: strOrNull(v.tastingNotes) ?? undefined,
      gearName: vessel ? strOrNull(vessel.name) ?? undefined : undefined,
      style: strOrNull(v.style) ?? strOrNull(v.infusionMethod) ?? undefined,
      temperatureTenths: numOrNull(v.temperature),
      timeSeconds: numOrNull(v.timeSeconds),
      ratio,
      createdAt: r.createdAt,
    });
  }

  // Top brews by rating desc, then most-recent first as tiebreaker.
  const topBrews = [...allBrews]
    .sort((a, b) => {
      const ra = a.rating ?? -Infinity;
      const rb = b.rating ?? -Infinity;
      if (ra !== rb) return rb - ra;
      return (
        (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
      );
    })
    .slice(0, 6);

  const ratings = allBrews
    .map((b) => b.rating)
    .filter((r): r is number => r !== null);
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((s, n) => s + n, 0) / ratings.length
      : null;

  return {
    totalBrews: allBrews.length,
    coffeeBrews: coffeeBrewRecords.length,
    teaBrews: teaBrewRecords.length,
    averageRating,
    beanCount: beanRecords.length,
    teaVarietalCount: teaRecords.length,
    brewerCount: brewerRecords.length,
    grinderCount: grinderRecords.length,
    vesselCount: vesselRecords.length,
    roasterCount: roasterRecords.length,
    topBrews,
    beans,
    teas,
    gear,
    roasters,
  };
}
