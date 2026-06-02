import type { RankthatHighlights } from "../../lib/highlights/rankthat";
import { FeaturedRow } from "./_shared";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedRankthatSection({
  data,
  theme,
}: {
  data: RankthatHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "orange");
  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Rankthat
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-orange uppercase">
            {data.totalItems.toLocaleString()}{" "}
            {data.totalItems === 1 ? "item" : "items"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">rankings</span>.
        </h2>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-ink bg-cream p-5">
            <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
              Rankings
            </div>
            <div className="mt-2 text-4xl font-bold tabular-nums">
              {data.totalCollections.toLocaleString()}
            </div>
          </div>
          <div className="rounded-2xl border-2 border-ink bg-cream p-5">
            <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
              Items ranked
            </div>
            <div className="mt-2 text-4xl font-bold tabular-nums">
              {data.totalItems.toLocaleString()}
            </div>
          </div>
        </div>

        {data.collections.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Rankings" />
            <ul className="mt-4 grid gap-4">
              {data.collections.map((c) => (
                <li
                  key={c.uri}
                  className="rounded-2xl border-2 border-ink bg-cream p-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      {c.color && (
                        <span
                          aria-hidden
                          className="inline-block h-4 w-4 shrink-0 rounded-full border-2 border-ink"
                          style={{ backgroundColor: c.color }}
                        />
                      )}
                      <div className="line-clamp-1 font-semibold leading-tight">
                        {c.name}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 font-mono text-[10px] tracking-widest text-wrap-orange uppercase tabular-nums">
                      {c.items.length}
                    </span>
                  </div>
                  {c.items.length > 0 && (
                    <ol className="mt-3 grid gap-1.5">
                      {c.items.slice(0, 10).map((item, idx) => (
                        <li
                          key={item.uri}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-wrap-orange font-mono text-[10px] tabular-nums">
                            {idx + 1}
                          </span>
                          {item.url ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="min-w-0 truncate font-mono text-xs hover:underline"
                            >
                              {item.url}
                            </a>
                          ) : (
                            <span className="min-w-0 truncate font-mono text-xs opacity-70">
                              (no url)
                            </span>
                          )}
                        </li>
                      ))}
                      {c.items.length > 10 && (
                        <li className="font-mono text-[10px] tracking-widest opacity-55 uppercase">
                          + {c.items.length - 10} more
                        </li>
                      )}
                    </ol>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
