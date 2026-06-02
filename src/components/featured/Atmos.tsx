import type { AtmosHighlights } from "../../lib/highlights/atmos";
import { toDisplayHandle } from "../../lib/handle";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedAtmosSection({
  data,
  theme,
}: {
  data: AtmosHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "cobalt");
  return (
    <section
      className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}
    >
      <div className="grain absolute inset-0 opacity-[0.04]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest text-cream/70 uppercase">
            Spotlight · atmos.email
          </div>
          {data.relayMember && (
            <span className="rounded-full bg-cream px-3 py-1 font-mono text-xs tracking-widest text-wrap-cobalt uppercase">
              Relay member
            </span>
          )}
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Email on the <span className="font-serif italic">open web</span>.
        </h2>

        <div className="mt-10 rounded-2xl border-2 border-cream bg-wrap-cobalt p-6">
          <div className="font-mono text-[10px] tracking-widest text-cream/65 uppercase">
            Your domain
          </div>
          <div className="mt-2 font-mono text-2xl break-all">
            @{toDisplayHandle(data.domain)}
          </div>
          {data.dkimSelectors.length > 0 && (
            <div className="mt-6">
              <div className="font-mono text-[10px] tracking-widest text-cream/65 uppercase">
                DKIM selectors · {data.dkimSelectors.length}
              </div>
              <ul className="mt-2 flex flex-wrap gap-2">
                {data.dkimSelectors.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-cream/40 bg-wrap-cobalt px-3 py-1 font-mono text-xs"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
