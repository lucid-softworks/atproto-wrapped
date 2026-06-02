import type { SifaHighlights } from "../../lib/featured";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedSifaSection({
  data,
  theme,
}: {
  data: SifaHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "pink");
  const counts = (
    [
      ["Skills", data.skills],
      ["Certifications", data.certifications],
      ["Positions", data.positions],
      ["Projects", data.projects],
      ["Education", data.education],
      ["Honors", data.honors],
      ["Languages", data.languages],
      ["Courses", data.courses],
      ["Volunteering", data.volunteering],
    ] as Array<[string, number]>
  ).filter(([, n]) => n > 0);

  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Sifa
          </div>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">resume</span>, on the open
          web.
        </h2>

        {counts.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {counts.map(([k, n]) => (
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

        {data.sections.length > 0 && (
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {data.sections.map((s, i) => (
              <li
                key={`${s.kind}-${i}`}
                className="rounded-2xl border-2 border-ink bg-cream p-4"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="line-clamp-2 font-semibold leading-tight">
                    {s.title}
                  </div>
                  <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 font-mono text-[10px] tracking-widest text-cream uppercase">
                    {s.kind}
                  </span>
                </div>
                {s.subtitle && (
                  <div className="mt-0.5 text-sm opacity-70">{s.subtitle}</div>
                )}
                {s.detail && (
                  <p className="mt-2 line-clamp-3 font-serif text-sm italic opacity-80">
                    {s.detail}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
