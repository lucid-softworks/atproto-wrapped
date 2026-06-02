import type { RepoRecord } from "../atproto";

export type AtToDoTask = {
  uri: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date | null;
};

export type AtToDoList = {
  uri: string;
  name: string;
  description?: string;
  updatedAt: Date | null;
  createdAt: Date | null;
  tasks: AtToDoTask[];
};

export type AtToDoHighlights = {
  totalLists: number;
  totalTasks: number;
  tasksCompleted: number;
  lists: AtToDoList[];
  /** Tasks that weren't claimed by any list (orphaned), shown separately. */
  looseTasks: AtToDoTask[];
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

export function getAtToDoHighlights(
  byCollection: Map<string, RepoRecord[]>,
): AtToDoHighlights | null {
  const listRecords = byCollection.get("app.attodo.list") ?? [];
  if (listRecords.length === 0) return null;

  const taskRecords = byCollection.get("app.attodo.task") ?? [];

  const taskByUri = new Map<string, AtToDoTask>();
  for (const r of taskRecords) {
    const v = r.value;
    taskByUri.set(r.uri, {
      uri: r.uri,
      title: strOrNull(v.title) ?? "Untitled task",
      description: strOrUndef(v.description),
      completed: v.completed === true,
      createdAt: r.createdAt,
    });
  }

  const claimed = new Set<string>();
  const lists: AtToDoList[] = listRecords.map((r) => {
    const v = r.value;
    const taskUris = Array.isArray(v.taskUris)
      ? (v.taskUris as unknown[]).filter(
          (u): u is string => typeof u === "string",
        )
      : [];
    const tasks: AtToDoTask[] = [];
    for (const uri of taskUris) {
      const task = taskByUri.get(uri);
      if (task) {
        tasks.push(task);
        claimed.add(uri);
      }
    }
    return {
      uri: r.uri,
      name: strOrNull(v.name) ?? "Untitled list",
      description: strOrUndef(v.description),
      updatedAt: parseDate(v.updatedAt),
      createdAt: r.createdAt,
      tasks,
    };
  });

  lists.sort(
    (a, b) =>
      (b.updatedAt?.getTime() ?? b.createdAt?.getTime() ?? 0) -
      (a.updatedAt?.getTime() ?? a.createdAt?.getTime() ?? 0),
  );

  const looseTasks: AtToDoTask[] = [];
  for (const [uri, task] of taskByUri) {
    if (!claimed.has(uri)) looseTasks.push(task);
  }
  looseTasks.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  let tasksCompleted = 0;
  for (const task of taskByUri.values()) {
    if (task.completed) tasksCompleted += 1;
  }

  return {
    totalLists: listRecords.length,
    totalTasks: taskRecords.length,
    tasksCompleted,
    lists,
    looseTasks,
  };
}
