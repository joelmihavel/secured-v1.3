import type { ComparisonMode } from "../types";

const CheckIcon = () => (
  <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-forest-green">
    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </div>
);

const CrossIcon = () => (
  <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-pastel-red">
    <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="var(--color-brick-red)" strokeWidth="4">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </div>
);

type BeyondNumbersSectionProps = {
  mode: ComparisonMode;
};

export function BeyondNumbersSection({ mode }: BeyondNumbersSectionProps) {
  const rows = [
    ["Move in tomorrow", "2-4 weeks of house hunting"],
    ["Zero brokerage, always", "1 month rent to a broker"],
    ["No landlord interaction", "Monthly landlord visits & opinions"],
    ["3 months deposit", "6-10 months deposit locked up"],
    ["Maintenance handled by Flent", "You call the plumber yourself"],
    ["Designer home, ready to live", "Empty flat, start from zero"],
    ["₹5,000 exit fee - that's it", "₹30k+ painting & surprise deductions"],
    ["Wi-Fi & water purifier included", "Arrange and install yourself"],
    ...(mode === "roommate" ? [["Flatmate matching by Flent", "Weeks of interviews & guessing"]] : []),
  ];

  return (
    <section className="flent-neo-card mb-5 rounded-[20px] bg-bg-white p-5">
      <h4 className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
        Beyond the numbers
      </h4>
      <p className="mb-4 text-xs text-muted-foreground">
        Things that don&apos;t show up in a spreadsheet.
      </p>
      <div className="flex flex-col gap-1.5">
        {rows.map(([flent, traditional]) => (
          <div key={flent} className="grid grid-cols-2 gap-1.5">
            <div className="flex items-center gap-2 rounded-[10px] border border-forest-green/20 bg-forest-green/5 px-2.5 py-2">
              <CheckIcon />
              <span className="text-xs font-semibold text-forest-green">{flent}</span>
            </div>
            <div className="flex items-center gap-2 rounded-[10px] border border-border bg-secondary-background px-2.5 py-2">
              <CrossIcon />
              <span className="text-xs text-muted-foreground">{traditional}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
