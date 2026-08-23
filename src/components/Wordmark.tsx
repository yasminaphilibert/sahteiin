import { cn } from "@/lib/utils";

/**
 * SAHTEIIN with the doubled I drawn as the clink — two strokes leaning
 * together. Real type, never a generated image: Arabic and the wordmark are
 * where image models garble hardest, so the lockup is always typeset.
 */
const Wordmark = ({ className }: { className?: string }) => (
  <h1
    className={cn(
      "font-display font-extrabold uppercase leading-[0.86] tracking-[-0.045em] text-bone",
      "flex flex-wrap items-baseline gap-[0.035em]",
      className
    )}
    aria-label="Sahteiin"
  >
    SAHTE
    <span
      aria-hidden
      className="relative inline-block h-[0.70em] w-[0.185em] flex-none"
    >
      <i
        className="absolute inset-y-0 left-0 w-[0.070em] origin-bottom -rotate-2 rounded-full bg-amber"
        style={{ fontStyle: "normal" }}
      />
      <i
        className="absolute inset-y-0 right-0 w-[0.070em] origin-bottom rotate-2 rounded-full bg-amber"
        style={{ fontStyle: "normal" }}
      />
    </span>
    N
  </h1>
);

export default Wordmark;
