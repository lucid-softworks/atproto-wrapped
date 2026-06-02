import type { PollenHighlights } from "../../lib/highlights/pollen";
import { FeaturedRow } from "./_shared";

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
  // Naïve: most types get an "s" suffix, "heart" → "hearts".
  if (n === 1) return type;
  return type.endsWith("s") ? type : `${type}s`;
}

function parseAtUri(
  uri: string,
): { collection: string; rkey: string } | null {
  // at://did:plc:xxx/<collection>/<rkey>
  if (!uri.startsWith("at://")) return null;
  const rest = uri.slice("at://".length);
  const parts = rest.split("/");
  if (parts.length < 3) return null;
  return { collection: parts[1], rkey: parts.slice(2).join("/") };
}

function shortCollection(c: string): string {
  // Show the last meaningful chunk so "place.pollen.post.image" becomes "post.image".
  const parts = c.split(".");
  if (parts.length <= 2) return c;
  return parts.slice(-2).join(".");
}

export function FeaturedPollenSection({ data }: { data: PollenHighlights }) {
  const reactionEntries = Array.from(data.reactionsByType.entries()).sort(
    (a, b) => b[1] - a[1],
  );

  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-lime text-ink">
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
                                (it.completed ? "bg-ink text-cream" : "bg-cream")
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
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {data.recentReactions.map((r, i) => {
                const parsed = r.subject ? parseAtUri(r.subject) : null;
                return (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-xl border-2 border-ink bg-cream px-3 py-2 font-mono text-xs"
                  >
                    <span
                      aria-hidden
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-wrap-lime text-sm"
                    >
                      {reactionEmoji(r.reactionType)}
                    </span>
                    <div className="min-w-0 flex-1 truncate">
                      {parsed ? (
                        <>
                          <span className="opacity-55">
                            {shortCollection(parsed.collection)}/
                          </span>
                          <span>{parsed.rkey}</span>
                        </>
                      ) : (
                        <span className="opacity-55">
                          {r.subject ?? "(no subject)"}
                        </span>
                      )}
                    </div>
                    {r.createdAt && (
                      <span className="text-[10px] opacity-55">
                        {r.createdAt.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
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
