import { useQuery } from "@tanstack/react-query";
import type { IntrosHighlights } from "../../lib/highlights/intros";
import { resolveHandlesForDids } from "../../lib/bskyProfiles";
import { toDisplayHandle } from "../../lib/handle";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedIntrosSection({
  data,
  theme,
}: {
  data: IntrosHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "pink");
  const dids = data.intros.map((i) => i.subject).filter(Boolean);
  const handlesQuery = useQuery({
    queryKey: ["bsky-handles", "intros", dids],
    queryFn: () => resolveHandlesForDids(dids),
    enabled: dids.length > 0,
    staleTime: 1000 * 60 * 60,
  });
  const handles = handlesQuery.data ?? new Map<string, string>();

  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Skybemoreblue
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-pink uppercase">
            {data.total.toLocaleString()} intros
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          <span className="font-serif italic">Intros</span> you wrote.
        </h2>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {data.intros.map((intro, i) => {
            const handle = handles.get(intro.subject);
            const href = `https://bsky.app/profile/${handle ?? intro.subject}`;
            const aboutLabel = handle
              ? `@${toDisplayHandle(handle)}`
              : intro.subject
                ? intro.subject
                : "someone";
            const displayDate = intro.updatedAt ?? intro.createdAt;
            return (
              <li
                key={`${intro.subject}-${i}`}
                className="relative rounded-2xl border-2 border-ink bg-cream p-5"
              >
                <div className="absolute -top-3 left-4 font-serif text-4xl leading-none text-ink/70">
                  “
                </div>
                {intro.body && (
                  <p className="mt-2 text-sm leading-relaxed">{intro.body}</p>
                )}
                {intro.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {intro.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border-2 border-ink bg-wrap-pink px-2 py-0.5 font-mono text-[10px] tracking-wide uppercase"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex items-baseline justify-between gap-3 border-t-2 border-ink/15 pt-3">
                  <div className="font-mono text-xs">
                    <span className="text-ink/55">about </span>
                    {intro.subject ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold underline decoration-ink/30 underline-offset-2 hover:decoration-ink"
                      >
                        {aboutLabel}
                      </a>
                    ) : (
                      <span className="font-semibold">{aboutLabel}</span>
                    )}
                  </div>
                  {displayDate && (
                    <div className="font-mono text-[10px] tracking-widest text-ink/45 uppercase">
                      {displayDate.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
