import { bluePlaceColorHex, type BluePlaceHighlights } from "../../lib/featured";
import { FeaturedRow } from "./_shared";

export function FeaturedBluePlaceSection({
  data,
}: {
  data: BluePlaceHighlights;
}) {
  const palette = Array.from(data.colorCounts.entries()).sort(
    (a, b) => b[1] - a[1],
  );
  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-ink text-cream">
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest text-cream/70 uppercase">
            Spotlight · Blue Place
          </div>
          <span className="rounded-full bg-cream px-3 py-1 font-mono text-xs tracking-widest text-ink uppercase">
            {data.total.toLocaleString()} pixels
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Pixels you <span className="font-serif italic">placed</span>.
        </h2>

        <div className="mt-8 flex flex-wrap items-end gap-4">
          <div>
            <div className="font-mono text-[10px] tracking-widest text-cream/55 uppercase">
              Palette · {data.uniqueColors} colors used
            </div>
            <div className="mt-2 flex gap-1">
              {palette.map(([idx, count]) => (
                <div
                  key={idx}
                  title={`color ${idx} · ${count} pixels`}
                  className="h-8 w-8 rounded border-2 border-cream"
                  style={{ backgroundColor: bluePlaceColorHex(idx) }}
                />
              ))}
            </div>
          </div>
          {data.boundingBox && (
            <div className="ml-auto rounded-2xl border-2 border-cream bg-ink px-4 py-2">
              <div className="font-mono text-[10px] tracking-widest text-cream/55 uppercase">
                Bounding box
              </div>
              <div className="font-mono text-sm">
                ({data.boundingBox.minX}, {data.boundingBox.minY}) → (
                {data.boundingBox.maxX}, {data.boundingBox.maxY})
              </div>
            </div>
          )}
        </div>

        <div className="mt-10">
          <FeaturedRow label="Recent placements" />
          <ul className="mt-4 grid gap-1 font-mono text-xs sm:grid-cols-2 lg:grid-cols-3">
            {data.pixels.slice(0, 24).map((p, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded border border-cream/20 bg-ink/40 px-3 py-1.5"
              >
                <span
                  className="inline-block h-4 w-4 rounded border border-cream"
                  style={{ backgroundColor: bluePlaceColorHex(p.color) }}
                />
                <span className="tabular-nums">
                  ({p.x}, {p.y})
                </span>
                {p.createdAt && (
                  <span className="ml-auto text-cream/45">
                    {p.createdAt.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
