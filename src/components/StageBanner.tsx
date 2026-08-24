import { PROJECT, stageCopy, type Stage } from "@/content/project-state";

const STAGES: Stage[] = ["proposal-sent", "accepted", "in-progress", "delivered"];

/**
 * Where the job stands, stated at the top of every page the client opens.
 *
 * A proposal that never says "you have not accepted this yet" leaves the
 * client guessing whether work has quietly started and whether they owe
 * anything. The banner answers both before they scroll.
 */
const StageBanner = () => {
  const { label, line } = stageCopy();
  const idx = STAGES.indexOf(PROJECT.stage);

  return (
    <div className="border-b border-white/10 bg-plum-2/60">
      <div className="container-custom flex flex-wrap items-center gap-x-8 gap-y-3 py-3">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-amber opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber" />
          </span>
          <span className="label text-bone">{label}</span>
        </div>
        <p className="flex-1 text-[13px] text-bone-2">{line}</p>
        <div className="flex items-center gap-1.5" aria-hidden>
          {STAGES.map((s, i) => (
            <span
              key={s}
              className="h-[3px] w-8 rounded-full"
              style={{
                background: i <= idx ? "#F5B44C" : "rgba(244,240,247,.16)",
              }}
            />
          ))}
        </div>
        <span className="label">
          Ref {PROJECT.reference}
        </span>
      </div>
    </div>
  );
};

export default StageBanner;
