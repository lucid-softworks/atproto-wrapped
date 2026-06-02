import { useQuery } from "@tanstack/react-query";
import type { HighFiveHighlights } from "../../lib/highlights/highFive";
import { resolveHandlesForDids } from "../../lib/bskyProfiles";

export function FeaturedHighFiveSection({
  data,
}: {
  data: HighFiveHighlights;
}) {
  const dids = data.highFives.map((h) => h.subject).filter(Boolean);
  const handlesQuery = useQuery({
    queryKey: ["bsky-handles", "high-five", dids],
    queryFn: () => resolveHandlesForDids(dids),
    enabled: dids.length > 0,
    staleTime: 1000 * 60 * 60,
  });
  const handles = handlesQuery.data ?? new Map<string, string>();

  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-yellow text-ink">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · High Five
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-yellow uppercase">
            {data.total.toLocaleString()} high fives
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          You{" "}
          <span className="font-serif italic">high-fived</span>{" "}
          {data.total.toLocaleString()} {data.total === 1 ? "person" : "people"}.
        </h2>

        <ul className="mt-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {data.highFives.map((h, i) => {
            const handle = handles.get(h.subject);
            const href = `https://bsky.app/profile/${handle ?? h.subject}`;
            const label = handle ? `@${handle}` : h.subject;
            return (
              <li key={`${h.subject}-${i}`}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border-2 border-ink bg-cream p-3 transition hover:bg-wrap-lime"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-wrap-yellow text-base">
                    ✋
                  </span>
                  <div className="min-w-0 flex-1 truncate font-mono text-xs">
                    {label}
                  </div>
                  {h.createdAt && (
                    <div className="font-mono text-[10px] text-ink/45">
                      {h.createdAt.toLocaleDateString(undefined, {
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
