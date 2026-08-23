/**
 * Website mockups for Chapter 06, composed from the brand's own assets.
 *
 * Not AI-generated, for one reason: a website mockup is a document a client
 * READS — nav labels, buttons, prices, a checkout form — and in-image UI text
 * is exactly what image models garble. So the chrome is drawn as SVG with
 * real type, and the approved carton, sachet and campaign photographs are
 * composited into it with sharp. Every word on these screens is spelled the
 * way it was typed here; every product picture is the one from Chapter 03.
 *
 * Four plates → public/images/06-website/:
 *   hero          brand site, desktop, home
 *   brand-range   brand site, desktop, the range
 *   shop-product  the shop, desktop, a product page
 *   shop-mobile   the shop, two phones: cart and checkout
 *
 * Coordinates are authored at 1520x1024 and rendered at 1.5x (2280x1536), the
 * same grid as every other hero on the site. Prices on the mock screens are
 * placeholders and the chapter says so.
 *
 *   node scripts/build-website-mockups.mjs
 */
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IMG = path.join(ROOT, "public", "images");
const OUT = path.join(IMG, "06-website");

const S = 1.5; // author at 1520x1024, render at 2280x1536
const W = 1520, H = 1024;

const PLUM = "#15101A", PLUM2 = "#1E1826", PLUM3 = "#26202F";
const BONE = "#F4F0F7", BONE2 = "#B7ADC3", BONE3 = "#877D95";
const AMBER = "#F5B44C";
const LINE = "rgba(244,240,247,.12)";

const SANS = "Segoe UI, Helvetica Neue, Arial, sans-serif";
const MONO = "Consolas, IBM Plex Mono, monospace";

const RANGE = [
  ["HUGO AGAIN", "hugo · elderflower + mint", "#4FBE8F", "01-hugo-again"],
  ["SALTY RITA", "margarita · lime, agave, salt", "#A8CE2E", "02-salty-rita"],
  ["LIMON-CHILL", "limoncello · lemon", "#F2C230", "03-limon-chill"],
  ["PALOMA MIA", "paloma · grapefruit + salt", "#F4713C", "04-paloma-mia"],
  ["BLUE HULA", "blue hawaii · pineapple + coconut", "#2E9BD6", "05-blue-hula"],
  ["BRAMBLE ON", "bramble · blackberry + lemon", "#7B3FA0", "06-bramble-on"],
  ["NOGRONI", "negroni · bitter orange + botanicals", "#B01E3C", "07-nogroni"],
];

/* ── SVG helpers (all in 1520x1024 author space) ───────────────────── */

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const text = (x, y, str, { size = 14, fill = BONE, weight = 400, font = SANS, ls = 0, anchor = "start", rtl = false } = {}) =>
  `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}" letter-spacing="${ls}" text-anchor="${anchor}"${rtl ? ' direction="rtl"' : ""}>${esc(str)}</text>`;

const label = (x, y, str, fill = BONE3, size = 11, anchor = "start") =>
  text(x, y, str, { size, fill, font: MONO, ls: 2.2, anchor });

const display = (x, y, str, size, fill = BONE) =>
  text(x, y, str, { size, fill, weight: 800, ls: -size * 0.02 });

// A pill is requested as rx=999 and meant to clamp to a true stadium shape
// (flat top/bottom, semicircular ends) — but SVG's per-axis rx/ry clamping
// isn't applied consistently by every renderer, and an unclamped huge radius
// on a short-and-wide rect draws full elliptical corners that meet in the
// middle: a lens, not a pill. Clamping here, once, makes every pill and the
// browser's url bar render as an actual stadium regardless of backend.
const rect = (x, y, w, h, fill, r = 0, stroke = "") => {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2));
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rr}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="1"` : ""}/>`;
};

const spectrum = (x, y, w, h = 3) =>
  RANGE.map(([, , c], i) => rect(x + (w / 7) * i, y, w / 7, h, c)).join("");

const button = (x, y, w, h, str, { fill = BONE, color = PLUM } = {}) =>
  rect(x, y, w, h, fill, 999) + text(x + w / 2, y + h / 2 + 4.5, str, { size: 12, fill: color, weight: 600, font: MONO, ls: 1.8, anchor: "middle" });

const ghostButton = (x, y, w, h, str) =>
  rect(x, y, w, h, "none", 999, "rgba(244,240,247,.35)") + text(x + w / 2, y + h / 2 + 4.5, str, { size: 12, fill: BONE, weight: 500, font: MONO, ls: 1.8, anchor: "middle" });

/** The clink, scaled to a box. */
const clink = (x, y, size, color = BONE) =>
  `<g transform="translate(${x},${y}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round">
    <path d="M8.6 21 10.9 5.6"/><path d="M15.4 21 13.1 5.6"/>
    <path d="M12 1.4v1.7" stroke-width="1.5"/><path d="M9.9 2.5l1 1.2" stroke-width="1.5"/><path d="M14.1 2.5l-1 1.2" stroke-width="1.5"/>
  </g>`;

/** Desktop browser chrome. Returns svg + the page box. */
function browser(url) {
  const x = 80, y = 60, w = W - 160, h = H - 120, bar = 40;
  const svg =
    rect(x, y, w, h, PLUM2, 14, "rgba(244,240,247,.16)") +
    rect(x, y, w, bar, PLUM3, 14) + rect(x, y + bar - 14, w, 14, PLUM3) +
    ["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => `<circle cx="${x + 22 + i * 18}" cy="${y + bar / 2}" r="5.5" fill="${c}" opacity=".85"/>`).join("") +
    rect(x + 90, y + 10, w - 180, bar - 20, PLUM, 999) +
    text(x + w / 2, y + bar / 2 + 4, url, { size: 11, fill: BONE3, font: MONO, anchor: "middle", ls: 1 });
  return { svg, page: { x, y: y + bar, w, h: h - bar } };
}

/** Site nav inside a page box. */
function nav(p, { dark = true, active = "" } = {}) {
  const y = p.y + 34;
  const items = ["THE RANGE", "1AM / 9AM", "STOCKISTS"];
  let s = display(p.x + 48, y + 8, "SAHTEIIN", 22);
  s += clink(p.x + 48 + 118 + 6, y - 12, 20, AMBER);
  let ix = p.x + p.w / 2 - 120;
  for (const it of items) {
    s += text(ix, y + 4, it, { size: 11, fill: it === active ? BONE : BONE2, font: MONO, ls: 2 });
    ix += it.length * 8.2 + 38;
  }
  s += text(p.x + p.w - 48, y + 8, "صحتين", { size: 20, fill: BONE, anchor: "end", rtl: true });
  s += rect(p.x, y + 26, p.w, 1, LINE);
  return s;
}

/* ── raster helpers ─────────────────────────────────────────────────── */

async function roundedImage(file, w, h, r) {
  const buf = await sharp(path.join(IMG, file)).resize(Math.round(w * S), Math.round(h * S), { fit: "cover" }).png().toBuffer();
  const mask = Buffer.from(`<svg width="${Math.round(w * S)}" height="${Math.round(h * S)}"><rect width="100%" height="100%" rx="${r * S}" fill="#fff"/></svg>`);
  return sharp(buf).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
}

async function render(name, svgBody, images) {
  await mkdir(OUT, { recursive: true });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W * S}" height="${H * S}" viewBox="0 0 ${W} ${H}">
    <rect width="${W}" height="${H}" fill="${PLUM}"/>${svgBody}</svg>`;
  let img = sharp(Buffer.from(svg)).png();
  const layers = [];
  for (const im of images) {
    layers.push({ input: await roundedImage(im.file, im.w, im.h, im.r ?? 0), left: Math.round(im.x * S), top: Math.round(im.y * S) });
  }
  // images first, then chrome-over-image bits (none needed here) — so draw images above base svg
  const base = await img.toBuffer();
  const out = await sharp(base).composite(layers).webp({ quality: 82, effort: 5 }).toFile(path.join(OUT, `${name}.webp`));
  console.log(`→ public/images/06-website/${name}.webp  (${out.width}x${out.height})`);
}

/* ── Plate 1: brand site — home ─────────────────────────────────────── */
async function heroPlate() {
  const { svg: chrome, page: p } = browser("sahteiin.com");
  let s = chrome + nav(p);
  const lx = p.x + 48, ty = p.y + 150;
  s += label(lx, ty, "ELECTROLYTE STICKS · BEIRUT", AMBER);
  s += display(lx, ty + 64, "TO YOUR", 54);
  s += display(lx, ty + 122, "HEALTH,", 54);
  s += display(lx, ty + 180, "TWICE.", 54);
  const copy = ["Seven cocktail flavours of electrolytes in a stick.", "One for 1AM. One for 9AM. Hydration with the", "manners of a bar, not a gym."];
  copy.forEach((l, i) => (s += text(lx, ty + 226 + i * 24, l, { size: 15, fill: BONE2 })));
  s += button(lx, ty + 316, 176, 42, "FIND A STOCKIST");
  s += ghostButton(lx + 190, ty + 316, 150, 42, "THE RANGE");
  s += spectrum(lx, p.y + p.h - 70, 420, 3);
  s += label(lx, p.y + p.h - 40, "SAY IT BEFORE. SAY IT AFTER.");
  const img = { file: "00-toast/hero.webp", x: p.x + p.w / 2 + 10, y: p.y + 100, w: p.w / 2 - 58, h: p.h - 150, r: 18 };
  await render("hero", s, [img]);
}

/* ── Plate 2: brand site — the range ────────────────────────────────── */
async function rangePlate() {
  const { svg: chrome, page: p } = browser("sahteiin.com/range");
  let s = chrome + nav(p, { active: "THE RANGE" });
  s += label(p.x + 48, p.y + 110, "THE RANGE · SEVEN YOU CAN SPOT ACROSS THE ROOM", AMBER);
  s += display(p.x + 48, p.y + 156, "SEVEN ACROSS THE ROOM", 34);
  const cardW = 158, cardH = 236, gap = 18, cols = 7;
  const gridW = cols * cardW + (cols - 1) * gap;
  const gx = p.x + (p.w - gridW) / 2, gy = p.y + 200;
  const images = [];
  RANGE.forEach(([name, desc, color, file], i) => {
    const x = gx + i * (cardW + gap);
    s += rect(x, gy, cardW, cardH + 78, PLUM3, 12);
    images.push({ file: `03-packaging/gallery/${file}.webp`, x: x + 8, y: gy + 8, w: cardW - 16, h: cardH - 16, r: 8 });
    s += rect(x + 12, gy + cardH + 6, 24, 3, color);
    s += text(x + 12, gy + cardH + 30, name, { size: 12, fill: BONE, weight: 700, ls: 0.5 });
    const d = desc.length > 24 ? desc.slice(0, 23) + "…" : desc;
    s += text(x + 12, gy + cardH + 48, d, { size: 10, fill: BONE3 });
    s += text(x + 12, gy + cardH + 66, "14 SACHETS", { size: 9, fill: BONE3, font: MONO, ls: 1.5 });
  });
  await render("brand-range", s, images);
}

/* ── Plate 3: the shop — product page ───────────────────────────────── */
async function productPlate() {
  const { svg: chrome, page: p } = browser("shop.sahteiin.com/nogroni");
  let s = chrome + nav(p, { active: "THE RANGE" });
  // cart pill
  s += ghostButton(p.x + p.w - 200, p.y + 18, 62, 30, "CART · 1");
  const ix = p.x + 48, iy = p.y + 92, iw = 380, ih = p.h - 140;
  const rx = ix + iw + 56, ry = p.y + 130;
  s += label(rx, ry, "NEGRONI · BITTER ORANGE + BOTANICALS", "#B01E3C");
  s += display(rx, ry + 58, "NOGRONI", 58);
  s += text(rx, ry + 96, "The one you say no to at 1AM and yes to at 9AM.", { size: 15, fill: BONE2 });
  s += text(rx, ry + 120, "Bitter orange, gentle botanicals, 14 sachets to a box.", { size: 15, fill: BONE2 });
  // flavour dots
  RANGE.forEach(([, , c], i) => {
    const cx = rx + 10 + i * 30;
    s += `<circle cx="${cx}" cy="${ry + 166}" r="9" fill="${c}"${i === 6 ? ` stroke="${BONE}" stroke-width="2"` : ""}/>`;
  });
  s += label(rx, ry + 200, "PICK YOUR ROUND");
  // price row (placeholder)
  s += rect(rx, ry + 228, 420, 1, LINE);
  s += display(rx, ry + 272, "$18", 34);
  s += text(rx + 72, ry + 272, "· 14 SACHETS · placeholder price", { size: 11, fill: BONE3, font: MONO, ls: 1.5 });
  // quantity + add
  s += rect(rx, ry + 300, 110, 44, "none", 999, "rgba(244,240,247,.35)");
  s += text(rx + 24, ry + 328, "−", { size: 18, fill: BONE });
  s += text(rx + 55, ry + 328, "1", { size: 15, fill: BONE, anchor: "middle", weight: 600 });
  s += text(rx + 78, ry + 328, "+", { size: 18, fill: BONE });
  s += button(rx + 124, ry + 300, 190, 44, "ADD TO CART");
  s += label(rx, ry + 384, "DELIVERY ACROSS LEBANON · CARD OR CASH ON DELIVERY");
  s += label(rx, ry + 406, "TWO TO THREE DAYS · BEIRUT NEXT DAY");
  s += spectrum(rx, ry + 440, 320, 3);
  const images = [{ file: "03-packaging/gallery/07-nogroni.webp", x: ix, y: iy, w: iw, h: ih, r: 16 }];
  await render("shop-product", s, images);
}

/* ── Plate 4: the shop — cart & checkout on mobile ──────────────────── */
async function mobilePlate() {
  const phoneW = 330, phoneH = 700, py = (H - phoneH) / 2;
  const px1 = W / 2 - phoneW - 50, px2 = W / 2 + 50;
  let s = "";
  const images = [];

  const phone = (x, title) => {
    let q = rect(x - 10, py - 10, phoneW + 20, phoneH + 20, PLUM3, 38, "rgba(244,240,247,.18)");
    q += rect(x, py, phoneW, phoneH, PLUM2, 30);
    q += rect(x + phoneW / 2 - 40, py + 12, 80, 20, PLUM, 999); // notch
    q += display(x + 22, py + 70, "SAHTEIIN", 16);
    q += clink(x + 22 + 86 + 4, py + 55, 15, AMBER);
    q += text(x + phoneW - 22, py + 70, "صحتين", { size: 15, fill: BONE, anchor: "end", rtl: true });
    q += rect(x, py + 86, phoneW, 1, LINE);
    q += label(x + 22, py + 116, title, AMBER);
    return q;
  };

  // Phone 1 — cart
  s += phone(px1, "YOUR CART · 2");
  const rows = [["NOGRONI", "14 sachets", "$18", "07-nogroni"], ["BLUE HULA", "14 sachets", "$18", "05-blue-hula"]];
  rows.forEach(([n, d, pr, f], i) => {
    const y = py + 140 + i * 98;
    s += rect(px1 + 22, y, phoneW - 44, 84, PLUM3, 12);
    images.push({ file: `03-packaging/gallery/${f}.webp`, x: px1 + 30, y: y + 8, w: 50, h: 68, r: 8 });
    s += text(px1 + 94, y + 32, n, { size: 13, fill: BONE, weight: 700 });
    s += text(px1 + 94, y + 50, d, { size: 11, fill: BONE3 });
    s += text(px1 + phoneW - 34, y + 32, pr, { size: 13, fill: BONE, weight: 600, anchor: "end" });
    s += text(px1 + 94, y + 70, "−   1   +", { size: 12, fill: BONE2, font: MONO });
  });
  const sy = py + 360;
  s += rect(px1 + 22, sy, phoneW - 44, 1, LINE);
  [["Subtotal", "$36"], ["Delivery · Beirut", "$3"], ["Total", "$39"]].forEach(([k, v], i) => {
    const y = sy + 28 + i * 26;
    s += text(px1 + 22, y, k, { size: 12, fill: i === 2 ? BONE : BONE2, weight: i === 2 ? 700 : 400 });
    s += text(px1 + phoneW - 22, y, v, { size: 12, fill: BONE, weight: 600, anchor: "end" });
  });
  s += label(px1 + 22, sy + 116, "PLACEHOLDER PRICES", BONE3, 9);
  s += button(px1 + 22, py + phoneH - 76, phoneW - 44, 46, "CHECKOUT");

  // Phone 2 — checkout
  s += phone(px2, "CHECKOUT · DELIVERY");
  const field = (y, lab, val) => {
    let q = label(px2 + 22, y, lab, BONE3, 9);
    q += rect(px2 + 22, y + 8, phoneW - 44, 38, PLUM, 9, "rgba(244,240,247,.18)");
    q += text(px2 + 34, y + 32, val, { size: 12, fill: BONE });
    return q;
  };
  s += field(py + 140, "NAME", "Nour Haddad");
  s += field(py + 200, "PHONE", "+961 3 000 000");
  s += field(py + 260, "ADDRESS", "Mar Mikhael, Armenia Street");
  s += field(py + 320, "CITY", "Beirut");
  s += label(px2 + 22, py + 396, "PAYMENT", BONE3, 9);
  const pay = (y, str, on) => rect(px2 + 22, y, phoneW - 44, 40, on ? PLUM3 : PLUM, 9, on ? AMBER : "rgba(244,240,247,.18)") + text(px2 + 34, y + 25, str, { size: 12, fill: BONE }) + (on ? `<circle cx="${px2 + phoneW - 40}" cy="${y + 20}" r="5" fill="${AMBER}"/>` : "");
  s += pay(py + 406, "Cash on delivery", true);
  s += pay(py + 454, "Card", false);
  s += button(px2 + 22, py + phoneH - 76, phoneW - 44, 46, "PLACE ORDER · $39");

  s += label(W / 2, H - 40, "THE SHOP · CART AND CHECKOUT · MOBILE", BONE3, 11, "middle");
  await render("shop-mobile", s, images);
}

await heroPlate();
await rangePlate();
await productPlate();
await mobilePlate();
