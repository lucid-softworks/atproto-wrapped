import { useQuery } from "@tanstack/react-query";
import type { PollenHighlights } from "../../lib/highlights/pollen";
import {
  fetchRecordByUri,
  parseAtUri,
} from "../../lib/highlights/_atUri";
import { resolveHandlesForDids } from "../../lib/bskyProfiles";
import { toDisplayHandle } from "../../lib/handle";
import { FeaturedRow } from "./_shared";
import { sectionTheme, type SectionTheme } from "./_theme";

const REACTION_EMOJI: Record<string, string> = {
  seed: "🌱",
  heart: "♡",
  like: "♡",
  star: "★",
  fire: "🔥",
  bloom: "🌸",
  sun: "☀",
};

function reactionEmoji(type: string): string {
  return REACTION_EMOJI[type] ?? "·";
}

function pluralizeReaction(type: string, n: number): string {
  if (n === 1) return type;
  return type.endsWith("s") ? type : `${type}s`;
}

type RemotePollenPost = {
  kind: "text" | "image" | "todo" | "other";
  text?: string;
  title?: string;
  did: string;
};

async function fetchPollenPosts(
  uris: string[],
): Promise<Map<string, RemotePollenPost>> {
  const out = new Map<string, RemotePollenPost>();
  await Promise.all(
    uris.map(async (uri) => {
      const parsed = parseAtUri(uri);
      if (!parsed) return;
      const v = await fetchRecordByUri<Record<string, unknown>>(uri);
      if (!v) return;
      const post: RemotePollenPost = { kind: "other", did: parsed.did };
      if (parsed.collection.endsWith("post.text")) {
        post.kind = "text";
        if (typeof v.text === "string") post.text = v.text;
      } else if (parsed.collection.endsWith("post.image")) {
        post.kind = "image";
        if (typeof v.alt === "string") post.text = v.alt;
        else if (typeof v.caption === "string") post.text = v.caption;
      } else if (parsed.collection.endsWith("post.todo")) {
        post.kind = "todo";
        if (typeof v.title === "string") post.title = v.title;
      }
      out.set(uri, post);
    }),
  );
  return out;
}

function kindLabel(kind: RemotePollenPost["kind"]): string {
  switch (kind) {
    case "text":
      return "post";
    case "image":
      return "photo";
    case "todo":
      return "todo";
    default:
      return "post";
  }
}

export function FeaturedPollenSection({
  data,
  theme,
}: {
  data: PollenHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "lime");
  const reactionEntries = Array.from(data.reactionsByType.entries()).sort(
    (a, b) => b[1] - a[1],
  );

  const subjectUris = Array.from(
    new Set(
      data.recentReactions
        .map((r) => r.subject)
        .filter((s): s is string => !!s),
    ),
  );
  const postsQuery = useQuery({
    queryKey: ["pollen-reaction-posts", subjectUris],
    queryFn: () => fetchPollenPosts(subjectUris),
    enabled: subjectUris.length > 0,
    staleTime: 1000 * 60 * 60,
  });
  const posts = postsQuery.data ?? new Map<string, RemotePollenPost>();

  const authorDids = Array.from(
    new Set(Array.from(posts.values()).map((p) => p.did)),
  );
  const authorsQuery = useQuery({
    queryKey: ["pollen-reaction-authors", authorDids],
    queryFn: () => resolveHandlesForDids(authorDids),
    enabled: authorDids.length > 0,
    staleTime: 1000 * 60 * 60,
  });
  const handles = authorsQuery.data ?? new Map<string, string>();

  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Pollen 🪷
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-lime uppercase">
            {data.totalRecords.toLocaleString()}{" "}
            {data.totalRecords === 1 ? "record" : "records"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">pollen</span> garden.
        </h2>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border-2 border-ink bg-cream p-4">
            <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
              Reactions
            </div>
            <div className="mt-1 text-2xl font-bold tabular-nums">
              {data.totalReactions.toLocaleString()}
            </div>
            {reactionEntries.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs">
                {reactionEntries.map(([type, n]) => (
                  <span key={type} className="whitespace-nowrap">
                    <span aria-hidden>{reactionEmoji(type)}</span>{" "}
                    <span className="font-bold tabular-nums">{n}</span>{" "}
                    <span className="opacity-70">
                      {pluralizeReaction(type, n)}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border-2 border-ink bg-cream p-4">
            <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
              Todos
            </div>
            <div className="mt-1 text-2xl font-bold tabular-nums">
              {data.totalTodos.toLocaleString()}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-ink bg-cream p-4">
            <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
              Follows
            </div>
            <div className="mt-1 text-2xl font-bold tabular-nums">
              {data.totalFollows.toLocaleString()}
            </div>
          </div>
        </div>

        {data.todos.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Recent todos" />
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.todos.map((t, i) => {
                const done = t.items.filter((it) => it.completed).length;
                return (
                  <li
                    key={i}
                    className="rounded-2xl border-2 border-ink bg-cream p-4"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-mono text-[10px] tracking-widest opacity-55 uppercase">
                          Todo
                        </div>
                        {t.title && (
                          <div className="mt-1 truncate font-bold">
                            {t.title}
                          </div>
                        )}
                      </div>
                      {t.items.length > 0 && (
                        <span className="rounded-full border border-ink/40 px-2 py-0.5 font-mono text-[10px] tracking-widest opacity-70 tabular-nums">
                          {done}/{t.items.length}
                        </span>
                      )}
                    </div>
                    {t.items.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {t.items.slice(0, 8).map((it, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-2 text-sm"
                          >
                            <span
                              aria-hidden
                              className={
                                "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-ink " +
                                (it.completed
                                  ? "bg-ink text-cream"
                                  : "bg-cream")
                              }
                            >
                              {it.completed ? "✓" : ""}
                            </span>
                            <span
                              className={
                                it.completed
                                  ? "line-through opacity-55"
                                  : "opacity-90"
                              }
                            >
                              {it.text}
                            </span>
                          </li>
                        ))}
                        {t.items.length > 8 && (
                          <li className="pl-6 font-mono text-[10px] opacity-55">
                            + {t.items.length - 8} more
                          </li>
                        )}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {data.recentReactions.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Recent reactions" />
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.recentReactions.map((r, i) => {
                const post = r.subject ? posts.get(r.subject) : null;
                const handle = post ? handles.get(post.did) : undefined;
                const author = handle
                  ? `@${toDisplayHandle(handle)}`
                  : post?.did;
                const body =
                  post?.text ??
                  post?.title ??
                  (postsQuery.isLoading ? "Loading…" : "");
                return (
                  <li
                    key={i}
                    className="flex gap-3 rounded-2xl border-2 border-ink bg-cream p-4"
                  >
                    <span
                      aria-hidden
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-wrap-lime text-base"
                    >
                      {reactionEmoji(r.reactionType)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2 font-mono text-[11px]">
                        <span className="font-semibold">
                          {r.reactionType}
                        </span>
                        <span className="opacity-55">·</span>
                        {post && (
                          <>
                            <span className="opacity-70">
                              {kindLabel(post.kind)} by
                            </span>
                            <span className="truncate font-semibold">
                              {author}
                            </span>
                          </>
                        )}
                      </div>
                      {body && (
                        <p className="mt-1 line-clamp-3 text-sm leading-snug">
                          {body}
                        </p>
                      )}
                      {r.createdAt && (
                        <div className="mt-2 font-mono text-[10px] opacity-55">
                          reacted{" "}
                          {r.createdAt.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
