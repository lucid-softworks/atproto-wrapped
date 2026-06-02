import type { RepoStats } from "../atproto";

export type SonaskyColor = {
  hex: string;
  label?: string;
};

export type SonaskyCharacter = {
  name: string;
  species?: string;
  pronouns?: string;
  description?: string;
  refSheet?: string;
  nsfw: boolean;
  drawWithoutAskingSFW: boolean;
  drawWithoutAskingNSFW: boolean;
  colors: SonaskyColor[];
};

export type SonaskyHighlights = {
  total: number;
  characters: SonaskyCharacter[];
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function boolOr(v: unknown, fallback: boolean): boolean {
  return typeof v === "boolean" ? v : fallback;
}

export function getSonaskyHighlights(
  stats: RepoStats,
): SonaskyHighlights | null {
  const records = stats.byCollection.get("app.sonasky.ref") ?? [];
  if (records.length === 0) return null;

  const characters: SonaskyCharacter[] = records
    .map((r) => {
      const c = (r.value.character as Record<string, unknown> | undefined) ?? {};
      const rawColors = Array.isArray(c.colors) ? c.colors : [];
      const colors: SonaskyColor[] = [];
      for (const raw of rawColors) {
        if (!raw || typeof raw !== "object") continue;
        const o = raw as Record<string, unknown>;
        const hex = strOrNull(o.hex);
        if (!hex) continue;
        colors.push({ hex, label: strOrUndef(o.label) });
      }
      return {
        name: strOrNull(c.name) ?? "Unnamed",
        species: strOrUndef(c.species),
        pronouns: strOrUndef(c.pronouns),
        description: strOrUndef(c.description),
        refSheet: strOrUndef(c.refSheet),
        nsfw: boolOr(c.nsfw, false),
        drawWithoutAskingSFW: boolOr(c.drawWithoutAskingSFW, false),
        drawWithoutAskingNSFW: boolOr(c.drawWithoutAskingNSFW, false),
        colors,
      };
    })
    .filter((c) => c.name);

  return {
    total: records.length,
    characters: characters.slice(0, 8),
  };
}
