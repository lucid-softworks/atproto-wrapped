import type { TokimekiPollsHighlights } from "../../lib/highlights/tokimekiPolls";

export function FeaturedTokimekiPollsSection({
  data,
}: {
  data: TokimekiPollsHighlights;
}) {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-orange text-ink">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Tokimeki polls
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-orange uppercase">
            {data.total.toLocaleString()} polls
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          <span className="font-serif italic">Polls</span> you've run.
        </h2>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {data.polls.map((p, i) => (
            <li
              key={i}
              className="rounded-2xl border-2 border-ink bg-cream p-4"
            >
              <div className="flex items-baseline justify-between gap-3">
                <div className="font-mono text-[10px] tracking-widest opacity-55 uppercase">
                  Poll
                </div>
                {p.createdAt && (
                  <div className="font-mono text-[10px] opacity-55">
                    {p.createdAt.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                )}
              </div>
              {p.options.length > 0 ? (
                <ol className="mt-3 space-y-1.5">
                  {p.options.map((opt, j) => (
                    <li
                      key={`${i}-${j}`}
                      className="flex items-start gap-2 rounded-xl border border-ink/30 bg-wrap-orange/10 px-3 py-2"
                    >
                      <span className="mt-0.5 font-mono text-[10px] tracking-widest opacity-55">
                        {String.fromCharCode(65 + j)}
                      </span>
                      <span className="text-sm leading-snug">{opt}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="mt-3 font-mono text-[10px] opacity-55">
                  (no options)
                </div>
              )}
              {p.endsAt && (
                <div className="mt-3 font-mono text-[10px] opacity-65">
                  ends{" "}
                  {p.endsAt.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
