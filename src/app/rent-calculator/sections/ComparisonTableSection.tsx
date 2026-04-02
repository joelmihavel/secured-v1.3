import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import type { RentCalculatorInputName } from "@/lib/posthog-tracking";

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
  onInputCommit: (
    inputName: RentCalculatorInputName,
    newValue: number,
    previousValue: number
  ) => void;
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

const SectionHeader = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => (
  <TableRow className={`border-b-0 ${className ?? ""}`}>
    <TableCell colSpan={3} className="px-4 py-2">
      <div className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-ground-brown">
        {title}
      </div>
    </TableCell>
  </TableRow>
);

// Spacer that provides 16px "wrapper padding" within a table block.
const SectionPaddingRow = ({ withTopBorder = false }: { withTopBorder?: boolean }) => (
  <TableRow className="border-b-0">
    <TableCell colSpan={3} className={`p-0 ${withTopBorder ? "border-t-2 border-border" : ""}`}>
      <div className="h-4" />
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
    onInputCommit,
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
    <section className="flent-neo-card mb-5 overflow-hidden rounded-[20px] bg-bg-white">
      <Table className="border-0">
        <TableHeader className="font-heading">
          <TableRow>
            <TableHead className="bg-secondary-background px-4 py-3.5 text-foreground">
              <div className="text-[16px] md:text-[18px] font-bold tracking-[0.1em] font-zin text-text-main/60">
                Costs
              </div>
            </TableHead>
            <TableHead className="bg-secondary-background px-2.5 py-3.5 text-center text-foreground">
              <div className="text-[16px] md:text-[18px] font-bold tracking-[0.1em] font-zin text-forest-green">
                Flent
              </div>
            </TableHead>
            <TableHead className="bg-secondary-background px-2.5 py-3.5 text-center text-foreground">
              <div className="text-[16px] md:text-[18px] font-bold tracking-[0.1em] font-zin text-text-main/70">
                Traditional Renting
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SectionPaddingRow />

          <SectionHeader title="Monthly Costs" />

          <SectionPaddingRow />

          <ComparisonRow
            rowClassName="border-b-0"
            label="Rent"
            flent={
              <EditCell
                value={flentRent}
                onChange={setFlentRent}
                suffix="/mo"
                onCommit={(newValue, previousValue) =>
                  onInputCommit("flent_rent", newValue, previousValue)
                }
              />
            }
            trad={
              <div>
                <EditCell
                  value={effTradRent}
                  onChange={setTradRent}
                  suffix="/mo"
                  onCommit={(newValue, previousValue) =>
                    onInputCommit("traditional_rent", newValue, previousValue)
                  }
                />
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
            rowClassName="border-b-0"
            label="Maintenance"
            sub="Society + common area"
            flent={<span className="text-[11px] font-bold text-forest-green md:text-[13px]">Inclusive</span>}
            trad={
              <div>
                <EditCell
                  value={effMaint}
                  onChange={setTradMaint}
                  suffix="/mo"
                  onCommit={(newValue, previousValue) =>
                    onInputCommit("traditional_maintenance", newValue, previousValue)
                  }
                />
              </div>
            }
          />

          <ComparisonRow
            rowClassName="border-b-0"
            label="Furnishing"
            flent={
              <span className="text-[11px] font-bold text-forest-green md:text-[13px]">
                200+ items included
              </span>
            }
            trad={
              <div>
                <Tabs
                  value={furnitureMode}
                  onValueChange={(value) => setFurnitureMode(value as FurnitureMode)}
                  variant="pill"
                  className="mx-auto mb-1.5 w-full max-w-[180px]"
                >
                  <TabsList className="flex w-full">
                    <TabsTrigger value="rent" className="!w-1/2 flex-1 !px-0 !py-1.5 !text-[11px]">
                      Rent
                    </TabsTrigger>
                    <TabsTrigger value="buy" className="!w-1/2 flex-1 !px-0 !py-1.5 !text-[11px]">
                      Buy
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                {furnitureMode === "rent" ? (
                  <>
                    <div className="text-sm font-bold text-text-main md:text-[17px]">
                      {formatCurrency(FURN_RENT_MO)}/mo
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      8 items via Furlenco, Rentomojo
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-bold text-text-main md:text-[17px]">
                      {formatCurrency(FURN_BUY)} upfront
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">~15 items purchased</div>
                  </>
                )}
              </div>
            }
          />

          <TableRow className="border-b-0">
            <TableCell className="border-t-2 border-border px-4 py-3">
              <div className="text-[16px] md:text-[18px] font-bold tracking-[0.1em] font-zin text-text-main">
                Effective monthly
              </div>
            </TableCell>
            <TableCell className="border-t-2 border-border px-2.5 py-3 text-center">
              <span className="text-[16px] md:text-[18px] font-bold tracking-[0.1em] font-zin text-forest-green">
                {formatCurrency(flentRent)}
              </span>
              <span className="text-[11px] text-text-main/80">/mo</span>
            </TableCell>
            <TableCell className="border-t-2 border-border px-2.5 py-3 text-center">
              <span className="text-[16px] md:text-[18px] font-bold tracking-[0.1em] font-zin text-text-main">
                {formatCurrency(tradMonthly)}
              </span>
              <span className="text-[11px] text-text-main/80">/mo</span>
            </TableCell>
          </TableRow>

          <SectionPaddingRow withTopBorder />

          <SectionHeader title="One-Time & Hidden Costs" />

          <SectionPaddingRow />

          <ComparisonRow
            rowClassName="border-b-0"
            label="Security Deposit"
            flent={
              <div>
                <span className="font-bold text-text-main">{formatCurrency(flentDeposit)}</span>
                <div className="text-[11px] text-muted-foreground">3 months&apos; rent</div>
              </div>
            }
            trad={
              <div>
                <EditCell
                  value={effDeposit}
                  onChange={setTradDeposit}
                  onCommit={(newValue, previousValue) =>
                    onInputCommit("traditional_deposit", newValue, previousValue)
                  }
                />
                <div className="mt-0.5 text-[11px] text-muted-foreground">
                  {DEPOSIT_MONTHS_TRAD} months typical
                </div>
              </div>
            }
          />

          <ComparisonRow
            rowClassName="border-b-0"
            label="Brokerage"
            flent={<span className="text-[11px] font-bold text-forest-green md:text-[13px]">Zero</span>}
            trad={
              <div>
                <EditCell
                  value={effBrokerage}
                  onChange={setTradBrokerage}
                  onCommit={(newValue, previousValue) =>
                    onInputCommit("traditional_brokerage", newValue, previousValue)
                  }
                />
                <div className="mt-0.5 text-[11px] text-muted-foreground">1 month rent typical</div>
              </div>
            }
          />

          <ComparisonRow
            rowClassName="border-b-0"
            label="Essentials"
            sub="Kitchenware, curtains, bedding"
            flent={<span className="text-[11px] font-bold text-forest-green md:text-[13px]">Included</span>}
            trad={
              <div>
                <span className="text-sm font-bold text-text-main md:text-[17px]">
                  {formatCurrency(ESSENTIALS)}
                </span>
                <div className="text-[11px] text-muted-foreground">Can&apos;t rent these</div>
              </div>
            }
          />

          {furnitureMode === "buy" ? (
            <ComparisonRow
              rowClassName="border-b-0"
              label="Furniture Depreciation"
              sub="Value lost over 11 months"
              flent={
                <span className="text-[11px] font-bold text-forest-green md:text-[13px]">
                  No furniture to lose
                </span>
              }
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
                  <div className="mt-1 text-[11px] font-bold text-brick-red md:text-[13px]">
                    = {formatCurrency(tradFurnBuyMo)}/mo effective cost
                  </div>
                </div>
              }
            />
          ) : null}

          <ComparisonRow
            rowClassName="border-b-0"
            label="Exit / Painting"
            flent={
              <div>
                <span className="font-bold text-text-main">{formatCurrency(FLENT_EXIT_FEE)}</span>
                <div className="text-[11px] text-muted-foreground">Fixed exit fee</div>
              </div>
            }
            trad={
              <div>
                <EditCell
                  value={tradPainting}
                  onChange={setTradPainting}
                  onCommit={(newValue, previousValue) =>
                    onInputCommit("traditional_painting", newValue, previousValue)
                  }
                />
                <div className="mt-0.5 text-[11px] text-muted-foreground">+ surprise deductions</div>
              </div>
            }
          />

          {mode === "roommate" ? (
            <ComparisonRow
              rowClassName="border-b-0"
              label="Flatmate Vacancy"
              sub="~10 days to find flatmates"
              flent={
                <span className="text-[11px] font-bold text-forest-green md:text-[13px]">
                  We match flatmates
                </span>
              }
              trad={
                <div>
                  <span className="text-sm font-bold text-brick-red md:text-[17px]">
                    {formatCurrency(tradVacancy)}
                  </span>
                  <div className="text-[11px] text-muted-foreground">
                    {formatCurrency(VACANCY_DAILY)}/day × ~{VACANCY_DAYS} days
                  </div>
                </div>
              }
            />
          ) : null}

          <ComparisonRow
            rowClassName="border-b-0"
            label="Deposit Opportunity Cost"
            sub="Returns lost @ 12% p.a."
            flent={
              <span className="text-sm font-bold text-text-main md:text-[17px]">
                {formatCurrency(flentDepositOpp)}
              </span>
            }
            trad={
              <span className="text-sm font-bold text-text-main md:text-[17px]">
                {formatCurrency(tradDepositOpp)}
              </span>
            }
          />

          <SectionPaddingRow />

          <TableRow className="border-b-0">
            <TableCell className="border-t-2 border-border px-4 py-4">
              <div className="text-[16px] md:text-[18px] font-bold tracking-[0.1em] font-zin text-text-main">
                Grand Total
              </div>
              {/* Keep the smaller size for the months line */}
              <div className="text-[11px] text-text-main/80">{DURATION} months</div>
            </TableCell>
            <TableCell className="border-t-2 border-border px-4 py-4 text-center">
              <span className="text-[16px] md:text-[18px] font-bold tracking-[0.1em] font-zin text-forest-green">
                {formatCurrency(flentTotal)}
              </span>
            </TableCell>
            <TableCell className="border-t-2 border-border px-4 py-4 text-center">
              <span className="text-[16px] md:text-[18px] font-bold tracking-[0.1em] font-zin text-text-main">
                {formatCurrency(tradTotal)}
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
}
