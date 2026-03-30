import { formatCurrency } from "../utils";

type UpfrontSectionProps = {
  flentUpfront: number;
  tradUpfront: number;
};

export function UpfrontSection({ flentUpfront, tradUpfront }: UpfrontSectionProps) {
  const upfrontDelta = tradUpfront - flentUpfront;
  const flentNeedsLessUpfront = upfrontDelta > 0;

  return (
    <section className="flent-neo-card mb-5 rounded-[20px] bg-pastel-cyan p-5">
      <div>
        <div className="mb-1 font-zin-italic text-6xl leading-none text-text-main">
          {formatCurrency(Math.abs(upfrontDelta))}
        </div>
        <p className="mb-3 text-subtitle-sm font-body text-text-main/80">
          {flentNeedsLessUpfront
            ? "less cash needed upfront with Flent"
            : "more cash needed upfront with Flent"}
        </p>
        <p className="max-w-[560px] text-subtitle-sm font-body text-text-main/85">
          Traditional renting costs{" "}
          <span className="font-bold text-text-main">{formatCurrency(tradUpfront)}</span> as you
          would have to pay a higher deposit, fixed brokerage and for furnishing.
        </p>
      </div>
    </section>
  );
}
