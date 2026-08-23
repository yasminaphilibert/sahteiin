/**
 * Candidate generator + curator for the shot list in image-manifest.mjs.
 *
 * The fal queue is three plain HTTP calls — submit, poll, fetch — the same
 * pattern as closclub-ai-os's qwen.provider.ts, no SDK. sharp does the
 * post-processing the portfolio's prepare-compare-images.mjs does: one exact
 * pixel grid per class, webp q80.
 *
 * Usage:
 *   node scripts/generate-images.mjs                # all pending shots
 *   node scripts/generate-images.mjs hero flatlay   # just these ids
 *   node scripts/generate-images.mjs --select hero 3 [--upscale]
 *   node scripts/generate-images.mjs --sheet        # rebuild contact sheet only
 *
 * Candidates land in generated/<id>/cand-<n>.png (idempotent — existing files
 * are skipped, so re-runs only fill gaps). generated/index.html is a contact
 * sheet for picking. --select post-processes one candidate into public/images/.
 *
 * FAL_KEY comes from .env.local (repo root) or the environment.
 */
import { readFile, writeFile, mkdir, readdir, access } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { SHOTS, OUT_SIZES } from "./image-manifest.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const GEN = path.join(ROOT, "generated");
const PUB = path.join(ROOT, "public", "images");

const FAL_QUEUE = "https://queue.fal.run";
const FAL_REST = "https://rest.fal.ai";
const POLL_MS = 2000;
const MAX_WAIT_MS = 6 * 60 * 1000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function loadEnv() {
  const envPath = path.join(ROOT, ".env.local");
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  }
}

function apiKey() {
  const key = process.env.FAL_KEY;
  if (!key) {
    throw new Error(
      "FAL_KEY is not set. Put FAL_KEY=<id>:<secret> in .env.local at the repo root."
    );
  }
  return key;
}

const authHeaders = () => ({ Authorization: `Key ${apiKey()}` });

/** Two-step storage upload, mirroring fal's own client. No storage_type
 *  query param — the API 400s on the one fal's Python client still sends. */
async function uploadToFal(data, contentType = "image/png", fileName = "reference.png") {
  const init = await fetch(`${FAL_REST}/storage/upload/initiate`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ file_name: fileName, content_type: contentType }),
  });
  if (!init.ok) {
    throw new Error(`fal upload initiate failed (${init.status}): ${(await init.text()).slice(0, 200)}`);
  }
  const { upload_url, file_url } = await init.json();
  const put = await fetch(upload_url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: new Uint8Array(data),
  });
  if (!put.ok) throw new Error(`fal upload PUT failed (${put.status})`);
  return file_url;
}

const uploadCache = new Map();

async function resolveRef(refPath) {
  const abs = path.join(ROOT, refPath);
  if (uploadCache.has(abs)) return uploadCache.get(abs);
  const data = await readFile(abs);
  const url = await uploadToFal(data, "image/png", path.basename(abs));
  uploadCache.set(abs, url);
  return url;
}

/** Submit -> poll -> fetch. Returns every image URL the request produced. */
async function runQueue(endpoint, args) {
  const submit = await fetch(`${FAL_QUEUE}/${endpoint}`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(args),
  });
  if (!submit.ok) {
    throw new Error(`fal submit failed for ${endpoint} (${submit.status}): ${(await submit.text()).slice(0, 300)}`);
  }
  const queued = await submit.json();
  const base = `${FAL_QUEUE}/${endpoint}/requests/${queued.request_id}`;
  const statusUrl = queued.status_url ?? `${base}/status`;
  const responseUrl = queued.response_url ?? base;

  const startedAt = Date.now();
  for (;;) {
    if (Date.now() - startedAt > MAX_WAIT_MS) {
      throw new Error(`request ${queued.request_id} unfinished after ${MAX_WAIT_MS / 60000} min`);
    }
    await sleep(POLL_MS);
    const res = await fetch(statusUrl, { headers: authHeaders() });
    if (!res.ok) throw new Error(`fal status failed (${res.status})`);
    const { status } = await res.json();
    if (status === "IN_QUEUE" || status === "IN_PROGRESS") continue;
    if (status !== "COMPLETED") throw new Error(`request ended in status ${status ?? "unknown"}`);
    break;
  }

  const resultRes = await fetch(responseUrl, { headers: authHeaders() });
  if (!resultRes.ok) {
    throw new Error(`fal result failed (${resultRes.status}): ${(await resultRes.text()).slice(0, 300)}`);
  }
  const result = await resultRes.json();
  const images = result.images ?? (result.image ? [result.image] : []);
  if (!images.length) throw new Error(`no image in response: ${JSON.stringify(result).slice(0, 300)}`);
  return images.map((im) => im.url);
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed (${res.status}): ${url.slice(0, 80)}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

async function existingCandidates(id) {
  try {
    return (await readdir(path.join(GEN, id))).filter((f) => f.startsWith("cand-")).length;
  } catch {
    return 0;
  }
}

/** Join two selected halves into one split frame, with a hairline gutter. */
async function joinHalves(shot) {
  const parts = [];
  for (const id of shot.from) {
    const src = SHOTS.find((s) => s.id === id);
    parts.push(await readFile(path.join(PUB, src.dest)));
  }
  const metas = await Promise.all(parts.map((b) => sharp(b).metadata()));
  const h = Math.min(...metas.map((m) => m.height));
  const resized = await Promise.all(
    parts.map((b) => sharp(b).resize({ height: h }).png().toBuffer())
  );
  const widths = await Promise.all(
    resized.map(async (b) => (await sharp(b).metadata()).width)
  );
  const gutter = 8;
  const totalW = widths.reduce((a, b) => a + b, 0) + gutter;
  return sharp({
    create: {
      width: totalW,
      height: h,
      channels: 3,
      background: "#15101A",
    },
  })
    .composite([
      { input: resized[0], left: 0, top: 0 },
      { input: resized[1], left: widths[0] + gutter, top: 0 },
    ])
    .png()
    .toBuffer();
}

async function generateShot(shot) {
  if (shot.provider === "reuse" || shot.provider === "join") return; // resolved at --select time
  const dir = path.join(GEN, shot.id);
  await mkdir(dir, { recursive: true });
  const have = await existingCandidates(shot.id);
  const want = shot.candidates ?? 3;
  if (have >= want) {
    console.log(`[${shot.id}] ${have}/${want} candidates already on disk — skipping`);
    return;
  }

  const args = { prompt: shot.prompt, num_images: 1 };
  if (shot.size) args.image_size = shot.size;
  if (shot.provider === "edit") {
    args.image_urls = [];
    for (const ref of shot.refs ?? []) args.image_urls.push(await resolveRef(ref));
  }

  for (let n = have + 1; n <= want; n++) {
    const dest = path.join(dir, `cand-${n}.png`);
    try {
      await access(dest);
      continue; // idempotent: a re-run only fills gaps
    } catch {
      /* not there yet — generate it */
    }
    process.stdout.write(`[${shot.id}] candidate ${n}/${want} via ${shot.endpoint} … `);
    const t0 = Date.now();
    const urls = await runQueue(shot.endpoint, { ...args, seed: 1000 + n * 97 });
    await download(urls[0], dest);
    console.log(`done (${Math.round((Date.now() - t0) / 1000)}s)`);
  }
}

/** A static contact sheet, grouped by shot, for human picking. */
async function buildSheet() {
  const rows = [];
  for (const shot of SHOTS) {
    if (shot.provider === "reuse") continue;
    let files = [];
    try {
      files = (await readdir(path.join(GEN, shot.id))).filter((f) => f.startsWith("cand-")).sort();
    } catch {
      /* none yet */
    }
    if (!files.length) continue;
    const cells = files
      .map((f) => {
        const n = f.match(/cand-(\d+)/)?.[1];
        return `<figure><img src="${shot.id}/${f}" loading="lazy"><figcaption>${shot.id} · ${n}<br><code>node scripts/generate-images.mjs --select ${shot.id} ${n}</code></figcaption></figure>`;
      })
      .join("\n");
    rows.push(`<section><h2>${shot.id} → ${shot.dest}</h2><div class="grid">${cells}</div></section>`);
  }
  const html = `<!doctype html><meta charset="utf-8"><title>SAHTEIIN — candidates</title>
<style>body{background:#15101A;color:#F4F0F7;font:14px/1.5 system-ui;padding:24px}h2{font-weight:600;margin:32px 0 12px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px}
figure{margin:0}img{width:100%;border-radius:8px}figcaption{margin-top:6px;color:#B7ADC3}code{font-size:11px;color:#877D95}</style>
${rows.join("\n")}`;
  await writeFile(path.join(GEN, "index.html"), html);
  console.log(`contact sheet: generated/index.html (${rows.length} shots)`);
}

/**
 * Composite صحتين onto a render as REAL type.
 *
 * Every model that was asked for the Arabic returned a different wrong word —
 * با فل, قمرن, خيين. So no model is asked any more: the packs are generated
 * with their upper face deliberately empty, and the toast is set here in a
 * system Arabic face, correctly shaped and joined, at a position chosen by eye
 * per candidate. Percentages, not pixels, so the placement survives the later
 * resize to the class grid.
 *
 *   --arabic <shot-id> <candidate-n> <xPct> <yPct> <sizePct>
 */
async function overlayArabic(buf, xPct, yPct, sizePct) {
  const { width, height } = await sharp(buf).metadata();
  const fontSize = Math.round((sizePct / 100) * height);
  const x = Math.round((xPct / 100) * width);
  const y = Math.round((yPct / 100) * height);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <text x="${x}" y="${y}" font-family="Segoe UI, Noto Naskh Arabic, Arial"
        font-size="${fontSize}" fill="#F4F0F7" fill-opacity="0.94"
        text-anchor="middle" direction="rtl">صحتين</text>
</svg>`;
  return sharp(buf)
    .composite([{ input: Buffer.from(svg), blend: "over" }])
    .png()
    .toBuffer();
}

async function upscale(buf) {
  const url = await uploadToFal(buf, "image/png", "select.png");
  const [out] = await runQueue("fal-ai/clarity-upscaler", { image_url: url, upscale_factor: 2 });
  const res = await fetch(out);
  return Buffer.from(await res.arrayBuffer());
}

async function select(id, n, doUpscale, arabic) {
  const shot = SHOTS.find((s) => s.id === id);
  if (!shot) throw new Error(`unknown shot id: ${id}`);

  let buf;
  if (shot.provider === "reuse") {
    const src = SHOTS.find((s) => s.id === shot.from);
    buf = await readFile(path.join(PUB, src.dest));
  } else if (shot.provider === "join") {
    buf = await joinHalves(shot);
  } else {
    buf = await readFile(path.join(GEN, id, `cand-${n}.png`));
    if (doUpscale) {
      process.stdout.write(`[${id}] clarity upscale … `);
      buf = await upscale(buf);
      console.log("done");
    }
    if (arabic) {
      buf = await overlayArabic(buf, arabic.x, arabic.y, arabic.size);
      console.log(`[${id}] صحتين composited at ${arabic.x}% / ${arabic.y}%`);
    } else if (shot.arabic) {
      console.log(
        `[${id}] note: this shot reserves space for صحتين — add it with ` +
          `--arabic ${id} ${n} <xPct> <yPct> <sizePct>`
      );
    }
  }

  const { w, h } = OUT_SIZES[shot.class];
  const dest = path.join(PUB, shot.dest);
  await mkdir(path.dirname(dest), { recursive: true });
  await sharp(buf).resize(w, h, { fit: "cover" }).webp({ quality: 80, effort: 5 }).toFile(dest);
  const kb = Math.round((await readFile(dest)).length / 1024);
  console.log(`[${id}] → public/images/${shot.dest} (${w}x${h}, ${kb} KB)`);

  // The cover's "after" pane mirrors the hero — refresh it whenever the hero
  // changes so the comparison never goes stale.
  if (id === "hero") await select("after", 0, false);
}

async function main() {
  loadEnv();
  const argv = process.argv.slice(2);

  if (argv[0] === "--sheet") return buildSheet();
  if (argv[0] === "--select") {
    const [, id, n, flag] = argv;
    if (!id) throw new Error("usage: --select <shot-id> <candidate-n> [--upscale]");
    return select(id, n, flag === "--upscale");
  }
  if (argv[0] === "--arabic") {
    const [, id, n, x, y, size, flag] = argv;
    if (!id || x === undefined || y === undefined) {
      throw new Error("usage: --arabic <shot-id> <candidate-n> <xPct> <yPct> <sizePct> [--upscale]");
    }
    return select(id, n, flag === "--upscale", {
      x: Number(x),
      y: Number(y),
      size: Number(size ?? 12),
    });
  }

  const ids = argv.filter((a) => !a.startsWith("--"));
  const shots = ids.length ? SHOTS.filter((s) => ids.includes(s.id)) : SHOTS;
  for (const shot of shots) {
    try {
      await generateShot(shot);
    } catch (err) {
      console.error(`[${shot.id}] FAILED: ${err.message}`);
    }
  }
  await buildSheet();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
