import { useQuery } from "@tanstack/react-query";
import type { EndorseHighlights } from "../../lib/highlights/endorse";
import { resolveHandlesForDids } from "../../lib/bskyProfiles";
import { toDisplayHandle } from "../../lib/handle";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedEndorseSection({
  data,
  theme,
}: {
  data: EndorseHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "lime");
  const dids = data.endorsements
    .map((e) => e.subject)
    .filter((s) => s.startsWith("did:"));
  const handlesQuery = useQuery({
    queryKey: ["bsky-handles", "endorse", dids],
    queryFn: () => resolveHandlesForDids(dids),
    enabled: dids.length > 0,
    staleTime: 1000 * 60 * 60,
  });
  const handles = handlesQuery.data ?? new Map<string, string>();

  return (
    <section
      className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}
    >
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Endorse
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-lime uppercase">
            {data.total.toLocaleString()} endorsements
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          <span className="font-serif italic">Endorsements</span> you've signed.
        </h2>

        <ul className="mt-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {data.endorsements.map((e, i) => {
            const handle = handles.get(e.subject);
            const href = `https://bsky.app/profile/${handle ?? e.subject}`;
            const label = handle ? `@${toDisplayHandle(handle)}` : e.subject;
            return (
              <li key={`${e.subject}-${i}`}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border-2 border-ink bg-cream p-3 transition hover:bg-wrap-yellow"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-wrap-lime font-mono text-xs font-bold">
                    ★
                  </span>
                  <div className="min-w-0 flex-1 truncate font-mono text-xs">
                    {label}
                  </div>
                  {e.createdAt && (
                    <div className="font-mono text-[10px] text-ink/45">
                      {e.createdAt.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
