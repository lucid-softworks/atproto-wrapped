import type { PskyHighlights } from "../../lib/featured";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedPskySection({
  data,
  theme,
}: {
  data: PskyHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "cyan");
  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Psky
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-cyan uppercase">
            {data.total.toLocaleString()} messages
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          In <span className="font-serif italic">{data.rooms}</span>{" "}
          {data.rooms === 1 ? "room" : "rooms"} on Psky.
        </h2>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {data.recent.map((m, i) => (
            <li
              key={i}
              className="rounded-2xl border-2 border-ink bg-cream p-4"
            >
              <p className="line-clamp-4 font-serif text-base leading-snug italic">
                "{m.content}"
              </p>
              {m.createdAt && (
                <div className="mt-2 font-mono text-[10px] text-ink/55">
                  {m.createdAt.toLocaleString()}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
