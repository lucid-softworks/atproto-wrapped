import { useQuery } from "@tanstack/react-query";
import type {
  SidetrailHighlights,
  SidetrailStop,
  SidetrailTrail,
} from "../../lib/highlights/sidetrail";
import { FeaturedRow } from "./_shared";

const PUBLIC_APPVIEW = "https://public.api.bsky.app";
const MAX_REFERENCED_TRAILS = 6;

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function parseAtUri(
  uri: string,
): { did: string; collection: string; rkey: string } | null {
  if (!uri.startsWith("at://")) return null;
  const rest = uri.slice("at://".length);
  const parts = rest.split("/");
  if (parts.length < 3) return null;
  return { did: parts[0], collection: parts[1], rkey: parts.slice(2).join("/") };
}

async function fetchTrail(uri: string): Promise<SidetrailTrail | null> {
  const parsed = parseAtUri(uri);
  if (!parsed) return null;
  const url = `${PUBLIC_APPVIEW}/xrpc/com.atproto.repo.getRecord?repo=${encodeURIComponent(
    parsed.did,
  )}&collection=${encodeURIComponent(
    parsed.collection,
  )}&rkey=${encodeURIComponent(parsed.rkey)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      uri?: string;
      value?: Record<string, unknown>;
    };
    const value = data.value ?? {};
    const rawStops = Array.isArray(value.stops) ? value.stops : [];
    const stops: SidetrailStop[] = rawStops.map((s) => {
      if (!s || typeof s !== "object") return {};
      const so = s as Record<string, unknown>;
      return {
        tid: strOrUndef(so.tid),
        title: strOrUndef(so.title),
        content: strOrUndef(so.content),
        buttonText: strOrUndef(so.buttonText),
      };
    });
    const createdAtRaw = value.createdAt;
    let createdAt: Date | null = null;
    if (typeof createdAtRaw === "string") {
      const t = Date.parse(createdAtRaw);
      if (!Number.isNaN(t)) createdAt = new Date(t);
    }
    return { uri, rkey: parsed.rkey, stops, createdAt };
  } catch {
    return null;
  }
}

async function fetchTrails(uris: string[]): Promise<SidetrailTrail[]> {
  const results = await Promise.all(uris.map(fetchTrail));
  return results.filter((t): t is SidetrailTrail => t !== null);
}

function TrailCard({ trail }: { trail: SidetrailTrail }) {
  return (
    <li className="rounded-2xl border-2 border-ink bg-cream p-4">
      <div className="flex items-baseline justify-between gap-3">
        <div className="font-mono text-[10px] tracking-widest opacity-55 uppercase">
          Trail
        </div>
        {trail.createdAt && (
          <div className="font-mono text-[10px] opacity-55">
            {trail.createdAt.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        )}
      </div>
      {trail.stops.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {trail.stops.slice(0, 6).map((s, j) => (
            <li
              key={`${trail.uri}-${j}`}
              className="flex gap-3 border-l-2 border-ink/30 pl-3"
            >
              <div className="min-w-0">
                {s.title && (
                  <div className="font-semibold leading-tight">{s.title}</div>
                )}
                {s.content && (
                  <div className="mt-1 line-clamp-2 font-serif text-sm italic opacity-80">
                    {s.content}
                  </div>
                )}
                {s.buttonText && (
                  <div className="mt-1 inline-block rounded-full border border-ink/40 px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase opacity-65">
                    {s.buttonText}
                  </div>
                )}
              </div>
            </li>
          ))}
          {trail.stops.length > 6 && (
            <li className="pl-3 font-mono text-[10px] opacity-55">
              + {trail.stops.length - 6} more stops
            </li>
          )}
        </ul>
      ) : (
        <div className="mt-3 font-mono text-[10px] opacity-55">(no stops)</div>
      )}
    </li>
  );
}

export function FeaturedSidetrailSection({
  data,
}: {
  data: SidetrailHighlights;
}) {
  const referencedUris = data.completedTrailUris.slice(0, MAX_REFERENCED_TRAILS);
  const walkedQuery = useQuery({
    queryKey: ["sidetrail-walked-trails", referencedUris],
    queryFn: () => fetchTrails(referencedUris),
    enabled: referencedUris.length > 0,
    staleTime: 1000 * 60 * 60,
  });
  const walkedTrails = walkedQuery.data ?? [];

  const stats: Array<[string, string]> = [
    ["Trails", data.totalTrails.toLocaleString()],
    ["Stops", data.totalStops.toLocaleString()],
  ];
  if (data.completions > 0) {
    stats.push(["Completions", data.completions.toLocaleString()]);
  }

  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-lime text-ink">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Sidetrail
          </div>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          <span className="font-serif italic">Trails</span> you've walked.
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
        </div>

        {data.trails.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Your trails" />
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.trails.map((t) => (
                <TrailCard key={t.uri} trail={t} />
              ))}
            </ul>
          </div>
        )}

        {referencedUris.length > 0 && (
          <div className="mt-12">
            <FeaturedRow label="Trails you've walked" />
            {walkedQuery.isLoading ? (
              <div className="mt-4 font-mono text-xs opacity-55">
                Loading trails from other PDSes…
              </div>
            ) : walkedTrails.length > 0 ? (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {walkedTrails.map((t) => (
                  <TrailCard key={t.uri} trail={t} />
                ))}
              </ul>
            ) : (
              <div className="mt-4 font-mono text-xs opacity-55">
                Couldn't load referenced trails.
              </div>
            )}
            {data.completedTrailUris.length > referencedUris.length && (
              <div className="mt-3 font-mono text-[10px] opacity-55">
                + {data.completedTrailUris.length - referencedUris.length} more
                completed trails not shown
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
