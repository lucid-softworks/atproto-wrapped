import type { StatusHighlights } from "../../lib/featured";

export function FeaturedStatusSection({ data }: { data: StatusHighlights }) {
  const services = Array.from(data.byService.entries()).sort(
    (a, b) => b[1] - a[1],
  );
  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-violet text-cream">
      <div className="grain absolute inset-0 opacity-[0.04]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest text-cream/70 uppercase">
            Spotlight · Status
          </div>
          <span className="rounded-full bg-cream px-3 py-1 font-mono text-xs tracking-widest text-wrap-violet uppercase">
            {data.total.toLocaleString()} update
            {data.total === 1 ? "" : "s"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          What you've <span className="font-serif italic">been up to</span>.
        </h2>

        {services.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {services.map(([svc, n]) => (
              <span
                key={svc}
                className="rounded-full border-2 border-cream bg-wrap-violet px-3 py-1 font-mono text-xs tracking-wide uppercase"
              >
                <span className="font-semibold">{svc}</span>
                <span className="ml-2 text-cream/70">
                  {n.toLocaleString()}
                </span>
              </span>
            ))}
          </div>
        )}

        {data.recent.length > 0 && (
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {data.recent.map((s, i) => (
              <li
                key={i}
                className="rounded-2xl border-2 border-cream bg-wrap-violet p-4"
              >
                <p className="font-serif text-lg leading-snug italic">
                  {s.emoji && <span className="mr-2 not-italic">{s.emoji}</span>}
                  "{s.text}"
                </p>
                <div className="mt-3 flex items-center justify-between font-mono text-[10px] tracking-widest text-cream/65 uppercase">
                  <span>{s.service}</span>
                  {s.createdAt && (
                    <span>
                      {s.createdAt.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
