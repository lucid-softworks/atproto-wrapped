import type { RepoRecord } from "../atproto";

export type MarqueDnsRecord = {
  name: string;
  value: string;
  recordType: string;
  ttl: string;
};

export type MarqueDomain = {
  domain: string;
  status: string | null;
  dnssec: boolean | null;
  whoisPrivacy: string | null;
  atprotoHandle: string | null;
  atprotoVerified: boolean | null;
  nameServers: string[];
  registeredAt: Date | null;
  expiresAt: Date | null;
  dnsRecords: MarqueDnsRecord[];
};

export type MarqueHighlights = {
  domains: MarqueDomain[];
  totalDomains: number;
  totalDnsRecords: number;
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function parseDate(v: unknown): Date | null {
  if (typeof v !== "string") return null;
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : new Date(t);
}

function boolOrNull(v: unknown): boolean | null {
  return typeof v === "boolean" ? v : null;
}

export function getMarqueHighlights(
  byCollection: Map<string, RepoRecord[]>,
): MarqueHighlights | null {
  const domainRecords = byCollection.get("at.marque.domain") ?? [];
  const dnsRecords = byCollection.get("at.marque.dns") ?? [];
  if (domainRecords.length === 0 && dnsRecords.length === 0) return null;

  // Group DNS records by domain name for fast lookup.
  const dnsByDomain = new Map<string, MarqueDnsRecord[]>();
  for (const r of dnsRecords) {
    const v = r.value;
    const domain = strOrNull(v.domain);
    if (!domain) continue;
    const raw = Array.isArray(v.records) ? v.records : [];
    const list: MarqueDnsRecord[] = [];
    for (const item of raw) {
      if (!item || typeof item !== "object") continue;
      const o = item as Record<string, unknown>;
      list.push({
        name: strOrNull(o.name) ?? "@",
        value: strOrNull(o.value) ?? "",
        recordType: strOrNull(o.recordType) ?? "?",
        ttl: strOrNull(o.ttl) ?? "auto",
      });
    }
    const existing = dnsByDomain.get(domain);
    if (existing) existing.push(...list);
    else dnsByDomain.set(domain, list);
  }

  const domains: MarqueDomain[] = domainRecords.map((r) => {
    const v = r.value;
    const domain = strOrNull(v.domain) ?? "";
    const nameServers = Array.isArray(v.nameServers)
      ? (v.nameServers.filter(
          (n) => typeof n === "string" && n.length > 0,
        ) as string[])
      : [];
    return {
      domain,
      status: strOrNull(v.status),
      dnssec: boolOrNull(v.dnssec),
      whoisPrivacy: strOrNull(v.whoisPrivacy),
      atprotoHandle: strOrNull(v.atprotoHandle),
      atprotoVerified: boolOrNull(v.atprotoVerified),
      nameServers,
      registeredAt: parseDate(v.registeredAt),
      expiresAt: parseDate(v.expiresAt),
      dnsRecords: dnsByDomain.get(domain) ?? [],
    };
  });

  // For DNS records on domains we didn't find a domain record for, surface
  // them as bare entries so they're not silently dropped.
  for (const [domain, list] of dnsByDomain) {
    if (!domains.some((d) => d.domain === domain)) {
      domains.push({
        domain,
        status: null,
        dnssec: null,
        whoisPrivacy: null,
        atprotoHandle: null,
        atprotoVerified: null,
        nameServers: [],
        registeredAt: null,
        expiresAt: null,
        dnsRecords: list,
      });
    }
  }

  domains.sort((a, b) => a.domain.localeCompare(b.domain));

  const totalDnsRecords = domains.reduce(
    (s, d) => s + d.dnsRecords.length,
    0,
  );

  return {
    domains,
    totalDomains: domains.length,
    totalDnsRecords,
  };
}
