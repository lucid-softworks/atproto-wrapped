import type { BadgesHighlights } from "../../lib/highlights/badges";

export function FeaturedBadgesSection({ data }: { data: BadgesHighlights }) {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-cobalt text-cream">
      <div className="grain absolute inset-0 opacity-[0.04]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest text-cream/70 uppercase">
            Spotlight · Blue Badges
          </div>
          <span className="rounded-full bg-cream px-3 py-1 font-mono text-xs tracking-widest text-wrap-cobalt uppercase">
            {data.total.toLocaleString()} badge
            {data.total === 1 ? "" : "s"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          The <span className="font-serif italic">badges</span> you earned.
        </h2>

        {data.badges.length > 0 && (
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.badges.map((b, i) => (
              <div
                key={i}
                className="rounded-2xl border-2 border-cream bg-wrap-cobalt p-5"
              >
                <div className="font-mono text-[10px] tracking-widest text-cream/60 uppercase">
                  Badge
                </div>
                <div className="mt-2 text-lg leading-snug font-bold tracking-[-0.01em]">
                  {b.name}
                </div>
                {b.description && (
                  <p className="mt-2 text-sm leading-snug text-cream/80">
                    {b.description}
                  </p>
                )}
                {b.issued && (
                  <div className="mt-3 font-mono text-[10px] tracking-widest text-cream/60 uppercase">
                    {b.issued.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
