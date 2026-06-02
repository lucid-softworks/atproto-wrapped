import { useQuery } from "@tanstack/react-query";
import type { FledglingsHighlights } from "../../lib/highlights/fledglings";
import {
  fetchRecordByUri,
  parseAtUri,
  resolveDidToPds,
} from "../../lib/highlights/_atUri";
import { pickBlob, blobUrl } from "../../lib/highlights/_blob";

type RemoteCreature = {
  name?: string;
  imageUrl?: string;
  rkey: string;
};

function strOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

/**
 * Fetch each creature record off its owner's PDS and (if it has an image
 * blob) build a `com.atproto.sync.getBlob` URL against that same PDS.
 * Tries several common field names for both the display name and the image
 * blob since the lexicon may evolve.
 */
async function fetchCreatures(
  uris: string[],
): Promise<Map<string, RemoteCreature>> {
  const out = new Map<string, RemoteCreature>();
  await Promise.all(
    uris.map(async (uri) => {
      const parsed = parseAtUri(uri);
      if (!parsed) return;
      const v = await fetchRecordByUri<Record<string, unknown>>(uri);
      if (!v) return;

      const name =
        strOrUndef(v.name) ??
        strOrUndef(v.displayName) ??
        strOrUndef(v.title) ??
        strOrUndef(v.species);

      const blob =
        pickBlob(v.image) ??
        pickBlob(v.avatar) ??
        pickBlob(v.photo) ??
        pickBlob(v.picture);

      let imageUrl: string | undefined;
      if (blob) {
        const pds = await resolveDidToPds(parsed.did);
        if (pds) imageUrl = blobUrl(pds, parsed.did, blob);
      }

      out.set(uri, { name, imageUrl, rkey: parsed.rkey });
    }),
  );
  return out;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

const KIND_EMOJI: Record<string, string> = {
  clean: "🧼",
  water: "💧",
  feed: "🍽",
  pet: "🤲",
  play: "🎈",
  sleep: "💤",
};

function kindEmoji(kind: string): string {
  return KIND_EMOJI[kind] ?? "·";
}

export function FeaturedFledglingsSection({
  data,
}: {
  data: FledglingsHighlights;
}) {
  const kindEntries = Array.from(data.actionsByKind.entries()).sort(
    (a, b) => b[1] - a[1],
  );

  // Fetch the top-interacted creatures (cap at 12 for the grid).
  const topCreatures = data.creatureUris.slice(0, 12);
  const creatureUris = topCreatures.map((c) => c.uri);

  const creaturesQuery = useQuery({
    queryKey: ["fledglings-creatures", creatureUris],
    queryFn: () => fetchCreatures(creatureUris),
    enabled: creatureUris.length > 0,
    staleTime: 1000 * 60 * 60,
  });
  const creatures = creaturesQuery.data ?? new Map<string, RemoteCreature>();

  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-wrap-lime text-ink">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-24">
        <div className="flex items-center justify-between gap-3">
          <div className="font-mono text-xs tracking-widest uppercase opacity-70">
            Spotlight · Fledglings
          </div>
          <span className="rounded-full bg-ink px-3 py-1 font-mono text-xs tracking-widest text-wrap-lime uppercase">
            {data.totalActions.toLocaleString()}{" "}
            {data.totalActions === 1 ? "action" : "actions"}
          </span>
        </div>

        <h2 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.03em]">
          <span className="font-serif italic">Fledglings</span> you've tended.
        </h2>

        <div className="mt-8 flex flex-wrap gap-3">
          <div className="rounded-2xl border-2 border-ink bg-cream px-4 py-2">
            <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
              Total actions
            </div>
            <div className="text-xl font-bold tabular-nums">
              {data.totalActions.toLocaleString()}
            </div>
          </div>
          {kindEntries.map(([kind, count]) => (
            <div
              key={kind}
              className="rounded-2xl border-2 border-ink bg-cream px-4 py-2"
            >
              <div className="font-mono text-[10px] tracking-widest text-ink/55 uppercase">
                <span aria-hidden className="mr-1">
                  {kindEmoji(kind)}
                </span>
                {kind}
              </div>
              <div className="text-xl font-bold tabular-nums">
                {count.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {topCreatures.length > 0 && (
          <div className="mt-12">
            <div className="font-mono text-xs tracking-widest uppercase opacity-70">
              Creatures you've raised
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {topCreatures.map((c) => {
                const creature = creatures.get(c.uri);
                const label =
                  creature?.name ?? creature?.rkey ?? c.uri.split("/").pop() ?? "Creature";
                return (
                  <li
                    key={c.uri}
                    className="flex items-center gap-3 rounded-2xl border-2 border-ink bg-cream p-3"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-ink bg-wrap-lime">
                      {creature?.imageUrl ? (
                        <img
                          src={creature.imageUrl}
                          alt={label}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span aria-hidden className="text-2xl">
                          🐣
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-bold leading-tight">
                        {label}
                      </div>
                      <div className="mt-1 font-mono text-[11px] text-ink/60">
                        {c.actionCount.toLocaleString()}{" "}
                        {c.actionCount === 1 ? "action" : "actions"}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {data.recentActions.length > 0 && (
          <div className="mt-12">
            <div className="font-mono text-xs tracking-widest uppercase opacity-70">
              Recent actions
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {data.recentActions.map((action, i) => {
                const creature = creatures.get(action.subjectUri);
                const label =
                  creature?.name ??
                  creature?.rkey ??
                  action.subjectUri.split("/").pop() ??
                  "Creature";
                return (
                  <li
                    key={`${action.subjectUri}-${i}`}
                    className="flex items-center gap-2 rounded-xl border-2 border-ink bg-cream px-3 py-2"
                  >
                    <span
                      aria-hidden
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-wrap-lime text-sm"
                    >
                      {kindEmoji(action.kind)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-mono text-xs">
                        <span className="font-semibold">{action.kind}</span>
                        <span className="opacity-55"> · </span>
                        <span className="opacity-90">{label}</span>
                      </div>
                    </div>
                    {action.createdAt && (
                      <span className="shrink-0 font-mono text-[10px] text-ink/45">
                        {formatDate(action.createdAt)}
                      </span>
                    )}
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
