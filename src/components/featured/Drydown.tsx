import type { DrydownHighlights } from "../../lib/featured";
import { Cover } from "../Cover";

export function FeaturedDrydownSection({ data }: { data: DrydownHighlights }) {
  const stats: Array<[string, number]> = [
    ["Reviews", data.total],
    ["Fragrances", data.fragrances],
    ["Houses", data.houses],
  ].filter(([, n]) => (n as number) > 0) as Array<[string, number]>;

  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-pink text-ink">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Drydown
          </div>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">fragrance</span> diary.
        </h2>

        {stats.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {stats.map(([k, n]) => (
              <div
                key={k}
                className="rounded-2xl border-2 border-ink bg-cream px-4 py-2"
              >
                <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                  {k}
                </div>
                <div className="text-xl font-bold tabular-nums">
                  {n.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.reviews.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.reviews.map((r, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border-2 border-ink bg-cream"
              >
                {r.imageUrl && (
                  <div className="relative aspect-[3/2] border-b-2 border-ink bg-ink/10">
                    <Cover
                      src={r.imageUrl}
                      alt={r.fragrance ?? "fragrance"}
                      fallback="✿"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="line-clamp-2 font-semibold leading-tight">
                      {r.fragrance ?? "Untitled fragrance"}
                    </div>
                    {r.rating !== null && (
                      <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 font-mono text-xs font-bold tabular-nums text-wrap-pink">
                        {r.rating}/{r.scale}
                      </span>
                    )}
                  </div>
                  {r.house && (
                    <div className="mt-0.5 text-sm opacity-65">{r.house}</div>
                  )}
                  {r.text && (
                    <p className="mt-2 line-clamp-4 font-serif text-sm italic opacity-80">
                      "{r.text}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
