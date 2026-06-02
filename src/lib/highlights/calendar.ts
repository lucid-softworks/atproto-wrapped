import type { RepoRecord } from "../atproto";

export type CalendarEventLink = {
  uri: string;
  name?: string;
};

export type CalendarEvent = {
  name: string;
  description?: string;
  mode?: string;
  status?: string;
  startsAt: Date | null;
  endsAt: Date | null;
  timezone?: string;
  uris: CalendarEventLink[];
  vodAtUri?: string;
  createdAt: Date | null;
  createdWith?: string;
};

export type CalendarRsvp = {
  status: string;
  eventUri?: string;
  eventDid?: string;
  eventRkey?: string;
  createdAt: Date | null;
};

export type CalendarHighlights = {
  eventsCreated: number;
  rsvps: number;
  rsvpsByStatus: Map<string, number>;
  events: CalendarEvent[];
  recentRsvps: CalendarRsvp[];
};

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function parseDate(v: unknown): Date | null {
  if (typeof v !== "string") return null;
  const t = Date.parse(v);
  return Number.isNaN(t) ? null : new Date(t);
}

function stripFragmentPrefix(value: string): string {
  const idx = value.indexOf("#");
  if (idx === -1) return value;
  return value.slice(idx + 1);
}

function parseAtUri(
  uri: string,
): { did?: string; rkey?: string } {
  // at://did:plc:.../collection/rkey
  if (!uri.startsWith("at://")) return {};
  const rest = uri.slice("at://".length);
  const parts = rest.split("/");
  const did = parts[0];
  const rkey = parts[2];
  return { did, rkey };
}

export function getCalendarHighlights(
  byCollection: Map<string, RepoRecord[]>,
): CalendarHighlights | null {
  const eventRecords =
    byCollection.get("community.lexicon.calendar.event") ?? [];
  const rsvpRecords =
    byCollection.get("community.lexicon.calendar.rsvp") ?? [];
  if (eventRecords.length === 0 && rsvpRecords.length === 0) return null;

  const events: CalendarEvent[] = eventRecords.map((r) => {
    const v = r.value;
    const rawUris = Array.isArray(v.uris) ? v.uris : [];
    const uris: CalendarEventLink[] = [];
    for (const u of rawUris) {
      if (!u || typeof u !== "object") continue;
      const uo = u as Record<string, unknown>;
      const uri = strOrNull(uo.uri);
      if (!uri) continue;
      uris.push({ uri, name: strOrUndef(uo.name) });
    }

    const modeRaw = strOrUndef(v.mode);
    const statusRaw = strOrUndef(v.status);
    const additional = v.additionalData as
      | Record<string, unknown>
      | undefined;
    const vodAtUri = additional
      ? strOrUndef(additional.vodAtUri)
      : undefined;

    return {
      name:
        strOrNull(v.name) ??
        strOrNull(v.title) ??
        strOrNull(v.text) ??
        "Untitled event",
      description: strOrUndef(v.description),
      mode: modeRaw ? stripFragmentPrefix(modeRaw) : undefined,
      status: statusRaw ? stripFragmentPrefix(statusRaw) : undefined,
      startsAt: parseDate(v.startsAt),
      endsAt: parseDate(v.endsAt),
      timezone: strOrUndef(v.timezone),
      uris,
      vodAtUri,
      createdAt: r.createdAt,
      createdWith: strOrUndef(v.createdWith),
    };
  });

  events.sort(
    (a, b) =>
      (b.startsAt?.getTime() ?? b.createdAt?.getTime() ?? 0) -
      (a.startsAt?.getTime() ?? a.createdAt?.getTime() ?? 0),
  );

  const rsvpsByStatus = new Map<string, number>();
  const rsvps: CalendarRsvp[] = rsvpRecords.map((r) => {
    const statusRaw =
      strOrNull(r.value.status) ?? "community.lexicon.calendar.rsvp#unknown";
    const short = stripFragmentPrefix(statusRaw) || "unknown";
    rsvpsByStatus.set(short, (rsvpsByStatus.get(short) ?? 0) + 1);

    const subject = r.value.subject as Record<string, unknown> | undefined;
    const eventUri = subject ? strOrUndef(subject.uri) : undefined;
    const { did, rkey } = eventUri ? parseAtUri(eventUri) : {};

    return {
      status: short,
      eventUri,
      eventDid: did,
      eventRkey: rkey,
      createdAt: r.createdAt,
    };
  });
  rsvps.sort(
    (a, b) =>
      (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0),
  );

  return {
    eventsCreated: eventRecords.length,
    rsvps: rsvpRecords.length,
    rsvpsByStatus,
    events: events.slice(0, 8),
    recentRsvps: rsvps.slice(0, 10),
  };
}
