import { Link } from "react-router-dom";
import { loadChapters } from "@/lib/chapters";
import { isChapterOpen, phaseForChapter } from "@/content/project-state";
import { useSession } from "@/lib/session-context";

/**
 * Every chapter, for owners only.
 *
 * The phase tracker covers the four billable phases, but the book also holds
 * the prologue, the price page and the website chapter — none of which are
 * phases and so none of which the tracker lists. Without this, an owner has
 * no way to reach half the site except by remembering slugs.
 *
 * Renders nothing for the client, who should be seeing the tracker's story
 * rather than an index of things they cannot open.
 */
const OwnerChapterIndex = () => {
  const { role } = useSession();
  if (role !== "owner") return null;

  const chapters = loadChapters().filter((c) => c.released);

  return (
    <div className="card-surface border-amber/30 p-6 md:p-7">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <p className="label text-amber">Owner view · every chapter</p>
        <p className="label">Not visible to the client</p>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">
        {chapters.map((c) => {
          const openToClient = isChapterOpen(c.order);
          const phase = phaseForChapter(c.order);

          return (
            <li key={c.slug}>
              <Link
                to={`/c/${c.slug}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/10 px-4 py-3 transition-colors hover:border-white/25"
                style={{ borderLeft: `3px solid ${c.color}` }}
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] tabular-nums text-bone-3">
                    {String(c.order).padStart(2, "0")}
                  </span>
                  <span className="text-[14px] font-semibold text-bone">
                    {c.title}
                  </span>
                  {phase && (
                    <span className="label normal-case tracking-normal">
                      phase {phase.n}
                    </span>
                  )}
                </span>
                <span
                  className={
                    openToClient
                      ? "font-mono text-[10px] uppercase tracking-[0.14em] text-bone-2"
                      : "font-mono text-[10px] uppercase tracking-[0.14em] text-amber"
                  }
                >
                  {openToClient ? "Shared" : "Hidden"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OwnerChapterIndex;
