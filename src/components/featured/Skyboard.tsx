import type { SkyboardHighlights } from "../../lib/highlights/skyboard";
import { FeaturedRow } from "./_shared";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedSkyboardSection({
  data,
  theme,
}: {
  data: SkyboardHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "violet");
  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest text-cream/70 uppercase">
            Spotlight · Skyboard
          </div>
          <span className="rounded-full bg-cream px-3 py-1 font-mono text-xs tracking-widest text-wrap-violet uppercase">
            {data.totalBoards.toLocaleString()}{" "}
            {data.totalBoards === 1 ? "board" : "boards"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">kanbans</span>.
        </h2>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border-2 border-cream bg-wrap-violet p-5">
            <div className="font-mono text-[10px] tracking-widest text-cream/65 uppercase">
              Boards
            </div>
            <div className="mt-2 text-4xl font-bold tabular-nums">
              {data.totalBoards.toLocaleString()}
            </div>
          </div>
          <div className="rounded-2xl border-2 border-cream bg-wrap-violet p-5">
            <div className="font-mono text-[10px] tracking-widest text-cream/65 uppercase">
              Columns
            </div>
            <div className="mt-2 text-4xl font-bold tabular-nums">
              {data.totalColumns.toLocaleString()}
            </div>
          </div>
        </div>

        {data.boards.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Boards" />
            <ul className="mt-4 grid gap-4">
              {data.boards.map((board) => (
                <li
                  key={board.uri}
                  className="rounded-2xl border-2 border-cream bg-wrap-violet p-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="line-clamp-2 font-semibold leading-tight">
                      {board.name}
                    </div>
                    {board.permissionRules > 0 && (
                      <span className="shrink-0 rounded-full border border-cream/60 px-2 py-0.5 font-mono text-[10px] tracking-widest text-cream/80 uppercase tabular-nums">
                        {board.permissionRules}{" "}
                        {board.permissionRules === 1 ? "rule" : "rules"}
                      </span>
                    )}
                  </div>
                  {board.columns.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 overflow-x-auto sm:flex-nowrap">
                      {board.columns.map((col) => (
                        <div
                          key={`${board.uri}-${col.id ?? col.name}-${col.order}`}
                          className="min-w-[7.5rem] flex-1 rounded-xl border-2 border-cream bg-cream p-3 text-ink"
                        >
                          <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                            #{col.order + 1}
                          </div>
                          <div className="mt-1 truncate text-sm font-semibold">
                            {col.name}
                          </div>
                        </div>
                      ))}
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
