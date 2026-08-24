import { PROJECT, money } from "@/content/project-state";
/**
 * The commercial page as a spec sheet: one number set large, the conditions as
 * metadata rows. Nothing here is a pitch — the chapters were the pitch.
 */
const INCLUDED = [
  ["Two revision rounds", "inside every phase"],
  ["Full ownership", "of the finished identity on final payment"],
  ["Fonts and licences", "bought in your name"],
  ["Friendly rate", "priced to build something together, not to maximise a quote"],
];

const TERMS: Array<[string, string]> = [
  [
    "Not in this price",
    "Trademark filing & MoPH registration, printing costs, photography production. The website is quoted separately — see the next chapter.",
  ],
  [
    "Printing",
    "You run the printer relationship; I hand over files their machines can run and join the proof call so nothing is lost in translation.",
  ],
  [
    "Extra rounds",
    "Past two revision rounds in a phase, extra days are $300/day — always agreed before they happen, never after.",
  ],
  [
    "What protects the calendar",
    "Feedback within three working days and one decision-maker on your side. That is the whole deal.",
  ],
];

const PricingTable = () => (
  <div className="flex flex-col gap-6">
    <div className="card-surface flex flex-wrap items-center justify-between gap-8 border-amber/40 p-7 md:p-9">
      <div>
        <p className="display-heading text-5xl md:text-6xl">{money(PROJECT.total)}</p>
        <p className="label mt-3">flat · 50% to start · 50% on delivery</p>
      </div>
      <ul className="flex max-w-[44ch] flex-col gap-2.5">
        {INCLUDED.map(([b, rest]) => (
          <li
            key={b}
            className="relative pl-4 text-[15px] leading-relaxed text-bone-2 before:absolute before:left-0 before:top-[0.65em] before:h-[1.5px] before:w-[7px] before:bg-amber"
          >
            <b className="font-semibold text-bone">{b}</b> {rest}
          </li>
        ))}
      </ul>
    </div>
    <dl className="grid gap-4 sm:grid-cols-2">
      {TERMS.map(([dt, dd]) => (
        <div key={dt} className="card-surface p-5">
          <dt className="label mb-2">{dt}</dt>
          <dd className="text-sm leading-relaxed text-bone-2">{dd}</dd>
        </div>
      ))}
    </dl>
  </div>
);

export default PricingTable;
