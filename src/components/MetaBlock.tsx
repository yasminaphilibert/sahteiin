import type { ChapterContent } from "@/lib/chapters";

const Pills = ({ items }: { items: string[] }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((t) => (
      <span
        key={t}
        className="rounded-full border border-white/20 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-bone-2"
      >
        {t}
      </span>
    ))}
  </div>
);

/**
 * The metadata block — location, year, tags, keywords, tools — the same
 * grammar as a portfolio project page. Facts as metadata, not as a pitch.
 */
const MetaBlock = ({ chapter }: { chapter: ChapterContent }) => {
  const rows: Array<[string, React.ReactNode]> = [];
  if (chapter.location) rows.push(["Location", chapter.location]);
  if (chapter.year) rows.push(["Year", chapter.year]);
  if (chapter.weeks) rows.push(["Weeks", chapter.weeks]);
  if (chapter.fee) rows.push(["Fee", chapter.fee]);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 self-start">
        {rows.map(([dt, dd]) => (
          <div key={dt}>
            <dt className="label mb-1">{dt}</dt>
            <dd className="text-[15px] font-semibold tabular-nums text-bone">
              {dd}
            </dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-col gap-5">
        {chapter.tags && chapter.tags.length > 0 && (
          <div>
            <p className="label mb-2">Tags</p>
            <Pills items={chapter.tags} />
          </div>
        )}
        {chapter.keywords && chapter.keywords.length > 0 && (
          <div>
            <p className="label mb-2">Keywords</p>
            <p className="text-sm text-bone-2">{chapter.keywords.join(", ")}</p>
          </div>
        )}
        {chapter.tools && chapter.tools.length > 0 && (
          <div>
            <p className="label mb-2">Tools used</p>
            <Pills items={chapter.tools} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MetaBlock;
