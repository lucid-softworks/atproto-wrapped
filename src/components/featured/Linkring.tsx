import type { LinkringHighlights } from "../../lib/highlights/linkring";
import { FeaturedRow } from "./_shared";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedLinkringSection({
  data,
  theme,
}: {
  data: LinkringHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "pink");
  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Linkring
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-pink uppercase">
            {(data.totalRings + data.totalLists).toLocaleString()} total
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Linkrings <span className="font-serif italic">&</span> lists.
        </h2>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-ink bg-cream p-5">
            <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
              Webrings
            </div>
            <div className="mt-2 text-4xl font-bold tabular-nums">
              {data.totalRings.toLocaleString()}
            </div>
          </div>
          <div className="rounded-2xl border-2 border-ink bg-cream p-5">
            <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
              Link lists
            </div>
            <div className="mt-2 text-4xl font-bold tabular-nums">
              {data.totalLists.toLocaleString()}
            </div>
          </div>
        </div>

        {data.rings.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Webrings" />
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {data.rings.map((r) => (
                <li
                  key={r.uri}
                  className="flex items-start gap-3 rounded-xl border-2 border-ink bg-cream p-3"
                >
                  <ColorSwatch color={r.color} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="line-clamp-1 font-semibold leading-tight">
                        {r.name}
                      </div>
                      {r.memberCount > 0 && (
                        <span className="shrink-0 rounded-full border border-ink/40 px-1.5 py-0.5 font-mono text-[10px] tracking-widest opacity-65 tabular-nums">
                          {r.memberCount}
                        </span>
                      )}
                    </div>
                    {r.description && (
                      <p className="mt-1 line-clamp-2 font-serif text-sm italic opacity-75">
                        {r.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.lists.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Link lists" />
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {data.lists.map((l) => (
                <li
                  key={l.uri}
                  className="flex items-start gap-3 rounded-xl border-2 border-ink bg-cream p-3"
                >
                  <ColorSwatch color={l.color} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="line-clamp-1 font-semibold leading-tight">
                        {l.name}
                      </div>
                      {l.linkCount > 0 && (
                        <span className="shrink-0 rounded-full border border-ink/40 px-1.5 py-0.5 font-mono text-[10px] tracking-widest opacity-65 tabular-nums">
                          {l.linkCount}
                        </span>
                      )}
                    </div>
                    {l.description && (
                      <p className="mt-1 line-clamp-2 font-serif text-sm italic opacity-75">
                        {l.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.externals.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Link-in-bio pages" />
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {data.externals.map((x) => (
                <li
                  key={x.uri}
                  className="rounded-xl border-2 border-ink bg-cream p-3"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="line-clamp-1 font-semibold leading-tight">
                      {x.title ?? "Link page"}
                    </div>
                    <span className="shrink-0 rounded-full border border-ink/40 px-1.5 py-0.5 font-mono text-[10px] tracking-widest opacity-65 uppercase">
                      {x.source}
                    </span>
                  </div>
                  {x.description && (
                    <p className="mt-1 line-clamp-2 font-serif text-sm italic opacity-75">
                      {x.description}
                    </p>
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

function ColorSwatch({ color }: { color?: string }) {
  // The Linkring schema stores colors as names like "blue" or "green". We map
  // a small palette of known names to CSS values; anything else falls back to
  // the name (which works for hex / valid CSS) or a neutral ink swatch.
  const known: Record<string, string> = {
    red: "#ef4444",
    orange: "#f97316",
    yellow: "#eab308",
    green: "#22c55e",
    teal: "#14b8a6",
    cyan: "#06b6d4",
    blue: "#3b82f6",
    indigo: "#6366f1",
    purple: "#a855f7",
    violet: "#8b5cf6",
    pink: "#ec4899",
    rose: "#f43f5e",
    black: "#0a0a0a",
    white: "#fafafa",
    gray: "#6b7280",
    grey: "#6b7280",
  };
  const value = color
    ? known[color.toLowerCase()] ?? color
    : "var(--color-ink, #111)";
  return (
    <span
      aria-hidden
      className="mt-0.5 inline-block h-6 w-6 shrink-0 rounded-full border-2 border-ink"
      style={{ backgroundColor: value }}
    />
  );
}
