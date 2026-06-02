import type {
  PopfeedHighlights,
  PopfeedReview,
} from "../../lib/featured";
import { Cover } from "../Cover";
import { initial } from "../../lib/format";
import { FeaturedRow } from "./_shared";
import { sectionTheme, type SectionTheme } from "./_theme";

// Each creative-work type maps to its own group with a verb that actually
// fits ("watched" makes no sense for a video game). Order here = render order.
const TYPE_GROUPS: Array<{ type: string; label: string }> = [
  { type: "movie", label: "Movies you watched" },
  { type: "tv_show", label: "Shows you watched" },
  { type: "video_game", label: "Games you played" },
  { type: "book", label: "Books you read" },
  { type: "music_album", label: "Albums you heard" },
];

export function FeaturedPopfeedSection({
  data,
  did,
  theme,
}: {
  data: PopfeedHighlights;
  did: string;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "yellow");
  const typesSummary = Array.from(data.byType.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([t, n]) => `${n.toLocaleString()} ${prettyPopfeedType(t, n)}`)
    .join("  ·  ");

  const grouped = new Map<string, PopfeedReview[]>();
  const other: PopfeedReview[] = [];
  for (const r of data.reviews) {
    const known = TYPE_GROUPS.some((g) => g.type === r.type);
    if (known && r.type) {
      const arr = grouped.get(r.type) ?? [];
      arr.push(r);
      grouped.set(r.type, arr);
    } else {
      other.push(r);
    }
  }

  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Popfeed
          </div>
          {data.averageRating !== null && (
            <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-yellow uppercase">
              Avg {data.averageRating.toFixed(1)} / 10
            </span>
          )}
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          A year of <span className="font-serif italic">reviews</span>.
        </h2>

        {typesSummary && (
          <p className="mt-4 font-mono text-sm tracking-wide opacity-65">
            {typesSummary}
          </p>
        )}

        {TYPE_GROUPS.map(({ type, label }) => {
          const list = grouped.get(type);
          if (!list || list.length === 0) return null;
          return (
            <div key={type} className="mt-12">
              <FeaturedRow label={`${label} · ${list.length}`} />
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {list.map((r, i) => (
                  <ReviewCard key={`${r.rkey}-${i}`} review={r} did={did} />
                ))}
              </div>
            </div>
          );
        })}

        {other.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label={`Other reviews · ${other.length}`} />
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {other.map((r, i) => (
                <ReviewCard key={`${r.rkey}-${i}`} review={r} did={did} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewCard({
  review,
  did,
}: {
  review: PopfeedReview;
  did: string;
}) {
  const href = `https://popfeed.social/review/at:/${did}/social.popfeed.feed.review/${review.rkey}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl border-2 border-ink bg-ink/10 transition group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] group-hover:shadow-[3px_3px_0_0_var(--color-ink)]">
        <Cover
          src={review.posterUrl}
          alt={review.title}
          fallback={initial(review.title)}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {review.rating !== null && (
          <span className="absolute top-2 right-2 rounded-full bg-ink px-2.5 py-1 font-mono text-xs font-bold tabular-nums text-wrap-yellow">
            {review.rating}/10
          </span>
        )}
        {review.type && (
          <span className="absolute top-2 left-2 rounded-full bg-cream/95 px-2 py-0.5 font-mono text-[10px] tracking-widest text-ink uppercase">
            {prettyPopfeedType(review.type, 1)}
          </span>
        )}
      </div>
      <div className="mt-3 line-clamp-2 font-semibold leading-tight group-hover:underline">
        {review.title}
      </div>
      {review.mainCredit && (
        <div className="mt-0.5 line-clamp-1 text-sm opacity-65">
          {review.mainCredit}
        </div>
      )}
      {review.text && (
        <p className="mt-2 line-clamp-3 font-serif text-sm italic opacity-80">
          "{review.text}"
        </p>
      )}
    </a>
  );
}

function prettyPopfeedType(type: string, count: number): string {
  const single: Record<string, string> = {
    movie: "movie",
    tv_show: "show",
    video_game: "game",
    book: "book",
    music_album: "album",
  };
  const s = single[type] ?? type.replace(/_/g, " ");
  return count === 1 ? s : `${s}s`;
}
