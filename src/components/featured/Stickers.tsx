import type { StickersHighlights } from "../../lib/highlights/stickers";
import { Cover } from "../Cover";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedStickersSection({
  data,
  theme,
}: {
  data: StickersHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "pink");
  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Boo.sky
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-pink uppercase">
            {data.total.toLocaleString()} sticker
            {data.total === 1 ? "" : "s"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">sticker</span> book.
        </h2>

        {data.stickers.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {data.stickers.map((s, i) => {
              const border = s.borderColor ?? "var(--color-ink)";
              const thickness = Math.min(Math.max(s.borderThickness ?? 4, 2), 16);
              return (
                <figure
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-2xl bg-cream"
                  style={{
                    border: `${thickness}px solid ${border}`,
                  }}
                >
                  <Cover
                    src={s.imageUrl}
                    alt={s.shortname ?? "sticker"}
                    fallback="✦"
                    className="absolute inset-0 h-full w-full object-contain p-2"
                  />
                  {s.shortname && (
                    <figcaption className="absolute right-0 bottom-0 left-0 line-clamp-1 bg-gradient-to-t from-ink/80 to-transparent p-2 font-mono text-[10px] tracking-wide text-cream uppercase">
                      {s.shortname}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
