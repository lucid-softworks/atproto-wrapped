import { Resvg, initWasm } from "@resvg/resvg-wasm";
import resvgWasm from "@resvg/resvg-wasm/index_bg.wasm";

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

export async function rasterizeSvgToPng(svg: string): Promise<Uint8Array> {
  await ensureWasmInit();
  const fontBuffers = await loadFonts();
  const resvg = new Resvg(svg, {
    font: { fontBuffers, loadSystemFonts: false },
    fitTo: { mode: "width", value: 1200 },
  });
  return resvg.render().asPng();
}

type WorkerCaches = { default: Cache };

export function getWorkerCache(): Cache | undefined {
  return (globalThis as unknown as { caches?: WorkerCaches }).caches?.default;
}

export function ogCacheKey(
  slug: string,
  format: "png" | "svg",
  origin: string,
): Request {
  const cacheUrl = new URL(
    `/_og-cache/${encodeURIComponent(slug)}.${format}`,
    origin,
  );
  return new Request(cacheUrl.toString(), { method: "GET" });
}
