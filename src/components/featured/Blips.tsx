import type { BlipsHighlights } from "../../lib/highlights/blips";

export function FeaturedBlipsSection({ data }: { data: BlipsHighlights }) {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-cyan text-ink">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Thought Blips
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-cyan uppercase">
            {data.total.toLocaleString()} blips
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          <span className="font-serif italic">Blips</span> of thought.
        </h2>

        <ul className="mt-10 space-y-4">
          {data.blips.map((b, i) => (
            <li
              key={i}
              className="rounded-2xl border-2 border-ink bg-cream p-5"
            >
              <p className="font-serif text-lg leading-relaxed italic">
                “{b.content}”
              </p>
              {b.createdAt && (
                <div className="mt-3 font-mono text-[10px] tracking-widest text-ink/45 uppercase">
                  {b.createdAt.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
