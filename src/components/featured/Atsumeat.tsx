import type { AtsumeatHighlights } from "../../lib/featured";
import { Cover } from "../Cover";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedAtsumeatSection({
  data,
  theme,
}: {
  data: AtsumeatHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "yellow");
  return (
    <section
      className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}
    >
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Atsumeat
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-yellow uppercase">
            {data.totalStickers.toLocaleString()} stickers
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">sticker</span> book.
        </h2>

        <div className="mt-8 flex flex-wrap gap-3">
          <div className="rounded-2xl border-2 border-ink bg-cream px-4 py-2">
            <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
              Trades
            </div>
            <div className="text-xl font-bold tabular-nums">
              {data.totalTransactions.toLocaleString()}
            </div>
          </div>
          <div className="rounded-2xl border-2 border-ink bg-cream px-4 py-2">
            <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
              Trading partners
            </div>
            <div className="text-xl font-bold tabular-nums">
              {data.uniquePartners.toLocaleString()}
            </div>
          </div>
        </div>

        {data.stickers.length > 0 && (
          <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {data.stickers.map((s, i) => (
              <div
                key={i}
                className="relative aspect-square overflow-hidden rounded-xl border-2 border-ink bg-[repeating-conic-gradient(var(--color-cream-dark)_0_25%,var(--color-cream)_0_50%)] bg-[length:12px_12px]"
              >
                <Cover
                  src={s.imageUrl}
                  alt="sticker"
                  fallback="✦"
                  className="absolute inset-0 h-full w-full object-contain p-1"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
