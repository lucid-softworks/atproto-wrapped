import { createFileRoute } from "@tanstack/react-router";
import { Resvg, initWasm } from "@resvg/resvg-wasm";
import resvgWasm from "@resvg/resvg-wasm/index_bg.wasm";
import {
  resolveHandle,
  getDidDocument,
  getPdsEndpoint,
} from "../../lib/atproto";
import { buildOgPosterSvg } from "../../lib/ogPoster";

let wasmInit: Promise<void> | null = null;
let fontBuffersPromise: Promise<Uint8Array[]> | null = null;

const FONT_URLS = [
  // Bricolage Grotesque (sans, used for the giant handle)
  "https://cdn.jsdelivr.net/gh/ateliertriay/bricolage@main/fonts/ttf/BricolageGrotesque-ExtraBold.ttf",
  // Instrument Serif Italic (for "A year of" + "wrapped.")
  "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/instrumentserif/InstrumentSerif-Italic.ttf",
  // JetBrains Mono (for header + service strip)
  "https://cdn.jsdelivr.net/gh/JetBrains/JetBrainsMono@master/fonts/ttf/JetBrainsMono-Medium.ttf",
];

async function ensureWasmInit(): Promise<void> {
  if (!wasmInit) {
    wasmInit = initWasm(resvgWasm as unknown as WebAssembly.Module).catch(
      (err: unknown) => {
        // Already-initialized is a no-op for our purposes (HMR reloads the
        // module wrapper but the underlying wasm survives).
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("Already initialized")) return;
        throw err;
      },
    );
  }
  await wasmInit;
}

async function loadFonts(): Promise<Uint8Array[]> {
  if (!fontBuffersPromise) {
    fontBuffersPromise = Promise.all(
      FONT_URLS.map(async (url) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`font load failed: ${url} ${res.status}`);
        return new Uint8Array(await res.arrayBuffer());
      }),
    );
  }
  return fontBuffersPromise;
}

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

async function renderPng(handle: string): Promise<Uint8Array> {
  const did = await resolveHandle(handle);
  const didDoc = await getDidDocument(did);
  const pds = getPdsEndpoint(didDoc);
  const collections = await listCollections(pds, did);
  const services = collectionsToServices(collections);

  const svg = buildOgPosterSvg({
    handle,
    collectionCount: collections.length,
    services,
  });

  await ensureWasmInit();
  const fontBuffers = await loadFonts();

  const resvg = new Resvg(svg, {
    font: { fontBuffers, loadSystemFonts: false },
    fitTo: { mode: "width", value: 1200 },
  });
  return resvg.render().asPng();
}

type WorkerCaches = { default: Cache };

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

        const cache = (globalThis as unknown as { caches?: WorkerCaches })
          .caches?.default;
        const cacheKey = new Request(request.url, { method: "GET" });
        if (cache) {
          const hit = await cache.match(cacheKey);
          if (hit) return hit;
        }

        try {
          const png = await renderPng(handle);
          const response = new Response(png as BodyInit, {
            status: 200,
            headers: {
              "Content-Type": "image/png",
              "Cache-Control": "public, max-age=86400, s-maxage=86400",
            },
          });
          if (cache) {
            await cache.put(cacheKey, response.clone());
          }
          return response;
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          return new Response(`og render failed: ${message}`, { status: 500 });
        }
      },
    },
  },
});
