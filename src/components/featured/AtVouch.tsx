import { useQuery } from "@tanstack/react-query";
import type { AtVouchHighlights } from "../../lib/highlights/atvouch";
import { resolveHandlesForDids } from "../../lib/bskyProfiles";

export function FeaturedAtVouchSection({
  data,
}: {
  data: AtVouchHighlights;
}) {
  const dids = data.vouches.map((v) => v.subject).filter(Boolean);
  const handlesQuery = useQuery({
    queryKey: ["bsky-handles", "atvouch", dids],
    queryFn: () => resolveHandlesForDids(dids),
    enabled: dids.length > 0,
    staleTime: 1000 * 60 * 60,
  });
  const handles = handlesQuery.data ?? new Map<string, string>();

  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-violet text-cream">
      <div className="grain absolute inset-0 opacity-[0.04]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest text-cream/70 uppercase">
            Spotlight · AtVouch
          </div>
          <span className="rounded-full bg-cream px-3 py-1 font-mono text-xs tracking-widest text-wrap-violet uppercase">
            {data.total.toLocaleString()} vouches
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          <span className="font-serif italic">Vouches</span> you've signed.
        </h2>

        <ul className="mt-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {data.vouches.map((v, i) => {
            const handle = handles.get(v.subject);
            const href = `https://bsky.app/profile/${handle ?? v.subject}`;
            const label = handle ? `@${handle}` : v.subject;
            return (
              <li key={`${v.subject}-${i}`}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border-2 border-cream bg-wrap-violet p-3 transition hover:bg-cream hover:text-wrap-violet"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-current font-mono text-xs font-bold">
                    ✓
                  </span>
                  <div className="min-w-0 flex-1 truncate font-mono text-xs">
                    {label}
                  </div>
                  {v.createdAt && (
                    <div className="font-mono text-[10px] opacity-65">
                      {v.createdAt.toLocaleDateString(undefined, {
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
