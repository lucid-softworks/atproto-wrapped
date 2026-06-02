import type { FrontpageHighlights } from "../../lib/featured";

export function FeaturedFrontpageSection({
  data,
}: {
  data: FrontpageHighlights;
}) {
  const stats: Array<[string, number]> = [
    ["Submissions", data.posts],
    ["Comments", data.comments],
    ["Votes", data.votes],
  ].filter(([, n]) => (n as number) > 0) as Array<[string, number]>;

  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-orange text-ink">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Frontpage
          </div>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          On <span className="font-serif italic">Frontpage</span>.
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

        {data.recent.length > 0 && (
          <ul className="mt-10 grid gap-2">
            {data.recent.map((p, i) => (
              <li
                key={`${p.title}-${i}`}
                className="flex items-baseline justify-between gap-3 rounded-xl border-2 border-ink bg-cream p-3"
              >
                <div className="min-w-0">
                  <div className="truncate font-semibold">
                    {p.title ?? p.url ?? "Submission"}
                  </div>
                  {p.url && (
                    <div className="truncate font-mono text-[11px] text-ink/55">
                      {p.url}
                    </div>
                  )}
                </div>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 rounded-full border border-ink bg-ink px-3 py-1 font-mono text-[10px] tracking-widest text-cream uppercase"
                  >
                    Open ↗
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
