import type { FlobitImagesHighlights } from "../../lib/highlights/flobitImages";
import { Cover } from "../Cover";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedFlobitImagesSection({
  data,
  theme,
}: {
  data: FlobitImagesHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "cyan");
  return (
    <section
      className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}
    >
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Flo-bit
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-cyan uppercase">
            {data.total.toLocaleString()} image
            {data.total === 1 ? "" : "s"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Pixels you <span className="font-serif italic">parked</span>.
        </h2>

        {data.images.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {data.images.map((img, i) => (
              <figure
                key={i}
                className="relative aspect-square overflow-hidden rounded-xl border-2 border-ink bg-ink/10"
              >
                <Cover
                  src={img.url}
                  alt="image"
                  fallback="◇"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
