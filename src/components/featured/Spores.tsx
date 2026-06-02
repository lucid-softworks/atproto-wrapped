import type { SporesHighlights } from "../../lib/featured";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedSporesSection({
  data,
  theme,
}: {
  data: SporesHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "mint");
  const stats: Array<[string, string]> = [];
  if (data.takenFlowers > 0)
    stats.push(["Flowers taken", data.takenFlowers.toLocaleString()]);
  if (data.specialSpores > 0)
    stats.push(["Special spores", data.specialSpores.toLocaleString()]);
  if (data.siteSections > 0)
    stats.push(["Site sections", data.siteSections.toLocaleString()]);
  if (data.hasSite) stats.push(["Site set up", "yes"]);

  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Hypha Spores
          </div>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          You took{" "}
          <span className="font-serif italic">
            {data.takenFlowers.toLocaleString()}
          </span>{" "}
          flowers.
        </h2>

        {stats.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {stats.map(([k, v]) => (
              <div
                key={k}
                className="rounded-2xl border-2 border-ink bg-cream px-4 py-2"
              >
                <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                  {k}
                </div>
                <div className="text-xl font-bold tabular-nums">{v}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
