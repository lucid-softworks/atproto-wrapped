import type { AtlasHighlights, AtlasLocation } from "../../lib/highlights/atlas";
import { FeaturedRow } from "./_shared";
import { sectionTheme, type SectionTheme } from "./_theme";

function formatDate(d: Date | null): string | null {
  if (!d) return null;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function locationLabel(l: AtlasLocation): string {
  if (l.address.name) return l.address.name;
  const parts = [l.address.locality, l.address.region, l.address.country].filter(
    (s): s is string => typeof s === "string" && s.length > 0,
  );
  if (parts.length > 0) return parts.join(", ");
  return l.atlasKey ?? "(unknown place)";
}

export function FeaturedAtlasSection({
  data,
  theme,
}: {
  data: AtlasHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "mint");
  const others = data.primary
    ? data.locations.filter((l) => l !== data.primary)
    : data.locations;

  return (
    <section
      className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}
    >
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Atlas
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-mint uppercase">
            {data.total.toLocaleString()}{" "}
            {data.total === 1 ? "place" : "places"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Where you've <span className="font-serif italic">pinned</span>{" "}
          yourself.
        </h2>

        {data.primary && (
          <div className="mt-12">
            <FeaturedRow label="Your home base" />
            <div className="mt-4 rounded-3xl border-2 border-ink bg-cream p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-mono text-[10px] tracking-widest opacity-55 uppercase">
                    Primary location
                  </div>
                  <div className="mt-2 text-[clamp(1.75rem,4vw,3rem)] leading-[1] font-bold tracking-[-0.02em]">
                    {locationLabel(data.primary)}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-xs">
                    {data.primary.address.country && (
                      <span className="rounded-full border-2 border-ink bg-wrap-mint px-2.5 py-1 tracking-widest uppercase">
                        {data.primary.address.country}
                      </span>
                    )}
                    {data.primary.address.region && (
                      <span className="opacity-70">
                        {data.primary.address.region}
                      </span>
                    )}
                    {data.primary.addedAt && (
                      <span className="opacity-55">
                        · added {formatDate(data.primary.addedAt)}
                      </span>
                    )}
                  </div>
                </div>
                <span className="rounded-full border-2 border-ink bg-wrap-yellow px-3 py-1 font-mono text-[10px] tracking-widest uppercase">
                  ★ primary
                </span>
              </div>
            </div>
          </div>
        )}

        {others.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Other places" />
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((l, i) => (
                <li
                  key={`${l.atlasKey ?? l.osmId ?? "loc"}-${i}`}
                  className="rounded-2xl border-2 border-ink bg-cream p-4"
                >
                  <div className="font-mono text-[10px] tracking-widest opacity-55 uppercase">
                    Place
                  </div>
                  <div className="mt-1 truncate font-bold">
                    {locationLabel(l)}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 font-mono text-[10px]">
                    {l.address.country && (
                      <span className="rounded-full border border-ink/40 px-1.5 py-0.5 tracking-widest uppercase opacity-80">
                        {l.address.country}
                      </span>
                    )}
                    {l.addedAt && (
                      <span className="opacity-55">
                        {formatDate(l.addedAt)}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
