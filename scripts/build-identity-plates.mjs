/**
 * Builds Chapter 02's supporting plates from REAL VECTORS, not renders.
 *
 * The chapter's claim is "drawn, not described" — so its imagery has to be the
 * actual production artwork, drawn on the 24-unit grid, rather than an image
 * model's impression of it. Every render so far has turned the two-stroke clink
 * into literal champagne glasses; these plates are the corrective, and they are
 * the only images on the site that are true to the mark.
 *
 * Three plates:
 *   grid    — the clink on its 24-unit construction grid, clear space marked
 *   icons   — the seven flavour glyphs, one stroke weight, one grid
 *   palette — the masterbrand pair and the seven flavour colours, with hexes
 *
 * Latin type is Unbounded-ish geometric via system fallback; Arabic is set in a
 * system Arabic face, the same approach as the --arabic overlay. Run:
 *   node scripts/build-identity-plates.mjs
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "images", "02-identity");

const PLUM = "#15101A";
const BONE = "#F4F0F7";
const MUTED = "#877D95";
const AMBER = "#F5B44C";

const FLAVOURS = [
  ["HUGO AGAIN", "#4FBE8F"],
  ["SALTY RITA", "#A8CE2E"],
  ["LIMON-CHILL", "#F2C230"],
  ["PALOMA MIA", "#F4713C"],
  ["BLUE HULA", "#2E9BD6"],
  ["BRAMBLE ON", "#7B3FA0"],
  ["NOGRONI", "#B01E3C"],
];

const SANS = "Segoe UI, Helvetica Neue, Arial, sans-serif";
const MONO = "Consolas, IBM Plex Mono, monospace";

/** The clink, from the production paths on the 24-unit grid. */
const CLINK = `
  <g fill="none" stroke="${BONE}" stroke-width="2.4" stroke-linecap="round">
    <path d="M8.6 21 10.9 5.6"/>
    <path d="M15.4 21 13.1 5.6"/>
    <path d="M12 1.4v1.7" stroke-width="1.5"/>
    <path d="M9.9 2.5l1 1.2" stroke-width="1.5"/>
    <path d="M14.1 2.5l-1 1.2" stroke-width="1.5"/>
  </g>`;

const label = (x, y, text, size = 15, fill = MUTED, anchor = "start") =>
  `<text x="${x}" y="${y}" font-family="${MONO}" font-size="${size}" fill="${fill}"
     letter-spacing="2.2" text-anchor="${anchor}">${text}</text>`;

async function png(svg, file, w, h) {
  await mkdir(OUT, { recursive: true });
  const dest = path.join(OUT, file);
  await sharp(Buffer.from(svg)).resize(w, h).webp({ quality: 82, effort: 5 }).toFile(dest);
  console.log(`→ public/images/02-identity/${file}  (${w}x${h})`);
}

/* ── Plate 1: the mark on its grid ─────────────────────────────────── */
async function gridPlate() {
  const W = 1520, H = 1024;
  const cell = 26;              // one grid unit in px
  const markUnits = 12;         // the mark occupies 12 of the 24 units
  const size = 24 * cell;       // the 24-unit box
  const ox = (W - size) / 2, oy = (H - size) / 2 + 10;

  let lines = "";
  for (let i = 0; i <= 24; i++) {
    const strong = i % 6 === 0;
    const c = strong ? "rgba(244,240,247,.30)" : "rgba(244,240,247,.13)";
    lines += `<line x1="${ox + i * cell}" y1="${oy}" x2="${ox + i * cell}" y2="${oy + size}" stroke="${c}" stroke-width="1"/>`;
    lines += `<line x1="${ox}" y1="${oy + i * cell}" x2="${ox + size}" y2="${oy + i * cell}" stroke="${c}" stroke-width="1"/>`;
  }

  // clear space = 3x stroke width, drawn as an amber keyline outside the mark
  const markPx = markUnits * cell;
  const pad = 2.4 * 3 * (markPx / 24);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="${PLUM}"/>
    ${lines}
    <rect x="${ox + (size - markPx) / 2 - pad}" y="${oy + (size - markPx) / 2 - pad}" width="${markPx + pad * 2}" height="${markPx + pad * 2}"
      fill="none" stroke="${AMBER}" stroke-width="1.5" stroke-dasharray="7 7" opacity=".75"/>
    <g transform="translate(${ox + (size - markUnits * cell) / 2},${oy + (size - markUnits * cell) / 2}) scale(${(markUnits * cell) / 24})">${CLINK}</g>
    ${label(ox + (size - markPx) / 2 - pad, oy + (size - markPx) / 2 - pad - 18, "CLEAR SPACE = STROKE WIDTH x 3", 15, AMBER)}
    ${label(ox, oy + size + 46, "THE CLINK / 24-UNIT GRID / 2.4 STROKE / ROUND CAPS")}
  </svg>`;
  await png(svg, "grid.webp", W, H);
}

/* ── Plate 2: the seven glyphs ─────────────────────────────────────── */
async function iconsPlate() {
  const icons = JSON.parse(
    await readFile(path.join(ROOT, "scripts", "assets", "icons.json"), "utf8")
  );
  const W = 1520, H = 1024;
  const cols = 4, box = 300, gapX = 40, gapY = 90;
  const gridW = cols * box + (cols - 1) * gapX;
  const ox = (W - gridW) / 2, oy = 150;

  let cells = "";
  icons.forEach((ic, i) => {
    const cx = ox + (i % cols) * (box + gapX);
    const cy = oy + Math.floor(i / cols) * (box + gapY);
    // recolour the extracted vector to bone, and scale its 24-unit box
    const inner = ic.svg
      .replace(/<svg[^>]*>/, "")
      .replace(/<\/svg>/, "")
      .replace(/currentColor/g, BONE);
    cells += `<rect x="${cx}" y="${cy}" width="${box}" height="${box}" rx="18"
        fill="rgba(244,240,247,.035)" stroke="rgba(244,240,247,.12)"/>
      <g transform="translate(${cx + box * 0.29},${cy + box * 0.29}) scale(${(box * 0.42) / 24})"
         fill="none" stroke="${BONE}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${inner}</g>
      ${label(cx + box / 2, cy + box + 34, ic.name.toUpperCase(), 15, MUTED, "middle")}`;
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="${PLUM}"/>
    ${label(ox, 86, "SEVEN GLYPHS / ONE GRID / ONE 1.75 STROKE / ROUND JOINS", 17, BONE)}
    ${cells}
  </svg>`;
  await png(svg, "icons.webp", W, H);
}

/* ── Plate 3: the colour system ────────────────────────────────────── */
async function palettePlate() {
  const W = 1520, H = 1024;
  const chipW = 168, chipH = 300, gap = 20;
  const rowW = FLAVOURS.length * chipW + (FLAVOURS.length - 1) * gap;
  const ox = (W - rowW) / 2;

  let chips = "";
  FLAVOURS.forEach(([name, hex], i) => {
    const x = ox + i * (chipW + gap);
    chips += `<rect x="${x}" y="440" width="${chipW}" height="${chipH}" rx="14" fill="${hex}"/>
      ${label(x, 780, hex.toUpperCase(), 15, MUTED)}
      ${label(x, 808, name, 14, BONE)}`;
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="${PLUM}"/>
    ${label(ox, 110, "MASTERBRAND", 17, BONE)}
    <rect x="${ox}" y="140" width="260" height="120" rx="14" fill="${PLUM}" stroke="rgba(244,240,247,.22)"/>
    ${label(ox + 16, 300, "#15101A  MIDNIGHT PLUM")}
    <rect x="${ox + 290}" y="140" width="260" height="120" rx="14" fill="${BONE}"/>
    ${label(ox + 306, 300, "#F4F0F7  BONE")}
    <rect x="${ox + 580}" y="140" width="260" height="120" rx="14" fill="${AMBER}"/>
    ${label(ox + 596, 300, "#F5B44C  AMBER / RIM LIGHT")}
    ${label(ox, 400, "THE RANGE / PRODUCT ONLY / NEVER THE MASTERBRAND", 17, BONE)}
    ${chips}
    ${label(ox, 900, "SPREAD ACROSS THE WHOLE WHEEL SO NO TWO STICKS CONFUSE AT ARM'S LENGTH")}
  </svg>`;
  await png(svg, "palette.webp", W, H);
}

await gridPlate();
await iconsPlate();
await palettePlate();
