import { AREA_DEFAULTS } from "../constants";
import type { ComparisonMode } from "../types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ControlsSectionProps = {
  mode: ComparisonMode;
  setMode: (mode: ComparisonMode) => void;
  area: string;
  setArea: (area: string) => void;
};

export function ControlsSection({
  mode,
  setMode,
  area,
  setArea,
}: ControlsSectionProps) {
  return (
    <section className="flent-neo-card mb-5 rounded-[20px] bg-bg-white p-5">
      <div className="mb-4">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
          I&apos;m comparing Flent against
        </div>
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as ComparisonMode)}
          variant="pill"
          className="w-full"
        >
          <TabsList className="flex w-full">
            <TabsTrigger value="roommate" className="!w-1/2 flex-1 md:!w-1/2">
              Renting with flatmates
            </TabsTrigger>
            <TabsTrigger value="1bhk" className="!w-1/2 flex-1 md:!w-1/2">
              Renting a 1BHK solo
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

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
