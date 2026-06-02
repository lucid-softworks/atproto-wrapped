import type { RepoRecord } from "../atproto";

export type SkytalkThread = {
  title?: string;
  text?: string;
  channelId?: string;
  createdAt: Date | null;
};

export type SkytalkHighlights = {
  total: number;
  threads: SkytalkThread[];
  channels: number;
};

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

export function getSkytalkHighlights(
  byCollection: Map<string, RepoRecord[]>,
): SkytalkHighlights | null {
  const records = byCollection.get("blue.skytalk.talk.thread") ?? [];
  if (records.length === 0) return null;

  const channels = new Set<string>();
  const threads: SkytalkThread[] = records.map((r) => {
    const v = r.value;
    const channelId = strOrUndef(v.channelId);
    if (channelId) channels.add(channelId);
    return {
      title: strOrUndef(v.title),
      text: strOrUndef(v.text),
      channelId,
      createdAt: r.createdAt,
    };
  });
  threads.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return {
    total: records.length,
    threads: threads.slice(0, 12),
    channels: channels.size,
  };
}
