/**
 * The six weeks as a gantt. Phase rows against a week grid; the bars carry the
 * chapter colours so the roadmap reads in the same key as the spectrum nav.
 */
const PHASES = [
  { label: "1 Foundations", start: 0, span: 1.5, color: "#4FBE8F" },
  { label: "2 Identity", start: 1.5, span: 1.5, color: "#F2C230" },
  { label: "3 Packaging", start: 3, span: 2, color: "#2E9BD6" },
  { label: "4 Launch kit", start: 5, span: 1, color: "#B01E3C" },
];

const WEEKS = 6;

const RoadmapTimeline = () => (
  <div className="card-surface overflow-x-auto p-5 md:p-6">
    <div className="min-w-[460px]">
      <div
        aria-hidden
        className="mb-2 ml-[118px] grid border-b border-white/10 pb-2"
        style={{ gridTemplateColumns: `repeat(${WEEKS}, 1fr)` }}
      >
        {Array.from({ length: WEEKS }, (_, i) => (
          <span
            key={i}
            className="text-center font-mono text-[11px] text-bone-3"
          >
            {i === 0 ? "wk 1" : i + 1}
          </span>
        ))}
      </div>
      {PHASES.map((p) => (
        <div
          key={p.label}
          className="grid items-center py-1.5"
          style={{ gridTemplateColumns: "118px 1fr" }}
        >
          <span className="whitespace-nowrap pr-3 font-mono text-[12px] text-bone-2">
            {p.label}
          </span>
          <div
            className="relative h-5 rounded"
            style={{
              background: `linear-gradient(90deg, rgba(255,255,255,.10) 1px, transparent 1px) 0 0 / ${100 / WEEKS}% 100%`,
            }}
          >
            <div
              className="absolute bottom-[3px] top-[3px] rounded-full opacity-90"
              style={{
                left: `${(p.start / WEEKS) * 100}%`,
                width: `${(p.span / WEEKS) * 100}%`,
                background: p.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default RoadmapTimeline;
