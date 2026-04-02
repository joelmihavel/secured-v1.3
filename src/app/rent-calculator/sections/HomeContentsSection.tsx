import type { FurnitureMode } from "../types";
import { formatCurrency } from "../utils";

type HomeContentsSectionProps = {
  furnitureMode: FurnitureMode;
  tradFurniture: number;
};

export function HomeContentsSection({
  furnitureMode,
  tradFurniture,
}: HomeContentsSectionProps) {
  const tradItemsCount = furnitureMode === "rent" ? "8" : "~15";
  const tradItemsLabel = furnitureMode === "rent" ? "rented" : "purchased";
  const tradAmount = formatCurrency(tradFurniture);

  return (
    <section className="flent-neo-card mb-5 rounded-[20px] bg-pastel-orange p-5">
      <h4 className="mb-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-text-main/60">
        What&apos;s in your home
      </h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="text-center">
          <div className="mb-1 font-heading text-[42px] italic text-text-main">200+</div>
          <div className="mb-2 text-subtitle-sm font-bold font-body text-text-main/80">
            items included with Flent
          </div>
          <p className="text-left text-subtitle-sm font-body text-text-main/70">
            A Flent home is completely ready to live in from hour one. Every home comes
            fully equipped, from beds and pillows to cutlery and everyday essentials.
          </p>
        </div>

        <div className="text-center">
          <div className="mb-1 font-heading text-[42px] italic text-text-main/70">
            {tradItemsCount}
          </div>
          <div className="mb-2 text-subtitle-sm font-bold font-body text-text-main/70">
            items {tradItemsLabel}
          </div>
          <p className="text-left text-subtitle-sm font-body text-text-main/70">
            {furnitureMode === "buy" ? (
              <>
                You spend {tradAmount} and get the basics and you&apos;re locked into it.
                Moving becomes a hassle, and resale value drops by around 50% within the first
                year.
              </>
            ) : (
              <>
                You spend {tradAmount}, you get functional, no-frills furniture. You still end up
                buying essentials like linen and kitchen items because you cannot rent these.
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
