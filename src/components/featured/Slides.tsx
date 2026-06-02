import type {
  SlidesDeck,
  SlidesHighlights,
} from "../../lib/highlights/slides";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedSlidesSection({
  data,
  theme,
}: {
  data: SlidesHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "orange");
  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Waow Slides
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-orange uppercase">
            {data.totalDecks.toLocaleString()} deck
            {data.totalDecks === 1 ? "" : "s"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">slide decks</span>.
        </h2>

        <div className="mt-8 flex flex-wrap gap-3">
          <div className="rounded-2xl border-2 border-ink bg-cream px-4 py-3">
            <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
              Decks
            </div>
            <div className="text-2xl font-bold tabular-nums">
              {data.totalDecks.toLocaleString()}
            </div>
          </div>
          <div className="rounded-2xl border-2 border-ink bg-cream px-4 py-3">
            <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
              Slides
            </div>
            <div className="text-2xl font-bold tabular-nums">
              {data.totalSlides.toLocaleString()}
            </div>
          </div>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.decks.map((d) => (
            <DeckCard key={d.rkey} deck={d} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function DeckCard({ deck }: { deck: SlidesDeck }) {
  const updated = deck.updatedAt ?? deck.createdAt;
  return (
    <li className="rounded-2xl border-2 border-ink bg-cream p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
          Deck
        </div>
        <span className="rounded-full border-2 border-ink bg-wrap-orange px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase">
          {deck.slideCount} slide{deck.slideCount === 1 ? "" : "s"}
        </span>
      </div>
      <div className="mt-2 line-clamp-2 text-base font-bold leading-tight tracking-[-0.01em]">
        {deck.name}
      </div>
      {updated && (
        <div className="mt-3 font-mono text-[10px] opacity-55">
          Updated{" "}
          {updated.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      )}
    </li>
  );
}
