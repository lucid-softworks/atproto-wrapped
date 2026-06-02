import type { AtCircleHighlights } from "../../lib/highlights/atcircle";
import { FeaturedRow } from "./_shared";

export function FeaturedAtCircleSection({
  data,
}: {
  data: AtCircleHighlights;
}) {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-mint text-ink">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · AT-Circle
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-mint uppercase">
            {(data.ringsAdmined + data.memberships).toLocaleString()} total
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Webrings you've{" "}
          <span className="font-serif italic">joined</span>.
        </h2>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-ink bg-cream p-5">
            <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
              Rings admined
            </div>
            <div className="mt-2 text-4xl font-bold tabular-nums">
              {data.ringsAdmined.toLocaleString()}
            </div>
          </div>
          <div className="rounded-2xl border-2 border-ink bg-cream p-5">
            <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
              Memberships
            </div>
            <div className="mt-2 text-4xl font-bold tabular-nums">
              {data.memberships.toLocaleString()}
            </div>
          </div>
        </div>

        {data.rings.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Rings you admin" />
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.rings.map((r) => (
                <li
                  key={r.uri}
                  className="rounded-2xl border-2 border-ink bg-cream p-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="line-clamp-2 font-semibold leading-tight">
                      {r.title}
                    </div>
                    {r.status && (
                      <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 font-mono text-[10px] tracking-widest text-wrap-mint uppercase">
                        {r.status}
                      </span>
                    )}
                  </div>
                  {r.description && (
                    <p className="mt-2 line-clamp-3 font-serif text-sm italic opacity-80">
                      {r.description}
                    </p>
                  )}
                  {r.acceptancePolicy && (
                    <div className="mt-2 font-mono text-[10px] tracking-widest opacity-55 uppercase">
                      Acceptance: {r.acceptancePolicy}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.members.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Your memberships" />
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {data.members.map((m) => (
                <li
                  key={m.uri}
                  className="flex items-center justify-between gap-3 rounded-xl border-2 border-ink bg-cream p-3"
                >
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{m.title}</div>
                    {m.url && (
                      <div className="truncate font-mono text-[11px] opacity-60">
                        {m.url}
                      </div>
                    )}
                  </div>
                  {m.url && (
                    <a
                      href={m.url}
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
