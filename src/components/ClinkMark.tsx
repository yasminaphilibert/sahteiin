import { cn } from "@/lib/utils";

/**
 * The clink — two strokes meeting, a spark where they touch. Drawn on a
 * 24-unit grid; these paths are the production vectors from the identity work,
 * not an illustration of them.
 */
const ClinkMark = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    className={cn("h-6 w-6", className)}
    aria-hidden
  >
    <path d="M8.6 21 10.9 5.6" />
    <path d="M15.4 21 13.1 5.6" />
    <path d="M12 1.4v1.7" strokeWidth="1.5" />
    <path d="M9.9 2.5l1 1.2" strokeWidth="1.5" />
    <path d="M14.1 2.5l-1 1.2" strokeWidth="1.5" />
  </svg>
);

export default ClinkMark;
