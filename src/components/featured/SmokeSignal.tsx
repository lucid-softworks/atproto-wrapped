import { useQuery } from "@tanstack/react-query";
import type { SmokeSignalHighlights } from "../../lib/featured";
import { fetchRecordByUri } from "../../lib/highlights/_atUri";
import { sectionTheme, type SectionTheme } from "./_theme";

type RemoteEvent = {
  name: string;
  description?: string;
  startsAt: Date | null;
};

async function fetchEvents(uris: string[]): Promise<Map<string, RemoteEvent>> {
  const out = new Map<string, RemoteEvent>();
  await Promise.all(
    uris.map(async (uri) => {
      const v = await fetchRecordByUri<Record<string, unknown>>(uri);
      if (!v) return;
      const name =
        (typeof v.name === "string" && v.name) ||
        (typeof v.title === "string" && v.title) ||
        "Untitled event";
      const description =
        typeof v.description === "string" ? v.description : undefined;
      const startsAt =
        typeof v.startsAt === "string"
          ? new Date(Date.parse(v.startsAt))
          : null;
      out.set(uri, { name, description, startsAt });
    }),
  );
  return out;
}

function formatDateTime(d: Date): string {
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function FeaturedSmokeSignalSection({
  data,
  theme,
}: {
  data: SmokeSignalHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "red");
  const rsvpStats = Array.from(data.rsvpsByStatus.entries()).sort(
    (a, b) => b[1] - a[1],
  );

  const rsvpUris = data.recentRsvps
    .map((r) => r.eventUri)
    .filter((u): u is string => !!u);
  const eventsQuery = useQuery({
    queryKey: ["smokesignal-rsvp-events", rsvpUris],
    queryFn: () => fetchEvents(rsvpUris),
    enabled: rsvpUris.length > 0,
    staleTime: 1000 * 60 * 60,
  });
  const remoteEvents = eventsQuery.data ?? new Map<string, RemoteEvent>();

  return (
    <section className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}>
      <div className="grain absolute inset-0 opacity-[0.04]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest text-cream/70 uppercase">
            Spotlight · Smoke Signal
          </div>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          IRL <span className="font-serif italic">plans</span>.
        </h2>

        <div className="mt-8 flex flex-wrap gap-3">
          {data.eventsCreated > 0 && (
            <div className="rounded-2xl border-2 border-cream bg-wrap-red px-4 py-2">
              <div className="font-mono text-[10px] tracking-widest text-cream/70 uppercase">
                Events created
              </div>
              <div className="text-xl font-bold tabular-nums">
                {data.eventsCreated.toLocaleString()}
              </div>
            </div>
          )}
          {data.rsvps > 0 && (
            <div className="rounded-2xl border-2 border-cream bg-wrap-red px-4 py-2">
              <div className="font-mono text-[10px] tracking-widest text-cream/70 uppercase">
                RSVPs
              </div>
              <div className="text-xl font-bold tabular-nums">
                {data.rsvps.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {rsvpStats.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {rsvpStats.map(([status, count]) => (
              <span
                key={status}
                className="rounded-full border-2 border-cream bg-wrap-red px-3 py-1 font-mono text-xs tracking-wide uppercase"
              >
                <span className="font-semibold">{status}</span>
                <span className="ml-2 text-cream/70">
                  {count.toLocaleString()}
                </span>
              </span>
            ))}
          </div>
        )}

        {data.events.length > 0 && (
          <div className="mt-10">
            <div className="font-mono text-xs tracking-widest text-cream/65 uppercase">
              Events you hosted
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {data.events.map((e, i) => (
                <li
                  key={i}
                  className="rounded-xl border-2 border-cream bg-wrap-red p-3"
                >
                  <div className="font-semibold">{e.name}</div>
                  {e.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-cream/95">
                      {e.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.recentRsvps.length > 0 && (
          <div className="mt-10">
            <div className="font-mono text-xs tracking-widest text-cream/65 uppercase">
              Events you RSVP'd to
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.recentRsvps.map((r, i) => {
                const ev = r.eventUri ? remoteEvents.get(r.eventUri) : null;
                return (
                  <li
                    key={`${r.eventUri ?? "rsvp"}-${i}`}
                    className="flex flex-col gap-2 rounded-xl border-2 border-cream bg-wrap-red p-4"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="font-bold leading-tight">
                        {ev?.name ??
                          (eventsQuery.isLoading
                            ? "Loading…"
                            : "Unknown event")}
                      </div>
                      <span className="shrink-0 rounded-full border border-cream/60 px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase">
                        {r.status}
                      </span>
                    </div>
                    {ev?.description && (
                      <p className="line-clamp-2 text-sm text-cream/95">
                        {ev.description}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-cream/70">
                      {ev?.startsAt && (
                        <span>{formatDateTime(ev.startsAt)}</span>
                      )}
                      {r.createdAt && (
                        <span className="text-cream/55">
                          RSVP'd{" "}
                          {r.createdAt.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
