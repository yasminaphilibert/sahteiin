import { useParams, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getChapterBySlug, isOpen } from "@/lib/chapters";
import CompareSlider from "@/components/CompareSlider";
import MetaBlock from "@/components/MetaBlock";
import RoadmapTimeline from "@/components/RoadmapTimeline";
import PricingTable from "@/components/PricingTable";
import WebsiteQuotes from "@/components/WebsiteQuotes";
import ChapterFooterNav from "@/components/ChapterFooterNav";
import SpectrumStrip from "@/components/SpectrumStrip";
import SignOff from "@/components/SignOff";
import ClinkMark from "@/components/ClinkMark";
import LockedNotice from "@/components/LockedNotice";
import StageBanner from "@/components/StageBanner";

/**
 * Scroll reveal, with the threshold kept deliberately low.
 *
 * `whileInView` starts a section at opacity 0 and waits for an
 * IntersectionObserver to undo it, so anything that stops the observer firing
 * leaves the content invisible. The default "some" threshold is the risky part:
 * a section with little or no laid-out area may never satisfy it. `amount:
 * 0.01` fires on the first sliver of intersection instead, and the gallery no
 * longer collapses to zero height now that its images load, so the case that
 * made this fragile is gone on both sides.
 */
const rise = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.01 },
  transition: { duration: 0.6, ease: [0.2, 0.7, 0.3, 1] as const },
};

/**
 * One generic chapter page — the whole proposal is content-driven, the way the
 * portfolio renders every project through one Project.tsx.
 */
const Chapter = () => {
  const { slug } = useParams();
  const chapter = slug ? getChapterBySlug(slug) : undefined;
  if (!chapter) return <Navigate to="/404" replace />;

  // A chapter whose phase has not been delivered yet is a real page the client
  // was probably sent a link to — so say what is in it and what opens it,
  // rather than pretending it does not exist.
  if (!isOpen(chapter)) {
    return (
      <>
        <StageBanner />
        <LockedNotice chapter={chapter} />
      </>
    );
  }

  const [intro, ...proseGroups] = chapter.description;

  return (
    <div className="pb-16">
      <StageBanner />
      {/* Hero.
          The box takes the image's aspect (all heroes are encoded 2280x1536,
          3:2) instead of a fixed viewport height with object-cover — the crop
          was cutting the carton's mark off the top and the sachets' crimps off
          the bottom. Every hero was composed edge to edge; show all of it. */}
      {chapter.heroImage && (
        <div className="container-custom pt-6">
          <motion.div
            className="media-frame bg-plum-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={chapter.heroImage}
              alt={chapter.heroAlt ?? chapter.title}
              width={2280}
              height={1536}
              className="block h-auto w-full"
            />
          </motion.div>
        </div>
      )}

      {/* Title + prose + metadata */}
      <motion.section className="container-custom py-14 md:py-20" {...rise}>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <Link to="/" className="label flex items-center gap-2 hover:text-bone-2">
              <ClinkMark className="h-4 w-4 text-amber" />
              {chapter.kicker}
            </Link>
          </div>
          <div className="md:col-span-9">
            <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2">
              <h1 className="display-heading text-4xl md:text-6xl">
                {chapter.title}
              </h1>
              {chapter.titleArabic && (
                <p className="arabic text-3xl text-bone md:text-4xl" lang="ar">
                  {chapter.titleArabic}
                </p>
              )}
            </div>
            {intro && (
              <div className="mb-12 flex max-w-[66ch] flex-col gap-5">
                {intro.map((p, i) => (
                  <p key={i} className="body-copy text-[17px]">
                    {p}
                  </p>
                ))}
              </div>
            )}
            <MetaBlock chapter={chapter} />
          </div>
        </div>
      </motion.section>

      <div className="container-custom">
        <SpectrumStrip />
      </div>

      {/* Comparison — same subject, resolved twice; click to turn the page. */}
      {chapter.comparisonPairs && chapter.comparisonPairs.length > 0 && (
        <motion.section className="py-16 md:py-20" {...rise}>
          <div className="container-custom">
            <div className="mx-auto max-w-4xl">
              <p className="label mb-3">
                {chapter.compareLabel ?? "Two renderings"}
                <span className="ml-3 normal-case tracking-normal text-bone-3">
                  click to turn the page
                </span>
              </p>
              {chapter.compareNote && (
                <p className="body-copy mb-8 max-w-[66ch] md:mb-10">
                  {chapter.compareNote}
                </p>
              )}
              <div className="grid grid-cols-1 gap-10 md:gap-14">
                {chapter.comparisonPairs.map((pair, i) => (
                  <motion.figure key={pair.label} {...rise}>
                    <CompareSlider
                      leftSrc={pair.left}
                      rightSrc={pair.right}
                      alt={pair.label}
                      initial={100}
                      eager={i === 0}
                    />
                    <figcaption className="label mt-4">{pair.label}</figcaption>
                  </motion.figure>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Gallery.
          Grid, not CSS columns, and eagerly loaded on purpose. These images
          carry no width/height, so before they load their box is zero-high —
          and a zero-high lazy image inside a multi-column container never
          trips the load, which left the whole gallery blank. A zero-high
          section also has no intersection area, so the reveal animation never
          fired either and the section stayed at opacity 0. Eight webp files is
          not a payload worth reintroducing that for. */}
      {chapter.galleryImages && chapter.galleryImages.length > 0 && (
        <motion.section className="container-custom py-10 md:py-14" {...rise}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {chapter.galleryImages.map((src) => (
              <div key={src} className="media-frame bg-plum-2">
                <img src={src} alt="" className="block w-full" />
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {chapter.showTimeline && (
        <motion.section className="container-custom py-10 md:py-14" {...rise}>
          <p className="label mb-6">Six weeks · start Monday, hand over in week six</p>
          <RoadmapTimeline />
        </motion.section>
      )}

      {chapter.showPricing && (
        <motion.section className="container-custom py-10 md:py-14" {...rise}>
          <PricingTable />
        </motion.section>
      )}

      {chapter.showWebsiteQuotes && (
        <motion.section className="container-custom py-10 md:py-14" {...rise}>
          <WebsiteQuotes />
        </motion.section>
      )}

      {/* Remaining prose groups — the closing beats, after the imagery and
          the spec blocks. */}
      {proseGroups.map((group, gi) => (
        <motion.section key={gi} className="container-custom py-10 md:py-14" {...rise}>
          <div className="mx-auto flex max-w-[66ch] flex-col gap-5">
            {group.map((p, i) => (
              <p key={i} className="body-copy text-[17px]">
                {p}
              </p>
            ))}
          </div>
        </motion.section>
      ))}

      {/* Colophon — the phase's commercial facts as a footer line, not a table. */}
      {chapter.closesWith && chapter.closesWith.length > 0 && (
        <motion.section className="container-custom py-10" {...rise}>
          <div className="border-t border-white/10 pt-6">
            <p className="font-mono text-[12px] uppercase leading-relaxed tracking-[0.14em] text-bone-3">
              {chapter.phase}
              {chapter.weeks ? ` · ${chapter.weeks}` : ""}
              {chapter.fee ? ` · ${chapter.fee}` : ""} · closes with:{" "}
              <span className="text-bone-2">{chapter.closesWith.join(" · ")}</span>
            </p>
          </div>
        </motion.section>
      )}

      <motion.section className="container-custom py-12 md:py-16" {...rise}>
        <SignOff />
      </motion.section>

      <div className="container-custom">
        <ChapterFooterNav current={chapter} />
      </div>
    </div>
  );
};

export default Chapter;
