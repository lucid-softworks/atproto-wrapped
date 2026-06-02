import type { SparksHighlights } from "../../lib/highlights/sparks";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedSparksSection({
  data,
  theme,
}: {
  data: SparksHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "orange");
  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Tokimeki Sparks
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-orange uppercase">
            {data.total.toLocaleString()} sparks
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          <span className="font-serif italic">Sparks</span> from the campfire.
        </h2>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.sparks.map((s, i) => (
            <li
              key={i}
              className="relative rounded-2xl border-2 border-ink bg-cream p-5"
            >
              <div className="absolute -top-3 left-4 font-serif text-4xl leading-none text-ink/70">
                “
              </div>
              <p className="mt-2 text-sm leading-relaxed">{s.text}</p>
              {s.createdAt && (
                <div className="mt-4 font-mono text-[10px] tracking-widest text-ink/45 uppercase">
                  {s.createdAt.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
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
