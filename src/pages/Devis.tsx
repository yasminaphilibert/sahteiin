import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PROJECT, money, validUntil } from "@/content/project-state";
import StageBanner from "@/components/StageBanner";
import SpectrumStrip from "@/components/SpectrumStrip";
import ClinkMark from "@/components/ClinkMark";
import SignOff from "@/components/SignOff";

const TERMS: Array<[string, string]> = [
  ["Revisions", "Two rounds inside every phase. Past two, extra days are $300/day — always agreed before they happen, never after."],
  ["Ownership", "Full ownership of the finished identity transfers to you on final payment. Fonts and licences are bought in your name."],
  ["Not in this price", "Trademark filing and MoPH registration, printing costs, photography production. The website is quoted separately below."],
  ["Printing", "You run the printer relationship. I hand over files their machines can run and join the proof call so nothing is lost in translation."],
  ["What protects the calendar", "Feedback within three working days, and one decision-maker on your side. That is the whole deal."],
  ["Validity", `This quote holds until ${validUntil()}. After that the scope stands but the numbers may need a look.`],
];

/**
 * The formal quote — the document that gets signed.
 *
 * Deliberately drier than the rest of the site: a devis is read for its
 * numbers and its terms, and decorating that reads as hiding something. The
 * brand shows up in the type and the ground, and then gets out of the way.
 */
const Devis = () => (
  <div className="flex min-h-screen flex-col">
    <StageBanner />

    <main className="container-custom flex-1 py-12 md:py-16">
      {/* Masthead */}
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="mb-8 flex items-center gap-3">
          <ClinkMark className="h-6 w-6 text-amber" />
          <span className="label">Devis · Quotation</span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="display-heading text-4xl md:text-5xl">
            {PROJECT.client.name} — rebrand
          </h1>
          <p className="arabic text-2xl text-bone-2" lang="ar">
            صحتين
          </p>
        </div>

        <SpectrumStrip className="mt-8" />

        <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
          {[
            ["Reference", PROJECT.reference],
            ["Issued", PROJECT.issued],
            ["Valid until", validUntil()],
            ["Currency", PROJECT.currency],
          ].map(([dt, dd]) => (
            <div key={dt}>
              <dt className="label mb-1">{dt}</dt>
              <dd className="font-mono text-[14px] tabular-nums text-bone">{dd}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="card-surface p-5">
            <p className="label mb-2">From</p>
            <p className="text-[15px] font-semibold text-bone">{PROJECT.from.name}</p>
            <p className="text-[14px] text-bone-2">{PROJECT.from.role}</p>
            <p className="text-[14px] text-bone-2">{PROJECT.from.location}</p>
            <a
              href={`mailto:${PROJECT.from.email}`}
              className="mt-1 inline-block text-[14px] text-amber underline decoration-amber/40 underline-offset-4"
            >
              {PROJECT.from.email}
            </a>
          </div>
          <div className="card-surface p-5">
            <p className="label mb-2">For</p>
            <p className="text-[15px] font-semibold text-bone">{PROJECT.client.name}</p>
            <p className="text-[14px] text-bone-2">Attn: {PROJECT.client.attn}</p>
            <p className="text-[14px] text-bone-2">{PROJECT.client.project}</p>
            <p className="text-[14px] text-bone-2">{PROJECT.client.location}</p>
          </div>
        </div>
      </motion.header>

      {/* Line items */}
      <section className="mb-12">
        <p className="label mb-5">Scope and fees</p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr className="border-b border-white/20">
                <th className="label py-3 text-left font-medium">Phase</th>
                <th className="label py-3 text-left font-medium">Deliverables</th>
                <th className="label py-3 text-left font-medium">Timing</th>
                <th className="label py-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {PROJECT.phases.map((p) => (
                <tr key={p.n} className="border-b border-white/10 align-top">
                  <td className="py-5 pr-4">
                    <span className="font-mono text-[12px] tabular-nums text-bone-3">
                      {String(p.n).padStart(2, "0")}
                    </span>
                    <span className="ml-3 text-[15px] font-semibold text-bone">
                      {p.name}
                    </span>
                  </td>
                  <td className="py-5 pr-4">
                    <ul className="flex flex-col gap-1">
                      {p.deliverables.map((d) => (
                        <li key={d} className="text-[13px] leading-relaxed text-bone-2">
                          {d}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-5 pr-4 text-[13px] whitespace-nowrap text-bone-2">
                    {p.weeks}
                  </td>
                  <td className="py-5 text-right font-mono text-[15px] tabular-nums text-bone">
                    {money(p.fee)}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={2} className="py-6" />
                <td className="py-6 pr-4">
                  <span className="label">Total</span>
                </td>
                <td className="py-6 text-right">
                  <span className="display-heading text-3xl">
                    {money(PROJECT.total)}
                  </span>
                  <span className="label mt-1 block">flat · 6 weeks</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Payment schedule */}
      <section className="mb-12">
        <p className="label mb-5">Payment schedule</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {PROJECT.payments.map((p) => (
            <div key={p.label} className="card-surface p-6">
              <div className="mb-2 flex items-baseline justify-between gap-4">
                <span className="text-[15px] font-semibold text-bone">
                  {p.label} · {p.pct}%
                </span>
                <span className="font-mono text-[17px] tabular-nums text-bone">
                  {money(p.amount)}
                </span>
              </div>
              <p className="text-[13px] text-bone-2">{p.due}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Optional add-ons — outside the total on purpose */}
      <section className="mb-12">
        <p className="label mb-2">Optional — quoted separately</p>
        <p className="body-copy mb-5 max-w-[62ch] text-[15px]">
          Neither is included in the {money(PROJECT.total)} above. Either can be
          added now, after week six, or not at all.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {PROJECT.addOns.map((a) => (
            <div key={a.name} className="card-surface flex items-baseline justify-between gap-4 p-5">
              <div>
                <p className="text-[15px] font-semibold text-bone">{a.name}</p>
                <p className="label mt-1">{a.weeks}</p>
              </div>
              <span className="font-mono text-[15px] tabular-nums text-bone-2">
                {money(a.fee)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Terms */}
      <section className="mb-12">
        <p className="label mb-5">Terms</p>
        <dl className="grid gap-4 sm:grid-cols-2">
          {TERMS.map(([dt, dd]) => (
            <div key={dt} className="card-surface p-5">
              <dt className="label mb-2">{dt}</dt>
              <dd className="text-[13px] leading-relaxed text-bone-2">{dd}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Acceptance */}
      <section className="mb-12">
        <div className="card-surface border-amber/40 p-8 md:p-10">
          <p className="label mb-3 text-amber">Acceptance</p>
          <h2 className="display-heading mb-4 text-2xl">
            Say yes and we start Monday.
          </h2>
          <p className="body-copy mb-8 max-w-[58ch] text-[15px]">
            Accepting this devis means agreeing the scope, the fee and the terms
            above. A reply confirming acceptance is enough to begin — a
            signature below is welcome if you prefer it on paper. The first
            thing you will see is a one-page brief that proves we are building
            the same thing.
          </p>

          <a
            href={`mailto:${PROJECT.from.email}?subject=${encodeURIComponent(
              `Devis ${PROJECT.reference} — accepted`
            )}`}
            className="mb-8 inline-flex items-center gap-3 rounded-full bg-amber px-7 py-3.5 font-mono text-[13px] uppercase tracking-[0.18em] text-plum transition-opacity hover:opacity-90"
          >
            Accept by email →
          </a>

          <div className="grid gap-8 sm:grid-cols-3">
            {["Name and title", "Signature", "Date"].map((l) => (
              <div key={l}>
                <div className="h-10 border-b border-white/25" />
                <p className="label mt-2">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Link to="/" className="link-cta">
        ← Back to the project
      </Link>
    </main>

    <footer className="container-custom pb-14">
      <SpectrumStrip className="mb-8" />
      <SignOff />
      <p className="label mt-8">
        {PROJECT.from.name} · {PROJECT.from.location} · Ref {PROJECT.reference} ·
        Valid until {validUntil()}
      </p>
    </footer>
  </div>
);

export default Devis;
