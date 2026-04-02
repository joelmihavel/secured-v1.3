"use client";

import { useEffect } from "react";
import { useRentCalculator } from "./hooks/useRentCalculator";
import { ComparisonTableSection } from "./sections/ComparisonTableSection";
import { ControlsSection } from "./sections/ControlsSection";
import { HeroSection } from "./sections/HeroSection";
import { HomeContentsSection } from "./sections/HomeContentsSection";
import { LocalityHomesSection } from "./sections/LocalityHomesSection";
import { SavingsSection } from "./sections/SavingsSection";
import { UpfrontSection } from "./sections/UpfrontSection";
import type { ComparisonMode } from "./types";
import type { Location, Occupant, Property, Room } from "@/lib/webflow";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DEFAULT_WITH_FLENT_ITEMS,
  DEFAULT_WITHOUT_FLENT_ITEMS,
  FlentCompare,
} from "@/app/homes/[slug]/sections/FlentCompare";
import {
  trackRentCalculatorAreaSelected,
  trackRentCalculatorFurnitureModeChanged,
  trackRentCalculatorInputEdited,
  trackRentCalculatorModeChanged,
  trackRentCalculatorStateUpdated,
  trackRentCalculatorViewed,
  type RentCalculatorInputName,
} from "@/lib/posthog-tracking";

type RentCalculatorClientProps = {
  properties: Property[];
  locations: Location[];
  rooms: Room[];
  occupants: Occupant[];
};

export function RentCalculatorClient({
  properties,
  locations,
  rooms,
  occupants,
}: RentCalculatorClientProps) {
  const calc = useRentCalculator();
  useEffect(() => {
    trackRentCalculatorViewed({
      surface: "rent_calculator_page",
      default_mode: calc.mode,
      default_area: calc.area,
      default_furniture_mode: calc.furnitureMode,
    });
    // Fire once per mount as page viewed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      trackRentCalculatorStateUpdated({
        mode: calc.mode,
        area: calc.area,
        furniture_mode: calc.furnitureMode,
        flent_rent: calc.flentRent,
        effective_traditional_rent: calc.effTradRent,
        effective_traditional_maintenance: calc.effMaint,
        effective_traditional_deposit: calc.effDeposit,
        effective_traditional_brokerage: calc.effBrokerage,
        traditional_painting: calc.tradPainting,
        flent_total: calc.calculations.flentTotal,
        traditional_total: calc.calculations.tradTotal,
        savings: calc.calculations.savings,
        flent_wins: calc.calculations.flentWins,
      });
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [
    calc.mode,
    calc.area,
    calc.furnitureMode,
    calc.flentRent,
    calc.effTradRent,
    calc.effMaint,
    calc.effDeposit,
    calc.effBrokerage,
    calc.tradPainting,
    calc.calculations.flentTotal,
    calc.calculations.tradTotal,
    calc.calculations.savings,
    calc.calculations.flentWins,
  ]);

  const handleModeChange = (nextMode: ComparisonMode) => {
    if (nextMode === calc.mode) return;
    trackRentCalculatorModeChanged({
      mode_selected: nextMode,
      previous_mode: calc.mode,
    });
    calc.setMode(nextMode);
  };

  const handleAreaChange = (nextArea: string) => {
    if (nextArea === calc.area) return;
    trackRentCalculatorAreaSelected({
      area_selected: nextArea,
      previous_area: calc.area,
      mode: calc.mode,
      interaction_source: "area_chip",
    });
    calc.setArea(nextArea);
  };

  const handleFurnitureModeChange = (nextFurnitureMode: "rent" | "buy") => {
    if (nextFurnitureMode === calc.furnitureMode) return;
    trackRentCalculatorFurnitureModeChanged({
      furniture_mode_selected: nextFurnitureMode,
      previous_furniture_mode: calc.furnitureMode,
      mode: calc.mode,
      area: calc.area,
    });
    calc.setFurnitureMode(nextFurnitureMode);
  };

  const handleInputCommit = (
    inputName: RentCalculatorInputName,
    newValue: number,
    previousValue: number
  ) => {
    trackRentCalculatorInputEdited({
      input_name: inputName,
      new_value: newValue,
      previous_value: previousValue,
      mode: calc.mode,
      area: calc.area,
      furniture_mode: calc.furnitureMode,
      edit_method: "typed",
    });
  };

  const withTexts =
    calc.mode === "roommate"
      ? [
          "Move in tomorrow",
          "Zero brokerage, always",
          "No landlord interaction",
          "3 months deposit",
          "Maintenance handled by Flent",
          "Designer home, ready to live",
          "₹5,000 exit fee - that's it",
          "Wi-Fi & water purifier included",
          "Flatmate matching by Flent",
        ]
      : [
          "Move in tomorrow",
          "Zero brokerage, always",
          "No landlord interaction",
          "3 months deposit",
          "Maintenance handled by Flent",
          "Designer home, ready to live",
          "₹5,000 exit fee - that's it",
          "Wi-Fi & water purifier included",
        ];

  const withoutTexts =
    calc.mode === "roommate"
      ? [
          "2-4 weeks of house hunting",
          "1 month rent to a broker",
          "Monthly landlord visits & opinions",
          "6-10 months deposit locked up",
          "You call the plumber yourself",
          "Empty flat, start from zero",
          "₹30k+ painting & surprise deductions",
          "Arrange and install yourself",
          "Weeks of interviews & guessing",
        ]
      : [
          "2-4 weeks of house hunting",
          "1 month rent to a broker",
          "Monthly landlord visits & opinions",
          "6-10 months deposit locked up",
          "You call the plumber yourself",
          "Empty flat, start from zero",
          "₹30k+ painting & surprise deductions",
          "Arrange and install yourself",
        ];

  const withItems = DEFAULT_WITH_FLENT_ITEMS.slice(0, withTexts.length).map((item, i) => ({
    ...item,
    text: withTexts[i],
  }));

  const withoutItems = DEFAULT_WITHOUT_FLENT_ITEMS.slice(0, withoutTexts.length).map((item, i) => ({
    ...item,
    text: withoutTexts[i],
  }));

  return (
    <main className="relative min-h-screen overflow-hidden bg-pastel-brown/20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url('/patterns/jupiter.svg')",
          backgroundRepeat: "repeat",
          opacity: 0.02,
          maskImage: "linear-gradient(to bottom, transparent 40%, black 60%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 40%, black 60%)",
        }}
      />
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 py-10 md:px-8 lg:px-20 lg:pt-30">
        <HeroSection />

        <section className="mb-8 flex justify-center">
          <Tabs
            value={calc.mode}
            onValueChange={(value) => handleModeChange(value as ComparisonMode)}
            variant="pill"
            className="w-full max-w-md"
          >
            <TabsList className="flex w-full">
              <TabsTrigger value="roommate" className="!w-1/2 flex-1 md:!w-1/2">
                Shared Living
              </TabsTrigger>
              <TabsTrigger value="1bhk" className="!w-1/2 flex-1 md:!w-1/2">
                Solo Living
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </section>

        <div className="grid grid-cols-1 gap-8">
          <div>
            <ControlsSection area={calc.area} setArea={handleAreaChange} />

            <ComparisonTableSection
              mode={calc.mode}
              furnitureMode={calc.furnitureMode}
              setFurnitureMode={handleFurnitureModeChange}
              flentRent={calc.flentRent}
              setFlentRent={calc.setFlentRent}
              effTradRent={calc.effTradRent}
              setTradRent={calc.setTradRent}
              effMaint={calc.effMaint}
              setTradMaint={calc.setTradMaint}
              effDeposit={calc.effDeposit}
              setTradDeposit={calc.setTradDeposit}
              effBrokerage={calc.effBrokerage}
              setTradBrokerage={calc.setTradBrokerage}
              tradPainting={calc.tradPainting}
              setTradPainting={calc.setTradPainting}
              isRentLow={calc.calculations.isRentLow}
              flentDeposit={calc.calculations.flentDeposit}
              tradFurnBuyCost={calc.calculations.tradFurnBuyCost}
              tradFurnBuyMo={calc.calculations.tradFurnBuyMo}
              tradVacancy={calc.calculations.tradVacancy}
              flentDepositOpp={calc.calculations.flentDepositOpp}
              tradDepositOpp={calc.calculations.tradDepositOpp}
              tradMonthly={calc.calculations.tradMonthly}
              flentTotal={calc.calculations.flentTotal}
              tradTotal={calc.calculations.tradTotal}
              onInputCommit={handleInputCommit}
            />
          </div>

          <div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <SavingsSection
                savings={calc.calculations.savings}
                flentWins={calc.calculations.flentWins}
                affordItems={calc.calculations.affordItems}
                mode={calc.mode}
                area={calc.area}
              />

              <UpfrontSection
                flentUpfront={calc.calculations.flentUpfront}
                tradUpfront={calc.calculations.tradUpfront}
              />
            </div>

            {/* <HomeContentsSection
              furnitureMode={calc.furnitureMode}
              tradFurniture={calc.calculations.tradFurniture}
            /> */}
          </div>
        </div>

        <div className="pt-10">
          <FlentCompare
            cardSectionId="rent-calculator-flent-compare"
            defaultTab="flent"
            withItems={withItems}
            withoutItems={withoutItems}
          />
        </div>

        <LocalityHomesSection
          area={calc.area}
          properties={properties}
          locations={locations}
          rooms={rooms}
          occupants={occupants}
        />
      </div>
    </main>
  );
}
