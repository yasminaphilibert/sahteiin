import { Link } from "react-router-dom";
import type { ChapterContent } from "@/lib/chapters";
import { phaseForChapter, money } from "@/content/project-state";
import ClinkMark from "@/components/ClinkMark";

/**
 * What a client sees at a chapter that has not opened yet.
 *
 * Deliberately not a 404: the chapter exists and they were probably sent the
 * link, so the honest answer is "this is real, here is what is in it, here is
 * what opens it" rather than pretending the page is missing.
 */
const LockedNotice = ({ chapter }: { chapter: ChapterContent }) => {
  const phase = phaseForChapter(chapter.order);

  return (
    <div className="container-custom flex min-h-[70vh] flex-col items-center justify-center py-20">
      <div className="card-surface w-full max-w-xl p-8 md:p-10">
        <div className="mb-6 flex items-center gap-3">
          <ClinkMark className="h-5 w-5 text-amber" />
          <span className="label">{chapter.kicker}</span>
        </div>

        <h1 className="display-heading mb-4 text-3xl md:text-4xl">
          {chapter.title}
        </h1>

        <p className="body-copy mb-7">
          {phase
            ? `This chapter holds the work from phase ${phase.n} — ${phase.name}. It opens here once that phase is delivered.`
            : "This chapter opens later in the project."}
        </p>

        {phase && (
          <>
            <p className="label mb-3">What it will contain</p>
            <ul className="mb-7 flex flex-col gap-2">
              {phase.deliverables.map((d) => (
                <li
                  key={d}
                  className="relative pl-4 text-[14px] leading-relaxed text-bone-2 before:absolute before:left-0 before:top-[0.68em] before:h-[1.5px] before:w-[7px] before:bg-amber"
                >
                  {d}
                </li>
              ))}
            </ul>
            <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
              <span className="label">{phase.weeks}</span>
              <span className="font-mono text-[13px] tabular-nums text-bone-2">
                {money(phase.fee)}
              </span>
            </div>
          </>
        )}

        <Link to="/" className="link-cta">
          ← Back to the project
        </Link>
      </div>
    </div>
  );
};

export default LockedNotice;
