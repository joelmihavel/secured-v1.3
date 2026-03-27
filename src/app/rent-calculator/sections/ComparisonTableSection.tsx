import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../components/primitives/Badge";
import { ComparisonRow } from "../components/primitives/ComparisonRow";
import { EditCell } from "../components/primitives/EditCell";
import {
  DEPOSIT_MONTHS_TRAD,
  DURATION,
  ESSENTIALS,
  FLENT_EXIT_FEE,
  FURN_BUY,
  FURN_RENT_MO,
  VACANCY_DAILY,
  VACANCY_DAYS,
} from "../constants";
import type { ComparisonMode, FurnitureMode } from "../types";
import { formatCurrency } from "../utils";

type ComparisonTableSectionProps = {
  mode: ComparisonMode;
  furnitureMode: FurnitureMode;
  setFurnitureMode: (mode: FurnitureMode) => void;
  flentRent: number;
  setFlentRent: (value: number) => void;
  effTradRent: number;
  setTradRent: (value: number) => void;
  effMaint: number;
  setTradMaint: (value: number) => void;
  effDeposit: number;
  setTradDeposit: (value: number) => void;
  effBrokerage: number;
  setTradBrokerage: (value: number) => void;
  tradPainting: number;
  setTradPainting: (value: number) => void;
  isRentLow: boolean;
  flentDeposit: number;
  tradFurnBuyCost: number;
  tradFurnBuyMo: number;
  tradVacancy: number;
  flentDepositOpp: number;
  tradDepositOpp: number;
  tradMonthly: number;
  flentTotal: number;
  tradTotal: number;
};

const SectionHeader = ({ title }: { title: string }) => (
  <TableRow>
    <TableCell colSpan={3} className="bg-pastel-brown px-4 py-2">
      <div className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-ground-brown">
        {title}
      </div>
    </TableCell>
  </TableRow>
);

export function ComparisonTableSection(props: ComparisonTableSectionProps) {
  const {
    mode,
    furnitureMode,
    setFurnitureMode,
    flentRent,
    setFlentRent,
    effTradRent,
    setTradRent,
    effMaint,
    setTradMaint,
    effDeposit,
    setTradDeposit,
    effBrokerage,
    setTradBrokerage,
    tradPainting,
    setTradPainting,
    isRentLow,
    flentDeposit,
    tradFurnBuyCost,
    tradFurnBuyMo,
    tradVacancy,
    flentDepositOpp,
    tradDepositOpp,
    tradMonthly,
    flentTotal,
    tradTotal,
  } = props;

  const tradFurnitureCost =
    furnitureMode === "rent"
      ? FURN_RENT_MO * DURATION + ESSENTIALS
      : tradFurnBuyCost + ESSENTIALS;

  return (
    <section className="mb-5 overflow-hidden border border-border bg-bg-white">
      <Table>
        <TableHeader className="font-heading">
          <TableRow>
            <TableHead className="bg-secondary-background px-4 py-3.5 text-foreground">
              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                Cost Component
              </div>
            </TableHead>
            <TableHead className="border-l-2 border-border bg-pastel-green/40 px-2.5 py-3.5 text-center text-foreground">
              <div className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-forest-green">
                Flent Home
              </div>
              <div className="mt-0.5 text-[10px] text-forest-green/70">All-inclusive</div>
            </TableHead>
            <TableHead className="border-l-2 border-border bg-secondary-background px-2.5 py-3.5 text-center text-foreground">
              <div className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-text-main">
                {mode === "1bhk" ? "Traditional 1BHK" : "Traditional (Shared)"}
              </div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">Tap numbers to edit</div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SectionHeader title="Monthly Costs" />

          <ComparisonRow
            label="Rent"
            flent={<EditCell value={flentRent} onChange={setFlentRent} suffix="/mo" />}
            trad={
              <div>
                <EditCell value={effTradRent} onChange={setTradRent} suffix="/mo" />
                {isRentLow ? (
                  <div className="mx-auto mt-1.5 max-w-40 text-[11px] font-semibold leading-4 text-brick-red">
                    This may not be a Flent-standard home. The locality, size, or building quality
                    could be a compromise.
                  </div>
                ) : null}
              </div>
            }
          />

          <ComparisonRow
            label="Maintenance"
            sub="Society + common area"
            flent={<Badge text="Included in rent" />}
            trad={
              <div>
                <EditCell value={effMaint} onChange={setTradMaint} suffix="/mo" />
                <div className="mt-0.5 text-[11px] text-muted-foreground">Paid separately</div>
              </div>
            }
          />

          <ComparisonRow
            label="Furnishing"
            flent={<Badge text="200+ items included" />}
            trad={
              <div>
                <div className="mx-auto mb-1.5 flex max-w-[180px] rounded-full border border-text-main bg-text-main p-0.5">
                  <button
                    onClick={() => setFurnitureMode("rent")}
                    className={`flex-1 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                      furnitureMode === "rent"
                        ? "bg-bg-white text-text-main"
                        : "text-text-invert/70"
                    }`}
                  >
                    Rent
                  </button>
                  <button
                    onClick={() => setFurnitureMode("buy")}
                    className={`flex-1 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                      furnitureMode === "buy"
                        ? "bg-bg-white text-text-main"
                        : "text-text-invert/70"
                    }`}
                  >
                    Buy
                  </button>
                </div>
                {furnitureMode === "rent" ? (
                  <>
                    <div className="text-sm font-bold text-text-main">{formatCurrency(FURN_RENT_MO)}/mo</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      8 items via Furlenco, Rentomojo
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-bold text-text-main">{formatCurrency(FURN_BUY)} upfront</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">~15 items purchased</div>
                  </>
                )}
              </div>
            }
          />

          <TableRow className="bg-secondary-background">
            <TableCell className="px-4 py-3">
              <div className="text-[13px] font-extrabold text-text-main">Effective monthly</div>
            </TableCell>
            <TableCell className="border-l-2 border-border px-2.5 py-3 text-center">
              <span className="text-lg font-extrabold text-forest-green">{formatCurrency(flentRent)}</span>
              <span className="text-[11px] text-muted-foreground">/mo</span>
            </TableCell>
            <TableCell className="border-l-2 border-border px-2.5 py-3 text-center">
              <span className="text-lg font-extrabold text-text-main">{formatCurrency(tradMonthly)}</span>
              <span className="text-[11px] text-muted-foreground">/mo</span>
            </TableCell>
          </TableRow>

          <SectionHeader title="One-Time & Hidden Costs" />

          <ComparisonRow
            label="Security Deposit"
            flent={
              <div>
                <span className="font-bold text-text-main">{formatCurrency(flentDeposit)}</span>
                <div className="text-[11px] text-muted-foreground">3 months&apos; rent</div>
              </div>
            }
            trad={
              <div>
                <EditCell value={effDeposit} onChange={setTradDeposit} />
                <div className="mt-0.5 text-[11px] text-muted-foreground">
                  {DEPOSIT_MONTHS_TRAD} months typical
                </div>
              </div>
            }
          />

          <ComparisonRow
            label="Brokerage"
            flent={<Badge text="Zero, always" />}
            trad={
              <div>
                <EditCell value={effBrokerage} onChange={setTradBrokerage} />
                <div className="mt-0.5 text-[11px] text-muted-foreground">1 month rent typical</div>
              </div>
            }
          />

          <ComparisonRow
            label="Essentials"
            sub="Kitchenware, curtains, bedding"
            flent={<Badge text="Included" />}
            trad={
              <div>
                <span className="text-sm font-bold text-text-main">{formatCurrency(ESSENTIALS)}</span>
                <div className="text-[11px] text-muted-foreground">Can&apos;t rent these</div>
              </div>
            }
          />

          {furnitureMode === "buy" ? (
            <ComparisonRow
              label="Furniture Depreciation"
              sub="Value lost over 11 months"
              flent={<Badge text="No furniture to lose" />}
              trad={
                <div className="mx-auto max-w-40 text-left">
                  <div className="mb-0.5 flex justify-between text-[11px]">
                    <span className="text-muted-foreground">Purchased</span>
                    <span className="font-bold text-text-main">{formatCurrency(FURN_BUY)}</span>
                  </div>
                  <div className="mb-0.5 flex justify-between text-[11px]">
                    <span className="text-muted-foreground">Resale (11mo)</span>
                    <span className="font-bold text-text-main">
                      {formatCurrency(FURN_BUY - tradFurnBuyCost)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-1 text-[11px]">
                    <span className="font-bold text-brick-red">Value lost</span>
                    <span className="font-extrabold text-brick-red">{formatCurrency(tradFurnBuyCost)}</span>
                  </div>
                  <div className="mt-1 text-[11px] font-bold text-brick-red">
                    = {formatCurrency(tradFurnBuyMo)}/mo effective cost
                  </div>
                </div>
              }
            />
          ) : null}

          <ComparisonRow
            label="Exit / Painting"
            flent={
              <div>
                <span className="font-bold text-text-main">{formatCurrency(FLENT_EXIT_FEE)}</span>
                <div className="text-[11px] text-muted-foreground">Fixed exit fee</div>
              </div>
            }
            trad={
              <div>
                <EditCell value={tradPainting} onChange={setTradPainting} />
                <div className="mt-0.5 text-[11px] text-muted-foreground">+ surprise deductions</div>
              </div>
            }
          />

          {mode === "roommate" ? (
            <ComparisonRow
              label="Flatmate Vacancy"
              sub="~10 days to find flatmates"
              flent={<Badge text="We match flatmates" />}
              trad={
                <div>
                  <span className="text-sm font-bold text-brick-red">{formatCurrency(tradVacancy)}</span>
                  <div className="text-[11px] text-muted-foreground">
                    {formatCurrency(VACANCY_DAILY)}/day × ~{VACANCY_DAYS} days
                  </div>
                </div>
              }
            />
          ) : null}

          <ComparisonRow
            label="Deposit Opportunity Cost"
            sub="Returns lost @ 12% p.a."
            flent={<span className="text-sm font-bold text-text-main">{formatCurrency(flentDepositOpp)}</span>}
            trad={<span className="text-sm font-bold text-text-main">{formatCurrency(tradDepositOpp)}</span>}
          />

          <TableRow className="border-b-0">
            <TableCell className="bg-ground-brown px-4 py-4">
              <div className="text-[13px] font-extrabold text-bg-white">Total Cost</div>
              <div className="text-[11px] text-brand-orange">{DURATION} months</div>
            </TableCell>
            <TableCell className="border-l-2 border-bg-white/20 bg-forest-green px-4 py-4 text-center">
              <span className="text-xl font-extrabold text-bg-white">{formatCurrency(flentTotal)}</span>
            </TableCell>
            <TableCell className="border-l-2 border-bg-white/20 bg-ground-brown px-4 py-4 text-center">
              <span className="text-xl font-extrabold text-brand-orange">{formatCurrency(tradTotal)}</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
}
