import type { CosmikHighlights } from "../../lib/highlights/cosmik";
import { FeaturedRow } from "./_shared";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedCosmikSection({
  data,
  theme,
}: {
  data: CosmikHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "lime");
  const stats: Array<[string, string]> = [
    ["Collections", data.totalCollections.toLocaleString()],
    ["Connections", data.totalConnections.toLocaleString()],
  ];

  const connectionTypes = Array.from(data.connectionTypes.entries()).sort(
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
            Spotlight · Cosmik
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-lime uppercase">
            {data.totalCollections.toLocaleString()}{" "}
            {data.totalCollections === 1 ? "collection" : "collections"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Knowledge you've{" "}
          <span className="font-serif italic">grouped</span>.
        </h2>

        <div className="mt-8 flex flex-wrap gap-3">
          {stats.map(([k, v]) => (
            <div
              key={k}
              className="rounded-2xl border-2 border-ink bg-cream px-4 py-2"
            >
              <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                {k}
              </div>
              <div className="text-xl font-bold tabular-nums">{v}</div>
            </div>
          ))}
          {connectionTypes.map(([type, count]) => (
            <div
              key={type}
              className="rounded-2xl border-2 border-ink bg-cream px-4 py-2"
            >
              <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                {type}
              </div>
              <div className="text-xl font-bold tabular-nums">
                {count.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {data.collections.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Collections" />
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.collections.map((c) => (
                <li
                  key={c.uri}
                  className="rounded-2xl border-2 border-ink bg-cream p-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="line-clamp-2 font-semibold leading-tight">
                      {c.name}
                    </div>
                    {c.accessType && (
                      <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 font-mono text-[10px] tracking-widest text-cream uppercase">
                        {c.accessType.toLowerCase()}
                      </span>
                    )}
                  </div>
                  {c.description && (
                    <p className="mt-2 line-clamp-3 font-serif text-sm italic opacity-80">
                      {c.description}
                    </p>
                  )}
                  {c.collaborators > 0 && (
                    <div className="mt-2 font-mono text-[10px] tracking-widest opacity-55 uppercase">
                      {c.collaborators.toLocaleString()}{" "}
                      {c.collaborators === 1
                        ? "collaborator"
                        : "collaborators"}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
