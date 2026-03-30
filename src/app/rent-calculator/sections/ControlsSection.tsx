import { AREA_DEFAULTS } from "../constants";

type ControlsSectionProps = {
  area: string;
  setArea: (area: string) => void;
};

export function ControlsSection({
  area,
  setArea,
}: ControlsSectionProps) {
  return (
    <section className="flent-neo-card mb-5 rounded-[20px] bg-bg-white p-5">
      <div>
        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
          Area
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(AREA_DEFAULTS).map((value) => (
            <button
              key={value}
              onClick={() => setArea(value)}
              className={`rounded-[10px] border-2 px-4 py-2 text-sm font-semibold ${
                area === value
                  ? "border-text-main bg-text-main text-text-invert"
                  : "border-border bg-bg-white text-text-main"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <p className="mt-3 text-subtitle-sm text-muted-foreground">
          Traditional rental defaults based on avg. {area} market rates. Deposit opportunity cost @
          12% p.a. All traditional-side numbers are editable.
        </p>
      </div>
    </section>
  );
}
