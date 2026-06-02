import type { RepoRecord } from "../atproto";

export type CosmikCollection = {
  uri: string;
  name: string;
  description?: string;
  accessType?: string;
  collaborators: number;
  createdAt: Date | null;
};

export type CosmikConnection = {
  uri: string;
  source?: string;
  target?: string;
  connectionType?: string;
  createdAt: Date | null;
};

export type CosmikHighlights = {
  totalCollections: number;
  totalConnections: number;
  connectionTypes: Map<string, number>;
  collections: CosmikCollection[];
  recentConnections: CosmikConnection[];
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export function getCosmikHighlights(
  byCollection: Map<string, RepoRecord[]>,
): CosmikHighlights | null {
  const collectionRecords =
    byCollection.get("network.cosmik.collection") ?? [];
  if (collectionRecords.length === 0) return null;

  const connectionRecords =
    byCollection.get("network.cosmik.connection") ?? [];

  const collections: CosmikCollection[] = collectionRecords.map((r) => {
    const v = r.value;
    const collaborators = Array.isArray(v.collaborators)
      ? v.collaborators.length
      : 0;
    return {
      uri: r.uri,
      name: strOrNull(v.name) ?? "Untitled collection",
      description: strOrUndef(v.description),
      accessType: strOrUndef(v.accessType),
      collaborators,
      createdAt: r.createdAt,
    };
  });

  collections.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  const connectionTypes = new Map<string, number>();
  const connections: CosmikConnection[] = connectionRecords.map((r) => {
    const v = r.value;
    const type = strOrUndef(v.connectionType);
    if (type)
      connectionTypes.set(type, (connectionTypes.get(type) ?? 0) + 1);
    return {
      uri: r.uri,
      source: strOrUndef(v.source),
      target: strOrUndef(v.target),
      connectionType: type,
      createdAt: r.createdAt,
    };
  });

  connections.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return {
    totalCollections: collectionRecords.length,
    totalConnections: connectionRecords.length,
    connectionTypes,
    collections,
    recentConnections: connections.slice(0, 8),
  };
}
