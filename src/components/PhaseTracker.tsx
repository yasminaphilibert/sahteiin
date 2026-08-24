import { Link } from "react-router-dom";
import { PROJECT, money, isChapterOpen, type PhaseStatus } from "@/content/project-state";
import { loadChapters } from "@/lib/chapters";
import { cn } from "@/lib/utils";

const FLAVOUR = ["#4FBE8F", "#F2C230", "#2E9BD6", "#B01E3C"];

const STATUS: Record<PhaseStatus, { text: string; tone: string }> = {
  locked: { text: "Locked", tone: "text-bone-3 border-white/15" },
  current: { text: "In progress", tone: "text-amber border-amber/50" },
  "in-review": { text: "With you for review", tone: "text-amber border-amber/50" },
  delivered: { text: "Delivered", tone: "text-bone border-white/35" },
  approved: { text: "Approved", tone: "text-bone border-white/35" },
};

/**
 * The four phases and where each one stands.
 *
 * Doubles as the site's navigation once the job is running: a delivered phase
 * links to the chapter showing that work, a locked one says plainly what has
 * to happen before it opens. `compact` drops the deliverable lists for the
 * strip shown on chapter pages.
 */
const PhaseTracker = ({ compact = false }: { compact?: boolean }) => {
  const chapters = loadChapters();

  return (
    <ol className="flex flex-col gap-3">
      {PROJECT.phases.map((p, i) => {
        const open = isChapterOpen(p.chapter);
        const chapter = chapters.find((c) => c.order === p.chapter);
        const status = STATUS[p.status];

        const body = (
          <div
            className={cn(
              "card-surface flex flex-col gap-4 p-5 md:p-6",
              open && "transition-colors hover:border-white/25",
              !open && "opacity-70"
            )}
            style={{ borderLeft: `4px solid ${FLAVOUR[i]}` }}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-[12px] tabular-nums text-bone-3">
                  {String(p.n).padStart(2, "0")}
                </span>
                <span className="display-heading text-lg md:text-xl">{p.name}</span>
                {open && chapter && (
                  <span className="label normal-case tracking-normal text-bone-3">
                    {chapter.title}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[13px] tabular-nums text-bone-2">
                  {money(p.fee)}
                </span>
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]",
                    status.tone
                  )}
                >
                  {status.text}
                </span>
              </div>
            </div>

            {!compact && (
              <>
                <ul className="flex flex-col gap-1.5">
                  {p.deliverables.map((d) => (
                    <li
                      key={d}
                      className="relative pl-4 text-[14px] leading-relaxed text-bone-2 before:absolute before:left-0 before:top-[0.68em] before:h-[1.5px] before:w-[7px]"
                      style={{ ["--tw-before-bg" as string]: FLAVOUR[i] }}
                    >
                      <span
                        aria-hidden
                        className="absolute left-0 top-[0.68em] h-[1.5px] w-[7px]"
                        style={{ background: FLAVOUR[i] }}
                      />
                      {d}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                  <span className="label">{p.weeks}</span>
                  <span className="text-[13px] text-bone-3">
                    {open
                      ? "Open — the work is here"
                      : `Opens when phase ${p.n} is delivered`}
                  </span>
                </div>
              </>
            )}
          </div>
        );

        return (
          <li key={p.n}>
            {open && chapter ? (
              <Link to={`/c/${chapter.slug}`} className="block">
                {body}
              </Link>
            ) : (
              body
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default PhaseTracker;
