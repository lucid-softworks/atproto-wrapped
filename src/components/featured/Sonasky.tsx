import type { SonaskyHighlights } from "../../lib/highlights/sonasky";

function hexToCss(hex: string): string {
  const trimmed = hex.replace(/^#/, "");
  if (trimmed.length === 3 || trimmed.length === 6 || trimmed.length === 8) {
    return `#${trimmed}`;
  }
  return "#888";
}

export function FeaturedSonaskySection({ data }: { data: SonaskyHighlights }) {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-violet text-cream">
      <div className="grain absolute inset-0 opacity-[0.04]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest text-cream/70 uppercase">
            Spotlight · Sonasky
          </div>
          <span className="rounded-full bg-cream px-3 py-1 font-mono text-xs tracking-widest text-wrap-violet uppercase">
            {data.total.toLocaleString()} character
            {data.total === 1 ? "" : "s"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">character</span> ref.
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {data.characters.map((c, i) => {
            const perms: Array<[string, boolean]> = [
              ["SFW: ask first", !c.drawWithoutAskingSFW],
              ["SFW: draw freely", c.drawWithoutAskingSFW],
              ["NSFW: ask first", !c.drawWithoutAskingNSFW],
              ["NSFW: draw freely", c.drawWithoutAskingNSFW],
              ["NSFW art OK", c.nsfw],
            ];
            return (
              <article
                key={i}
                className="rounded-3xl border-2 border-cream bg-wrap-violet p-6"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-2xl font-bold tracking-[-0.02em]">
                    {c.name}
                  </h3>
                  {c.pronouns && (
                    <span className="font-mono text-[10px] tracking-widest text-cream/65 uppercase">
                      {c.pronouns}
                    </span>
                  )}
                </div>

                {c.species && (
                  <div className="mt-1 font-mono text-xs tracking-widest text-cream/65 uppercase">
                    {c.species}
                  </div>
                )}

                {c.description && (
                  <p className="mt-3 text-sm leading-relaxed text-cream/85">
                    {c.description}
                  </p>
                )}

                {c.colors.length > 0 && (
                  <div className="mt-5">
                    <div className="font-mono text-[10px] tracking-widest text-cream/60 uppercase">
                      Palette
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {c.colors.map((col, ci) => (
                        <div
                          key={ci}
                          className="flex items-center gap-2 rounded-full border-2 border-cream bg-wrap-violet px-2 py-1"
                          title={col.hex}
                        >
                          <span
                            className="h-5 w-5 rounded-full border border-cream/60"
                            style={{ background: hexToCss(col.hex) }}
                          />
                          <span className="font-mono text-[10px] tracking-wide uppercase">
                            {col.label ?? col.hex}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  {perms
                    .filter(([, on]) => on)
                    .map(([label], pi) => (
                      <span
                        key={pi}
                        className="rounded-full border-2 border-cream bg-wrap-violet px-3 py-1 font-mono text-[10px] tracking-widest uppercase"
                      >
                        {label}
                      </span>
                    ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
