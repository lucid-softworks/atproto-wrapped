import type { AtGuildsHighlights } from "../../lib/highlights/atguilds";
import { FeaturedRow } from "./_shared";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedAtGuildsSection({
  data,
  theme,
}: {
  data: AtGuildsHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "yellow");
  const stats: Array<[string, string]> = [
    ["Guilds led", data.guildsLed.toLocaleString()],
    ["Guilds joined", data.guildsJoined.toLocaleString()],
  ];

  return (
    <section
      className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}
    >
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Atguilds
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-yellow uppercase">
            {(data.guildsLed + data.guildsJoined).toLocaleString()}{" "}
            {data.guildsLed + data.guildsJoined === 1 ? "guild" : "guilds"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Guilds you{" "}
          <span className="font-serif italic">walk</span> with.
        </h2>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
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

        {data.guilds.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Guilds you lead" />
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {data.guilds.map((g) => (
                <li
                  key={g.uri}
                  className="rounded-xl border-2 border-ink bg-cream p-3"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="line-clamp-1 font-semibold leading-tight">
                      {g.name}
                    </div>
                    <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 font-mono text-[10px] tracking-widest text-wrap-yellow uppercase tabular-nums">
                      {g.memberCount}{" "}
                      {g.memberCount === 1 ? "member" : "members"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.claims.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Memberships claimed" />
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {data.claims.slice(0, 12).map((c) => (
                <li
                  key={c.uri}
                  className="rounded-xl border-2 border-ink bg-cream p-3"
                >
                  <div className="truncate font-mono text-xs opacity-80">
                    {c.guildUri ?? "(no guild)"}
                  </div>
                  {c.createdAt && (
                    <div className="mt-1 font-mono text-[10px] opacity-55">
                      {c.createdAt.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
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
