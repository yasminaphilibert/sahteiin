import { Link } from "react-router-dom";
import type { ChapterContent } from "@/lib/chapters";
import { getOpenChapters, loadChapters } from "@/lib/chapters";
import { isChapterOpen } from "@/content/project-state";

/**
 * Prev/next runs over released chapters only. An unlisted chapter never
 * advertises its neighbours' existence and is never advertised by them — the
 * share link is the only door.
 */
const ChapterFooterNav = ({ current }: { current: ChapterContent }) => {
  const released = getOpenChapters();
  const idx = released.findIndex((c) => c.slug === current.slug);
  const prev = idx > 0 ? released[idx - 1] : null;
  const next = idx >= 0 && idx < released.length - 1 ? released[idx + 1] : null;
  // The "revealed at sign-off" teaser only makes sense while an unreleased
  // chapter actually sits between here and the end of the book.
  const hasLockedAhead = loadChapters().some(
    (c) => !isChapterOpen(c.order) && c.order > current.order
  );

  return (
    <nav className="grid gap-4 sm:grid-cols-2">
      <Link
        to={prev ? `/c/${prev.slug}` : "/"}
        className="card-surface group flex flex-col gap-2 p-6 transition-colors hover:border-white/25"
      >
        <span className="label">{prev ? "Previous" : "Back to"}</span>
        <span className="display-heading text-lg">
          {prev ? prev.title : "THE TOAST"}
        </span>
      </Link>
      {next ? (
        <Link
          to={`/c/${next.slug}`}
          className="card-surface group flex flex-col items-end gap-2 p-6 text-right transition-colors hover:border-white/25"
          style={{ borderColor: `${next.color}55` }}
        >
          <span className="label">Next chapter</span>
          <span className="display-heading text-lg">{next.title}</span>
        </Link>
      ) : hasLockedAhead ? (
        <div className="card-surface flex flex-col items-end justify-center gap-2 p-6 text-right opacity-70">
          <span className="label">The next chapter</span>
          <span className="text-sm text-bone-2">
            is revealed at the next sign-off.
          </span>
        </div>
      ) : (
        <div className="card-surface flex flex-col items-end justify-center gap-2 p-6 text-right opacity-70">
          <span className="label">The end</span>
          <span className="arabic text-lg text-bone-2" lang="ar">
            صحتين
          </span>
        </div>
      )}
    </nav>
  );
};

export default ChapterFooterNav;
