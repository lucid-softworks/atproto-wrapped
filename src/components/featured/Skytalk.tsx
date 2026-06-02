import type { SkytalkHighlights } from "../../lib/highlights/skytalk";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedSkytalkSection({
  data,
  theme,
}: {
  data: SkytalkHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "cobalt");
  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="grain absolute inset-0 opacity-[0.04]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest text-cream/70 uppercase">
            Spotlight · SkyTalk
          </div>
          <span className="rounded-full bg-cream px-3 py-1 font-mono text-xs tracking-widest text-wrap-cobalt uppercase">
            {data.total.toLocaleString()} threads
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          <span className="font-serif italic">Threads</span> you've started.
        </h2>

        {data.channels > 0 && (
          <div className="mt-6 font-mono text-xs tracking-widest text-cream/65 uppercase">
            Across {data.channels.toLocaleString()} channel
            {data.channels === 1 ? "" : "s"}
          </div>
        )}

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {data.threads.map((t, i) => (
            <li
              key={i}
              className="rounded-2xl border-2 border-cream bg-wrap-cobalt p-4"
            >
              <div className="flex items-baseline justify-between gap-3">
                <div className="line-clamp-1 text-lg font-semibold">
                  {t.title ?? "(untitled)"}
                </div>
                {t.channelId && (
                  <span className="shrink-0 rounded-full bg-cream px-2 py-0.5 font-mono text-[10px] tracking-widest text-wrap-cobalt uppercase">
                    #{t.channelId}
                  </span>
                )}
              </div>
              {t.text && (
                <p className="mt-2 line-clamp-4 font-serif text-sm italic text-cream/85">
                  {t.text}
                </p>
              )}
              {t.createdAt && (
                <div className="mt-3 font-mono text-[10px] text-cream/55">
                  {t.createdAt.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
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
