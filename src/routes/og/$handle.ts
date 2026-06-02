import { createFileRoute } from "@tanstack/react-router";
import {
  resolveHandle,
  getDidDocument,
  getPdsEndpoint,
} from "../../lib/atproto";
import { describeCollection } from "../../lib/labels";
import {
  buildOgPosterSvg,
  type OgServiceTile,
} from "../../lib/ogPoster";
import {
  getWorkerCache,
  ogCacheKey,
  rasterizeSvgToPng,
} from "../../lib/ogRender";

async function listCollections(pds: string, did: string): Promise<string[]> {
  const url = `${pds}/xrpc/com.atproto.repo.describeRepo?repo=${encodeURIComponent(did)}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = (await res.json()) as { collections?: string[] };
  return data.collections ?? [];
}

function collectionsToServices(collections: string[]): string[] {
  const services = new Set<string>();
  for (const nsid of collections) {
    const parts = nsid.split(".");
    if (parts.length >= 2) {
      services.add(parts.slice(0, 2).join("."));
    }
  }
  return Array.from(services).sort();
}

function buildTopServiceTiles(collections: string[]): OgServiceTile[] {
  // Group lexicons by service name (via describeCollection). We can't show
  // record counts here without a CAR fetch, so the tile reads as e.g.
  // "BLUESKY · 14 · lexicons" — the count and label are still personalized
  // to the handle's actual top services.
  const groups = new Map<string, number>();
  collections.forEach((nsid, idx) => {
    const d = describeCollection(nsid, idx);
    groups.set(d.service, (groups.get(d.service) ?? 0) + 1);
  });
  return Array.from(groups.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([service, count]) => ({
      label: service.toUpperCase(),
      count,
      word: count === 1 ? "lexicon" : "lexicons",
    }));
}

async function renderSvg(handle: string): Promise<string> {
  const did = await resolveHandle(handle);
  const didDoc = await getDidDocument(did);
  const pds = getPdsEndpoint(didDoc);
  const collections = await listCollections(pds, did);
  const services = collectionsToServices(collections);
  const topServices = buildTopServiceTiles(collections);
  return buildOgPosterSvg({
    handle,
    collectionCount: collections.length,
    services,
    topServices,
  });
}

export const Route = createFileRoute("/og/$handle")({
  server: {
    handlers: {
      GET: async ({
        params,
        request,
      }: {
        params: { handle: string };
        request: Request;
      }) => {
        const handle = params.handle.replace(/^@/, "").trim();
        if (!handle || handle.length > 64) {
          return new Response("invalid handle", { status: 400 });
        }

        const requestUrl = new URL(request.url);
        const format =
          requestUrl.searchParams.get("format") === "svg" ? "svg" : "png";

        const cache = getWorkerCache();
        const cacheKey = ogCacheKey(handle, format, requestUrl.origin);
        if (cache) {
          const hit = await cache.match(cacheKey);
          if (hit) return hit;
        }

        try {
          const svg = await renderSvg(handle);
          if (format === "svg") {
            const response = new Response(svg, {
              status: 200,
              headers: {
                "Content-Type": "image/svg+xml; charset=utf-8",
                "Cache-Control": "public, max-age=86400, s-maxage=86400",
              },
            });
            if (cache) await cache.put(cacheKey, response.clone());
            return response;
          }
          const png = await rasterizeSvgToPng(svg);
          const response = new Response(png as BodyInit, {
            status: 200,
            headers: {
              "Content-Type": "image/png",
              "Cache-Control": "public, max-age=86400, s-maxage=86400",
            },
          });
          if (cache) await cache.put(cacheKey, response.clone());
          return response;
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          return new Response(`og render failed: ${message}`, { status: 500 });
        }
      },
    },
  },
});
