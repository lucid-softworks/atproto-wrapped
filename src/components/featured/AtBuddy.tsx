import type { AtBuddyHighlights } from "../../lib/featured";
import { FeaturedRow } from "./_shared";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedAtBuddySection({
  data,
  theme,
}: {
  data: AtBuddyHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "pink");
  const interactionStats = Array.from(data.interactionsByType.entries()).sort(
    (a, b) => b[1] - a[1],
  );
  return (
    <section
      className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}
    >
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · AtBuddy
          </div>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Meet{" "}
          <span className="font-serif italic">
            {data.creature?.name ?? "your buddy"}
          </span>
          .
        </h2>

        {data.creature && (
          <div className="mt-8 inline-flex items-center gap-4 rounded-2xl border-2 border-ink bg-cream p-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-ink bg-wrap-yellow text-3xl">
              {data.creature.isShiny ? "✨" : "🐾"}
            </div>
            <div>
              <div className="text-2xl font-bold">{data.creature.name}</div>
              <div className="flex flex-wrap gap-x-3 font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                {data.creature.species && <span>{data.creature.species}</span>}
                {data.creature.rarity && <span>{data.creature.rarity}</span>}
                {data.creature.isShiny && <span>shiny</span>}
              </div>
            </div>
          </div>
        )}

        {data.stats && (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.stats.level !== undefined && (
              <StatBlock label="Level" value={`${data.stats.level}`} />
            )}
            {data.stats.xp !== undefined && (
              <StatBlock label="XP" value={data.stats.xp.toLocaleString()} />
            )}
            {data.stats.mood !== undefined && (
              <AtBuddyBar label="Mood" value={data.stats.mood} />
            )}
            {data.stats.energy !== undefined && (
              <AtBuddyBar label="Energy" value={data.stats.energy} />
            )}
          </div>
        )}

        {interactionStats.length > 0 && (
          <div className="mt-10">
            <FeaturedRow
              label={`Interactions · ${data.totalInteractions.toLocaleString()} total`}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {interactionStats.map(([type, count]) => (
                <span
                  key={type}
                  className="rounded-full border-2 border-ink bg-cream px-3 py-1 font-mono text-xs tracking-wide uppercase"
                >
                  <span className="font-semibold">{type}</span>
                  <span className="ml-2 text-ink/55">
                    {count.toLocaleString()}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border-2 border-ink bg-cream p-4">
      <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
        {label}
      </div>
      <div className="mt-1 text-3xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

function AtBuddyBar({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="rounded-2xl border-2 border-ink bg-cream p-4">
      <div className="flex items-baseline justify-between">
        <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
          {label}
        </div>
        <div className="font-mono text-xs font-bold tabular-nums">{value}</div>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full border border-ink bg-cream-dark">
        <div className="h-full bg-ink" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
