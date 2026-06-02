import type { RepoRecord } from "../atproto";

export type VibeMealEngraving = {
  bodySerial?: string;
  bottomLip?: string;
  bottomMinted?: string;
  lidOuterPrimary?: string;
  lidOuterSecondary?: string;
};

export type VibeMealCan = {
  rkey?: string;
  runId?: string;
  mintNumber: number | null;
  recipeId?: string;
  issuerDid?: string;
  verificationUrl?: string;
  issuedAt: Date | null;
  cubemapId?: string;
  gradientId?: string;
  engraving: VibeMealEngraving;
  createdAt: Date | null;
};

export type VibeMealHighlights = {
  total: number;
  cans: VibeMealCan[];
};

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function parseDate(v: unknown): Date | null {
  if (typeof v !== "string") return null;
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : new Date(t);
}

export function getVibeMealHighlights(
  byCollection: Map<string, RepoRecord[]>,
): VibeMealHighlights | null {
  const records = byCollection.get("com.vibe-coded.meal.generation") ?? [];
  if (records.length === 0) return null;

  const cans: VibeMealCan[] = records.map((r) => {
    const v = r.value;
    const claim = (v.claim as Record<string, unknown> | undefined) ?? {};
    const params =
      (claim.params as Record<string, unknown> | undefined) ?? {};
    const shader =
      (params.shader as Record<string, unknown> | undefined) ?? {};
    const shaderValues =
      (shader.values as Record<string, unknown> | undefined) ?? {};
    const engravingObj =
      (params.engraving as Record<string, unknown> | undefined) ?? {};
    const slots =
      (engravingObj.slots as Record<string, unknown> | undefined) ?? {};

    return {
      rkey: strOrUndef(claim.rkey),
      runId: strOrUndef(claim.runId),
      mintNumber:
        typeof claim.mintNumber === "number" ? claim.mintNumber : null,
      recipeId: strOrUndef(claim.recipeId),
      issuerDid: strOrUndef(claim.issuerDid),
      verificationUrl: strOrUndef(claim.verificationUrl),
      issuedAt: parseDate(claim.issuedAt),
      cubemapId: strOrUndef(shaderValues.cubemapId),
      gradientId: strOrUndef(shaderValues.gradientId),
      engraving: {
        bodySerial: strOrUndef(slots.bodySerial),
        bottomLip: strOrUndef(slots.bottomLip),
        bottomMinted: strOrUndef(slots.bottomMinted),
        lidOuterPrimary: strOrUndef(slots.lidOuterPrimary),
        lidOuterSecondary: strOrUndef(slots.lidOuterSecondary),
      },
      createdAt: r.createdAt,
    };
  });

  cans.sort((a, b) => {
    const aT = a.issuedAt?.getTime() ?? a.createdAt?.getTime() ?? 0;
    const bT = b.issuedAt?.getTime() ?? b.createdAt?.getTime() ?? 0;
    return bT - aT;
  });

  return {
    total: records.length,
    cans,
  };
}
