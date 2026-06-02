import type { RepoStats } from "../atproto";

export type AtRoomNameLang = {
  lang: string;
  value: string;
};

export type AtRoomObject = {
  name: string;
  scale: number | null;
  /** Alternate-language names other than English, if any. */
  altNames: AtRoomNameLang[];
  createdAt: Date | null;
};

export type AtRoomLayout = {
  size: number | null;
  wallHeight: number | null;
  wallThickness: number | null;
  /** Hex string like "#rrggbb" or undefined if no color provided. */
  wallColor?: string;
  floorColor?: string;
  furnishingsCount: number;
  createdAt: Date | null;
};

export type AtRoomHighlights = {
  totalObjects: number;
  totalLayouts: number;
  objects: AtRoomObject[];
  layout?: AtRoomLayout;
};

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function numOrNull(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function clampByte(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(255, Math.round(n)));
}

function toHex2(n: number): string {
  const h = clampByte(n).toString(16);
  return h.length === 1 ? `0${h}` : h;
}

/**
 * Convert a `{red, green, blue}` (each 0-255 ints) shape to a "#rrggbb"
 * string. Returns undefined when the input isn't shaped like a color.
 */
function pickColorHex(v: unknown): string | undefined {
  if (!v || typeof v !== "object") return undefined;
  const c = v as Record<string, unknown>;
  const r = numOrNull(c.red);
  const g = numOrNull(c.green);
  const b = numOrNull(c.blue);
  if (r === null || g === null || b === null) return undefined;
  return `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`;
}

function pickNameLangs(v: unknown): AtRoomNameLang[] {
  if (!Array.isArray(v)) return [];
  const out: AtRoomNameLang[] = [];
  for (const entry of v) {
    if (!entry || typeof entry !== "object") continue;
    const e = entry as Record<string, unknown>;
    const lang = strOrUndef(e.lang);
    const value = strOrUndef(e.value);
    if (!lang || !value) continue;
    out.push({ lang, value });
  }
  return out;
}

export function getAtRoomHighlights(
  stats: RepoStats,
): AtRoomHighlights | null {
  const objectRecords =
    stats.byCollection.get("blue.atroom.room.object") ?? [];
  const layoutRecords =
    stats.byCollection.get("blue.atroom.room.layout") ?? [];

  if (objectRecords.length === 0 && layoutRecords.length === 0) return null;

  const objects: AtRoomObject[] = objectRecords.map((r) => {
    const v = r.value;
    const langs = pickNameLangs(v.nameLangs);
    const englishLang = langs.find((l) => l.lang === "en");
    const name = englishLang?.value ?? strOrUndef(v.name) ?? "Untitled";
    const altNames = langs.filter((l) => l.lang !== "en");
    return {
      name,
      scale: numOrNull(v.scale),
      altNames,
      createdAt: r.createdAt,
    };
  });

  // Top 12 by createdAt desc.
  objects.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );
  const topObjects = objects.slice(0, 12);

  // Use the most recent layout, if any.
  let layout: AtRoomLayout | undefined = undefined;
  if (layoutRecords.length > 0) {
    const sortedLayouts = [...layoutRecords].sort(
      (a, b) =>
        (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
    );
    const r = sortedLayouts[0];
    const v = r.value;
    const wall = (v.wall ?? {}) as Record<string, unknown>;
    const floor = (v.floor ?? {}) as Record<string, unknown>;
    const wallSurface = (wall.surface ?? {}) as Record<string, unknown>;
    const floorSurface = (floor.surface ?? {}) as Record<string, unknown>;
    const furnishings = Array.isArray(v.furnishings) ? v.furnishings : [];
    layout = {
      size: numOrNull(v.size),
      wallHeight: numOrNull(wall.height),
      wallThickness: numOrNull(wall.thickness),
      wallColor: pickColorHex(wallSurface.color),
      floorColor: pickColorHex(floorSurface.color),
      furnishingsCount: furnishings.length,
      createdAt: r.createdAt,
    };
  }

  return {
    totalObjects: objectRecords.length,
    totalLayouts: layoutRecords.length,
    objects: topObjects,
    layout,
  };
}
