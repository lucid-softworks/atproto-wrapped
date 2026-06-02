import type { AsqHighlights } from "../../lib/highlights/asq";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedAsqSection({
  data,
  theme,
}: {
  data: AsqHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "mint");
  return (
    <section
      className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}
    >
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · AsQ
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-mint uppercase">
            {data.total.toLocaleString()} questions
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          <span className="font-serif italic">Questions</span> you've asked.
        </h2>

        <ul className="mt-10 space-y-4">
          {data.questions.map((q, i) => (
            <li
              key={i}
              className="rounded-2xl border-2 border-ink bg-cream p-5"
            >
              {q.title && (
                <div className="text-lg leading-tight font-bold tracking-tight">
                  {q.title}
                </div>
              )}
              {q.body && (
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/75">
                  {q.body}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {q.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border-2 border-ink bg-wrap-mint px-2 py-0.5 font-mono text-[10px] tracking-wide uppercase"
                  >
                    {t}
                  </span>
                ))}
                {q.createdAt && (
                  <span className="ml-auto font-mono text-[10px] tracking-widest text-ink/45 uppercase">
                    {q.createdAt.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
