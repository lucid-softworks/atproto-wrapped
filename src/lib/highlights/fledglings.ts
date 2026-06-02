import type { RepoRecord } from "../atproto";

export type FledglingsAction = {
  kind: string;
  /** at:// URI of the com.nrempel.fledglings.creature being tended. */
  subjectUri: string;
  createdAt: Date | null;
};

export type FledglingsCreatureStat = {
  uri: string;
  actionCount: number;
};

export type FledglingsHighlights = {
  totalActions: number;
  /** Each unique action `kind` (clean, water, feed, pet, …) → count. */
  actionsByKind: Map<string, number>;
  /** Unique creature URIs ranked by how many actions the actor took on them. */
  creatureUris: FledglingsCreatureStat[];
  /** Top 12 actions by createdAt desc. */
  recentActions: FledglingsAction[];
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

export function getFledglingsHighlights(
  byCollection: Map<string, RepoRecord[]>,
): FledglingsHighlights | null {
  const records = byCollection.get("com.nrempel.fledglings.action") ?? [];
  if (records.length === 0) return null;

  const actionsByKind = new Map<string, number>();
  const perCreature = new Map<string, number>();
  const actions: FledglingsAction[] = [];

  for (const r of records) {
    const v = r.value;
    const kind = strOrNull(v.kind) ?? "unknown";
    actionsByKind.set(kind, (actionsByKind.get(kind) ?? 0) + 1);

    const subject = v.subject as Record<string, unknown> | undefined;
    const subjectUri = subject ? strOrNull(subject.uri) : null;
    if (!subjectUri) continue;

    perCreature.set(subjectUri, (perCreature.get(subjectUri) ?? 0) + 1);
    actions.push({
      kind,
      subjectUri,
      createdAt: r.createdAt,
    });
  }

  actions.sort(
    (a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  const creatureUris: FledglingsCreatureStat[] = Array.from(
    perCreature.entries(),
  )
    .map(([uri, actionCount]) => ({ uri, actionCount }))
    .sort((a, b) => b.actionCount - a.actionCount);

  return {
    totalActions: records.length,
    actionsByKind,
    creatureUris,
    recentActions: actions.slice(0, 12),
  };
}
