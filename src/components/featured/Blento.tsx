import type {
  BlentoCard,
  BlentoHighlights,
} from "../../lib/highlights/blento";
import { sectionTheme, type SectionTheme } from "./_theme";

const TYPE_LABELS: Record<string, string> = {
  rpgActor: "RPG Actor",
  sembleCollection: "Semble Collection",
  bskyPost: "Bluesky Post",
  bskyProfile: "Bluesky Profile",
  link: "Link",
  text: "Text",
  image: "Image",
};

function prettyType(type: string): string {
  if (TYPE_LABELS[type]) return TYPE_LABELS[type];
  // Convert camelCase to space-separated words for unknown types.
  return type
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function FeaturedBlentoSection({
  data,
  theme,
}: {
  data: BlentoHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "pink");
  const types = Array.from(data.byType.entries()).sort(
    (a, b) => b[1] - a[1],
  );

  return (
    <section
      className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}
    >
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Blento
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-pink uppercase">
            {data.total.toLocaleString()} card
            {data.total === 1 ? "" : "s"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">blento</span> board.
        </h2>

        {types.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {types.map(([t, n]) => (
              <span
                key={t}
                className="rounded-full border-2 border-ink bg-cream px-3 py-1 font-mono text-xs tracking-wide uppercase"
              >
                <span className="font-semibold">{prettyType(t)}</span>
                <span className="ml-2 text-ink/55 tabular-nums">{n}</span>
              </span>
            ))}
          </div>
        )}

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.cards.map((c) => (
            <CardRow key={c.rkey} card={c} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function CardRow({ card }: { card: BlentoCard }) {
  return (
    <li className="rounded-2xl border-2 border-ink bg-cream p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-ink/40 bg-ink/5 px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase">
          {prettyType(card.cardType)}
        </span>
        {card.updatedAt && (
          <span className="font-mono text-[10px] opacity-55">
            {card.updatedAt.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>
      <div className="mt-2 line-clamp-2 text-base font-semibold leading-tight">
        {card.title ?? <span className="opacity-55">Untitled card</span>}
      </div>
      {card.href && (
        <div className="mt-3">
          <a
            href={card.href}
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-full border-2 border-ink bg-ink px-3 py-1 font-mono text-[10px] tracking-widest text-wrap-pink uppercase hover:bg-cream hover:text-ink"
          >
            Open ↗
          </a>
        </div>
      )}
    </li>
  );
}
