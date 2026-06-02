import type { StandardDocsHighlights } from "../../lib/highlights/standardDocs";

export function FeaturedStandardDocsSection({
  data,
}: {
  data: StandardDocsHighlights;
}) {
  const stats: Array<[string, number]> = [
    ["Documents", data.totalDocs],
    ["Recommends", data.totalRecommends],
    ["Unique tags", data.uniqueTags],
  ].filter(([, n]) => (n as number) > 0) as Array<[string, number]>;

  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-ink text-cream">
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest text-cream/65 uppercase">
            Spotlight · Standard
          </div>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Long-form on the{" "}
          <span className="font-serif italic">Standard</span>.
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

        {data.docs.length > 0 && (
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {data.docs.map((d, i) => (
              <li
                key={`${d.title}-${i}`}
                className="rounded-2xl border-2 border-cream bg-ink p-4"
              >
                <div className="font-semibold leading-tight">{d.title}</div>
                {d.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {d.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-cream/40 px-2 py-0.5 font-mono text-[10px] tracking-widest text-cream/70 uppercase"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {d.description && (
                  <p className="mt-2 line-clamp-3 font-serif text-sm italic text-cream/80">
                    {d.description}
                  </p>
                )}
                {(d.publishedAt ?? d.createdAt) && (
                  <div className="mt-2 font-mono text-[10px] text-cream/45">
                    {(d.publishedAt ?? d.createdAt)?.toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
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
