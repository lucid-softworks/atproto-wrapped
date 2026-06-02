import type { WishlistHighlights } from "../../lib/highlights/registry";
import { Cover } from "../Cover";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedWishlistSection({
  data,
  theme,
}: {
  data: WishlistHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "yellow");
  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Blue Registry
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-yellow uppercase">
            {data.totalItems.toLocaleString()} item
            {data.totalItems === 1 ? "" : "s"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">wishlist</span>.
        </h2>

        {data.lists.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {data.lists.map((l, i) => (
              <div
                key={i}
                className="rounded-2xl border-2 border-ink bg-cream px-4 py-2"
              >
                <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                  List
                </div>
                <div className="text-base font-bold">{l.title}</div>
                {l.description && (
                  <div className="mt-1 max-w-xs text-xs text-ink/70">
                    {l.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {data.items.length > 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((it, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border-2 border-ink bg-cream"
              >
                <div className="relative aspect-[4/3] bg-ink/10">
                  <Cover
                    src={it.imageUrl}
                    alt={it.name}
                    fallback="◇"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {it.priority && (
                    <span className="absolute top-2 right-2 rounded-full bg-ink px-2 py-0.5 font-mono text-[10px] tracking-widest text-wrap-yellow uppercase">
                      {it.priority}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-base font-bold tracking-[-0.01em]">
                    {it.name}
                  </div>
                  {it.color && (
                    <div className="mt-1 font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                      {it.color}
                    </div>
                  )}
                  {it.description && (
                    <p className="mt-2 line-clamp-3 text-sm text-ink/75">
                      {it.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
