const W = 1200;
const H = 630;

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fitHandleSize(handle: string): number {
  const len = handle.length + 1;
  if (len <= 12) return 130;
  if (len <= 16) return 108;
  if (len <= 22) return 84;
  if (len <= 28) return 68;
  return 52;
}

function buildServiceStrip(services: string[]): string {
  const MAX = 90;
  const chosen: string[] = [];
  let len = 0;
  for (const s of services) {
    const next = chosen.length === 0 ? s.length : len + 3 + s.length;
    if (next > MAX) break;
    chosen.push(s);
    len = next;
  }
  const remainder = services.length - chosen.length;
  const joined = chosen.join("  ·  ");
  const tail = remainder > 0 ? `   +${remainder} more` : "";
  return joined + tail;
}

export type OgPosterInput = {
  handle: string;
  collectionCount: number;
  services: string[];
};

export function buildOgPosterSvg(input: OgPosterInput): string {
  const handle = `@${input.handle}`;
  const handleSize = fitHandleSize(handle);
  const eyebrowY = 200;
  const handleY = eyebrowY + handleSize + 12;
  const wrappedSize = 76;
  const wrappedY = handleY + wrappedSize + 8;
  const subtitleY = wrappedY + 44;
  const stripY = H - 56;

  const subtitle = input.collectionCount
    ? `${input.collectionCount.toLocaleString()} lexicons across the ATmosphere`
    : "a year on the ATmosphere";

  const serviceStrip = buildServiceStrip(input.services);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#f1ead9" />

  <!-- decorative corner blocks (stay clear of the handle text area) -->
  <rect x="${W - 220}" y="${H - 200}" width="180" height="120" rx="14" fill="#d8ff4d" stroke="#0a0a0a" stroke-width="3" />
  <rect x="${W - 200}" y="180" width="140" height="90" rx="14" fill="#4dd4ff" stroke="#0a0a0a" stroke-width="3" />

  <!-- top bar -->
  <g transform="translate(60 90)">
    <circle cx="9" cy="0" r="9" fill="#ff4d97" />
    <text x="28" y="6" font-family="JetBrains Mono, ui-monospace, monospace" font-size="18" font-weight="500" letter-spacing="2" fill="#0a0a0a">ATPROTO·WRAPPED</text>
    <text x="${W - 120}" y="6" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" letter-spacing="2.5" fill="#0a0a0a" opacity="0.55" text-anchor="end">ISSUE 01</text>
  </g>
  <line x1="60" y1="124" x2="${W - 60}" y2="124" stroke="#0a0a0a" stroke-opacity="0.18" stroke-width="2" />

  <!-- eyebrow -->
  <text x="60" y="${eyebrowY}" font-family="Instrument Serif, Georgia, serif" font-style="italic" font-size="48" fill="#0a0a0a" opacity="0.7">A year of</text>

  <!-- handle giant -->
  <text x="60" y="${handleY}" font-family="Bricolage Grotesque, Arial Black, sans-serif" font-weight="800" font-size="${handleSize}" letter-spacing="-3" fill="#0a0a0a">${esc(handle)}</text>

  <!-- wrapped italic -->
  <text x="60" y="${wrappedY}" font-family="Instrument Serif, Georgia, serif" font-style="italic" font-size="${wrappedSize}" fill="#0a0a0a">wrapped.</text>

  <!-- subtitle -->
  <text x="60" y="${subtitleY}" font-family="JetBrains Mono, ui-monospace, monospace" font-size="20" fill="#0a0a0a" opacity="0.65" letter-spacing="1">${esc(subtitle)}</text>

  <!-- service strip -->
  ${
    serviceStrip
      ? `<text x="60" y="${stripY}" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" fill="#0a0a0a" opacity="0.7" letter-spacing="1.5">${esc(serviceStrip)}</text>`
      : ""
  }

  <!-- corner mark -->
  <circle cx="${W - 80}" cy="${stripY - 6}" r="6" fill="#0a0a0a" />
</svg>`;
}
