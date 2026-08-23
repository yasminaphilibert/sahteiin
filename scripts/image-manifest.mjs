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

const MASTER_V3 = `Editorial product photograph of a premium electrolyte drink range called SAHTEIIN, on a matte near-black plum surface against a seamless deep plum-black backdrop (#15101A) — cool plum-black, NOT maroon, NOT brown. The mood is high-end spirits advertising: dramatic, textured, close.

CENTRE-RIGHT: one closed rectangular carton, upright, three-quarter view, matte soft-touch deep plum, every edge and panel the same plum — no gold, no tan, no metallic edge, no open flap. The front face is a designed composition, NOT centered text:
— top left: the brand mark alone — two thin bone-white strokes leaning together like glasses mid-clink with a tiny spark above — printed in gloss varnish so it catches the light
— upper half, LARGE: the Arabic word "صحتين" in bone-white, set big as a graphic element in its own right
— lower third: the wordmark reading exactly "SAHTEIIN" in capitals, wide geometric sans, tightly letter-spaced, oversized so it spans nearly the full face width, the two adjacent letter I's drawn as the same two angled clink strokes
— at the base, one small line reading exactly "ELECTROLYTE STICKS · 14 SACHETS"
— lower-left corner: a small index of seven short thin stacked horizontal lines, one per flavour colour — a discreet detail, NOT a large rainbow stripe, NOT covering the spine
— across the plum face, a barely-visible tone-on-tone blind-deboss repeat of the tiny clink mark: texture, not decoration

FOREGROUND: exactly seven single-serve stick sachets standing upright in a slightly staggered rhythm, each ONE flat solid matte colour, in order: fresh green (#4FBE8F), acid lime (#A8CE2E), golden yellow (#F2C230), coral orange (#F4713C), azure BLUE (#2E9BD6), deep VIOLET purple (#7B3FA0), dark burgundy red (#B01E3C) — all seven clearly distinguishable; sachet 5 unmistakably blue, sachet 6 unmistakably purple.

Each sachet is printed as follows:
— the flavour name set vertically in heavy condensed bone-white capitals, OVERSIZED so its first letter is cropped by the top crimp — the type deliberately bleeds off the sachet
— the seven names read exactly, in order: "HUGO AGAIN", "SALTY RITA", "LIMON-CHILL", "PALOMA MIA", "BLUE HULA", "BRAMBLE ON", "NOGRONI"
— behind and below the type, ONE flavour icon drawn LARGE in a darker shade of the sachet's own colour — tone-on-tone, geometric, single confident line, never sketchy: elderflower sprig, salted coupe-glass rim, whole lemon with leaf, grapefruit wedge, pineapple, blackberry cluster, spiral peel curl. Seven different objects, no two alike, no citrus slice on more than one sachet
— near the base, small in bone-white: the two-stroke clink mark and the Arabic word "صحتين"
Sachets have crisp crimped serrated top and bottom edges, a subtle foil sheen on the seal only, soft realistic creasing.

LIGHT: low-key spirits-ad lighting — one large soft key from the upper left, one hard warm amber rim light from the right rear cutting the silhouettes, deep shadow falloff into the backdrop, soft contact shadows. Slightly warm grade, deep blacks, no colour cast on the white type, fine film grain.

CAMERA: 100mm macro feel, f/4, slightly below eye level so the carton looms, all sachets sharp, visible paper tooth and the varnish sheen on the mark.

${CONSTRAINTS}`;

const VARIANT_A = `Overhead flat-lay editorial product photograph on a deep plum-black surface (#15101A) — cool plum-black, NOT maroon, NOT brown. Seven electrolyte stick sachets of the brand SAHTEIIN in a perfectly even row — fresh green (#4FBE8F), acid lime (#A8CE2E), golden yellow (#F2C230), coral orange (#F4713C), azure blue (#2E9BD6), deep violet purple (#7B3FA0), dark burgundy red (#B01E3C), all clearly different, sachet 5 unmistakably blue, sachet 6 unmistakably purple. Each sachet is one flat solid matte colour, printed with its name in oversized vertical heavy condensed bone-white capitals cropped by the top crimp, the small descriptor line beside it, ONE flavour icon LARGE and tone-on-tone in a darker cut of the sachet's own colour, and the two-stroke clink mark with the Arabic word "صحتين" small at the base. Names and descriptors read exactly: "HUGO AGAIN / hugo · elderflower + mint", "SALTY RITA / margarita · lime + salt", "LIMON-CHILL / limoncello · lemon", "PALOMA MIA / paloma · grapefruit + salt", "BLUE HULA / blue hawaii · pineapple + coconut", "BRAMBLE ON / bramble · blackberry", "NOGRONI / negroni · bitter orange". The seven icons are seven different objects: elderflower sprig, salted coupe-glass rim, whole lemon with leaf, grapefruit wedge, pineapple, blackberry cluster, spiral peel curl — no citrus slice on more than one sachet. Soft top light, subtle shadow, visible paper texture and film grain, no props, no text anywhere other than the sachet printing. ${CONSTRAINTS}`;

const VARIANT_B = `Documentary 16mm-grain photograph, split composition, one frame divided vertically into two halves. LEFT HALF: a hand raising a dark burgundy-red SAHTEIIN electrolyte stick sachet reading exactly "NOGRONI" in vertical bone-white capitals over a crowded Beirut bar counter at night — warm tungsten light, bottles and motion blurred in the background, 1AM energy. RIGHT HALF: the same hand holding the same burgundy sachet on a sunlit kitchen counter the next morning — cool soft daylight, quiet, 9AM. Natural skin texture, real film grain, slight halation, no studio gloss, no text overlay, no watermark, no other people's faces in focus.`;

const BEFORE = `Amateur product mockup of an energy-drink style electrolyte brand called ELECTRONYTES, rendered the way a generic AI concept looks: a navy blue background with neon squiggle graphics and glowing accents, six stick sachets (not seven) sharing one warm orange-to-pink gradient so they all look alike, a centered glossy wordmark floating in empty space, small wobbly white icons, plastic-looking surfaces, oversaturated, generic sports-supplement energy. Clean spelling of "ELECTRONYTES" only — no other readable text. Flat even lighting, e-commerce render feel, slight CGI sheen.`;

const NAMING_HERO = `Extreme close-up editorial photograph of the front face of a matte soft-touch deep plum carton on a plum-black background (#15101A) — cool plum-black, NOT maroon. Filling the upper frame, LARGE: the Arabic word "صحتين" printed in bone-white, sharp and correctly formed, set as a graphic element. Below it, partially cropped by the bottom of the frame, the beginning of a wide geometric sans wordmark reading exactly "SAHTEIIN". Top left, small: two thin bone-white strokes leaning together like glasses mid-clink with a tiny spark above, printed in gloss varnish catching a warm amber rim light from the right. Visible paper tooth, fine film grain, dramatic low-key spirits-ad lighting, deep blacks. No other text, no props, no hands, no glow, no neon, no watermark.`;

const CLINK_MACRO = `Keep the graphic in image 1 exactly as drawn — the same two thin strokes leaning together with the small spark above, the same proportions and angles. Render it as a macro photograph: the mark printed in gloss varnish on a matte soft-touch deep plum carton surface (#15101A plum-black, NOT maroon, NOT brown), tone-on-tone, revealed by one warm amber rim light raking across from the right so the varnish catches and shines while the matte board stays dark. Extreme close-up, 100mm macro, f/4, visible paper tooth and fibre, fine film grain, deep shadows. No text anywhere, no other graphics, no hands, no props, no glow, no neon.`;

const sachet = (name, colorName, hex, darker, icon) =>
  `Editorial product photograph, single electrolyte stick sachet standing upright, centered, portrait crop, on a deep plum-black background (#15101A) — cool plum-black, NOT maroon. The sachet matches the packaging system of image 1 exactly: ONE flat solid matte ${colorName} (${hex}), crisp crimped serrated top and bottom edges, subtle foil sheen on the seal only, soft realistic creasing. Printed on it: the flavour name reading exactly "${name}" set vertically in heavy condensed bone-white capitals, OVERSIZED so its first letter is cropped by the top crimp; behind and below the type ONE ${icon} drawn LARGE in ${darker} — tone-on-tone, geometric, single confident line; near the base, small in bone-white, the two-stroke clink mark and the Arabic word "صحتين". Low-key spirits-ad lighting: soft key upper left, hard warm amber rim light from the right rear, deep shadow falloff, fine film grain, 100mm macro feel. Exactly one sachet. No other text, no props, no glow, no neon, no gradients on the sachet, no watermark.`;

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
    id: "hero",
    dest: "00-toast/hero.webp",
    class: "hero",
    provider: "txt2img",
    endpoint: T2I,
    prompt: MASTER_V3,
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
    from: "hero",
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
    dest: "03-packaging/hero.webp",
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
    refs: ["public/images/00-toast/hero.webp"],
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
    refs: ["public/images/00-toast/hero.webp"],
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
    refs: ["public/images/00-toast/hero.webp"],
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
    refs: ["public/images/00-toast/hero.webp"],
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
    refs: ["public/images/00-toast/hero.webp"],
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
    refs: ["public/images/00-toast/hero.webp"],
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
    refs: ["public/images/00-toast/hero.webp"],
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
    prompt: MASTER_V3,
    size: LANDSCAPE,
    candidates: 2,
  },
  {
    id: "twice-b",
    dest: "03-packaging/compare/version-b.webp",
    class: "compare",
    provider: "txt2img",
    endpoint: T2I_ALT,
    prompt: MASTER_V3,
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
