import type { RepoRecord } from "../atproto";

export type FundingChannel = {
  uri: string; // at:// URI of the channel record
  channelType: string | null;
  channelUri: string | null; // https:// URI from the channel value, if any
  createdAt: Date | null;
};

export type FundingPlan = {
  uri: string; // at:// URI of the plan record
  name: string;
  amountCents: number | null;
  currency: string | null;
  frequency: string | null;
  /** Channel at:// URIs referenced by this plan, in original order. */
  channelRefs: string[];
  /** Resolved channels (only those found in the same repo). */
  channels: FundingChannel[];
  createdAt: Date | null;
};

export type FundingHighlights = {
  totalPlans: number;
  totalChannels: number;
  /** Sum of all plan amounts (in cents), normalized to a yearly cadence. */
  annualizedCents: number;
  /** Currency code seen on plans, if a single one dominates. */
  primaryCurrency: string | null;
  plans: FundingPlan[];
  /** Channels not referenced by any plan, for the orphan subsection. */
  orphanChannels: FundingChannel[];
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function numOrNull(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function frequencyMultiplier(frequency: string | null): number {
  if (!frequency) return 1;
  switch (frequency.toLowerCase()) {
    case "daily":
      return 365;
    case "weekly":
      return 52;
    case "biweekly":
    case "bi-weekly":
      return 26;
    case "monthly":
      return 12;
    case "quarterly":
      return 4;
    case "yearly":
    case "annually":
    case "annual":
      return 1;
    case "one-time":
    case "onetime":
    case "once":
    default:
      return 1;
  }
}

export function getFundingHighlights(
  byCollection: Map<string, RepoRecord[]>,
): FundingHighlights | null {
  const planRecords = byCollection.get("fund.at.funding.plan") ?? [];
  const channelRecords = byCollection.get("fund.at.funding.channel") ?? [];

  if (planRecords.length === 0 && channelRecords.length === 0) return null;

  // Build channel map keyed by at:// URI so plans can dereference.
  const channelByUri = new Map<string, FundingChannel>();
  for (const r of channelRecords) {
    const v = r.value;
    const channel: FundingChannel = {
      uri: r.uri,
      channelType: strOrNull(v.channelType),
      channelUri: strOrNull(v.uri),
      createdAt: r.createdAt,
    };
    channelByUri.set(r.uri, channel);
  }

  const referencedChannelUris = new Set<string>();
  const plans: FundingPlan[] = planRecords.map((r) => {
    const v = r.value;
    const channelRefs = Array.isArray(v.channels)
      ? (v.channels as unknown[]).filter(
          (x): x is string => typeof x === "string",
        )
      : [];
    for (const ref of channelRefs) referencedChannelUris.add(ref);
    const channels: FundingChannel[] = channelRefs
      .map((ref) => channelByUri.get(ref))
      .filter((c): c is FundingChannel => !!c);
    return {
      uri: r.uri,
      name: strOrNull(v.name) ?? "Unnamed plan",
      amountCents: numOrNull(v.amount),
      currency: strOrNull(v.currency),
      frequency: strOrNull(v.frequency),
      channelRefs,
      channels,
      createdAt: r.createdAt,
    };
  });

  plans.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  const orphanChannels: FundingChannel[] = [];
  for (const [uri, c] of channelByUri) {
    if (!referencedChannelUris.has(uri)) orphanChannels.push(c);
  }
  orphanChannels.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  let annualizedCents = 0;
  const currencyCounts = new Map<string, number>();
  for (const p of plans) {
    if (p.amountCents !== null) {
      annualizedCents += p.amountCents * frequencyMultiplier(p.frequency);
    }
    if (p.currency) {
      currencyCounts.set(p.currency, (currencyCounts.get(p.currency) ?? 0) + 1);
    }
  }

  let primaryCurrency: string | null = null;
  let topCount = 0;
  for (const [c, n] of currencyCounts) {
    if (n > topCount) {
      primaryCurrency = c;
      topCount = n;
    }
  }

  return {
    totalPlans: plans.length,
    totalChannels: channelRecords.length,
    annualizedCents,
    primaryCurrency,
    plans,
    orphanChannels,
  };
}
