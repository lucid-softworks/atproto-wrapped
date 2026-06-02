import type {
  AiConsentHighlights,
  AiConsentPref,
} from "../../lib/highlights/aiConsent";

const LABELS: Record<AiConsentPref["key"], { title: string; about: string }> = {
  training: {
    title: "Training",
    about: "Using your records to train AI models.",
  },
  embedding: {
    title: "Embedding",
    about: "Vectorizing your records for semantic search.",
  },
  inference: {
    title: "Inference",
    about: "Feeding your records into an AI at runtime.",
  },
  syntheticContent: {
    title: "Synthetic content",
    about: "Generating new content that mimics your records.",
  },
};

export function FeaturedAiConsentSection({
  data,
}: {
  data: AiConsentHighlights;
}) {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-red text-cream">
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest text-cream/65 uppercase">
            Spotlight · AI consent
          </div>
          <span className="rounded-full bg-cream px-3 py-1 font-mono text-xs tracking-widest text-ink uppercase">
            {data.disallowed}/{data.prefs.length} disallowed
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">AI</span> rules.
        </h2>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {data.prefs.map((p) => {
            const meta = LABELS[p.key];
            return (
              <div
                key={p.key}
                className="rounded-2xl border-2 border-cream bg-ink p-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="font-semibold leading-tight">
                    {meta.title}
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase ${
                      p.allow
                        ? "bg-wrap-lime text-ink"
                        : "bg-wrap-pink text-ink"
                    }`}
                  >
                    {p.allow ? "Allowed" : "Denied"}
                  </span>
                </div>
                <p className="mt-2 font-serif text-sm italic text-cream/70">
                  {meta.about}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
