import type { RpgHighlights } from "../../lib/featured";
import { Cover } from "../Cover";
import { initial } from "../../lib/format";
import { FeaturedRow } from "./_shared";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedRpgSection({
  data,
  theme,
}: {
  data: RpgHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "lime");
  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · RPG
          </div>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">character</span> sheet.
        </h2>

        <div className="mt-10 grid gap-8 sm:grid-cols-[auto_1fr]">
          {data.spriteUrl && (
            <RpgSprite
              src={data.spriteUrl}
              frameWidth={data.spriteFrameWidth}
              frameHeight={data.spriteFrameHeight}
              sheetWidth={data.spriteSheetWidth}
              sheetHeight={data.spriteSheetHeight}
            />
          )}

          <div>
            {data.stats?.octant && (
              <div className="mb-6">
                <div className="font-mono text-[10px] tracking-widest opacity-60 uppercase">
                  Alignment
                </div>
                <div className="mt-1 text-3xl font-bold capitalize">
                  {data.stats.octant}
                </div>
              </div>
            )}

            {data.stats && data.stats.attributes.length > 0 && (
              <div className="space-y-2">
                {data.stats.attributes.map((a) => (
                  <RpgBar key={a.name} name={a.name} value={a.value} />
                ))}
              </div>
            )}

            {data.stats && data.stats.games.length > 0 && (
              <div className="mt-6 grid gap-2">
                {data.stats.games.map((g) => (
                  <div
                    key={g.name}
                    className="rounded-xl border-2 border-ink bg-cream p-3"
                  >
                    <div className="flex items-baseline justify-between">
                      <div className="font-semibold">{g.name}</div>
                      <div className="font-mono text-xs opacity-60">
                        {g.tries.toLocaleString()} tr
                        {g.tries === 1 ? "y" : "ies"}
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-sm">
                      <span>
                        <span className="opacity-60">best </span>
                        <span className="font-bold tabular-nums">
                          {g.best.toLocaleString()}
                        </span>
                      </span>
                      <span>
                        <span className="opacity-60">worst </span>
                        <span className="font-bold tabular-nums">
                          {g.worst.toLocaleString()}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {data.items.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Inventory" />
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {data.items.map((it, i) => (
                <div
                  key={`${it.title}-${i}`}
                  className="flex flex-col rounded-2xl border-2 border-ink bg-cream p-3"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl border-2 border-ink bg-[repeating-conic-gradient(var(--color-cream-dark)_0_25%,var(--color-cream)_0_50%)] bg-[length:16px_16px]">
                    <Cover
                      src={it.iconUrl}
                      alt={it.title}
                      fallback={initial(it.title)}
                      pixelated
                      className="absolute inset-0 h-full w-full object-contain p-4"
                    />
                    {it.category && (
                      <span className="absolute top-2 left-2 rounded-full bg-ink px-2 py-0.5 font-mono text-[10px] tracking-widest text-cream uppercase">
                        {it.category}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 line-clamp-2 font-semibold leading-tight">
                    {it.title}
                  </div>
                  {it.context && (
                    <div className="mt-1 line-clamp-2 font-serif text-sm italic opacity-70">
                      {it.context}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function RpgSprite({
  src,
  frameWidth,
  frameHeight,
  sheetWidth,
  sheetHeight,
}: {
  src: string;
  frameWidth?: number;
  frameHeight?: number;
  sheetWidth?: number;
  sheetHeight?: number;
}) {
  const fw = frameWidth ?? 48;
  const fh = frameHeight ?? 48;
  const sw = sheetWidth ?? fw;
  const sh = sheetHeight ?? fh;
  const scale = 4;
  const cols = Math.max(1, Math.round(sw / fw));
  const canAnimate = cols >= 3;
  const walkX = -fw * Math.min(cols, 3) * scale;

  return (
    <div className="mx-auto w-fit self-start rounded-2xl border-2 border-ink bg-cream p-4 sm:mx-0">
      <div
        className={canAnimate ? "sprite-walk-3" : ""}
        style={
          {
            width: fw * scale,
            height: fh * scale,
            backgroundImage: `url("${src}")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${sw * scale}px ${sh * scale}px`,
            backgroundPosition: "0 0",
            imageRendering: "pixelated",
            "--sprite-walk-x": `${walkX}px`,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

function RpgBar({ name, value }: { name: string; value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="flex items-baseline justify-between font-mono text-xs">
        <span className="capitalize">{name}</span>
        <span className="font-bold tabular-nums">{value}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full border border-ink bg-cream">
        <div className="h-full bg-ink" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
