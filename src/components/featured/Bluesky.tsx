import type { BlueskyHighlights } from "../../lib/featured";
import { shortenDid } from "../../lib/format";

const BSKY_HERO_THEME: Record<
  BlueskyHighlights["hero"][number]["theme"],
  { bg: string; fg: string; muted: string }
> = {
  pink: { bg: "bg-wrap-pink", fg: "text-ink", muted: "text-ink/65" },
  lime: { bg: "bg-wrap-lime", fg: "text-ink", muted: "text-ink/65" },
  yellow: { bg: "bg-wrap-yellow", fg: "text-ink", muted: "text-ink/65" },
  mint: { bg: "bg-wrap-mint", fg: "text-ink", muted: "text-ink/65" },
  cyan: { bg: "bg-wrap-cyan", fg: "text-ink", muted: "text-ink/65" },
  violet: { bg: "bg-wrap-violet", fg: "text-cream", muted: "text-cream/70" },
  orange: { bg: "bg-wrap-orange", fg: "text-ink", muted: "text-ink/65" },
};

export function FeaturedBlueskySection({ data }: { data: BlueskyHighlights }) {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-cobalt text-cream">
      <div className="grain absolute inset-0 opacity-[0.04]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-cream/70 uppercase">
            <span className="inline-block h-3 w-3 rounded-full bg-cream" />
            Spotlight · Bluesky
          </div>
          <span className="rounded-full bg-cream px-3 py-1 font-mono text-xs tracking-widest text-wrap-cobalt uppercase">
            {data.total.toLocaleString()} records
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          The <span className="font-serif italic">big year</span> on Bluesky.
        </h2>

        {data.hero.length > 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.hero.map((h) => {
              const t = BSKY_HERO_THEME[h.theme];
              return (
                <div
                  key={h.label}
                  className={`relative overflow-hidden rounded-3xl border-2 border-ink ${t.bg} ${t.fg} p-6`}
                >
                  <div
                    className={`font-mono text-xs tracking-widest uppercase ${t.muted}`}
                  >
                    {h.label}
                  </div>
                  <div className="mt-3 text-[clamp(2.5rem,8vw,5rem)] leading-[0.85] font-bold tracking-[-0.04em] tabular-nums">
                    {h.count.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {data.moderation.length > 0 && (
            <BskyChipGroup label="Moderation" rows={data.moderation} />
          )}
          {data.curation.length > 0 && (
            <BskyChipGroup label="Curating" rows={data.curation} />
          )}
          {data.curiosity.length > 0 && (
            <BskyChipGroup label="Curious bits" rows={data.curiosity} />
          )}
        </div>

        {data.profileBits.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {data.profileBits.map(([k, v]) => (
              <span
                key={k}
                className="rounded-full border-2 border-cream bg-wrap-cobalt px-3 py-1 font-mono text-xs tracking-wide uppercase"
              >
                <span className="font-semibold">{k}</span>
                <span className="ml-2 text-cream/70">{v}</span>
              </span>
            ))}
          </div>
        )}

        {data.verifications > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-cream/65 uppercase">
              <span className="inline-block h-px w-6 bg-cream/60" />
              You vouched for {data.verifications.toLocaleString()} account
              {data.verifications === 1 ? "" : "s"}
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {data.verifiedRecent.map((v, i) => {
                const display = v.displayName ?? v.handle ?? shortenDid(v.did);
                const profileHref = v.handle
                  ? `https://bsky.app/profile/${v.handle}`
                  : `https://bsky.app/profile/${v.did}`;
                return (
                  <li key={`${v.did}-${i}`}>
                    <a
                      href={profileHref}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-xl border-2 border-cream bg-wrap-cobalt p-3 transition hover:bg-cream hover:text-wrap-cobalt"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-current font-mono text-xs font-bold">
                        ✓
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold">{display}</div>
                        {v.handle && (
                          <div className="truncate font-mono text-[11px] opacity-65">
                            @{v.handle}
                          </div>
                        )}
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function BskyChipGroup({
  label,
  rows,
}: {
  label: string;
  rows: Array<[string, number]>;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-cream/65 uppercase">
        <span className="inline-block h-px w-6 bg-cream/60" />
        {label}
      </div>
      <ul className="mt-3 space-y-1">
        {rows.map(([k, n]) => (
          <li
            key={k}
            className="flex items-baseline justify-between gap-3 border-b border-cream/15 py-1 font-mono text-sm"
          >
            <span>{k}</span>
            <span className="font-bold tabular-nums">
              {n.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
