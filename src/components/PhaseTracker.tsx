import { Link } from "react-router-dom";
import { PROJECT, money, isChapterOpen, type PhaseStatus } from "@/content/project-state";
import { loadChapters } from "@/lib/chapters";
import { useSession } from "@/lib/session-context";
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
 * Two audiences, one component. The client gets the honest picture — a locked
 * phase is dimmed and says what has to happen before it opens. An owner gets
 * a working index: every phase is reachable regardless of the project state,
 * because the person deciding whether a phase is ready has to be able to read
 * it first. That distinction is marked, not hidden, so an owner is never
 * confused about which view they are looking at.
 */
const PhaseTracker = ({ compact = false }: { compact?: boolean }) => {
  const chapters = loadChapters();
  const { role } = useSession();
  const isOwner = role === "owner";

  return (
    <ol className="flex flex-col gap-3">
      {PROJECT.phases.map((p, i) => {
        const openToClient = isChapterOpen(p.chapter);
        const chapter = chapters.find((c) => c.order === p.chapter);
        const reachable = (openToClient || isOwner) && !!chapter;
        const status = STATUS[p.status];

        return (
          <li key={p.n}>
            <div
              className={cn(
                "card-surface flex flex-col gap-4 p-5 md:p-6",
                reachable && "transition-colors hover:border-white/25",
                !openToClient && !isOwner && "opacity-70"
              )}
              style={{ borderLeft: `4px solid ${FLAVOUR[i]}` }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="font-mono text-[12px] tabular-nums text-bone-3">
                    {String(p.n).padStart(2, "0")}
                  </span>
                  <span className="display-heading text-lg md:text-xl">{p.name}</span>
                  {reachable && chapter && (
                    <span className="label normal-case tracking-normal text-bone-3">
                      {chapter.title}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
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
                  {/* An owner needs to see, at a glance, what the client is
                      currently allowed to open — otherwise "everything works
                      for me" hides a phase that was never handed over. */}
                  {isOwner && !openToClient && (
                    <span className="rounded-full border border-amber/50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-amber">
                      Hidden from client
                    </span>
                  )}
                </div>
              </div>

              {!compact && (
                <>
                  <ul className="flex flex-col gap-1.5">
                    {p.deliverables.map((d) => (
                      <li
                        key={d}
                        className="relative pl-4 text-[14px] leading-relaxed text-bone-2"
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

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <span className="label">{p.weeks}</span>

                    {reachable && chapter ? (
                      <Link
                        to={`/c/${chapter.slug}`}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full px-5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-opacity hover:opacity-85",
                          openToClient
                            ? "bg-amber text-plum"
                            : "border border-amber/50 text-amber"
                        )}
                      >
                        {openToClient ? "Open this phase →" : "Preview as owner →"}
                      </Link>
                    ) : (
                      <span className="text-[13px] text-bone-3">
                        Opens when phase {p.n} is delivered
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default PhaseTracker;
