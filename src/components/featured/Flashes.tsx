import type { FlashesHighlights } from "../../lib/featured";
import { Cover } from "../Cover";

export function FeaturedFlashesSection({ data }: { data: FlashesHighlights }) {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-pink text-ink">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Flashes
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-pink uppercase">
            {data.total.toLocaleString()} flash{data.total === 1 ? "" : "es"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">flashes</span>.
        </h2>

        {data.posts.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {data.posts.map((p, i) => (
              <figure
                key={i}
                className="relative aspect-[3/4] overflow-hidden rounded-xl border-2 border-ink bg-ink/10"
              >
                <Cover
                  src={p.imageUrl}
                  alt={p.text ?? "flash"}
                  fallback="◆"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {p.text && (
                  <figcaption className="absolute right-0 bottom-0 left-0 line-clamp-3 bg-gradient-to-t from-ink/85 to-transparent p-3 text-xs text-cream">
                    {p.text}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        ) : (
          <p className="mt-6 font-serif text-lg italic opacity-70">
            Flashes account set up — no posts yet.
          </p>
        )}
      </div>
    </section>
  );
}
