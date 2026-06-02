import type { RepoRecord } from "../atproto";

export type KeytraceClaim = {
  type: string;
  status: string;
  claimUri: string;
  subject?: string;
  profileUrl?: string;
  displayName?: string;
  lastVerifiedAt: Date | null;
  createdAt: Date | null;
};

export type KeytraceHighlights = {
  claims: KeytraceClaim[];
  verified: number;
  byType: Map<string, number>;
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function parseDate(v: unknown): Date | null {
  if (typeof v !== "string") return null;
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : new Date(t);
}

export function getKeytraceHighlights(
  byCollection: Map<string, RepoRecord[]>,
): KeytraceHighlights | null {
  const records = byCollection.get("dev.keytrace.claim") ?? [];
  if (records.length === 0) return null;

  const claims: KeytraceClaim[] = records.map((r) => {
    const v = r.value as Record<string, unknown>;
    const identity = (v.identity ?? {}) as Record<string, unknown>;
    return {
      type: strOrNull(v.type) ?? "unknown",
      status: strOrNull(v.status) ?? "unknown",
      claimUri: strOrNull(v.claimUri) ?? "",
      subject: strOrUndef(identity.subject),
      profileUrl: strOrUndef(identity.profileUrl),
      displayName: strOrUndef(identity.displayName),
      lastVerifiedAt: parseDate(v.lastVerifiedAt),
      createdAt: r.createdAt,
    };
  });

  claims.sort((a, b) => {
    const ad = a.lastVerifiedAt?.getTime() ?? a.createdAt?.getTime() ?? 0;
    const bd = b.lastVerifiedAt?.getTime() ?? b.createdAt?.getTime() ?? 0;
    return bd - ad;
  });

  const byType = new Map<string, number>();
  let verified = 0;
  for (const c of claims) {
    byType.set(c.type, (byType.get(c.type) ?? 0) + 1);
    if (c.status === "verified") verified++;
  }

  return { claims, verified, byType };
}
