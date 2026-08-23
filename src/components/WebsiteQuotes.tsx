/**
 * The two website routes, quoted separately from the core $6,500 — an
 * optional appendix, not a fifth phase. Durations and the commerce-platform
 * assumption are estimates flagged for confirmation before this goes out;
 * the two prices are the client's own numbers.
 */
const ROUTES = [
  {
    name: "The brand site",
    tag: "Marketing",
    price: "$1,600",
    weeks: "~2 weeks",
    blurb: "Tell the story, show the range, help someone find you on a shelf.",
    includes: [
      "Design mockups — home, the range, 1AM / 9AM, stockists, contact",
      "Desktop and mobile, laid out for EN and AR",
      "Built fast and static on the brand's own identity",
      "Hosting set up, analytics, launch",
    ],
  },
  {
    name: "The shop",
    tag: "Commercial",
    price: "$3,000",
    weeks: "~3 weeks",
    blurb: "Sell the seven and the multipack, direct, across Lebanon.",
    includes: [
      "Design mockups — home, range, product page, cart, checkout",
      "Built on a commerce platform, product catalogue loaded and priced",
      "Lebanon delivery zones, card and cash on delivery, bilingual",
      "Order emails, launch, a walkthrough of running it",
    ],
  },
];

const TERMS: Array<[string, string]> = [
  ["Payment", "50% to start, 50% on delivery — same terms as the core proposal."],
  ["Revisions", "Two rounds on the mockups before a line of the build starts."],
  [
    "Not included",
    "Domain, hosting and platform fees, payment-processor charges, product photography (covered by Chapter 04's shot list), and ongoing maintenance — available after launch at $300/day.",
  ],
  ["Timing", "Either route can start now, after week 6, or not at all — the $6,500 proposal stands on its own."],
];

const WebsiteQuotes = () => (
  <div className="flex flex-col gap-6">
    <div className="grid gap-5 md:grid-cols-2">
      {ROUTES.map((r) => (
        <div key={r.name} className="card-surface flex flex-col gap-5 p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label mb-1">{r.tag}</p>
              <h3 className="display-heading text-2xl">{r.name}</h3>
            </div>
            <div className="text-right">
              <p className="display-heading text-3xl">{r.price}</p>
              <p className="label mt-1">{r.weeks}</p>
            </div>
          </div>
          <p className="body-copy text-[15px]">{r.blurb}</p>
          <ul className="flex flex-col gap-2.5">
            {r.includes.map((line) => (
              <li
                key={line}
                className="relative pl-4 text-[14px] leading-relaxed text-bone-2 before:absolute before:left-0 before:top-[0.65em] before:h-[1.5px] before:w-[7px] before:bg-amber"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      ))}
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

export default WebsiteQuotes;
