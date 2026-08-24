import { withBase } from "@/lib/utils";

/**
 * What the money buys, shown rather than described.
 *
 * The client is being asked to sign before any of the chapters open, so this
 * is the one place he sees the actual output. Each frame is tied to the phase
 * that produces it — the point is not "look, pictures", it is "phase 3 is the
 * thing that turns into this".
 *
 * These are the real concept visuals from the work, not stand-ins; the note
 * under the strip says plainly that they are concept, not production art.
 */
const TEASERS = [
  {
    src: "public/images/00-toast/hero.webp",
    phase: "Phases 2 – 3",
    caption: "The mark, the bilingual lockup and a box a printer can run.",
  },
  {
    src: "public/images/03-packaging/hero.webp",
    phase: "Phase 3",
    caption: "Seven flavours you can tell apart across a room.",
  },
  {
    src: "public/images/04-launch/hero.webp",
    phase: "Phase 4",
    caption: "One idea, told twice — 1AM over a bar, 9AM over a counter.",
  },
  {
    src: "public/images/04-launch/ooh.webp",
    phase: "Phase 4",
    caption: "The campaign out in Beirut, on a wall.",
  },
];

const TeaserStrip = () => (
  <div className="flex flex-col gap-5">
    <div className="grid gap-5 md:grid-cols-2">
      {TEASERS.map((t) => (
        <figure key={t.src} className="flex flex-col gap-3">
          <div className="media-frame bg-plum-2">
            <img
              src={withBase(t.src)}
              alt={t.caption}
              width={2280}
              height={1536}
              className="block h-auto w-full"
            />
          </div>
          <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="label">{t.phase}</span>
            <span className="text-[14px] text-bone-2">{t.caption}</span>
          </figcaption>
        </figure>
      ))}
    </div>
    <p className="text-[13px] leading-relaxed text-bone-3">
      These are concept visuals — made to show the direction, not production
      artwork. The logos, dielines and print files are what the phases below
      actually deliver.
    </p>
  </div>
);

export default TeaserStrip;
