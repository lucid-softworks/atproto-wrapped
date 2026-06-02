import type { MadebydannyCdnHighlights } from "../../lib/highlights/madebydannyCdn";
import { Cover } from "../Cover";
import { sectionTheme, type SectionTheme } from "./_theme";

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function FeaturedMadebydannyCdnSection({
  data,
  theme,
}: {
  data: MadebydannyCdnHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "mint");
  const total = data.images + data.videos;
  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Madebydanny CDN
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-mint uppercase">
            {total.toLocaleString()} file{total === 1 ? "" : "s"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">media</span> library.
        </h2>

        <div className="mt-8 flex flex-wrap gap-3">
          <div className="rounded-2xl border-2 border-ink bg-cream px-4 py-2">
            <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
              Images
            </div>
            <div className="text-xl font-bold tabular-nums">
              {data.images.toLocaleString()}
            </div>
          </div>
          <div className="rounded-2xl border-2 border-ink bg-cream px-4 py-2">
            <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
              Videos
            </div>
            <div className="text-xl font-bold tabular-nums">
              {data.videos.toLocaleString()}
            </div>
          </div>
          <div className="rounded-2xl border-2 border-ink bg-cream px-4 py-2">
            <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
              Total uploaded
            </div>
            <div className="text-xl font-bold tabular-nums">
              {formatBytes(data.totalBytes)}
            </div>
          </div>
        </div>

        {data.media.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {data.media.slice(0, 16).map((m, i) => (
              <figure
                key={i}
                className="relative aspect-square overflow-hidden rounded-xl border-2 border-ink bg-ink/10"
              >
                {m.kind === "video" ? (
                  m.url ? (
                    <video
                      src={m.url}
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-serif text-2xl italic opacity-60">
                        ▶
                      </span>
                    </div>
                  )
                ) : (
                  <Cover
                    src={m.url}
                    alt="upload"
                    fallback="◇"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <span className="absolute top-2 left-2 rounded-full bg-ink px-2 py-0.5 font-mono text-[10px] tracking-widest text-wrap-mint uppercase">
                  {m.kind}
                </span>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
