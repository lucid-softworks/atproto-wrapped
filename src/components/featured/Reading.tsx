import type { ReadingHighlights } from "../../lib/featured";

export function FeaturedReadingSection({ data }: { data: ReadingHighlights }) {
  const stats: Array<[string, number]> = [
    ["Blog posts", data.blogsWritten],
    ["Books", data.booksLogged],
    ["Leaflet docs", data.leafletDocs],
    ["Bookmarks", data.bookmarks],
    ["Annotations", data.annotations],
    ["Skylight ratings", data.skylights],
  ].filter(([, n]) => (n as number) > 0) as Array<[string, number]>;

  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-violet text-cream">
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest text-cream/65 uppercase">
            Spotlight · Reading & writing
          </div>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">book</span> club.
        </h2>

        {stats.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {stats.map(([k, n]) => (
              <div
                key={k}
                className="rounded-2xl border-2 border-cream bg-ink px-4 py-2"
              >
                <div className="font-mono text-[10px] tracking-widest text-cream/65 uppercase">
                  {k}
                </div>
                <div className="text-xl font-bold tabular-nums">
                  {n.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.items.length > 0 && (
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {data.items.map((it, i) => (
              <li
                key={`${it.title}-${i}`}
                className="rounded-2xl border-2 border-cream bg-ink p-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="line-clamp-2 font-semibold leading-tight">
                    {it.title}
                  </div>
                  <span className="shrink-0 rounded-full bg-cream px-2 py-0.5 font-mono text-[10px] tracking-widest text-ink uppercase">
                    {readingKindLabel(it.kind)}
                  </span>
                </div>
                {it.author && (
                  <div className="mt-1 text-sm text-cream/65">{it.author}</div>
                )}
                {it.excerpt && (
                  <p className="mt-2 line-clamp-3 font-serif text-sm italic text-cream/80">
                    {it.excerpt}
                  </p>
                )}
                {it.createdAt && (
                  <div className="mt-2 font-mono text-[10px] text-cream/45">
                    {it.createdAt.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function readingKindLabel(kind: ReadingHighlights["items"][number]["kind"]) {
  switch (kind) {
    case "blog":
      return "blog";
    case "book":
      return "book";
    case "leaflet":
      return "leaflet";
    case "bookmark":
      return "bookmark";
    case "annotation":
      return "highlight";
    case "skylight":
      return "rating";
  }
}
