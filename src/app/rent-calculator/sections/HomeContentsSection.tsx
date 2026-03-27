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
  return (
    <section className="flent-neo-card mb-5 rounded-[20px] bg-pastel-orange p-5">
      <h4 className="mb-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-text-main/60">
        What&apos;s in your home
      </h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border-2 border-text-main bg-bg-white p-4.5 text-center">
          <div className="mb-1 font-heading text-[42px] italic text-text-main">200+</div>
          <div className="mb-2 text-[11px] font-bold text-text-main">items included with Flent</div>
          <div className="text-left text-xs leading-5 text-text-main/70">
            Bed, wardrobe, desk, sofa, dining, AC, washing machine, microwave, cookware,
            cutlery, water purifier, Wi-Fi router, curtains, bedsheets, pillows, and more.
          </div>
          <div className="mt-2.5 rounded-[10px] bg-brand-orange/30 py-1.5 text-xs font-extrabold text-text-main">
            Extra cost: {formatCurrency(0)}
          </div>
        </div>

        <div className="rounded-2xl bg-secondary-background p-4.5 text-center">
          <div className="mb-1 font-heading text-[42px] italic text-text-main/70">
            {furnitureMode === "rent" ? "8" : "~15"}
          </div>
          <div className="mb-2 text-[11px] font-bold text-text-main/70">
            items {furnitureMode === "rent" ? "rented" : "purchased"}
          </div>
          <div className="text-left text-xs leading-5 text-text-main/70">
            {furnitureMode === "rent"
              ? "Bed, mattress, wardrobe, desk, chair, sofa, dining, washing machine. No kitchenware, curtains, or appliances."
              : "Basic furniture. Stuck with it when you move. Resale drops ~50% in year one."}
          </div>
          {furnitureMode === "rent" ? (
            <div className="mt-2 text-[11px] text-text-main/55">
              via <strong>Furlenco</strong> - <strong>Rentomojo</strong> -{" "}
              <strong>Cityfurnish</strong>
            </div>
          ) : null}
          <div className="mt-2.5 rounded-[10px] bg-brand-orange/30 py-1.5 text-xs font-extrabold text-text-main">
            Extra cost: {formatCurrency(tradFurniture)}
          </div>
        </div>
      </div>
    </section>
  );
}
