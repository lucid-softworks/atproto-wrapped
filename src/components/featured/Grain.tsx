import type { GrainHighlights } from "../../lib/featured";
import { Cover } from "../Cover";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedGrainSection({
  data,
  theme,
}: {
  data: GrainHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "mint");
  const stats: Array<[string, number]> = [
    ["Photos", data.total],
    ["Galleries", data.galleries],
    ["Stories", data.stories],
    ["Favorites", data.favorites],
    ["Comments", data.comments],
    ["Follows", data.follows],
  ].filter(([, n]) => (n as number) > 0) as Array<[string, number]>;

  return (
    <section
      className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}
    >
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Grain
          </div>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">photo</span> roll.
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

        {data.photos.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {data.photos.map((p, i) => (
              <figure
                key={`${p.imageUrl}-${i}`}
                className="relative aspect-square overflow-hidden rounded-xl border-2 border-ink bg-ink/10"
              >
                <Cover
                  src={p.imageUrl}
                  alt={p.alt ?? p.caption ?? "photo"}
                  fallback="◇"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {p.caption && (
                  <figcaption className="absolute right-0 bottom-0 left-0 line-clamp-2 bg-gradient-to-t from-ink/80 to-transparent p-3 text-xs text-cream">
                    {p.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
