/**
 * The shot list. Every prompt lives here and nowhere else, so a name change
 * after trademark screening is one find-and-replace (SAHTEIIN / صحتين).
 *
 * Prompts are adapted from electronytes-rebrand/master-prompt.md v3. The
 * doctrine that file encodes is preserved verbatim where it matters:
 *  - exact-spelling lists and the negative-constraints block stay in full —
 *    image models drift on in-image text, counts and colour;
 *  - the descriptor tier appears ONLY in the flat-lay (Variant A) — small
 *    secondary type is where models garble;
 *  - readable Arabic as a design element is fine, but the bilingual lockup
 *    the client must READ is real type on the site, never generated.
 *
 * provider: "txt2img" (fal queue, text-to-image — FLUX-class, for text-heavy
 * pack shots) or "edit" (fal-ai/qwen-image-2/edit, reference-conditioned, max
 * 3 refs addressed positionally). Endpoints are per-shot so a routing change
 * is data, not code. If a BFL_API_KEY ever lands in .env.local, provider
 * "bfl" routes the same prompt to api.bfl.ai instead.
 */

const CONSTRAINTS =
  "CONSTRAINTS: render all text exactly as written above with correct spelling — do not invent, translate, abbreviate or duplicate any word. Exactly seven sachets, no more and no fewer. No large rainbow stripes anywhere, no neon, no glow, no gradients on the sachets, no confetti, no squiggles, no liquid splashes, no cocktail glasses, no ice, no fruit props, no people, no hands, no watermark, no extra logos, no lens flare.";

/**
 * The v3 hero was one shot carrying a carton, seven sachets, two scripts and
 * seven flavour names. Every candidate lost the count (5, 6 and 9 sachets came
 * back) and every candidate garbled صحتين. Splitting the shot is the fix: each
 * render now has ONE subject and one job, the count leads the prompt instead of
 * arriving in paragraph four, and no render is asked for Arabic at all — the
 * toast is composited afterwards as real Noto Naskh type (see --arabic in
 * generate-images.mjs), because a misspelt toast in front of a client is worse
 * than no toast.
 */
const CARTON = `A single closed rectangular carton, alone, centered, three-quarter view, upright — ONE box and nothing else in the frame. No sachets, no sticks, no packets, no other objects whatsoever.

Editorial product photograph on a seamless deep plum-black backdrop (#15101A) — cool plum-black, NOT maroon, NOT brown. High-end spirits advertising: dramatic, textured, close.

The carton is matte soft-touch deep plum, every edge and panel the same plum — no gold, no tan, no metallic edge, no open flap. Its front face is a designed composition, NOT centered text:
— top left: the brand mark alone — two thin bone-white strokes leaning together like two glasses caught mid-clink, with a tiny four-point spark above where they meet — printed in gloss varnish so it catches the light
— the upper half of the face is left EMPTY: clean unbroken matte plum board, no text, no graphics, no ornament, deliberately reserved negative space
— lower third: the wordmark reading exactly "SAHTEIIN" in capitals, wide geometric sans, tightly letter-spaced, oversized so it spans nearly the full face width
— at the base, one small line reading exactly "ELECTROLYTE STICKS · 14 SACHETS"
— lower-left corner: a small index of seven short thin stacked horizontal lines, one per flavour colour — a discreet detail, NOT a large rainbow stripe, NOT covering the spine
— across the plum face, a barely-visible tone-on-tone blind-deboss repeat of the tiny clink mark: texture, not decoration

LIGHT: low-key spirits-ad lighting — one large soft key from the upper left, one hard warm amber rim light from the right rear cutting the silhouette, deep shadow falloff into the backdrop, a soft contact shadow. Slightly warm grade, deep blacks, no colour cast on the white type, fine film grain.

CAMERA: 100mm macro feel, f/4, slightly below eye level so the carton looms, visible paper tooth and the varnish sheen on the mark.

CONSTRAINTS: exactly one carton, alone in frame. No sachets or sticks of any kind. No Arabic script, no Arabic text, no second alphabet — Latin capitals only. Render "SAHTEIIN" and "ELECTROLYTE STICKS · 14 SACHETS" exactly as written with correct spelling; no other words anywhere. No rainbow stripes, no neon, no glow, no gradients, no confetti, no squiggles, no liquid splashes, no cocktail glasses, no ice, no fruit props, no people, no hands, no watermark, no registered-trademark symbol, no extra logos, no lens flare.`;

const SACHETS_ROW = `SEVEN sachets. Exactly seven — count them: one, two, three, four, five, six, seven. Not six, not eight, not nine. Seven single-serve stick sachets standing upright in one slightly staggered row, evenly spaced, no box and no other object in the frame.

Editorial product photograph on a seamless deep plum-black backdrop (#15101A) — cool plum-black, NOT maroon, NOT brown. Low-key spirits-advertising light.

The seven sachets are each ONE flat solid matte colour, left to right in this exact order:
1. fresh green (#4FBE8F)
2. acid lime (#A8CE2E)
3. golden yellow (#F2C230)
4. coral orange (#F4713C)
5. azure BLUE (#2E9BD6) — unmistakably blue, not teal, not green
6. deep VIOLET purple (#7B3FA0) — unmistakably purple, not blue, not red
7. dark burgundy red (#B01E3C)
All seven are clearly distinguishable from each other at a glance. No two sachets share a colour. No gradients on any sachet — each is one flat colour.

Each sachet carries ONE flavour icon drawn LARGE in a darker shade of that sachet's own colour — tone-on-tone, geometric, a single confident line, never sketchy. Seven different objects, one per sachet, no two alike, in order: elderflower sprig, salted coupe-glass rim, whole lemon with a leaf, grapefruit wedge, pineapple, blackberry cluster, spiral peel curl. No citrus on more than one sachet.

Sachets have crisp crimped serrated top and bottom edges, a subtle foil sheen on the seal only, soft realistic creasing, visible paper tooth.

LIGHT: one large soft key from the upper left, one hard warm amber rim light from the right rear cutting the silhouettes, deep shadow falloff, soft contact shadows, fine film grain. 100mm macro feel, f/4, all seven sachets sharp.

CONSTRAINTS: exactly seven sachets, no more and no fewer. No text of any kind on the sachets or anywhere in the frame — no letters, no words, no numbers, no Arabic, no logos. Icons only. No carton, no box. No rainbow stripes, no neon, no glow, no confetti, no squiggles, no liquid splashes, no cocktail glasses, no ice, no fruit props, no people, no hands, no watermark, no lens flare.`;

const VARIANT_A = `SEVEN sachets. Exactly seven — count them: one, two, three, four, five, six, seven. Not six, not eight. Overhead flat-lay, the seven laid in one perfectly even row, evenly spaced, nothing else in the frame.

Editorial product photograph on a deep plum-black surface (#15101A) — cool plum-black, NOT maroon, NOT brown.

Left to right in this exact order, each sachet ONE flat solid matte colour:
1. fresh green (#4FBE8F)
2. acid lime (#A8CE2E)
3. golden yellow (#F2C230)
4. coral orange (#F4713C)
5. azure BLUE (#2E9BD6) — unmistakably blue
6. deep VIOLET purple (#7B3FA0) — unmistakably purple
7. dark burgundy red (#B01E3C)
No two sachets share a colour; all seven read as different at a glance.

Each sachet carries ONE flavour icon drawn LARGE and tone-on-tone in a darker cut of its own colour — geometric, single confident line. Seven different objects in order: elderflower sprig, salted coupe-glass rim, whole lemon with a leaf, grapefruit wedge, pineapple, blackberry cluster, spiral peel curl. No citrus on more than one sachet.

Crisp crimped serrated edges, subtle foil sheen on the seal only, visible paper texture. Soft even top light, one subtle shadow per sachet, fine film grain.

CONSTRAINTS: exactly seven sachets, no more and no fewer. No text of any kind anywhere in the frame — no letters, no words, no numbers, no Arabic, no logos. Icons only. No props, no box, no rainbow stripes, no neon, no glow, no gradients, no confetti, no squiggles, no splashes, no glasses, no ice, no fruit, no people, no hands, no watermark.`;

const VARIANT_B = `Documentary 16mm-grain photograph, split composition, one frame divided vertically into two halves. LEFT HALF: a hand raising a dark burgundy-red SAHTEIIN electrolyte stick sachet reading exactly "NOGRONI" in vertical bone-white capitals over a crowded Beirut bar counter at night — warm tungsten light, bottles and motion blurred in the background, 1AM energy. RIGHT HALF: the same hand holding the same burgundy sachet on a sunlit kitchen counter the next morning — cool soft daylight, quiet, 9AM. Natural skin texture, real film grain, slight halation, no studio gloss, no text overlay, no watermark, no other people's faces in focus.`;

const BEFORE = `Amateur product mockup of an energy-drink style electrolyte brand called ELECTRONYTES, rendered the way a generic AI concept looks: a navy blue background with neon squiggle graphics and glowing accents, six stick sachets (not seven) sharing one warm orange-to-pink gradient so they all look alike, a centered glossy wordmark floating in empty space, small wobbly white icons, plastic-looking surfaces, oversaturated, generic sports-supplement energy. Clean spelling of "ELECTRONYTES" only — no other readable text. Flat even lighting, e-commerce render feel, slight CGI sheen.`;

/** The plate the toast is composited onto: an empty, beautifully lit board. */
const NAMING_HERO = `Extreme close-up editorial photograph of the front face of a matte soft-touch deep plum carton, filling the frame, on a plum-black background (#15101A) — cool plum-black, NOT maroon, NOT brown.

The face is almost entirely EMPTY: clean unbroken matte plum board, deliberately reserved negative space across the whole upper and middle frame — no text, no graphics, no ornament there. Across it runs a barely-visible tone-on-tone blind-deboss repeat of a tiny two-stroke clink mark: texture, not decoration.

Only at the very bottom edge, small and partially cropped by the frame, a wide geometric sans wordmark reading exactly "SAHTEIIN".

A hard warm amber rim light rakes across from the right, a soft key from the upper left; visible paper tooth and fibre, fine film grain, dramatic low-key spirits-ad lighting, deep blacks, 100mm macro feel.

CONSTRAINTS: the upper two-thirds of the frame stays empty plum board. No Arabic script, no Arabic text, no second alphabet. The only word anywhere is "SAHTEIIN", spelled exactly. No props, no hands, no people, no glow, no neon, no watermark, no registered-trademark symbol, no lens flare.`;

const CLINK_MACRO = `Keep the graphic in image 1 exactly as drawn — the same two thin strokes leaning together with the small spark above, the same proportions and angles. Render it as a macro photograph: the mark printed in gloss varnish on a matte soft-touch deep plum carton surface (#15101A plum-black, NOT maroon, NOT brown), tone-on-tone, revealed by one warm amber rim light raking across from the right so the varnish catches and shines while the matte board stays dark. Extreme close-up, 100mm macro, f/4, visible paper tooth and fibre, fine film grain, deep shadows. No text anywhere, no other graphics, no hands, no props, no glow, no neon.`;

/**
 * One sachet per frame, one word per frame. A single short name is the most
 * reliable text an image model renders — it is seven competing names in one
 * frame that turns into "BA6EAC" and "7B3FAO". The clink mark and the Arabic
 * are left off entirely; both are composited as real vector/type afterwards.
 */
const sachet = (name, colorName, hex, darker, icon) =>
  `ONE electrolyte stick sachet, alone, standing upright, centered, portrait crop — a single sachet and nothing else in the frame.

Editorial product photograph on a deep plum-black background (#15101A) — cool plum-black, NOT maroon, NOT brown.

The sachet is ONE flat solid matte ${colorName} (${hex}) — one flat colour, no gradient. Crisp crimped serrated top and bottom edges, subtle foil sheen on the seal only, soft realistic creasing, visible paper tooth.

Printed on it, only two things:
— the flavour name, reading exactly "${name}" and nothing else, set vertically in heavy condensed bone-white capitals, OVERSIZED so its first letter is cropped by the top crimp and the type bleeds off the sachet
— behind and below that type, ONE ${icon}, drawn LARGE in ${darker} — tone-on-tone, geometric, a single confident line, never sketchy

LIGHT: low-key spirits-ad lighting — soft key from the upper left, hard warm amber rim light from the right rear, deep shadow falloff, soft contact shadow, fine film grain, 100mm macro feel, f/4.

CONSTRAINTS: exactly one sachet. The ONLY text in the frame is "${name}", spelled exactly that way — no second name, no descriptor line, no numbers, no Arabic script, no logos, no watermark, no registered-trademark symbol. One icon only. No props, no box, no glow, no neon, no gradients, no glasses, no ice, no fruit, no people, no hands.`;

/** class -> final encoded size. Compare pairs MUST share one exact grid. */
export const OUT_SIZES = {
  hero: { w: 2280, h: 1536 },
  compare: { w: 1520, h: 1024 },
  wide: { w: 2280, h: 1536 },
  gallery: { w: 1024, h: 1520 },
};

const T2I = "fal-ai/flux-2-pro"; // text-heavy pack shots — FLUX-class fidelity
const EDIT = "fal-ai/qwen-image-2/edit"; // reference-matched consistency passes
const T2I_ALT = "fal-ai/qwen-image"; // the second voice for "resolved twice"

const LANDSCAPE = { width: 1536, height: 1024 };
const PORTRAIT = { width: 1024, height: 1536 };

export const SHOTS = [
  {
    id: "carton",
    dest: "00-toast/hero.webp",
    class: "hero",
    provider: "txt2img",
    endpoint: T2I,
    prompt: CARTON,
    size: LANDSCAPE,
    candidates: 4,
    /** Composite the toast on afterwards — see --arabic. */
    arabic: true,
  },
  {
    id: "sachets",
    dest: "03-packaging/hero.webp",
    class: "wide",
    provider: "txt2img",
    endpoint: T2I,
    prompt: SACHETS_ROW,
    size: LANDSCAPE,
    candidates: 4,
  },
  {
    id: "before",
    dest: "00-toast/compare/before.webp",
    class: "compare",
    provider: "txt2img",
    endpoint: T2I,
    prompt: BEFORE,
    size: LANDSCAPE,
    candidates: 3,
  },
  {
    // The "after" of the cover comparison is the hero itself, re-encoded to
    // the compare grid so the wipe is honest.
    id: "after",
    dest: "00-toast/compare/after.webp",
    class: "compare",
    provider: "reuse",
    from: "carton",
  },
  {
    id: "naming-hero",
    dest: "01-foundations/hero.webp",
    class: "wide",
    provider: "txt2img",
    endpoint: T2I,
    prompt: NAMING_HERO,
    size: LANDSCAPE,
    candidates: 3,
    arabic: true,
  },
  {
    id: "clink-macro",
    dest: "02-identity/hero.webp",
    class: "wide",
    provider: "edit",
    endpoint: EDIT,
    prompt: CLINK_MACRO,
    refs: ["scripts/assets/clink.png"],
    size: LANDSCAPE,
    candidates: 3,
  },
  {
    id: "flatlay",
    dest: "03-packaging/flatlay.webp",
    class: "wide",
    provider: "txt2img",
    endpoint: T2I,
    prompt: VARIANT_A,
    size: LANDSCAPE,
    candidates: 4,
  },
  // Seven sachet portraits — reference-conditioned on the hero select so the
  // set shares one lighting world. Refs are addressed positionally ("image 1").
  {
    id: "s1-hugo-again",
    dest: "03-packaging/gallery/01-hugo-again.webp",
    class: "gallery",
    provider: "edit",
    endpoint: EDIT,
    prompt: sachet("HUGO AGAIN", "fresh green", "#4FBE8F", "a darker forest green", "elderflower sprig — stems with small five-petal flowers and round buds"),
    refs: ["public/images/03-packaging/hero.webp"],
    size: PORTRAIT,
    candidates: 2,
  },
  {
    id: "s2-salty-rita",
    dest: "03-packaging/gallery/02-salty-rita.webp",
    class: "gallery",
    provider: "edit",
    endpoint: EDIT,
    prompt: sachet("SALTY RITA", "acid lime", "#A8CE2E", "a darker olive lime", "salted coupe-glass rim — a wide arc with small salt dots along its edge"),
    refs: ["public/images/03-packaging/hero.webp"],
    size: PORTRAIT,
    candidates: 2,
  },
  {
    id: "s3-limon-chill",
    dest: "03-packaging/gallery/03-limon-chill.webp",
    class: "gallery",
    provider: "edit",
    endpoint: EDIT,
    prompt: sachet("LIMON-CHILL", "golden yellow", "#F2C230", "a darker ochre", "whole lemon with one leaf"),
    refs: ["public/images/03-packaging/hero.webp"],
    size: PORTRAIT,
    candidates: 2,
  },
  {
    id: "s4-paloma-mia",
    dest: "03-packaging/gallery/04-paloma-mia.webp",
    class: "gallery",
    provider: "edit",
    endpoint: EDIT,
    prompt: sachet("PALOMA MIA", "coral orange", "#F4713C", "a darker burnt coral", "grapefruit wedge — a fan of segments inside a rind arc"),
    refs: ["public/images/03-packaging/hero.webp"],
    size: PORTRAIT,
    candidates: 2,
  },
  {
    id: "s5-blue-hula",
    dest: "03-packaging/gallery/05-blue-hula.webp",
    class: "gallery",
    provider: "edit",
    endpoint: EDIT,
    prompt: sachet("BLUE HULA", "azure blue", "#2E9BD6", "a darker deep sea blue", "pineapple with a cross-hatched body and spiky crown"),
    refs: ["public/images/03-packaging/hero.webp"],
    size: PORTRAIT,
    candidates: 2,
  },
  {
    id: "s6-bramble-on",
    dest: "03-packaging/gallery/06-bramble-on.webp",
    class: "gallery",
    provider: "edit",
    endpoint: EDIT,
    prompt: sachet("BRAMBLE ON", "deep violet purple", "#7B3FA0", "a darker aubergine violet", "blackberry cluster — a bunch of round drupelets with one small leaf"),
    refs: ["public/images/03-packaging/hero.webp"],
    size: PORTRAIT,
    candidates: 2,
  },
  {
    id: "s7-nogroni",
    dest: "03-packaging/gallery/07-nogroni.webp",
    class: "gallery",
    provider: "edit",
    endpoint: EDIT,
    prompt: sachet("NOGRONI", "dark burgundy red", "#B01E3C", "a darker oxblood", "spiral orange-peel curl"),
    refs: ["public/images/03-packaging/hero.webp"],
    size: PORTRAIT,
    candidates: 2,
  },
  // "Resolved twice": the same Master v3 brief through two different models.
  // Folders/filenames are neutral — the page credits neither, so the URLs
  // must not either.
  {
    id: "twice-a",
    dest: "03-packaging/compare/version-a.webp",
    class: "compare",
    provider: "txt2img",
    endpoint: T2I,
    prompt: SACHETS_ROW,
    size: LANDSCAPE,
    candidates: 2,
  },
  {
    id: "twice-b",
    dest: "03-packaging/compare/version-b.webp",
    class: "compare",
    provider: "txt2img",
    endpoint: T2I_ALT,
    prompt: SACHETS_ROW,
    size: LANDSCAPE,
    candidates: 2,
  },
  {
    id: "campaign",
    dest: "04-launch/hero.webp",
    class: "wide",
    provider: "txt2img",
    endpoint: T2I,
    prompt: VARIANT_B,
    size: LANDSCAPE,
    candidates: 4,
  },
];
