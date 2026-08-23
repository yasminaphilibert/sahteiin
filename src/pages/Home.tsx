import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { loadChapters } from "@/lib/chapters";
import Wordmark from "@/components/Wordmark";
import SpectrumStrip from "@/components/SpectrumStrip";
import SignOff from "@/components/SignOff";
import ClinkMark from "@/components/ClinkMark";

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.2, 0.7, 0.3, 1] as const },
});

/**
 * The cover. Lists released chapters only; an unreleased chapter shows as a
 * locked flavour-colour block — the gating itself dramatises the phase
 * structure: each one is revealed at a sign-off.
 */
const Home = () => {
  const chapters = loadChapters();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="container-custom pb-10 pt-16 md:pt-24">
        <motion.div {...rise(0)} className="mb-8 flex items-center gap-3">
          <ClinkMark className="h-7 w-7 text-amber" />
          <p className="label">A proposal, in chapters · for the ElectroNytes project</p>
        </motion.div>
        <motion.div {...rise(0.07)} className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
          <Wordmark className="text-[clamp(3rem,11.5vw,7.5rem)]" />
          <p className="arabic pb-2 text-[clamp(1.6rem,4.4vw,2.6rem)] text-bone-2" lang="ar">
            صحتين
          </p>
        </motion.div>
        <motion.p {...rise(0.14)} className="body-copy mt-8 max-w-[62ch] text-lg">
          Seven cocktail flavours, a stick in every pocket, hydration with the
          manners of a bar. The idea is good — this is the brand around it, told
          one chapter at a time. Each chapter is a phase; each phase ends in
          something you can hold.
        </motion.p>
        <motion.div {...rise(0.21)} className="mt-10">
          <SpectrumStrip />
        </motion.div>
      </header>

      <main className="container-custom flex-1 pb-16">
        <div className="grid gap-4">
          {chapters.map((c, i) =>
            c.released ? (
              <motion.div key={c.slug} {...rise(0.28 + i * 0.05)}>
                <Link
                  to={`/c/${c.slug}`}
                  className="card-surface group flex items-baseline justify-between gap-6 p-6 transition-colors hover:border-white/25 md:p-7"
                  style={{ borderLeft: `4px solid ${c.color}` }}
                >
                  <div className="flex items-baseline gap-5">
                    <span className="font-mono text-[12px] tabular-nums text-bone-3">
                      {String(c.order).padStart(2, "0")}
                    </span>
                    <span className="display-heading text-xl md:text-2xl">
                      {c.title}
                    </span>
                  </div>
                  <span className="link-cta hidden group-hover:text-bone sm:inline">
                    Read →
                  </span>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key={c.slug}
                {...rise(0.28 + i * 0.05)}
                className="card-surface flex items-baseline justify-between gap-6 p-6 opacity-60 md:p-7"
                style={{ borderLeft: `4px solid ${c.color}` }}
                aria-label={`Chapter ${c.order} — revealed at the next sign-off`}
              >
                <div className="flex items-baseline gap-5">
                  <span className="font-mono text-[12px] tabular-nums text-bone-3">
                    {String(c.order).padStart(2, "0")}
                  </span>
                  <span
                    className="display-heading text-xl tracking-widest md:text-2xl"
                    style={{ color: c.color }}
                  >
                    ▪▪▪▪▪▪
                  </span>
                </div>
                <span className="label">revealed at sign-off</span>
              </motion.div>
            )
          )}
        </div>
      </main>

      <footer className="container-custom pb-14">
        <SpectrumStrip className="mb-8" />
        <SignOff />
        <p className="label mt-8">
          Prepared by Yasmina · Beirut · valid 30 days
        </p>
      </footer>
    </div>
  );
};

export default Home;
