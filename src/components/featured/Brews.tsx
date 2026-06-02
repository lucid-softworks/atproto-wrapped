import type {
  BrewsHighlights,
  BrewItem,
} from "../../lib/highlights/brews";
import { FeaturedRow } from "./_shared";

function fmtTemp(tenths: number | null): string | null {
  if (tenths === null) return null;
  return `${(tenths / 10).toFixed(1)}°F`;
}

function fmtTime(seconds: number | null): string | null {
  if (seconds === null) return null;
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

function brewParamsLine(b: BrewItem): string {
  const parts: string[] = [];
  const temp = fmtTemp(b.temperatureTenths);
  const time = fmtTime(b.timeSeconds);
  if (temp) parts.push(temp);
  if (time) parts.push(time);
  if (b.ratio) parts.push(b.ratio);
  return parts.join(" · ");
}

export function FeaturedBrewsSection({ data }: { data: BrewsHighlights }) {
  const stats: Array<[string, string]> = [];
  if (data.coffeeBrews > 0)
    stats.push(["Coffees", data.coffeeBrews.toLocaleString()]);
  if (data.teaBrews > 0) stats.push(["Teas", data.teaBrews.toLocaleString()]);
  if (data.averageRating !== null)
    stats.push(["Avg rating", `${data.averageRating.toFixed(1)} / 10`]);
  if (data.beanCount > 0)
    stats.push(["Beans", data.beanCount.toLocaleString()]);
  if (data.teaVarietalCount > 0)
    stats.push(["Tea varietals", data.teaVarietalCount.toLocaleString()]);
  if (data.brewerCount > 0)
    stats.push(["Brewers", data.brewerCount.toLocaleString()]);
  if (data.vesselCount > 0)
    stats.push(["Vessels", data.vesselCount.toLocaleString()]);
  if (data.grinderCount > 0)
    stats.push(["Grinders", data.grinderCount.toLocaleString()]);
  if (data.roasterCount > 0)
    stats.push(["Roasters", data.roasterCount.toLocaleString()]);

  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-orange text-ink">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Brews
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-orange uppercase">
            {data.totalBrews.toLocaleString()}{" "}
            {data.totalBrews === 1 ? "brew" : "brews"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">brewing</span> year.
        </h2>

        {stats.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {stats.map(([k, v]) => (
              <div
                key={k}
                className="rounded-2xl border-2 border-ink bg-cream px-4 py-2"
              >
                <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                  {k}
                </div>
                <div className="text-xl font-bold tabular-nums">{v}</div>
              </div>
            ))}
          </div>
        )}

        {data.topBrews.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Top brews" />
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.topBrews.map((b, i) => {
                const params = brewParamsLine(b);
                return (
                  <li
                    key={`${b.kind}-${b.subjectName}-${i}`}
                    className="rounded-2xl border-2 border-ink bg-cream p-4"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="min-w-0">
                        <div className="line-clamp-2 font-semibold leading-tight">
                          {b.subjectName}
                        </div>
                        <div className="mt-1 font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                          {b.kind === "coffee" ? "coffee" : "tea"}
                          {b.subjectQualifier && ` · ${b.subjectQualifier}`}
                          {b.style && ` · ${b.style}`}
                        </div>
                      </div>
                      {b.rating !== null && (
                        <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 font-mono text-[10px] tracking-widest text-cream uppercase tabular-nums">
                          {b.rating}/10
                        </span>
                      )}
                    </div>
                    {b.tastingNotes && (
                      <p className="mt-2 line-clamp-3 font-serif text-sm italic opacity-80">
                        "{b.tastingNotes}"
                      </p>
                    )}
                    {(params || b.gearName) && (
                      <div className="mt-2 font-mono text-[10px] tracking-wide text-ink/55">
                        {params}
                        {params && b.gearName && " · "}
                        {b.gearName && <span>on {b.gearName}</span>}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {data.beans.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Beans you've drunk" />
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {data.beans.map((b) => (
                <li
                  key={b.uri}
                  className="rounded-xl border-2 border-ink bg-cream p-3"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="line-clamp-1 font-semibold leading-tight">
                      {b.name}
                    </div>
                    {b.closed && (
                      <span className="shrink-0 rounded-full border border-ink px-2 py-0.5 font-mono text-[9px] tracking-widest opacity-60 uppercase">
                        closed
                      </span>
                    )}
                  </div>
                  <div className="mt-1 font-mono text-[10px] tracking-wide text-ink/55">
                    {[b.roastLevel, b.origin].filter(Boolean).join(" · ")}
                  </div>
                  {b.roasterName && (
                    <div className="mt-0.5 font-mono text-[10px] tracking-wide text-ink/45">
                      by {b.roasterName}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.teas.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Teas you've drunk" />
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {data.teas.map((t) => (
                <li
                  key={t.uri}
                  className="rounded-xl border-2 border-ink bg-cream p-3"
                >
                  <div className="line-clamp-1 font-semibold leading-tight">
                    {t.name}
                  </div>
                  <div className="mt-1 font-mono text-[10px] tracking-wide text-ink/55">
                    {[t.category, t.origin].filter(Boolean).join(" · ")}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.gear.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Gear" />
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {data.gear.map((g) => (
                <li
                  key={g.uri}
                  className="rounded-xl border-2 border-ink bg-cream p-3"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="line-clamp-1 font-semibold leading-tight">
                      {g.name}
                    </div>
                    <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 font-mono text-[9px] tracking-widest text-cream uppercase">
                      {g.kind}
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[10px] tracking-wide text-ink/55">
                    {[g.type, g.material].filter(Boolean).join(" · ")}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.roasters.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Roasters" />
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {data.roasters.map((r) => (
                <li
                  key={r.uri}
                  className="flex items-center justify-between gap-3 rounded-xl border-2 border-ink bg-cream p-3"
                >
                  <div className="min-w-0">
                    <div className="line-clamp-1 font-semibold leading-tight">
                      {r.name}
                    </div>
                    {r.location && (
                      <div className="mt-1 font-mono text-[10px] tracking-wide text-ink/55">
                        {r.location}
                      </div>
                    )}
                  </div>
                  {r.website && (
                    <a
                      href={r.website}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 rounded-full border border-ink bg-ink px-3 py-1 font-mono text-[10px] tracking-widest text-cream uppercase"
                    >
                      Visit ↗
                    </a>
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
