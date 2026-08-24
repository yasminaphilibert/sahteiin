import { withBase, cn } from "@/lib/utils";
import { useSession } from "@/lib/session-context";

/**
 * What the money buys, shown rather than described — but only partly.
 *
 * One frame is left clear: the range, which proves the standard of the work.
 * The rest are blurred, because the mark, the lockup and the campaign are the
 * things being bought, and handing them over in full on the sales page leaves
 * nothing for the phases to deliver. The caption stays readable under every
 * frame, so a blurred image still tells the client what is coming — it
 * withholds the picture, not the promise.
 *
 * Owners see all four clear, flagged as such, so nobody has to sign out to
 * check what a frame actually looks like.
 *
 * The blur is CSS: the underlying file is still fetchable at its URL by
 * anyone who reads the markup. It sets an expectation, it does not enforce
 * one — same as every other lock on this static site.
 */
const TEASERS = [
  {
    src: "public/images/00-toast/hero.webp",
    phase: "Phases 2 – 3",
    caption: "The mark, the bilingual lockup and a box a printer can run.",
    reveal: false,
    opensAt: "phase 2",
  },
  {
    src: "public/images/03-packaging/hero.webp",
    phase: "Phase 3",
    caption: "Seven flavours you can tell apart across a room.",
    reveal: true,
    opensAt: "phase 3",
  },
  {
    src: "public/images/04-launch/hero.webp",
    phase: "Phase 4",
    caption: "One idea, told twice — 1AM over a bar, 9AM over a counter.",
    reveal: false,
    opensAt: "phase 4",
  },
  {
    src: "public/images/04-launch/ooh.webp",
    phase: "Phase 4",
    caption: "The campaign out in Beirut, on a wall.",
    reveal: false,
    opensAt: "phase 4",
  },
];

const TeaserStrip = () => {
  const { role } = useSession();
  const isOwner = role === "owner";

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        {TEASERS.map((t) => {
          const hidden = !t.reveal && !isOwner;

          return (
            <figure key={t.src} className="flex flex-col gap-3">
              <div className="media-frame relative bg-plum-2">
                <img
                  src={withBase(t.src)}
                  alt={hidden ? "" : t.caption}
                  aria-hidden={hidden || undefined}
                  width={2280}
                  height={1536}
                  className={cn(
                    "block h-auto w-full",
                    // Scaled up while blurred: a blur samples past the edges
                    // and would otherwise fade the frame's own borders out.
                    hidden && "scale-105 blur-xl saturate-[.85]"
                  )}
                />

                {hidden && (
                  <div className="absolute inset-0 flex items-end bg-plum/35 p-5">
                    <span className="rounded-full border border-white/25 bg-plum/80 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-bone-2">
                      Revealed when {t.opensAt} opens
                    </span>
                  </div>
                )}

                {isOwner && !t.reveal && (
                  <div className="absolute right-4 top-4">
                    <span className="rounded-full border border-amber/50 bg-plum/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-amber">
                      Blurred for client
                    </span>
                  </div>
                )}
              </div>

              <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="label">{t.phase}</span>
                <span className="text-[14px] text-bone-2">{t.caption}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>

      <p className="text-[13px] leading-relaxed text-bone-3">
        One frame is shown in full — the range. The rest come into focus as
        their phase is delivered. All of these are concept visuals, made to
        show the direction, not production artwork.
      </p>
    </div>
  );
};

export default TeaserStrip;
