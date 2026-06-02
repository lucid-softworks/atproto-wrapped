import { useQuery } from "@tanstack/react-query";
import type { ProtoimsgHighlights } from "../../lib/highlights/protoimsg";
import { resolveHandlesForDids } from "../../lib/bskyProfiles";
import { toDisplayHandle } from "../../lib/handle";

export function FeaturedProtoimsgSection({
  data,
}: {
  data: ProtoimsgHighlights;
}) {
  const allDids = Array.from(
    new Set(data.groups.flatMap((g) => g.memberDids)),
  );
  const handlesQuery = useQuery({
    queryKey: ["bsky-handles", "protoimsg", allDids],
    queryFn: () => resolveHandlesForDids(allDids),
    enabled: allDids.length > 0,
    staleTime: 1000 * 60 * 60,
  });
  const handles = handlesQuery.data ?? new Map<string, string>();

  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-violet text-cream">
      <div className="grain absolute inset-0 opacity-[0.04]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest text-cream/70 uppercase">
            Spotlight · ProtoIMSG
          </div>
          <span className="rounded-full bg-cream px-3 py-1 font-mono text-xs tracking-widest text-wrap-violet uppercase">
            {data.totalMembers.toLocaleString()} members
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Communities you've <span className="font-serif italic">built</span>.
        </h2>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {data.groups.map((g, i) => (
            <div
              key={`${g.name}-${i}`}
              className="rounded-2xl border-2 border-cream bg-wrap-violet p-4"
            >
              <div className="flex items-baseline justify-between gap-3">
                <div className="text-xl font-semibold">{g.name}</div>
                {g.isInnerCircle && (
                  <span className="shrink-0 rounded-full bg-wrap-yellow px-2 py-0.5 font-mono text-[10px] tracking-widest text-ink uppercase">
                    Inner circle
                  </span>
                )}
              </div>
              <div className="mt-2 font-mono text-[10px] tracking-widest text-cream/65 uppercase">
                {g.memberDids.length} member
                {g.memberDids.length === 1 ? "" : "s"}
              </div>
              {g.memberDids.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1">
                  {g.memberDids.slice(0, 12).map((did) => {
                    const handle = handles.get(did);
                    const display = handle
                      ? `@${toDisplayHandle(handle)}`
                      : did;
                    const href = handle
                      ? `https://bsky.app/profile/${handle}`
                      : `https://bsky.app/profile/${did}`;
                    return (
                      <li key={did}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="block truncate max-w-[18ch] rounded-full border border-cream/40 bg-wrap-violet px-2 py-0.5 font-mono text-[11px] hover:bg-cream hover:text-wrap-violet"
                          title={did}
                        >
                          {display}
                        </a>
                      </li>
                    );
                  })}
                  {g.memberDids.length > 12 && (
                    <li className="rounded-full border border-cream/40 bg-wrap-violet px-2 py-0.5 font-mono text-[11px] opacity-70">
                      +{g.memberDids.length - 12} more
                    </li>
                  )}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
