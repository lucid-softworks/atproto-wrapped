import type { RepoRecord } from "../atproto";

export type AtmosHighlights = {
  domain: string;
  relayMember: boolean;
  dkimSelectors: string[];
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

export function getAtmosHighlights(
  byCollection: Map<string, RepoRecord[]>,
): AtmosHighlights | null {
  const records = byCollection.get("email.atmos.attestation") ?? [];
  if (records.length === 0) return null;
  const v = records[0].value as Record<string, unknown>;
  const domain = strOrNull(v.domain);
  if (!domain) return null;
  const relayMember = v.relayMember === true;
  const dkimSelectors = Array.isArray(v.dkimSelectors)
    ? (v.dkimSelectors as unknown[]).filter(
        (s): s is string => typeof s === "string",
      )
    : [];
  return { domain, relayMember, dkimSelectors };
}
