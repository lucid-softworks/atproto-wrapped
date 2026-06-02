import type { VibeMealHighlights } from "../../lib/highlights/vibeMeal";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedVibeMealSection({
  data,
  theme,
}: {
  data: VibeMealHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "red");
  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="grain absolute inset-0 opacity-[0.05]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest text-cream/75 uppercase">
            Spotlight · AgentMeal
          </div>
          {data.total > 1 && (
            <span className="rounded-full bg-cream px-3 py-1 font-mono text-xs tracking-widest text-wrap-red uppercase">
              {data.total.toLocaleString()} cans
            </span>
          )}
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">AgentMeal</span> can.
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {data.cans.map((c, i) => (
            <article
              key={`${c.rkey ?? i}`}
              className="relative overflow-hidden rounded-3xl border-2 border-cream bg-ink p-6 shadow-[8px_8px_0_0_rgba(0,0,0,0.35)]"
            >
              <div className="flex items-baseline justify-between">
                <div className="font-mono text-[10px] tracking-widest text-cream/55 uppercase">
                  {c.runId ?? "Run"}
                </div>
                {c.mintNumber !== null && (
                  <div className="font-mono text-sm tracking-widest text-cream/65">
                    mint #
                    <span className="text-cream tabular-nums">
                      {c.mintNumber.toString().padStart(6, "0")}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 text-3xl font-bold tracking-[-0.02em]">
                {c.engraving.lidOuterPrimary ?? "AgentMeal"}
              </div>
              {c.engraving.lidOuterSecondary && (
                <div className="mt-1 font-serif text-lg italic text-cream/85">
                  {c.engraving.lidOuterSecondary}
                </div>
              )}

              <dl className="mt-5 grid gap-2 font-mono text-xs">
                {c.engraving.bodySerial && (
                  <Row label="Serial" value={c.engraving.bodySerial} />
                )}
                {c.engraving.bottomLip && (
                  <Row label="Edition" value={c.engraving.bottomLip} />
                )}
                {c.engraving.bottomMinted && (
                  <Row label="Minted" value={c.engraving.bottomMinted} />
                )}
                {c.recipeId && <Row label="Recipe" value={c.recipeId} />}
                {(c.cubemapId || c.gradientId) && (
                  <Row
                    label="Shader"
                    value={[c.cubemapId, c.gradientId]
                      .filter(Boolean)
                      .join(" / ")}
                  />
                )}
                {c.issuedAt && (
                  <Row
                    label="Issued"
                    value={c.issuedAt.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  />
                )}
              </dl>

              {(c.issuerDid || c.verificationUrl) && (
                <div className="mt-5 flex flex-wrap items-center gap-3 border-t-2 border-cream/20 pt-4 font-mono text-[10px] tracking-widest text-cream/55 uppercase">
                  {c.issuerDid && <span>by {c.issuerDid}</span>}
                  {c.verificationUrl && (
                    <a
                      href={c.verificationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-auto rounded-full border border-cream/40 px-2 py-0.5 transition hover:bg-cream hover:text-wrap-red"
                    >
                      verify ↗
                    </a>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <dt className="w-20 shrink-0 tracking-widest text-cream/55 uppercase">
        {label}
      </dt>
      <dd className="min-w-0 truncate text-cream">{value}</dd>
    </div>
  );
}
