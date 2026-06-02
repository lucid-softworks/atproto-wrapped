import type { AtToDoHighlights } from "../../lib/highlights/attodo";
import { FeaturedRow } from "./_shared";
import { sectionTheme, type SectionTheme } from "./_theme";

export function FeaturedAtToDoSection({
  data,
  theme,
}: {
  data: AtToDoHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "cyan");
  const stats: Array<[string, string]> = [
    ["Lists", data.totalLists.toLocaleString()],
    ["Tasks", data.totalTasks.toLocaleString()],
    ["Completed", data.tasksCompleted.toLocaleString()],
  ];

  return (
    <section
      className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}
    >
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · AtToDo
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-cyan uppercase">
            {data.totalLists.toLocaleString()}{" "}
            {data.totalLists === 1 ? "list" : "lists"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          Your <span className="font-serif italic">to-do</span> trail.
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

        {data.lists.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Lists" />
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.lists.map((list, i) => (
                <li
                  key={`${list.uri}-${i}`}
                  className="rounded-2xl border-2 border-ink bg-cream p-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="line-clamp-2 font-semibold leading-tight">
                      {list.name}
                    </div>
                    <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 font-mono text-[10px] tracking-widest text-cream uppercase tabular-nums">
                      {list.tasks.length}
                    </span>
                  </div>
                  {list.description && (
                    <p className="mt-1 line-clamp-2 font-serif text-sm italic opacity-75">
                      {list.description}
                    </p>
                  )}
                  {list.tasks.length > 0 && (
                    <ul className="mt-3 grid gap-1.5">
                      {list.tasks.slice(0, 6).map((task) => (
                        <li
                          key={task.uri}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span
                            className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 border-ink ${
                              task.completed ? "bg-ink text-cream" : "bg-cream"
                            }`}
                            aria-hidden
                          >
                            {task.completed ? (
                              <span className="text-[10px] leading-none">
                                ✓
                              </span>
                            ) : null}
                          </span>
                          <span
                            className={`min-w-0 truncate ${
                              task.completed
                                ? "line-through opacity-55"
                                : "opacity-90"
                            }`}
                          >
                            {task.title}
                          </span>
                        </li>
                      ))}
                      {list.tasks.length > 6 && (
                        <li className="font-mono text-[10px] tracking-widest opacity-55 uppercase">
                          + {list.tasks.length - 6} more
                        </li>
                      )}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.looseTasks.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Loose tasks" />
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {data.looseTasks.slice(0, 8).map((task) => (
                <li
                  key={task.uri}
                  className="flex items-start gap-2 rounded-xl border-2 border-ink bg-cream p-3 text-sm"
                >
                  <span
                    className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 border-ink ${
                      task.completed ? "bg-ink text-cream" : "bg-cream"
                    }`}
                    aria-hidden
                  >
                    {task.completed ? (
                      <span className="text-[10px] leading-none">✓</span>
                    ) : null}
                  </span>
                  <span
                    className={`min-w-0 truncate ${
                      task.completed
                        ? "line-through opacity-55"
                        : "opacity-90"
                    }`}
                  >
                    {task.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
