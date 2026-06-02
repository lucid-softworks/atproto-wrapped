import type { SimocracyHighlights } from "../../lib/highlights/simocracy";
import { Cover } from "../Cover";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedSimocracySection({
  data,
  theme,
}: {
  data: SimocracyHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "red");
  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="grain absolute inset-0 opacity-[0.04]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest text-cream/70 uppercase">
            Spotlight · Simocracy
          </div>
          <span className="rounded-full bg-cream px-3 py-1 font-mono text-xs tracking-widest text-wrap-red uppercase">
            {data.total.toLocaleString()} sim{data.total === 1 ? "" : "s"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">sim</span>.
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.sims.map((s, i) => (
            <article
              key={i}
              className="overflow-hidden rounded-2xl border-2 border-cream bg-wrap-red"
            >
              <div className="relative aspect-square bg-cream/10">
                <Cover
                  src={s.imageUrl}
                  alt={s.name}
                  fallback="◇"
                  pixelated
                  className="absolute inset-0 h-full w-full object-contain p-4"
                />
              </div>
              <div className="border-t-2 border-cream p-4">
                <div className="text-lg font-bold tracking-[-0.01em]">
                  {s.name}
                </div>
                {s.characterSet && (
                  <div className="mt-1 font-mono text-[10px] tracking-widest text-cream/65 uppercase">
                    {s.characterSet}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
