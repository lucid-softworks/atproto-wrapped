import type { RepoRecord } from "../atproto";

export type PollenReaction = {
  subject: string | null;
  reactionType: string;
  createdAt: Date | null;
};

export type PollenTodoItem = {
  text: string;
  completed: boolean;
};

export type PollenTodo = {
  title: string | null;
  items: PollenTodoItem[];
  blueskyPostUri: string | null;
  createdAt: Date | null;
};

export type PollenFollow = {
  subject: string;
  createdAt: Date | null;
};

export type PollenHighlights = {
  totalReactions: number;
  reactionsByType: Map<string, number>;
  recentReactions: PollenReaction[];
  totalTodos: number;
  todos: PollenTodo[];
  totalFollows: number;
  totalRecords: number;
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

export function getPollenHighlights(
  byCollection: Map<string, RepoRecord[]>,
): PollenHighlights | null {
  const reactionRecords = byCollection.get("place.pollen.feed.reaction") ?? [];
  const todoRecords = byCollection.get("place.pollen.post.todo") ?? [];
  const followRecords = byCollection.get("place.pollen.graph.follow") ?? [];

  if (
    reactionRecords.length === 0 &&
    todoRecords.length === 0 &&
    followRecords.length === 0
  )
    return null;

  const reactionsByType = new Map<string, number>();
  const reactions: PollenReaction[] = reactionRecords.map((r) => {
    const v = r.value;
    const type = strOrNull(v.reactionType) ?? "other";
    reactionsByType.set(type, (reactionsByType.get(type) ?? 0) + 1);
    return {
      subject: strOrNull(v.subject),
      reactionType: type,
      createdAt: r.createdAt,
    };
  });
  reactions.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  const todos: PollenTodo[] = todoRecords.map((r) => {
    const v = r.value;
    const raw = Array.isArray(v.items) ? v.items : [];
    const items: PollenTodoItem[] = [];
    for (const it of raw) {
      if (!it || typeof it !== "object") continue;
      const o = it as Record<string, unknown>;
      const text = strOrNull(o.text);
      if (!text) continue;
      items.push({ text, completed: o.completed === true });
    }
    return {
      title: strOrNull(v.title),
      items,
      blueskyPostUri: strOrNull(v.blueskyPostUri),
      createdAt: r.createdAt,
    };
  });
  todos.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return {
    totalReactions: reactionRecords.length,
    reactionsByType,
    recentReactions: reactions.slice(0, 10),
    totalTodos: todoRecords.length,
    todos: todos.slice(0, 6),
    totalFollows: followRecords.length,
    totalRecords:
      reactionRecords.length + todoRecords.length + followRecords.length,
  };
}
