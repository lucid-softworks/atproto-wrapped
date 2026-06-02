import type { GamesHighlights } from "../../lib/featured";

export function FeaturedGamesSection({ data }: { data: GamesHighlights }) {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-red text-cream">
      <div className="grain absolute inset-0 opacity-[0.04]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest text-cream/70 uppercase">
            Spotlight · Games
          </div>
          <span className="rounded-full bg-cream px-3 py-1 font-mono text-xs tracking-widest text-wrap-red uppercase">
            {data.totalGames.toLocaleString()} games played
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          The <span className="font-serif italic">arcade</span>.
        </h2>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.games.map((g) => (
            <div
              key={g.nsid}
              className="rounded-2xl border-2 border-cream bg-wrap-red p-5"
            >
              <div className="flex items-baseline justify-between">
                <div className="text-xl font-semibold">{g.name}</div>
                <div className="font-mono text-xs text-cream/65">
                  {g.total.toLocaleString()}{" "}
                  {g.total === 1 ? "play" : "plays"}
                </div>
              </div>
              {g.bestScore !== undefined && (
                <div className="mt-3 flex items-baseline gap-2">
                  <div className="text-3xl font-bold tabular-nums">
                    {g.bestScore.toLocaleString()}
                  </div>
                  {g.metric && (
                    <div className="font-mono text-[10px] tracking-widest text-cream/65 uppercase">
                      {g.metric}
                    </div>
                  )}
                </div>
              )}
              <div className="mt-3 truncate font-mono text-[10px] tracking-wide text-cream/55">
                {g.nsid}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
