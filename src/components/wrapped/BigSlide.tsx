import { useRef } from "react";
import { THEME_STYLES, type CollectionDescriptor } from "../../lib/labels";
import { useInView } from "../../hooks/useInView";

export function BigSlide({
  index,
  total,
  nsid,
  count,
  descriptor,
}: {
  index: number;
  total: number;
  nsid: string;
  count: number;
  descriptor: CollectionDescriptor;
}) {
  const t = THEME_STYLES[descriptor.theme];
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref);

  const flip = index % 2 === 0;

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.fg}`}
    >
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="flex items-center justify-between">
          <div className={`font-mono text-xs tracking-widest uppercase ${t.muted}`}>
            #{String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </div>
          <span
            className={`rounded-full px-3 py-1 font-mono text-xs tracking-widest uppercase ${t.chip} ${t.chipFg}`}
          >
            {descriptor.service}
          </span>
        </div>

        <div
          className={`mt-10 grid gap-8 sm:gap-12 ${
            flip ? "sm:grid-cols-[1.2fr_1fr]" : "sm:grid-cols-[1fr_1.2fr]"
          }`}
        >
          <div className={flip ? "" : "sm:order-2"}>
            <div
              className={`text-[clamp(5rem,18vw,15rem)] leading-[0.85] font-bold tracking-[-0.05em] tabular-nums ${
                visible ? "fade-up" : "opacity-0"
              }`}
            >
              {count.toLocaleString()}
            </div>
            <div
              className={`mt-2 text-[clamp(2rem,7vw,5rem)] leading-[0.95] font-medium tracking-tight italic ${
                visible ? "fade-up" : "opacity-0"
              }`}
              style={visible ? { animationDelay: "0.1s" } : undefined}
            >
              {descriptor.word}
            </div>
          </div>

          <div
            className={`flex flex-col justify-end ${
              flip ? "sm:items-end sm:text-right" : ""
            }`}
          >
            <p
              className={`font-serif text-2xl leading-snug italic sm:text-4xl ${
                visible ? "fade-up" : "opacity-0"
              }`}
              style={visible ? { animationDelay: "0.2s" } : undefined}
            >
              {descriptor.headline(count)}
            </p>
            <div className={`mt-6 font-mono text-xs tracking-wider ${t.muted}`}>
              {nsid}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
