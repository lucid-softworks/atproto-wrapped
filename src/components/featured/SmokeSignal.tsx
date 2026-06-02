import type { SmokeSignalHighlights } from "../../lib/featured";

export function FeaturedSmokeSignalSection({
  data,
}: {
  data: SmokeSignalHighlights;
}) {
  const rsvpStats = Array.from(data.rsvpsByStatus.entries()).sort(
    (a, b) => b[1] - a[1],
  );
  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-red text-cream">
      <div className="grain absolute inset-0 opacity-[0.04]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest text-cream/70 uppercase">
            Spotlight · Smoke Signal
          </div>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          IRL <span className="font-serif italic">plans</span>.
        </h2>

        <div className="mt-8 flex flex-wrap gap-3">
          {data.eventsCreated > 0 && (
            <div className="rounded-2xl border-2 border-cream bg-wrap-red px-4 py-2">
              <div className="font-mono text-[10px] tracking-widest text-cream/70 uppercase">
                Events created
              </div>
              <div className="text-xl font-bold tabular-nums">
                {data.eventsCreated.toLocaleString()}
              </div>
            </div>
          )}
          {data.rsvps > 0 && (
            <div className="rounded-2xl border-2 border-cream bg-wrap-red px-4 py-2">
              <div className="font-mono text-[10px] tracking-widest text-cream/70 uppercase">
                RSVPs
              </div>
              <div className="text-xl font-bold tabular-nums">
                {data.rsvps.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {rsvpStats.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {rsvpStats.map(([status, count]) => (
              <span
                key={status}
                className="rounded-full border-2 border-cream bg-wrap-red px-3 py-1 font-mono text-xs tracking-wide uppercase"
              >
                <span className="font-semibold">{status}</span>
                <span className="ml-2 text-cream/70">
                  {count.toLocaleString()}
                </span>
              </span>
            ))}
          </div>
        )}

        {data.events.length > 0 && (
          <div className="mt-10">
            <div className="font-mono text-xs tracking-widest text-cream/65 uppercase">
              Events you hosted
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {data.events.map((e, i) => (
                <li
                  key={i}
                  className="rounded-xl border-2 border-cream bg-wrap-red p-3"
                >
                  <div className="font-semibold">{e.name}</div>
                  {e.description && (
                    <p className="mt-1 line-clamp-2 font-serif text-sm italic text-cream/80">
                      {e.description}
                    </p>
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
