import type { TangledHighlights } from "../../lib/featured";

export function FeaturedTangledSection({ data }: { data: TangledHighlights }) {
  const stats: Array<[string, number]> = [
    ["Repos", data.totalRepos],
    ["Stars given", data.starsGiven],
    ["Reactions", data.reactions],
    ["Issues filed", data.issues],
  ].filter(([, n]) => (n as number) > 0) as Array<[string, number]>;

  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-violet text-cream">
      <div className="grain absolute inset-0 opacity-[0.04]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest text-cream/70 uppercase">
            Spotlight · Tangled
          </div>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">code</span> garden.
        </h2>

        {stats.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {stats.map(([k, n]) => (
              <div
                key={k}
                className="rounded-2xl border-2 border-cream bg-wrap-violet px-5 py-3"
              >
                <div className="font-mono text-[10px] tracking-widest text-cream/65 uppercase">
                  {k}
                </div>
                <div className="mt-1 text-2xl font-bold tabular-nums">
                  {n.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.repos.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-cream/65 uppercase">
              <span className="inline-block h-px w-6 bg-cream/60" />
              Repos
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {data.repos.map((r, i) => (
                <li
                  key={`${r.name}-${i}`}
                  className="flex items-center justify-between gap-3 rounded-xl border-2 border-cream bg-wrap-violet p-3"
                >
                  <div className="min-w-0">
                    <div className="truncate font-mono text-base font-semibold">
                      {r.name}
                    </div>
                    {r.knot && (
                      <div className="truncate font-mono text-[11px] text-cream/65">
                        {r.knot}
                      </div>
                    )}
                  </div>
                  {r.url && (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 rounded-full border border-cream bg-cream px-3 py-1 font-mono text-[10px] tracking-widest text-wrap-violet uppercase"
                    >
                      Open ↗
                    </a>
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
