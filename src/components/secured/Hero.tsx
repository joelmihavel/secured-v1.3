"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "./ui/Button";
import type { HeroContent } from "@/lib/secured/types";
import type { SelectedBuilding, BuildingData } from "./ActivityMap";

const CASHBACK_RATE = 0.01;

interface AreaRentRange {
  area: string;
  min: number;
  max: number;
  median: number;
  p25: number;
  p75: number;
}

function calcPercentile(rent: number, range: AreaRentRange): number {
  if (rent <= range.min) return 0;
  if (rent >= range.max) return 100;
  return Math.round(((rent - range.min) / (range.max - range.min)) * 100);
}

function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

type HeroStep = "explore" | "result";

export function Hero({ data, variant = "tenant" }: { data: HeroContent; variant?: "tenant" | "landlord" }) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<HeroStep>("explore");
  const [rentInput, setRentInput] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [areaNames, setAreaNames] = useState<string[]>([]);
  const [areaRentRanges, setAreaRentRanges] = useState<AreaRentRange[]>([]);
  const prevVariant = useRef(variant);
  const [showText, setShowText] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState<SelectedBuilding | null>(null);
  const handleBuildingSelect = useCallback((b: SelectedBuilding | null) => setSelectedBuilding(b), []);

  useEffect(() => {
    setMounted(true);
    import("./ActivityMap").then((m) => {
      setAreaNames(m.AREA_NAMES);
      setAreaRentRanges(m.AREA_RENT_RANGES);
      if (m.AREA_NAMES.length > 0) setSelectedArea(m.AREA_NAMES[3]);
    });
  }, []);

  useEffect(() => {
    if (prevVariant.current !== variant) {
      setShowText(false);
      const timer = setTimeout(() => setShowText(true), 500);
      prevVariant.current = variant;
      return () => clearTimeout(timer);
    }
  }, [variant]);

  const rent = parseInt(rentInput.replace(/,/g, ""), 10) || 0;
  const currentRange = useMemo(
    () => areaRentRanges.find((r) => r.area === selectedArea),
    [selectedArea, areaRentRanges]
  );
  const percentile = currentRange && rent > 0 ? calcPercentile(rent, currentRange) : 0;
  const monthlyCashback = Math.round(rent * CASHBACK_RATE);
  const annualCashback = monthlyCashback * 12;

  const handleCheck = useCallback(() => {
    if (rent >= 5000 && selectedArea) setStep("result");
  }, [rent, selectedArea]);

  const handleReset = useCallback(() => {
    setStep("explore");
    setRentInput("");
  }, []);

  const handleRentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw === "") { setRentInput(""); return; }
    const num = parseInt(raw, 10);
    setRentInput(num.toLocaleString("en-IN"));
  }, []);

  const percentileLabel = percentile <= 30
    ? "Below average — great deal!"
    : percentile <= 60
    ? "Around market rate"
    : percentile <= 80
    ? "Above average for this area"
    : "Premium range — you might be overpaying";

  const percentileColor = percentile <= 30
    ? "#4ade80"
    : percentile <= 60
    ? "#ff9a6d"
    : percentile <= 80
    ? "#fbbf24"
    : "#ef4444";

  return (
    <section data-section="hero" className="relative flex w-full flex-col overflow-hidden bg-[#131313]" style={{ height: "100vh", minHeight: 700 }}>
      {/* Interactive map — inset to sit within the border lines */}
      <div className="absolute inset-0 z-0 lg:left-[80px] lg:right-[80px]">
        {mounted && <LazyActivityMap onBuildingSelect={handleBuildingSelect} />}
      </div>

      {/* Building info popup — above everything, offset by map inset on lg */}
      {selectedBuilding && (
        <div className="absolute inset-0 z-[500] pointer-events-none lg:left-[80px] lg:right-[80px]">
          <div className="pointer-events-auto">
            <BuildingPopup
              building={selectedBuilding.data}
              x={selectedBuilding.x}
              y={selectedBuilding.y}
              onClose={() => setSelectedBuilding(null)}
            />
          </div>
        </div>
      )}

      {/* Bottom-center overlay */}
      <div className="pointer-events-none relative z-[450] flex flex-1 flex-col items-center justify-end pb-8 px-6 md:pb-14">
        <div
          className="pointer-events-auto flex w-full max-w-[440px] flex-col items-center text-center transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] md:max-w-[480px]"
          style={{
            opacity: showText ? 1 : 0,
            transform: showText ? "translateY(0)" : "translateY(12px)",
          }}
        >
          {step === "explore" ? (
            <div className="flex w-full flex-col items-center gap-5">
              {/* Heading */}
              <div className="flex flex-col items-center gap-1.5">
                <h1 className="font-display text-[28px] leading-[1.05] tracking-[-1.5px] text-white md:text-[40px] lg:text-[48px] lg:tracking-[-2px]">
                  Are you <span className="text-[#ff9a6d]">overpaying</span> rent?
                </h1>
                <p
                  className="text-sm leading-[1.5] tracking-[-0.3px] text-[#797979] md:text-base"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  Check how your rent compares &amp; earn cashback
                </p>
              </div>

              {/* Input card */}
              <div className="w-full rounded-2xl border border-white/[0.06] bg-[#1a1a1a]/90 p-5 backdrop-blur-xl md:p-6">
                {/* Area selector */}
                <div className="mb-4">
                  <label
                    className="mb-1.5 block text-left text-[11px] font-medium uppercase tracking-[1px] text-[#666]"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    Your Area
                  </label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full appearance-none border-b border-white/10 bg-transparent pb-2 text-[15px] text-white outline-none transition-colors focus:border-[#ff9a6d]"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    {areaNames.map((name) => (
                      <option key={name} value={name} className="bg-[#1a1a1a] text-white">
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rent input */}
                <div className="mb-5">
                  <label
                    className="mb-1.5 block text-left text-[11px] font-medium uppercase tracking-[1px] text-[#666]"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    Monthly Rent
                  </label>
                  <div className="flex items-baseline gap-1 border-b border-white/10 pb-2 transition-colors focus-within:border-[#ff9a6d]">
                    <span className="text-[15px] text-[#666]" style={{ fontFamily: "var(--font-ui)" }}>₹</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 25,000"
                      value={rentInput}
                      onChange={handleRentChange}
                      onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                      className="w-full bg-transparent text-[15px] text-white placeholder-[#444] outline-none"
                      style={{ fontFamily: "var(--font-ui)" }}
                    />
                  </div>
                </div>

                {/* Check button */}
                <Button
                  fullWidth
                  onClick={handleCheck}
                  disabled={rent < 5000 || !selectedArea}
                >
                  Check My Rent
                </Button>
              </div>

              <p
                className="text-xs tracking-[-0.2px] text-[#555]"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                Explore the map above to see what others pay
              </p>
            </div>
          ) : (
            <div className="flex w-full flex-col items-center gap-4">
              {/* Result card */}
              <div className="w-full rounded-2xl border border-white/[0.06] bg-[#1a1a1a]/90 p-5 backdrop-blur-xl md:p-6">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="text-left">
                    <p
                      className="text-[11px] font-medium uppercase tracking-[1px] text-[#666]"
                      style={{ fontFamily: "var(--font-ui)" }}
                    >
                      Your rent in {selectedArea}
                    </p>
                    <p className="mt-1 font-display text-[28px] leading-[1] tracking-[-1px] text-white">
                      {formatINR(rent)}<span className="text-base text-[#666]">/mo</span>
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="mt-1 text-xs text-[#666] underline decoration-[#444] underline-offset-2 transition-colors hover:text-white"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    Edit
                  </button>
                </div>

                {/* Percentile bar */}
                <div className="mb-4">
                  <div className="mb-1.5 flex items-center justify-between">
                    <p
                      className="text-[11px] font-medium uppercase tracking-[1px] text-[#666]"
                      style={{ fontFamily: "var(--font-ui)" }}
                    >
                      Rent Percentile
                    </p>
                    <p
                      className="text-xs font-semibold"
                      style={{ fontFamily: "var(--font-ui)", color: percentileColor }}
                    >
                      {percentile}th
                    </p>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    {/* Range markers */}
                    {currentRange && (
                      <>
                        <div
                          className="absolute top-0 h-full rounded-full bg-white/[0.04]"
                          style={{
                            left: `${((currentRange.p25 - currentRange.min) / (currentRange.max - currentRange.min)) * 100}%`,
                            width: `${((currentRange.p75 - currentRange.p25) / (currentRange.max - currentRange.min)) * 100}%`,
                          }}
                        />
                      </>
                    )}
                    <div
                      className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentile}%`, backgroundColor: percentileColor }}
                    />
                    {/* Marker dot */}
                    <div
                      className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#1a1a1a] transition-all duration-500"
                      style={{ left: `${percentile}%`, backgroundColor: percentileColor }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[10px] text-[#555]" style={{ fontFamily: "var(--font-ui)" }}>
                      {formatINR(currentRange?.min ?? 0)}
                    </span>
                    <span
                      className="text-[11px]"
                      style={{ fontFamily: "var(--font-ui)", color: percentileColor }}
                    >
                      {percentileLabel}
                    </span>
                    <span className="text-[10px] text-[#555]" style={{ fontFamily: "var(--font-ui)" }}>
                      {formatINR(currentRange?.max ?? 0)}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="mb-4 h-px w-full bg-white/[0.06]" />

                {/* Cashback potential */}
                <div className="mb-4">
                  <p
                    className="mb-2 text-[11px] font-medium uppercase tracking-[1px] text-[#666]"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    Your Cashback Potential
                  </p>
                  <div className="flex gap-3">
                    <div className="flex-1 rounded-xl bg-white/[0.04] p-3">
                      <p className="text-[10px] uppercase tracking-[0.5px] text-[#666]" style={{ fontFamily: "var(--font-ui)" }}>Monthly</p>
                      <p className="mt-0.5 font-display text-xl leading-[1] tracking-[-0.5px] text-[#ff9a6d]">
                        {formatINR(monthlyCashback)}
                      </p>
                    </div>
                    <div className="flex-1 rounded-xl bg-white/[0.04] p-3">
                      <p className="text-[10px] uppercase tracking-[0.5px] text-[#666]" style={{ fontFamily: "var(--font-ui)" }}>Annual</p>
                      <p className="mt-0.5 font-display text-xl leading-[1] tracking-[-0.5px] text-white">
                        {formatINR(annualCashback)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-1.5 text-[10px] text-[#555]" style={{ fontFamily: "var(--font-ui)" }}>
                    Based on {formatINR(rent)}/mo × {(CASHBACK_RATE * 100).toFixed(1)}% cashback rate
                  </p>
                </div>

                {/* Download CTA */}
                <Button
                  href="https://apps.apple.com/in/app/secured-by-flent/id6757275258"
                  target="_blank"
                  rel="noopener noreferrer"
                  fullWidth
                >
                  Start Earning — Download App
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function BuildingPopup({
  building,
  x,
  y,
  onClose,
}: {
  building: BuildingData;
  x: number;
  y: number;
  onClose: () => void;
}) {
  const isOverpaying = building.rent > building.market_avg;
  const diff = Math.abs(building.rent - building.market_avg);

  return (
    <div
      className="absolute z-[500]"
      style={{
        left: x,
        top: y - 16,
        transform: "translate(-50%, -100%)",
        animation: "popupFadeIn 0.2s ease-out",
      }}
    >
      <div
        className="secured-3d-popup relative rounded-[14px] border border-white/[0.06] bg-[#161616]/95 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        style={{ minWidth: 240, maxWidth: 280 }}
      >
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-white/30 transition-colors hover:text-white"
          style={{ fontSize: 16, lineHeight: 1 }}
        >
          ×
        </button>
        <div className="secured-3d-popup-area">{building.area}</div>
        <div className="secured-3d-popup-rent">
          <span className="secured-3d-popup-label">Rent</span>
          <span className="secured-3d-popup-value">{formatINR(building.rent)}/mo</span>
        </div>
        <div className="secured-3d-popup-rent">
          <span className="secured-3d-popup-label">Market avg</span>
          <span className="secured-3d-popup-value">{formatINR(building.market_avg)}/mo</span>
        </div>
        {isOverpaying ? (
          <div className="secured-3d-popup-alert">Overpaying by {formatINR(diff)}/mo</div>
        ) : (
          <div className="secured-3d-popup-good">Below market rate — good deal</div>
        )}
        <div className="secured-3d-popup-divider" />
        <div className="secured-3d-popup-cashback">
          Earn <strong>{formatINR(building.cashback)}/year</strong> cashback
        </div>
        <div className="secured-3d-popup-users">
          {building.users} people nearby use Secured
        </div>
        <a
          href="https://apps.apple.com/in/app/secured-by-flent/id6757275258"
          target="_blank"
          rel="noopener noreferrer"
          className="secured-3d-popup-cta"
        >
          Optimize your rent
        </a>
      </div>
      {/* Arrow */}
      <div className="mx-auto h-0 w-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#161616]/95" />
    </div>
  );
}

function LazyActivityMap({ onBuildingSelect }: { onBuildingSelect?: (b: SelectedBuilding | null) => void }) {
  const [ActivityMap, setActivityMap] = useState<React.ComponentType<{ onBuildingSelect?: (b: SelectedBuilding | null) => void }> | null>(null);

  useEffect(() => {
    import("./ActivityMap").then((m) => setActivityMap(() => m.ActivityMap));
  }, []);

  if (!ActivityMap) return null;
  return <ActivityMap onBuildingSelect={onBuildingSelect} />;
}
