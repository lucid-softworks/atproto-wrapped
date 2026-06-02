import type { RepoRecord } from "../atproto";

export type SidetrailStop = {
  tid?: string;
  title?: string;
  content?: string;
  buttonText?: string;
};

export type SidetrailTrail = {
  uri: string;
  rkey: string;
  stops: SidetrailStop[];
  createdAt: Date | null;
};

export type SidetrailHighlights = {
  trails: SidetrailTrail[];
  totalTrails: number;
  totalStops: number;
  completions: number;
  completedTrailUris: string[];
};

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export function getSidetrailHighlights(
  byCollection: Map<string, RepoRecord[]>,
): SidetrailHighlights | null {
  const trailRecords = byCollection.get("app.sidetrail.trail") ?? [];
  const completionRecords =
    byCollection.get("app.sidetrail.completion") ?? [];
  if (trailRecords.length === 0 && completionRecords.length === 0) return null;

  const trails: SidetrailTrail[] = trailRecords.map((r) => {
    const v = r.value;
    const rawStops = Array.isArray(v.stops) ? v.stops : [];
    const stops: SidetrailStop[] = rawStops.map((s) => {
      if (!s || typeof s !== "object") return {};
      const so = s as Record<string, unknown>;
      return {
        tid: strOrUndef(so.tid),
        title: strOrUndef(so.title),
        content: strOrUndef(so.content),
        buttonText: strOrUndef(so.buttonText),
      };
    });
    return {
      uri: r.uri,
      rkey: r.rkey,
      stops,
      createdAt: r.createdAt,
    };
  });
  trails.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  const totalStops = trails.reduce((s, t) => s + t.stops.length, 0);

  const completedTrailUris: string[] = [];
  const seenUris = new Set<string>();
  for (const r of completionRecords) {
    const trail = r.value.trail;
    if (!trail || typeof trail !== "object") continue;
    const uri = (trail as Record<string, unknown>).uri;
    if (typeof uri !== "string" || uri.length === 0) continue;
    if (seenUris.has(uri)) continue;
    seenUris.add(uri);
    completedTrailUris.push(uri);
  }

  return {
    trails: trails.slice(0, 8),
    totalTrails: trailRecords.length,
    totalStops,
    completions: completionRecords.length,
    completedTrailUris,
  };
}
