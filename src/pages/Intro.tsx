import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PROJECT, money, validUntil } from "@/content/project-state";
import Wordmark from "@/components/Wordmark";
import SpectrumStrip from "@/components/SpectrumStrip";
import StageBanner from "@/components/StageBanner";
import TeaserStrip from "@/components/TeaserStrip";
import PhaseTracker from "@/components/PhaseTracker";
import OwnerChapterIndex from "@/components/OwnerChapterIndex";
import PaymentState from "@/components/PaymentState";
import SignOff from "@/components/SignOff";
import ClinkMark from "@/components/ClinkMark";
import { withBase } from "@/lib/utils";

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.2, 0.7, 0.3, 1] as const },
});

const Section = ({
  n,
  title,
  lede,
  children,
  delay = 0,
}: {
  n: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.section className="container-custom py-12 md:py-16" {...rise(delay)}>
    <div className="mb-8 flex flex-col gap-3 md:mb-10">
      <span className="label text-amber">{n}</span>
      <h2 className="display-heading text-2xl md:text-3xl">{title}</h2>
      {lede && <p className="body-copy max-w-[62ch]">{lede}</p>}
    </div>
    {children}
  </motion.section>
);

/**
 * The page the client opens first.
 *
 * It has one job: make it obvious what he is buying before he is asked to
 * sign anything. So it runs concept → outcome → method → money → devis, and
 * the outcome comes before the price on purpose. The chapters stay locked
 * behind it; this page has to carry the argument on its own.
 */
const Intro = () => (
  <div className="flex min-h-screen flex-col">
    <StageBanner />

    {/* Hero */}
    <header className="container-custom pb-12 pt-14 md:pt-20">
      <motion.div {...rise(0)} className="mb-8 flex items-center gap-3">
        <ClinkMark className="h-7 w-7 text-amber" />
        <p className="label">
          A rebrand for {PROJECT.client.name} · prepared by {PROJECT.from.name}
        </p>
      </motion.div>

      <motion.div
        {...rise(0.07)}
        className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4"
      >
        <Wordmark className="text-[clamp(3rem,11vw,7rem)]" />
        <p className="arabic pb-2 text-[clamp(1.6rem,4.4vw,2.6rem)] text-bone-2" lang="ar">
          صحتين
        </p>
      </motion.div>

      <motion.p {...rise(0.14)} className="body-copy mt-8 max-w-[62ch] text-lg">
        Seven cocktail flavours, a stick in every pocket, hydration with the
        manners of a bar. The idea already works — what it needs is the brand
        around it: a name that is truly yours, a look that owns a shelf, and
        packaging a printer can actually run.
      </motion.p>

      <motion.div {...rise(0.21)} className="mt-10">
        <SpectrumStrip />
      </motion.div>

      <motion.dl
        {...rise(0.28)}
        className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-4"
      >
        {[
          ["One price", money(PROJECT.total)],
          ["Timeline", "6 weeks"],
          ["Phases", String(PROJECT.phases.length)],
          ["Languages", "EN / AR"],
        ].map(([dt, dd]) => (
          <div key={dt} className="bg-plum px-4 py-4">
            <dt className="label mb-1.5">{dt}</dt>
            <dd className="text-[17px] font-bold tabular-nums text-bone">{dd}</dd>
          </div>
        ))}
      </motion.dl>
    </header>

    <main className="flex-1">
      <Section
        n="01 — Where this goes"
        title="What you end up with."
        lede="Before the money, the outcome. This is the work these six weeks produce — the box, the range, the campaign — so you can see exactly what you are signing up for."
        delay={0.35}
      >
        <TeaserStrip />
      </Section>

      <Section
        n="02 — How we work"
        title="Four phases, each ending in something you can hold."
        lede="Every phase closes with a real deliverable and a quick sign-off from you. Nothing big lands as a surprise, and each phase opens on this page as it is delivered — so you can always see where we are."
        delay={0}
      >
        <PhaseTracker />
        <div className="mt-6">
          <OwnerChapterIndex />
        </div>
      </Section>

      <Section
        n="03 — The money"
        title="One number, no ranges."
        lede="Half to start, half on delivery. Two revision rounds inside every phase, full ownership of the finished identity on final payment, and fonts licensed in your name."
        delay={0}
      >
        <PaymentState />
      </Section>

      {/* The devis */}
      <motion.section className="container-custom py-12 md:py-16" {...rise(0)}>
        <div className="card-surface flex flex-col gap-6 border-amber/40 p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-[46ch]">
            <p className="label mb-3 text-amber">The next step</p>
            <h2 className="display-heading mb-3 text-2xl md:text-3xl">
              Read the devis.
            </h2>
            <p className="body-copy text-[15px]">
              The formal quote — every line item, the payment schedule and the
              terms, on one page. Reference {PROJECT.reference}, valid until{" "}
              {validUntil()}. Say yes and the first phase starts Monday.
            </p>
          </div>
          <Link
            to="/devis"
            className="inline-flex shrink-0 items-center gap-3 rounded-full bg-amber px-7 py-4 font-mono text-[13px] uppercase tracking-[0.18em] text-plum transition-opacity hover:opacity-90"
          >
            Open the devis →
          </Link>
        </div>
      </motion.section>
    </main>

    <footer className="container-custom pb-14">
      <SpectrumStrip className="mb-8" />
      <SignOff />
      <p className="label mt-8">
        {PROJECT.from.name} · {PROJECT.from.location} · Ref {PROJECT.reference}
      </p>
    </footer>
  </div>
);

export default Intro;
