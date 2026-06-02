import type { RepoRecord } from "../atproto";

export type SkyboardColumn = {
  id?: string;
  name: string;
  order: number;
};

export type SkyboardBoard = {
  uri: string;
  name: string;
  columns: SkyboardColumn[];
  permissionRules: number;
  createdAt: Date | null;
};

export type SkyboardHighlights = {
  totalBoards: number;
  totalColumns: number;
  boards: SkyboardBoard[];
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export function getSkyboardHighlights(
  byCollection: Map<string, RepoRecord[]>,
): SkyboardHighlights | null {
  const boardRecords = byCollection.get("dev.skyboard.board") ?? [];
  if (boardRecords.length === 0) return null;

  let totalColumns = 0;
  const boards: SkyboardBoard[] = boardRecords.map((r) => {
    const v = r.value;
    const rawColumns = Array.isArray(v.columns)
      ? (v.columns as unknown[])
      : [];
    const columns: SkyboardColumn[] = [];
    rawColumns.forEach((c, idx) => {
      if (!c || typeof c !== "object") return;
      const col = c as Record<string, unknown>;
      const name = strOrNull(col.name);
      if (!name) return;
      columns.push({
        id: strOrUndef(col.id),
        name,
        order: typeof col.order === "number" ? col.order : idx,
      });
    });
    columns.sort((a, b) => a.order - b.order);
    totalColumns += columns.length;

    const permissions = v.permissions as Record<string, unknown> | undefined;
    const rules =
      permissions && Array.isArray(permissions.rules)
        ? permissions.rules.length
        : 0;

    return {
      uri: r.uri,
      name: strOrNull(v.name) ?? "Untitled board",
      columns,
      permissionRules: rules,
      createdAt: r.createdAt,
    };
  });

  boards.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return {
    totalBoards: boardRecords.length,
    totalColumns,
    boards,
  };
}
