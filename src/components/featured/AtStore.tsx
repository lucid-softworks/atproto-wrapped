import type { AtStoreHighlights } from "../../lib/highlights/atstore";
import { FeaturedRow } from "./_shared";

export function FeaturedAtStoreSection({
  data,
}: {
  data: AtStoreHighlights;
}) {
  const stats: Array<[string, string]> = [];
  if (data.favoritesCount > 0)
    stats.push(["Favorites", data.favoritesCount.toLocaleString()]);
  if (data.reviewsCount > 0)
    stats.push(["Reviews", data.reviewsCount.toLocaleString()]);
  if (data.averageRating !== null)
    stats.push(["Avg rating", data.averageRating.toFixed(1)]);

  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-pink text-ink">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · atstore
          </div>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Apps you <span className="font-serif italic">fancied</span>.
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

        {data.reviews.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Reviews you wrote" />
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.reviews.map((r, i) => (
                <li
                  key={i}
                  className="rounded-2xl border-2 border-ink bg-cream p-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    {r.rating !== null ? (
                      <div className="font-mono text-sm font-bold tabular-nums">
                        {"★".repeat(Math.max(0, Math.min(5, Math.round(r.rating))))}
                        <span className="opacity-30">
                          {"★".repeat(
                            5 - Math.max(0, Math.min(5, Math.round(r.rating))),
                          )}
                        </span>
                      </div>
                    ) : (
                      <div className="font-mono text-[10px] tracking-widest opacity-55 uppercase">
                        Review
                      </div>
                    )}
                    {r.createdAt && (
                      <div className="font-mono text-[10px] opacity-55">
                        {r.createdAt.toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    )}
                  </div>
                  {r.text && (
                    <p className="mt-2 line-clamp-4 font-serif text-sm italic opacity-85">
                      {r.text}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.favorites.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Favorited apps" />
            <ul className="mt-4 grid gap-2 font-mono text-xs sm:grid-cols-2 lg:grid-cols-3">
              {data.favorites.map((f, i) => (
                <li
                  key={`${f.subject}-${i}`}
                  className="flex items-center gap-2 rounded-xl border-2 border-ink bg-cream px-3 py-2"
                >
                  <span className="text-base" aria-hidden>
                    ♡
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {f.subject || "(unknown listing)"}
                  </span>
                  {f.createdAt && (
                    <span className="font-mono text-[10px] opacity-55">
                      {f.createdAt.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
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
