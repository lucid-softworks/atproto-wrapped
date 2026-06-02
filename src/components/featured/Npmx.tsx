import type { NpmxHighlights } from "../../lib/highlights/npmx";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedNpmxSection({
  data,
  theme,
}: {
  data: NpmxHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "red");
  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="grain absolute inset-0 opacity-[0.04]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between gap-3">
          <div className="font-mono text-xs tracking-widest text-cream/70 uppercase">
            Spotlight · NPMX
          </div>
          <span className="rounded-full bg-cream px-3 py-1 font-mono text-xs tracking-widest text-wrap-red uppercase">
            {data.totalLikes.toLocaleString()} likes
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          <span className="font-serif italic">Packages</span> you starred.
        </h2>

        <ul className="mt-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {data.likes.map((l, i) => (
            <li key={`${l.subjectRef}-${i}`}>
              <a
                href={l.subjectRef}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border-2 border-cream bg-wrap-red p-3 transition hover:bg-cream hover:text-wrap-red"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-current font-mono text-xs font-bold">
                  ★
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-mono text-sm font-bold">
                    {l.packageName}
                  </div>
                  {l.createdAt && (
                    <div className="font-mono text-[10px] opacity-70">
                      {l.createdAt.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  )}
                </div>
                <span className="shrink-0 font-mono text-[10px] opacity-65">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
