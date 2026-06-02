import type { StreamplaceHighlights } from "../../lib/featured";
import { FeaturedRow } from "./_shared";
import { relativeDate } from "../../lib/format";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedStreamplaceSection({
  data,
  theme,
}: {
  data: StreamplaceHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "cyan");
  const stats: Array<[string, string]> = [
    ["Streams", `${data.totalStreams.toLocaleString()}`],
    ["Chat messages", `${data.totalChats.toLocaleString()}`],
    [
      "Streamers chatted with",
      `${data.uniqueStreamersChatted.toLocaleString()}`,
    ],
  ];
  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Streamplace
          </div>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          On <span className="font-serif italic">stream</span>.
        </h2>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {stats.map(([k, v]) => (
            <div
              key={k}
              className="rounded-2xl border-2 border-ink bg-cream p-5"
            >
              <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                {k}
              </div>
              <div className="mt-2 text-4xl font-bold tabular-nums">{v}</div>
            </div>
          ))}
        </div>

        {data.streams.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Streams you started" />
            <ul className="mt-4 grid gap-2">
              {data.streams.map((s, i) => (
                <li
                  key={`${s.title}-${i}`}
                  className="flex items-center justify-between gap-4 rounded-xl border-2 border-ink bg-cream p-3"
                >
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{s.title}</div>
                    {s.createdAt && (
                      <div className="font-mono text-[11px] opacity-60">
                        {s.createdAt.toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    )}
                  </div>
                  {s.url && (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 rounded-full border border-ink bg-ink px-3 py-1 font-mono text-[10px] tracking-widest text-cream uppercase"
                    >
                      Open ↗
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.recentChats.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Recent things you said in chat" />
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {data.recentChats.map((c, i) => (
                <li
                  key={`${c.text}-${i}`}
                  className="rounded-xl border-2 border-ink bg-cream p-4"
                >
                  <p className="font-serif text-base italic">"{c.text}"</p>
                  <div className="mt-2 font-mono text-[10px] tracking-wide opacity-55">
                    in {c.streamer}'s stream
                    {c.createdAt && ` · ${relativeDate(c.createdAt)}`}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
