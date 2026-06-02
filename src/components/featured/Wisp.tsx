import type { WispHighlights } from "../../lib/highlights/wisp";
import { FeaturedRow } from "./_shared";

export function FeaturedWispSection({ data }: { data: WispHighlights }) {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-yellow text-ink">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · wisp.place
          </div>
          {data.fileCount > 0 && (
            <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-yellow uppercase">
              {data.fileCount.toLocaleString()} files
            </span>
          )}
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">wisp.place</span> site.
        </h2>

        <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 font-mono text-sm">
          {data.domain ? (
            <a
              href={`https://${data.domain}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border-2 border-ink bg-ink px-3 py-1 text-cream transition hover:bg-cream hover:text-ink"
            >
              {data.domain} ↗
            </a>
          ) : data.site ? (
            <span className="rounded-full border-2 border-ink bg-cream px-3 py-1">
              site: {data.site}
            </span>
          ) : null}
          {data.fileCount > 0 && (
            <span>
              <span className="opacity-60">files </span>
              <span className="font-bold tabular-nums">
                {data.fileCount.toLocaleString()}
              </span>
            </span>
          )}
        </div>

        {data.topEntries.length > 0 && (
          <div className="mt-10">
            <FeaturedRow label="Top of the tree" />
            <ul className="mt-4 grid gap-1 font-mono text-sm sm:grid-cols-2 lg:grid-cols-3">
              {data.topEntries.map((e, i) => (
                <li
                  key={`${e.name}-${i}`}
                  className="flex items-center gap-2 rounded-xl border-2 border-ink bg-cream px-3 py-2"
                >
                  <span aria-hidden className="opacity-60">
                    {e.type === "directory" ? "▾" : "·"}
                  </span>
                  <span className="truncate">{e.name}</span>
                  {e.type === "directory" && (
                    <span className="ml-auto rounded-full border border-ink/40 px-1.5 py-0.5 text-[9px] tracking-widest uppercase opacity-60">
                      dir
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
