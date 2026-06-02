import type { SidetrailHighlights } from "../../lib/highlights/sidetrail";
import { FeaturedRow } from "./_shared";

export function FeaturedSidetrailSection({
  data,
}: {
  data: SidetrailHighlights;
}) {
  const stats: Array<[string, string]> = [
    ["Trails", data.totalTrails.toLocaleString()],
    ["Stops", data.totalStops.toLocaleString()],
  ];
  if (data.completions > 0) {
    stats.push(["Completions", data.completions.toLocaleString()]);
  }

  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-lime text-ink">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Sidetrail
          </div>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          <span className="font-serif italic">Trails</span> you've walked.
        </h2>

        <div className="mt-8 flex flex-wrap gap-3">
          {stats.map(([k, v]) => (
            <div
              key={k}
              className="rounded-2xl border-2 border-ink bg-cream px-4 py-2"
            >
              <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                {k}
              </div>
              <div className="text-xl font-bold tabular-nums">{v}</div>
            </div>
          ))}
        </div>

        {data.trails.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Your trails" />
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.trails.map((t) => (
                <li
                  key={t.uri}
                  className="rounded-2xl border-2 border-ink bg-cream p-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="font-mono text-[10px] tracking-widest opacity-55 uppercase">
                      Trail
                    </div>
                    {t.createdAt && (
                      <div className="font-mono text-[10px] opacity-55">
                        {t.createdAt.toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    )}
                  </div>
                  {t.stops.length > 0 ? (
                    <ul className="mt-3 space-y-2">
                      {t.stops.slice(0, 6).map((s, j) => (
                        <li
                          key={`${t.uri}-${j}`}
                          className="flex gap-3 border-l-2 border-ink/30 pl-3"
                        >
                          <div className="min-w-0">
                            {s.title && (
                              <div className="font-semibold leading-tight">
                                {s.title}
                              </div>
                            )}
                            {s.content && (
                              <div className="mt-1 line-clamp-2 font-serif text-sm italic opacity-80">
                                {s.content}
                              </div>
                            )}
                            {s.buttonText && (
                              <div className="mt-1 inline-block rounded-full border border-ink/40 px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase opacity-65">
                                {s.buttonText}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                      {t.stops.length > 6 && (
                        <li className="pl-3 font-mono text-[10px] opacity-55">
                          + {t.stops.length - 6} more stops
                        </li>
                      )}
                    </ul>
                  ) : (
                    <div className="mt-3 font-mono text-[10px] opacity-55">
                      (no stops)
                    </div>
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
