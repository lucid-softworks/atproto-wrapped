import type { AnisotaHighlights } from "../../lib/featured";
import { initial } from "../../lib/format";
import { FeaturedRow } from "./_shared";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedAnisotaSection({
  data,
  theme,
}: {
  data: AnisotaHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "lime");
  const pct =
    data.totalXP !== null && data.xpToNextLevel
      ? Math.round(
          (data.totalXP /
            Math.max(1, data.totalXP + data.xpToNextLevel)) *
            100,
        )
      : null;

  const stats: Array<[string, number]> = [
    ["Days logged", data.daysLogged],
    ["Sessions", data.sessions],
    ["Items collected", data.itemsAcquired],
    ["Specimens", data.specimensDocumented],
    ["Expeditions", data.expeditions],
    ["Achievements", data.achievements],
    ["Feed posts", data.feedPosts],
  ].filter(([, n]) => (n as number) > 0) as Array<[string, number]>;

  return (
    <section
      className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}
    >
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Anisota
          </div>
          {data.level !== null && (
            <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-lime uppercase">
              Level {data.level}
            </span>
          )}
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">chronicle</span>.
        </h2>

        {data.totalXP !== null && (
          <div className="mt-8 max-w-2xl rounded-2xl border-2 border-ink bg-cream p-5">
            <div className="flex items-baseline justify-between">
              <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                Experience
              </div>
              <div className="font-mono text-xs">
                {data.totalXP.toLocaleString()} XP
                {data.xpToNextLevel !== null && data.xpToNextLevel > 0 && (
                  <span className="opacity-65">
                    {" "}
                    · {data.xpToNextLevel.toLocaleString()} to next level
                  </span>
                )}
              </div>
            </div>
            {pct !== null && (
              <div className="mt-3 h-3 overflow-hidden rounded-full border-2 border-ink bg-cream-dark">
                <div className="h-full bg-ink" style={{ width: `${pct}%` }} />
              </div>
            )}
          </div>
        )}

        {stats.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {stats.map(([k, n]) => (
              <div
                key={k}
                className="rounded-2xl border-2 border-ink bg-cream px-4 py-2"
              >
                <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                  {k}
                </div>
                <div className="text-xl font-bold tabular-nums">
                  {n.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {data.items.length > 0 && (
          <div className="mt-12">
            <FeaturedRow
              label={`Inventory · ${data.inventoryTotal.toLocaleString()} items`}
            />
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {data.items.map((it, i) => (
                <div
                  key={`${it.itemId}-${i}`}
                  className="flex items-center gap-3 rounded-xl border-2 border-ink bg-cream p-3"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-ink font-mono text-xs font-bold uppercase ${rarityBg(
                      it.rarity,
                    )}`}
                  >
                    {it.quantity > 1 ? `×${it.quantity}` : initial(it.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 font-semibold leading-tight">
                      {it.name}
                    </div>
                    <div className="flex flex-wrap gap-x-2 font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                      {it.type && <span>{it.type}</span>}
                      {it.rarity && <span>· {it.rarity}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function rarityBg(rarity?: string): string {
  switch (rarity) {
    case "legendary":
      return "bg-wrap-yellow";
    case "epic":
      return "bg-wrap-pink";
    case "rare":
      return "bg-wrap-cyan";
    case "uncommon":
      return "bg-wrap-mint";
    default:
      return "bg-cream-dark";
  }
}
