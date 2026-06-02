import type { FlushingHighlights } from "../../lib/featured";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedFlushingSection({
  data,
  theme,
}: {
  data: FlushingHighlights;
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
            Spotlight · Flushing Right Now
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-yellow uppercase">
            {data.total.toLocaleString()} flushes
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          You announced <span className="font-serif italic">every flush</span>.
        </h2>

        {data.recent.length > 0 && (
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {data.recent.map((f, i) => (
              <li
                key={i}
                className="rounded-2xl border-2 border-ink bg-cream p-5"
              >
                <p className="font-serif text-xl italic">
                  {f.emoji && <span className="mr-2">{f.emoji}</span>}
                  "{f.text ?? "(no text)"}"
                </p>
                {f.createdAt && (
                  <div className="mt-2 font-mono text-[10px] text-ink/55">
                    {f.createdAt.toLocaleString()}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
