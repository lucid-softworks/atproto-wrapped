import { createFileRoute } from "@tanstack/react-router";
import { buildHomeOgSvg } from "../../lib/ogPoster";
import {
  getWorkerCache,
  ogCacheKey,
  rasterizeSvgToPng,
} from "../../lib/ogRender";

export const Route = createFileRoute("/og/")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const requestUrl = new URL(request.url);
        const format =
          requestUrl.searchParams.get("format") === "svg" ? "svg" : "png";

        const cache = getWorkerCache();
        const cacheKey = ogCacheKey("_home", format, requestUrl.origin);
        if (cache) {
          const hit = await cache.match(cacheKey);
          if (hit) return hit;
        }

        try {
          const svg = buildHomeOgSvg();
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
