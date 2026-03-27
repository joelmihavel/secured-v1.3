"use client";

import { useRentCalculator } from "./hooks/useRentCalculator";
import { BeyondNumbersSection } from "./sections/BeyondNumbersSection";
import { ComparisonTableSection } from "./sections/ComparisonTableSection";
import { ControlsSection } from "./sections/ControlsSection";
import { HeroSection } from "./sections/HeroSection";
import { HomeContentsSection } from "./sections/HomeContentsSection";
import { LocalityHomesSection } from "./sections/LocalityHomesSection";
import { SavingsSection } from "./sections/SavingsSection";
import { UpfrontSection } from "./sections/UpfrontSection";
import type { Location, Occupant, Property, Room } from "@/lib/webflow";

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
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 py-10 md:px-8 lg:px-12 lg:pt-30">
        <HeroSection />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
          <div>
            <ControlsSection
              mode={calc.mode}
              setMode={calc.setMode}
              area={calc.area}
              setArea={calc.setArea}
            />

            <ComparisonTableSection
              mode={calc.mode}
              furnitureMode={calc.furnitureMode}
              setFurnitureMode={calc.setFurnitureMode}
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
            />
          </div>

          <div className="lg:pt-2">
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

            <HomeContentsSection
              furnitureMode={calc.furnitureMode}
              tradFurniture={calc.calculations.tradFurniture}
            />

            <BeyondNumbersSection mode={calc.mode} />
          </div>
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
