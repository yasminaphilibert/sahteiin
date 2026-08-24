import { PROJECT, money, validUntil, type PaymentStatus } from "@/content/project-state";
import { cn } from "@/lib/utils";

const STATUS: Record<PaymentStatus, { text: string; tone: string }> = {
  due: { text: "Due", tone: "text-amber border-amber/50" },
  paid: { text: "Paid", tone: "text-hugo border-hugo/50" },
  scheduled: { text: "Scheduled", tone: "text-bone-3 border-white/15" },
};

/**
 * The money, and only the money: what is owed, when, and what has landed.
 *
 * Kept separate from the devis so the client can check where they stand
 * without reopening a formal document — the question "have I paid this yet"
 * should never require reading a contract.
 */
const PaymentState = () => (
  <div className="card-surface p-6 md:p-7">
    <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
      <p className="label">Payment schedule</p>
      <p className="label">
        {PROJECT.currency} · 50 / 50
      </p>
    </div>

    <ul className="flex flex-col">
      {PROJECT.payments.map((p) => {
        const s = STATUS[p.status];
        return (
          <li
            key={p.label}
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-white/10 py-4 first:pt-0"
          >
            <div className="flex items-baseline gap-3">
              <span className="text-[15px] font-semibold text-bone">{p.label}</span>
              <span className="label normal-case tracking-normal">{p.due}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[15px] tabular-nums text-bone">
                {money(p.amount)}
              </span>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]",
                  s.tone
                )}
              >
                {s.text}
              </span>
            </div>
          </li>
        );
      })}
    </ul>

    <div className="flex flex-wrap items-baseline justify-between gap-4 pt-5">
      <div>
        <p className="label mb-1">Total</p>
        <p className="display-heading text-3xl">{money(PROJECT.total)}</p>
      </div>
      <p className="text-[13px] text-bone-3">
        Flat — no ranges, no surprises.
        <br />
        This quote is valid until {validUntil()}.
      </p>
    </div>
  </div>
);

export default PaymentState;
