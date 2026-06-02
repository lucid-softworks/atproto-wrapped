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
  if (len <= 12) return 124;
  if (len <= 16) return 104;
  if (len <= 22) return 82;
  if (len <= 28) return 66;
  return 52;
}

export type OgServiceTile = {
  label: string;
  count: number;
  word: string;
};

export type OgPosterInput = {
  handle: string;
  collectionCount: number;
  services: string[];
  topServices: OgServiceTile[];
};

const TILE_THEME = {
  cobalt: { bg: "#1e4dff", fg: "#f1ead9", muted: "#d4ccb6" },
  mint: { bg: "#7df0b0", fg: "#0a0a0a", muted: "#1a4a2d" },
  orange: { bg: "#ff6a3d", fg: "#0a0a0a", muted: "#3d1f12" },
} as const;

function floatingTile(
  x: number,
  y: number,
  w: number,
  h: number,
  rotate: number,
  tile: OgServiceTile,
  theme: keyof typeof TILE_THEME,
): string {
  const t = TILE_THEME[theme];
  const cx = x + w / 2;
  const cy = y + h / 2;
  return `
  <g transform="rotate(${rotate} ${cx} ${cy})">
    <rect x="${x + 6}" y="${y + 6}" width="${w}" height="${h}" rx="16" fill="#0a0a0a" />
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${t.bg}" stroke="#0a0a0a" stroke-width="3" />
    <text x="${x + 18}" y="${y + 28}" font-family="JetBrains Mono, ui-monospace, monospace" font-size="11" letter-spacing="2" fill="${t.muted}">${esc(tile.label)}</text>
    <text x="${x + 18}" y="${y + 78}" font-family="Bricolage Grotesque, Arial Black, sans-serif" font-weight="800" font-size="40" letter-spacing="-1" fill="${t.fg}">${esc(tile.count.toLocaleString())}</text>
    <text x="${x + 18}" y="${y + 102}" font-family="Instrument Serif, Georgia, serif" font-style="italic" font-size="15" fill="${t.muted}">${esc(tile.word)}</text>
  </g>`;
}

function buildMarqueeSpans(services: string[]): string {
  if (services.length === 0) return "";
  // Mono-text width budget at ~14px / letter-spacing 3 fits roughly 80
  // characters across the W-120 canvas with a small right-margin.
  const MAX_CHARS = 80;
  const sep = "  ";
  const star = "•  ";
  let used = 0;
  const chosen: string[] = [];
  for (const s of services) {
    const piece = star + s.toUpperCase();
    const next = used + (chosen.length === 0 ? piece.length : piece.length + sep.length);
    if (next > MAX_CHARS) break;
    chosen.push(piece);
    used = next;
  }
  const remainder = services.length - chosen.length;
  const tail = remainder > 0 ? `${sep}+${remainder} more` : "";
  // Bullets get a lime accent; the rest stays cream.
  return (
    chosen
      .map(
        (piece) =>
          `<tspan fill="#d8ff4d">•</tspan><tspan>${esc(piece.slice(1))}</tspan>`,
      )
      .join(sep) + (tail ? `<tspan opacity="0.6">${esc(tail)}</tspan>` : "")
  );
}

export function buildOgPosterSvg(input: OgPosterInput): string {
  const handle = `@${input.handle}`;
  const handleSize = fitHandleSize(handle);

  const topBarY = 82;
  const dividerY = 116;
  const eyebrowY = 184;
  const handleY = eyebrowY + handleSize + 10;
  const wrappedSize = 70;
  const wrappedY = handleY + wrappedSize + 2;
  const subtitleY = wrappedY + 38;

  const marqueeH = 56;
  const marqueeY = H - marqueeH;

  const subtitle = `${input.collectionCount.toLocaleString()} lexicons across the ATmosphere`;

  // Floating tiles on the right — positions, sizes, and rotations mirror
  // FloatingTiles in src/components/Landing.tsx so the OG card "rhymes"
  // with the landing page when someone clicks through.
  const tileW = 180;
  const tileH = 120;
  const tilePositions: Array<{ x: number; y: number; rotate: number }> = [
    { x: 960, y: 150, rotate: 6 },
    { x: 905, y: 290, rotate: -4 },
    { x: 980, y: 410, rotate: 3 },
  ];
  const tileThemes: Array<keyof typeof TILE_THEME> = [
    "cobalt",
    "mint",
    "orange",
  ];
  const tiles = input.topServices.slice(0, 3);
  const tilesSvg = tiles
    .map((tile, i) => {
      const pos = tilePositions[i];
      return floatingTile(
        pos.x,
        pos.y,
        tileW,
        tileH,
        pos.rotate,
        tile,
        tileThemes[i],
      );
    })
    .join("\n");

  const marqueeSpans = buildMarqueeSpans(input.services);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#f1ead9" />

  <!-- top bar -->
  <g transform="translate(60 ${topBarY})">
    <circle cx="9" cy="0" r="9" fill="#ff4d97" />
    <text x="28" y="6" font-family="JetBrains Mono, ui-monospace, monospace" font-size="18" font-weight="500" letter-spacing="2" fill="#0a0a0a">ATPROTO·WRAPPED</text>
    <text x="${W - 120}" y="6" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" letter-spacing="3" fill="#0a0a0a" opacity="0.5" text-anchor="end">ISSUE 01 · THE ATMOSPHERE EDITION</text>
  </g>
  <line x1="60" y1="${dividerY}" x2="${W - 60}" y2="${dividerY}" stroke="#0a0a0a" stroke-opacity="0.15" stroke-width="2" />

  <!-- eyebrow -->
  <text x="60" y="${eyebrowY}" font-family="Instrument Serif, Georgia, serif" font-style="italic" font-size="46" fill="#0a0a0a" opacity="0.7">A year of</text>

  <!-- giant handle -->
  <text x="60" y="${handleY}" font-family="Bricolage Grotesque, Arial Black, sans-serif" font-weight="800" font-size="${handleSize}" letter-spacing="-3" fill="#0a0a0a">${esc(handle)}</text>

  <!-- wrapped italic -->
  <text x="60" y="${wrappedY}" font-family="Instrument Serif, Georgia, serif" font-style="italic" font-size="${wrappedSize}" fill="#0a0a0a">wrapped.</text>

  <!-- subtitle -->
  <text x="60" y="${subtitleY}" font-family="JetBrains Mono, ui-monospace, monospace" font-size="16" letter-spacing="1" fill="#0a0a0a" opacity="0.65">${esc(subtitle)}</text>

  <!-- floating service tiles -->
  ${tilesSvg}

  <!-- marquee strip (matches Landing.tsx Marquee) -->
  <rect x="0" y="${marqueeY}" width="${W}" height="${marqueeH}" fill="#0a0a0a" />
  ${
    marqueeSpans
      ? `<text x="60" y="${marqueeY + 35}" font-family="JetBrains Mono, ui-monospace, monospace" font-size="14" letter-spacing="3" fill="#f1ead9">${marqueeSpans}</text>`
      : ""
  }
</svg>`;
}
