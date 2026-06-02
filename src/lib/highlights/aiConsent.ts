import type { RepoRecord } from "../atproto";

export type AiConsentPref = {
  key: "training" | "embedding" | "inference" | "syntheticContent";
  allow: boolean;
};

export type AiConsentHighlights = {
  prefs: AiConsentPref[];
  allowed: number;
  disallowed: number;
};

const KEYS = ["training", "embedding", "inference", "syntheticContent"] as const;

export function getAiConsentHighlights(
  byCollection: Map<string, RepoRecord[]>,
): AiConsentHighlights | null {
  const records = byCollection.get("community.lexicon.preference.ai") ?? [];
  if (records.length === 0) return null;
  const v = records[0].value as Record<string, unknown>;
  const prefs = (v.preferences ?? {}) as Record<string, unknown>;
  const list: AiConsentPref[] = [];
  let allowed = 0;
  let disallowed = 0;
  for (const key of KEYS) {
    const entry = prefs[key] as Record<string, unknown> | undefined;
    if (!entry) continue;
    const allow = entry.allow === true;
    list.push({ key, allow });
    if (allow) allowed++;
    else disallowed++;
  }
  if (list.length === 0) return null;
  return { prefs: list, allowed, disallowed };
}
