import { useQuery } from "@tanstack/react-query";
import type { CalendarHighlights } from "../../lib/highlights/calendar";
import { fetchRecordByUri, parseAtUri } from "../../lib/highlights/_atUri";
import { resolveHandlesForDids } from "../../lib/bskyProfiles";
import { sectionTheme, type SectionTheme } from "./_theme";

function formatDateTime(d: Date): string {
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function prettyMode(mode: string): string {
  if (mode === "inperson" || mode === "in_person" || mode === "in-person")
    return "in person";
  return mode;
}

type RemoteEvent = {
  name: string;
  description?: string;
  startsAt: Date | null;
  mode?: string;
  vodAtUri?: string;
};

function stripFragmentPrefix(value: string): string {
  const idx = value.indexOf("#");
  if (idx === -1) return value;
  return value.slice(idx + 1);
}

/**
 * Build a Streamplace watch URL from an at:// URI pointing at a
 * place.stream.video record. Streamplace URLs use the creator's handle:
 *   https://stream.place/<handle>/video/<rkey>
 * If we haven't resolved the creator's handle yet, fall back to the DID
 * (stream.place accepts both forms).
 */
function vodWatchUrl(
  atUri: string,
  handles: Map<string, string>,
): string | null {
  const parsed = parseAtUri(atUri);
  if (!parsed) return null;
  const handle = handles.get(parsed.did);
  const actor = handle ?? parsed.did;
  return `https://stream.place/${actor}/video/${parsed.rkey}`;
}

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
      const modeRaw = typeof v.mode === "string" ? v.mode : undefined;
      const mode = modeRaw ? stripFragmentPrefix(modeRaw) : undefined;
      const additional = v.additionalData as
        | Record<string, unknown>
        | undefined;
      const vodAtUri =
        additional && typeof additional.vodAtUri === "string"
          ? additional.vodAtUri
          : undefined;
      out.set(uri, { name, description, startsAt, mode, vodAtUri });
    }),
  );
  return out;
}

export function FeaturedCalendarSection({
  data,
  theme,
}: {
  data: CalendarHighlights;
  theme?: SectionTheme;
}) {
  const t = sectionTheme(theme ?? "violet");
  const rsvpStats = Array.from(data.rsvpsByStatus.entries()).sort(
    (a, b) => b[1] - a[1],
  );

  // Fetch the (up to 10) referenced events cross-PDS so we can show real
  // event names + descriptions instead of opaque DID/rkey pairs.
  const rsvpUris = data.recentRsvps
    .map((r) => r.eventUri)
    .filter((u): u is string => !!u);
  const eventsQuery = useQuery({
    queryKey: ["calendar-rsvp-events", rsvpUris],
    queryFn: () => fetchEvents(rsvpUris),
    enabled: rsvpUris.length > 0,
    staleTime: 1000 * 60 * 60,
  });
  const remoteEvents = eventsQuery.data ?? new Map<string, RemoteEvent>();

  // Collect every VOD creator DID we know about (both from hosted events
  // and from the cross-PDS RSVP'd events) and resolve them to handles so
  // we can build proper stream.place/<handle>/video/<rkey> URLs.
  const vodDids = Array.from(
    new Set(
      [
        ...data.events.map((e) => e.vodAtUri),
        ...Array.from(remoteEvents.values()).map((e) => e.vodAtUri),
      ]
        .filter((u): u is string => !!u)
        .map((u) => parseAtUri(u)?.did)
        .filter((d): d is string => !!d),
    ),
  );
  const vodHandlesQuery = useQuery({
    queryKey: ["calendar-vod-handles", vodDids],
    queryFn: () => resolveHandlesForDids(vodDids),
    enabled: vodDids.length > 0,
    staleTime: 1000 * 60 * 60,
  });
  const vodHandles = vodHandlesQuery.data ?? new Map<string, string>();

  return (
    <section
      className={`relative overflow-hidden border-b-2 border-ink ${t.bg} ${t.text}`}
    >
      <div className="grain absolute inset-0 opacity-[0.04]" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between gap-3">
          <div className="font-mono text-xs tracking-widest text-cream/70 uppercase">
            Spotlight · Calendar
          </div>
          <span className="rounded-full bg-cream px-3 py-1 font-mono text-xs tracking-widest text-wrap-violet uppercase">
            {data.eventsCreated.toLocaleString()} events
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          On the <span className="font-serif italic">calendar</span>.
        </h2>

        <div className="mt-8 flex flex-wrap gap-3">
          {data.eventsCreated > 0 && (
            <div className="rounded-2xl border-2 border-cream bg-wrap-violet px-4 py-2">
              <div className="font-mono text-[10px] tracking-widest text-cream/70 uppercase">
                Events
              </div>
              <div className="text-xl font-bold tabular-nums">
                {data.eventsCreated.toLocaleString()}
              </div>
            </div>
          )}
          {data.rsvps > 0 && (
            <div className="rounded-2xl border-2 border-cream bg-wrap-violet px-4 py-2">
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
                className="rounded-full border-2 border-cream bg-wrap-violet px-3 py-1 font-mono text-xs tracking-wide uppercase"
              >
                <span className="font-semibold">{status}</span>
                <span className="ml-2 text-cream/70 tabular-nums">
                  {count.toLocaleString()}
                </span>
              </span>
            ))}
          </div>
        )}

        {data.events.length > 0 && (
          <div className="mt-12">
            <div className="font-mono text-xs tracking-widest text-cream/65 uppercase">
              Events you hosted
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.events.map((e, i) => (
                <li
                  key={`${e.name}-${i}`}
                  className="flex flex-col gap-2 rounded-xl border-2 border-cream bg-wrap-violet p-4"
                >
                  <div className="font-bold leading-tight">{e.name}</div>
                  {e.description && (
                    <p className="line-clamp-3 text-sm text-cream/95">
                      {e.description}
                    </p>
                  )}
                  {e.startsAt && (
                    <div className="font-mono text-[11px] tracking-wide text-cream/70">
                      {formatDateTime(e.startsAt)}
                      {e.timezone && (
                        <span className="ml-1 text-cream/50">
                          · {e.timezone}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {e.mode && (
                      <span className="rounded-full border border-cream/60 px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase">
                        {prettyMode(e.mode)}
                      </span>
                    )}
                    {e.status && (
                      <span className="rounded-full border border-cream/60 px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase">
                        {e.status}
                      </span>
                    )}
                  </div>
                  {(e.uris.length > 0 || e.vodAtUri) && (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {e.uris.map((u, j) => (
                        <a
                          key={`${u.uri}-${j}`}
                          href={u.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border-2 border-cream bg-cream px-3 py-1 font-mono text-[10px] tracking-widest text-wrap-violet uppercase transition hover:bg-wrap-violet hover:text-cream"
                        >
                          {u.name ?? "Link"} ↗
                        </a>
                      ))}
                      {e.vodAtUri &&
                        (() => {
                          const watchUrl = vodWatchUrl(e.vodAtUri, vodHandles);
                          if (!watchUrl) return null;
                          return (
                            <a
                              key="vod"
                              href={watchUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full border-2 border-wrap-yellow bg-wrap-yellow px-3 py-1 font-mono text-[10px] tracking-widest text-ink uppercase transition hover:bg-wrap-violet hover:text-wrap-yellow"
                            >
                              ▶ Watch VOD ↗
                            </a>
                          );
                        })()}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.recentRsvps.length > 0 && (
          <div className="mt-12">
            <div className="font-mono text-xs tracking-widest text-cream/65 uppercase">
              Events you RSVP'd to
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.recentRsvps.map((r, i) => {
                const ev = r.eventUri ? remoteEvents.get(r.eventUri) : null;
                return (
                  <li
                    key={`${r.eventUri ?? "rsvp"}-${i}`}
                    className="flex flex-col gap-2 rounded-xl border-2 border-cream bg-wrap-violet p-4"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="font-bold leading-tight">
                        {ev?.name ??
                          (eventsQuery.isLoading ? "Loading…" : "Unknown event")}
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
                      {ev?.mode && (
                        <span className="rounded-full border border-cream/60 px-2 py-0.5 text-[10px] tracking-widest uppercase">
                          {prettyMode(ev.mode)}
                        </span>
                      )}
                      {r.createdAt && (
                        <span className="text-cream/55">
                          RSVP'd {formatDate(r.createdAt)}
                        </span>
                      )}
                    </div>
                    {ev?.vodAtUri &&
                      (() => {
                        const watchUrl = vodWatchUrl(ev.vodAtUri, vodHandles);
                        if (!watchUrl) return null;
                        return (
                          <a
                            href={watchUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex w-fit items-center rounded-full border-2 border-wrap-yellow bg-wrap-yellow px-3 py-1 font-mono text-[10px] tracking-widest text-ink uppercase transition hover:bg-wrap-violet hover:text-wrap-yellow"
                          >
                            ▶ Watch VOD ↗
                          </a>
                        );
                      })()}
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
