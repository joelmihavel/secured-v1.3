import { formatCurrency } from "../utils";

type UpfrontSectionProps = {
  flentUpfront: number;
  tradUpfront: number;
};

export function UpfrontSection({ flentUpfront, tradUpfront }: UpfrontSectionProps) {
  return (
    <section className="flent-neo-card mb-5 rounded-[20px] bg-pastel-cyan p-5">
      <h4 className="mb-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-text-main/60">
        Day 1 - Cash Out of Pocket
      </h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border-2 border-text-main bg-bg-white p-4 text-center">
          <div className="mb-1 text-[11px] font-bold text-text-main">Flent</div>
          <div className="text-[22px] font-extrabold text-text-main">{formatCurrency(flentUpfront)}</div>
          <div className="mt-1 text-[11px] text-text-main/65">3mo deposit + 1st month</div>
        </div>
        <div className="rounded-2xl bg-secondary-background p-4 text-center">
          <div className="mb-1 text-[11px] font-bold text-text-main/70">Traditional</div>
          <div className="text-[22px] font-extrabold text-text-main">{formatCurrency(tradUpfront)}</div>
          <div className="mt-1 text-[11px] text-text-main/65">Deposit + brokerage + furnishing</div>
        </div>
      </div>
      {tradUpfront > flentUpfront ? (
        <div className="mt-3 text-center text-[13px] font-bold text-text-main">
          {formatCurrency(tradUpfront - flentUpfront)} less cash needed upfront with Flent
        </div>
      ) : null}
    </section>
  );
}
