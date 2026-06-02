const BSKY_APPVIEW = "https://public.api.bsky.app";
const BATCH_SIZE = 25;

type ProfileView = { did: string; handle?: string };

/**
 * Resolve DIDs → handles in bulk via app.bsky.actor.getProfiles.
 * Returns a Map keyed by DID. Missing/unresolvable DIDs are simply
 * absent from the map, so callers can fall back to a shortened DID.
 */
export async function resolveHandlesForDids(
  dids: string[],
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (dids.length === 0) return map;

  const batches: string[][] = [];
  for (let i = 0; i < dids.length; i += BATCH_SIZE) {
    batches.push(dids.slice(i, i + BATCH_SIZE));
  }

  await Promise.all(
    batches.map(async (batch) => {
      const params = new URLSearchParams();
      for (const did of batch) params.append("actors", did);
      const url = `${BSKY_APPVIEW}/xrpc/app.bsky.actor.getProfiles?${params}`;
      try {
        const res = await fetch(url);
        if (!res.ok) return;
        const data = (await res.json()) as { profiles?: ProfileView[] };
        for (const p of data.profiles ?? []) {
          if (p.handle) map.set(p.did, p.handle);
        }
      } catch {
        // Best-effort — UI falls back to the raw DID.
      }
    }),
  );

  return map;
}
