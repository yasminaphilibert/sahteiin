import { cn } from "@/lib/utils";

export const FLAVOUR_COLORS = [
  "#4FBE8F", // HUGO AGAIN
  "#A8CE2E", // SALTY RITA
  "#F2C230", // LIMON-CHILL
  "#F4713C", // PALOMA MIA
  "#2E9BD6", // BLUE HULA
  "#7B3FA0", // BRAMBLE ON
  "#B01E3C", // NOGRONI
];

/**
 * The 4px seven-segment flavour bar — the range as a structural motif rather
 * than decoration. Flush segments, whole colour wheel, no rainbow gradient.
 */
const SpectrumStrip = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cn("flex h-1 w-full overflow-hidden rounded-full", className)}
  >
    {FLAVOUR_COLORS.map((c) => (
      <i key={c} className="flex-1" style={{ background: c }} />
    ))}
  </div>
);

export default SpectrumStrip;
