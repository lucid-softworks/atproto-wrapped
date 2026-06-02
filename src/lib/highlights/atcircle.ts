import type { RepoRecord } from "../atproto";

export type AtCircleRing = {
  uri: string;
  title: string;
  description?: string;
  admin?: string;
  acceptancePolicy?: string;
  status?: string;
  createdAt: Date | null;
};

export type AtCircleMember = {
  uri: string;
  title: string;
  url?: string;
  rss?: string;
  ringUri?: string;
  createdAt: Date | null;
};

export type AtCircleHighlights = {
  ringsAdmined: number;
  memberships: number;
  rings: AtCircleRing[];
  members: AtCircleMember[];
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export function getAtCircleHighlights(
  byCollection: Map<string, RepoRecord[]>,
): AtCircleHighlights | null {
  const ringRecords =
    byCollection.get("net.asadaame5121.at-circle.ring") ?? [];
  const memberRecords =
    byCollection.get("net.asadaame5121.at-circle.member") ?? [];

  if (ringRecords.length === 0 && memberRecords.length === 0) return null;

  const rings: AtCircleRing[] = ringRecords.map((r) => {
    const v = r.value;
    return {
      uri: r.uri,
      title: strOrNull(v.title) ?? "Untitled ring",
      description: strOrUndef(v.description),
      admin: strOrUndef(v.admin),
      acceptancePolicy: strOrUndef(v.acceptancePolicy),
      status: strOrUndef(v.status),
      createdAt: r.createdAt,
    };
  });
  rings.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  const members: AtCircleMember[] = memberRecords.map((r) => {
    const v = r.value;
    const ring = v.ring as Record<string, unknown> | undefined;
    return {
      uri: r.uri,
      title: strOrNull(v.title) ?? "Untitled site",
      url: strOrUndef(v.url),
      rss: strOrUndef(v.rss),
      ringUri: ring ? strOrUndef(ring.uri) : undefined,
      createdAt: r.createdAt,
    };
  });
  members.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return {
    ringsAdmined: ringRecords.length,
    memberships: memberRecords.length,
    rings,
    members,
  };
}
