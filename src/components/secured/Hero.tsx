"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import type { HeroContent } from "@/lib/secured/types";

/* ── ASCII glitch text effect ── */
const GLITCH_CHARS = "01!@#$%&*+=<>?/\\|{}[]~^";

function useAsciiGlitch(text: string, initialDelay = 800) {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const glitchingRef = useRef(false);
  const textRef = useRef(text);

  useEffect(() => {
    textRef.current = text;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    glitchingRef.current = false;
    setDisplay(text);
  }, [text]);

  const triggerGlitch = useCallback(() => {
    if (glitchingRef.current) return;
    glitchingRef.current = true;
    if (intervalRef.current) clearInterval(intervalRef.current);
    let frame = 0;
    const totalFrames = 14;
    const t = textRef.current;
    intervalRef.current = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const resolved = Math.floor(progress * t.length);
      let result = "";
      for (let i = 0; i < t.length; i++) {
        if (t[i] === " ") {
          result += " ";
        } else if (i < resolved) {
          result += t[i];
        } else {
          result += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }
      }
      setDisplay(result);
      if (frame >= totalFrames) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setDisplay(t);
        glitchingRef.current = false;
      }
    }, 40);
  }, []);

  useEffect(() => {
    const initTimer = setTimeout(triggerGlitch, initialDelay);
    const loopTimer = setInterval(triggerGlitch, 6000);

    return () => {
      clearTimeout(initTimer);
      clearInterval(loopTimer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      glitchingRef.current = false;
    };
  }, [triggerGlitch, initialDelay]);

  return { display, triggerGlitch };
}
import type { SelectedBuilding, BuildingData, BhkType, RentRange, AreaRentRange } from "./ActivityMap";

/* ── Custom area picker with search + GPS ── */

function AreaPicker({
  areas,
  value,
  onChange,
  areaCoords,
}: {
  areas: string[];
  value: string;
  onChange: (area: string) => void;
  areaCoords?: Record<string, [number, number]>;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [locating, setLocating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", handleOutside);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  useEffect(() => {
    if (open) setSearch("");
  }, [open]);

  const filtered = search
    ? areas.filter((a) => a.toLowerCase().includes(search.toLowerCase()))
    : areas;

  const showCustomOption = search.length > 1 && filtered.length === 0;

  function selectCustom() {
    onChange(search);
    setOpen(false);
  }

  function handleLocate() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=14`
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.state_district || "";
          if (!city.toLowerCase().includes("bengaluru") && !city.toLowerCase().includes("bangalore")) {
            setSearch("Not in Bangalore");
            setLocating(false);
            return;
          }
          const suburb =
            data.address?.suburb ||
            data.address?.neighbourhood ||
            data.address?.city_district ||
            "";
          const match = areas.find((a) => a.toLowerCase() === suburb.toLowerCase());
          if (match) { onChange(match); setOpen(false); setLocating(false); return; }
          const partial = areas.find((a) =>
            suburb.toLowerCase().includes(a.toLowerCase()) ||
            a.toLowerCase().includes(suburb.toLowerCase())
          );
          if (partial) { onChange(partial); setOpen(false); setLocating(false); return; }
          if (areaCoords) {
            let nearest = areas[0];
            let minDist = Infinity;
            for (const a of areas) {
              const c = areaCoords[a];
              if (!c) continue;
              const d = (c[0] - longitude) ** 2 + (c[1] - latitude) ** 2;
              if (d < minDist) { minDist = d; nearest = a; }
            }
            onChange(nearest);
            setOpen(false);
          } else if (suburb) {
            onChange(suburb);
            setOpen(false);
          }
        } catch { /* ignore */ } finally { setLocating(false); }
      },
      () => setLocating(false),
      { timeout: 8000, maximumAge: 60000 }
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 border-b border-white/10 bg-transparent pb-1.5 text-left transition-colors hover:border-white/20"
      >
        <svg className="flex-shrink-0 text-[#666]" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span className="flex-1 truncate text-[13px] text-white" style={{ fontFamily: "var(--font-ui)" }}>
          {value || "Select area"}
        </span>
        <svg className="flex-shrink-0 text-[#555]" width="8" height="8" viewBox="0 0 10 10" fill="none">
          <path d="M2.5 3.5L5 6.5L7.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 bottom-[calc(100%+6px)] z-[600] flex max-h-[240px] flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#1a1a1a]/95 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {/* Search + locate */}
          <div className="flex flex-shrink-0 items-center gap-2 border-b border-white/[0.06] px-3 py-2">
            <svg className="flex-shrink-0 text-[#555]" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filtered.length === 1) { onChange(filtered[0]); setOpen(false); }
                else if (e.key === "Enter" && showCustomOption) selectCustom();
              }}
              placeholder="Search area in Bangalore..."
              className="min-w-0 flex-1 bg-transparent text-[12px] text-white placeholder-[#555] outline-none"
              style={{ fontFamily: "var(--font-ui)" }}
            />
            <button
              type="button"
              onClick={handleLocate}
              className="flex flex-shrink-0 items-center gap-1 rounded-full border border-white/[0.08] px-2 py-0.5 text-[9px] text-[#888] transition-colors hover:border-[#ff9a6d]/30 hover:text-[#ff9a6d]"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
              </svg>
              {locating ? "..." : "Locate me"}
            </button>
          </div>

          {/* Scrollable list */}
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto overscroll-contain"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#333 transparent" }}
            onTouchMove={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {filtered.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => { onChange(name); setOpen(false); }}
                className={`flex w-full items-center gap-1.5 px-3 py-[6px] text-left text-[12px] transition-colors ${
                  name === value
                    ? "bg-[#ff9a6d]/[0.08] text-[#ff9a6d]"
                    : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-ui)" }}
              >
                {name === value ? (
                  <svg className="flex-shrink-0" width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4 7.5L8 2.5" stroke="#ff9a6d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span className="w-[9px]" />
                )}
                {name}
              </button>
            ))}
            {showCustomOption && (
              <button
                type="button"
                onClick={selectCustom}
                className="flex w-full items-center gap-1.5 px-3 py-[6px] text-left text-[12px] text-[#ff9a6d] transition-colors hover:bg-[#ff9a6d]/[0.06]"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                <svg className="flex-shrink-0" width="9" height="9" viewBox="0 0 10 10" fill="none">
                  <line x1="5" y1="2" x2="5" y2="8" stroke="#ff9a6d" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="2" y1="5" x2="8" y2="5" stroke="#ff9a6d" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                Use &ldquo;{search}&rdquo;
              </button>
            )}
            {filtered.length === 0 && !showCustomOption && (
              <p className="px-3 py-3 text-center text-[11px] text-[#555]" style={{ fontFamily: "var(--font-ui)" }}>
                No areas found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const CASHBACK_RATE = 0.01;

function calcPercentile(rent: number, range: RentRange): number {
  if (rent <= range.min) return 0;
  if (rent >= range.max) return 100;
  return Math.round(((rent - range.min) / (range.max - range.min)) * 100);
}

function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

/* ── Text Hero — full-viewport intro ── */

export function Hero({ data, variant = "tenant" }: { data: HeroContent; variant?: "tenant" | "landlord" }) {
  const fullHeading = `${data.headingPrefix}${data.headingHighlight}`;
  const { display: glitchedHeading, triggerGlitch } = useAsciiGlitch(fullHeading);
  const prefixLen = data.headingPrefix.length;

  const prevVariant = useRef(variant);
  const [showText, setShowText] = useState(true);

  useEffect(() => {
    if (prevVariant.current !== variant) {
      setShowText(false);
      const timer = setTimeout(() => setShowText(true), 500);
      prevVariant.current = variant;
      return () => clearTimeout(timer);
    }
  }, [variant]);

  return (
    <section
      data-section="hero"
      className="relative flex w-full flex-col items-center overflow-hidden bg-[#131313]"
      style={{ height: "100vh", minHeight: 700 }}
    >
      {/* Background textures */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-[70%] opacity-[0.4] lg:w-[579px] lg:opacity-[0.6]">
          <img
            alt=""
            aria-hidden="true"
            src="/assets/backgrounds/hero-texture-left.svg"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute right-0 top-0 hidden h-full w-[591px] opacity-[0.2] lg:block">
          <img
            alt=""
            aria-hidden="true"
            src="/assets/backgrounds/hero-texture-right.png"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Text content — positioned in upper portion */}
      <div
        className="relative z-10 mt-[18vh] flex w-full max-w-[1040px] flex-col items-center px-12 text-center md:mt-[16vh] md:px-24 lg:px-[160px]"
        style={{
          opacity: showText ? 1 : 0,
          transform: showText ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        {/* Heading + subheading group */}
        <div className="flex flex-col items-center gap-3">
          <motion.h1
            className="cursor-default font-display text-[36px] leading-[1] tracking-[-2px] text-white md:text-[48px] lg:text-[64px] 3xl:text-[80px] 4xl:text-[96px] 5xl:text-[128px]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            onMouseEnter={triggerGlitch}
          >
            {glitchedHeading.slice(0, prefixLen)}
            <span className="text-[#ff9a6d]">{glitchedHeading.slice(prefixLen)}</span>
          </motion.h1>

          <motion.p
            className="text-[18px] leading-[1.4] tracking-[-1px] text-[#999] md:text-[24px] lg:text-[28px] 3xl:text-[34px] 4xl:text-[42px] 5xl:text-[56px]"
            style={{ fontFamily: "var(--font-ui)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            {data.subheading}
          </motion.p>
        </div>

        {/* Description */}
        <motion.p
          className="mt-6 max-w-[420px] text-[15px] leading-[1.8] text-[#888] md:text-base 3xl:max-w-[520px] 3xl:text-lg 4xl:max-w-[680px] 4xl:text-xl 5xl:max-w-[900px] 5xl:text-2xl"
          style={{ fontFamily: "var(--font-ui)", whiteSpace: "pre-line" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          {data.description}
        </motion.p>

        {/* CTA */}
        <motion.div
          className="mt-6 w-full max-w-[446px] 3xl:max-w-[500px] 4xl:max-w-[560px] 5xl:max-w-[700px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.4, 0, 0.2, 1] }}
        >
          <Button
            fullWidth
            href="https://apps.apple.com/in/app/secured-by-flent/id6757275258"
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.ctaButtonText}
          </Button>
          {data.ctaDisclaimer && (
            <p
              className="mt-3 text-center text-xs leading-[1.8] tracking-[-0.24px] text-[#aaa] 3xl:text-sm 4xl:text-base 5xl:text-lg"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              {data.ctaDisclaimer}
            </p>
          )}
        </motion.div>
      </div>

    </section>
  );
}

/* ── Rent Map Section — interactive map + rent checker ── */

type RentStep = "explore" | "result";

export function RentMapSection() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<RentStep>("explore");
  const [rentInput, setRentInput] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedBhk, setSelectedBhk] = useState<BhkType>("2 BHK");
  const [bhkTypes, setBhkTypes] = useState<BhkType[]>([]);
  const [areaNames, setAreaNames] = useState<string[]>([]);
  const [areaRentRanges, setAreaRentRanges] = useState<AreaRentRange[]>([]);
  const [areaCoords, setAreaCoords] = useState<Record<string, [number, number]>>({});
  const [selectedBuilding, setSelectedBuilding] = useState<SelectedBuilding | null>(null);
  const [flyArea, setFlyArea] = useState("");
  const flyToRef = useRef<((area: string) => void) | null>(null);
  const handleBuildingSelect = useCallback((b: SelectedBuilding | null) => setSelectedBuilding(b), []);
  const handleMapReady = useCallback((flyTo: (area: string) => void) => { flyToRef.current = flyTo; }, []);
  const handleFlyTo = useCallback((area: string) => {
    if (!area) return;
    setFlyArea(area);
    flyToRef.current?.(area);
  }, []);

  const handleAreaChange = useCallback((area: string) => {
    setSelectedArea(area);
    handleFlyTo(area);
  }, [handleFlyTo]);

  useEffect(() => {
    setMounted(true);
    import("./ActivityMap").then((m) => {
      setAreaNames(m.AREA_NAMES);
      setAreaRentRanges(m.AREA_RENT_RANGES);
      setAreaCoords(m.AREA_COORDS);
      setBhkTypes(m.BHK_TYPES);
      const defaultArea = m.AREA_NAMES.includes("Koramangala") ? "Koramangala" : m.AREA_NAMES[0];
      setSelectedArea(defaultArea);
      setFlyArea(defaultArea);
    });
  }, []);

  const rent = parseInt(rentInput.replace(/,/g, ""), 10) || 0;
  const currentRange = useMemo(
    () => areaRentRanges.find((r) => r.area === selectedArea),
    [selectedArea, areaRentRanges]
  );
  const bhkRange = useMemo(
    () => currentRange?.byBhk[selectedBhk],
    [currentRange, selectedBhk]
  );
  const percentile = bhkRange && rent > 0 ? calcPercentile(rent, bhkRange) : 0;
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
    ? "You got a great deal. Don't tell your landlord"
    : percentile <= 60
    ? "Fair rent. Nothing crazy"
    : percentile <= 80
    ? "You might be paying extra"
    : "Yeah… you're overpaying";

  const percentileColor = percentile <= 30
    ? "#4ade80"
    : percentile <= 60
    ? "#ff9a6d"
    : percentile <= 80
    ? "#fbbf24"
    : "#ef4444";

  return (
    <section
      data-section="rent-map"
      className="relative z-[31] flex w-full flex-col overflow-hidden bg-[#131313]"
      style={{ height: "100vh", minHeight: 700 }}
    >
      {/* Full-bleed map */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {mounted && <LazyActivityMap onBuildingSelect={handleBuildingSelect} onMapReady={handleMapReady} />}
      </div>

      {/* Building info popup */}
      {selectedBuilding && (
        <div
          className="absolute inset-0 z-[500] pointer-events-none "
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
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

      {/* Bottom overlay — rent checker strip on top of map */}
      <div className="pointer-events-none relative z-[450] flex flex-1 flex-col justify-end">
        <div className="pointer-events-auto w-full">
          {step === "explore" ? (
            <div className="w-full border-t border-white/[0.08] bg-[#131313]/85 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl md:px-8">
              {/* Title row */}
              <p
                className="mb-2.5 text-center text-[10px] uppercase tracking-[0.14em] text-[#777] md:mb-2 md:text-left"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                Check if you&apos;re overpaying rent
              </p>

              {/* Horizontal form strip */}
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-3">
                {/* Area picker */}
                <div className="md:w-[200px] md:flex-shrink-0">
                  <label className="mb-1 block text-[9px] font-medium uppercase tracking-[1px] text-[#666]" style={{ fontFamily: "var(--font-ui)" }}>
                    Area
                  </label>
                  <AreaPicker areas={areaNames} value={selectedArea} onChange={handleAreaChange} areaCoords={areaCoords} />
                </div>

                {/* BHK pills */}
                <div className="md:flex-shrink-0">
                  <label className="mb-1 block text-[9px] font-medium uppercase tracking-[1px] text-[#666]" style={{ fontFamily: "var(--font-ui)" }}>
                    Type
                  </label>
                  <div className="flex gap-1.5">
                    {bhkTypes.map((bhk) => (
                      <button
                        key={bhk}
                        type="button"
                        onClick={() => setSelectedBhk(bhk)}
                        className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-all ${
                          selectedBhk === bhk
                            ? "bg-[#ff9a6d]/[0.12] text-[#ff9a6d] ring-1 ring-inset ring-[#ff9a6d]/25"
                            : "bg-white/[0.04] text-[#666] hover:bg-white/[0.06] hover:text-white/50"
                        }`}
                        style={{ fontFamily: "var(--font-ui)" }}
                      >
                        {bhk}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Monthly rent */}
                <div className="md:w-[160px] md:flex-shrink-0">
                  <label className="mb-1 block text-[9px] font-medium uppercase tracking-[1px] text-[#666]" style={{ fontFamily: "var(--font-ui)" }}>
                    Monthly Rent
                  </label>
                  <div className="flex items-baseline gap-1.5 border-b border-white/10 pb-1.5 transition-colors focus-within:border-[#ff9a6d]">
                    <span className="text-[14px] text-[#666]" style={{ fontFamily: "var(--font-ui)" }}>₹</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="25,000"
                      value={rentInput}
                      onChange={handleRentChange}
                      onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                      className="w-full bg-transparent text-[14px] text-white placeholder-[#555] outline-none"
                      style={{ fontFamily: "var(--font-ui)" }}
                    />
                  </div>
                </div>

                {/* Check button */}
                <div className="md:flex-shrink-0">
                  <Button onClick={handleCheck} disabled={rent < 5000 || !selectedArea}>
                    Check my rent
                  </Button>
                </div>
              </div>

              {/* Bottom info row */}
              <div className="mt-2 flex flex-col items-center gap-1 md:flex-row md:justify-between">
                {bhkRange && (
                  <p className="text-[9px] text-[#555]" style={{ fontFamily: "var(--font-ui)" }}>
                    {selectedBhk} in {selectedArea}: {formatINR(bhkRange.min)} – {formatINR(bhkRange.max)}
                  </p>
                )}
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#4ade80] shadow-[0_0_4px_rgba(74,222,128,0.5)]" />
                  <p className="text-[9px] tracking-[0.02em] text-white/40" style={{ fontFamily: "var(--font-ui)" }}>
                    Based on real data from Secured users across Bangalore
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full border-t border-white/[0.08] bg-[#131313]/85 px-4 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl md:px-8">
              {/* Result — horizontal layout on desktop */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                {/* Left: rent + area */}
                <div className="flex items-start gap-4 md:flex-shrink-0">
                  <div>
                    <p className="text-[9px] font-medium uppercase tracking-[1px] text-[#777]" style={{ fontFamily: "var(--font-ui)" }}>
                      {selectedBhk} in {selectedArea}
                    </p>
                    <p className="mt-1 font-display text-[24px] leading-[1] tracking-[-1px] text-white">
                      {formatINR(rent)}<span className="ml-0.5 text-[11px] tracking-normal text-[#777]">/mo</span>
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="mt-1 text-[10px] text-[#777] underline decoration-[#444] underline-offset-2 transition-colors hover:text-white md:mt-0"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    Edit
                  </button>
                </div>

                {/* Divider */}
                <div className="hidden h-10 w-px bg-white/[0.1] md:block" />

                {/* Center: percentile bar */}
                <div className="flex-1">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[9px] font-medium uppercase tracking-[0.5px] text-[#777]" style={{ fontFamily: "var(--font-ui)" }}>
                      Percentile
                    </span>
                    <span className="text-[10px] font-semibold" style={{ fontFamily: "var(--font-ui)", color: percentileColor }}>
                      {percentile}th — {percentileLabel}
                    </span>
                  </div>
                  <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.1]">
                    {bhkRange && (
                      <div
                        className="absolute top-0 h-full rounded-full bg-white/[0.04]"
                        style={{
                          left: `${((bhkRange.p25 - bhkRange.min) / (bhkRange.max - bhkRange.min)) * 100}%`,
                          width: `${((bhkRange.p75 - bhkRange.p25) / (bhkRange.max - bhkRange.min)) * 100}%`,
                        }}
                      />
                    )}
                    <div
                      className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentile}%`, backgroundColor: percentileColor }}
                    />
                    <div
                      className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#1a1a1a] transition-all duration-500"
                      style={{ left: `${percentile}%`, backgroundColor: percentileColor }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between">
                    <span className="text-[8px] text-[#777]" style={{ fontFamily: "var(--font-ui)" }}>{formatINR(bhkRange?.min ?? 0)}</span>
                    <span className="text-[8px] text-[#777]" style={{ fontFamily: "var(--font-ui)" }}>{formatINR(bhkRange?.max ?? 0)}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden h-10 w-px bg-white/[0.1] md:block" />
                <div className="h-px w-full bg-white/[0.1] md:hidden" />

                {/* Right: cashback + CTA */}
                <div className="flex flex-col gap-2 md:flex-shrink-0 md:items-end">
                  <div>
                    <p className="text-[9px] font-medium uppercase tracking-[1px] text-[#777]" style={{ fontFamily: "var(--font-ui)" }}>
                      Cashback with Secured
                    </p>
                    <div className="mt-1 flex items-baseline gap-3">
                      <p className="font-display text-[20px] leading-[1] tracking-[-0.8px] text-[#ff9a6d]">
                        {formatINR(annualCashback)}<span className="ml-0.5 text-[11px] text-[#ff9a6d]/50">/yr</span>
                      </p>
                      <div className="h-4 w-px bg-white/[0.1]" />
                      <p className="font-display text-[14px] leading-[1] tracking-[-0.3px] text-white/60">
                        {formatINR(monthlyCashback)}<span className="ml-0.5 text-[10px] text-white/60">/mo</span>
                      </p>
                    </div>
                  </div>
                  <Button
                    href="https://apps.apple.com/in/app/secured-by-flent/id6757275258"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Start earning
                  </Button>
                </div>
              </div>

              {/* Promo banner */}
              <div className="mt-2.5 rounded-lg border border-[#ff9a6d]/15 bg-[#ff9a6d]/[0.05] px-3 py-1.5">
                <p className="text-center text-[10px] font-medium text-[#ff9a6d]" style={{ fontFamily: "var(--font-ui)" }}>
                  This month: flat ₹1,000 cashback on your next rent
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Building popup ── */

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
  const savingsColor = isOverpaying ? "#ef4444" : "#4ade80";

  return (
    <div
      className="absolute z-[500]"
      style={{
        left: x,
        top: y - 12,
        transform: "translate(-50%, -100%)",
        animation: "popupFadeIn 0.2s ease-out",
      }}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div
        className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#161616]/95 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        style={{ width: 220 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.8px] text-white/60" style={{ fontFamily: "var(--font-ui)" }}>
            {building.area} · {building.bhk}
          </p>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-white/[0.1] text-white/60 transition-colors hover:bg-white/[0.1] hover:text-white"
            style={{ fontSize: 11, lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Rent */}
        <div className="px-4 pt-2 pb-3">
          <p className="text-[9px] font-medium uppercase tracking-[0.5px] text-[#777]" style={{ fontFamily: "var(--font-ui)" }}>
            Rent
          </p>
          <p className="mt-0.5 font-display text-[22px] leading-[1.1] tracking-[-0.8px] text-white">
            {formatINR(building.rent)}
            <span className="ml-0.5 text-[11px] tracking-normal text-[#777]">/mo</span>
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1" style={{ background: isOverpaying ? "rgba(239,68,68,0.08)" : "rgba(74,222,128,0.08)" }}>
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none" style={{ transform: isOverpaying ? "rotate(180deg)" : "none" }}>
              <path d="M5 2L8 7H2L5 2Z" fill={savingsColor} />
            </svg>
            <span className="whitespace-nowrap text-[10px] font-semibold" style={{ color: savingsColor, fontFamily: "var(--font-ui)" }}>
              {formatINR(diff)} {isOverpaying ? "above" : "below"} market avg
            </span>
          </div>
        </div>

        {/* Cashback */}
        <div className="border-t border-white/[0.06] bg-[#ff9a6d]/[0.04] px-4 py-3">
          <p className="text-[9px] font-medium uppercase tracking-[0.5px] text-[#888]" style={{ fontFamily: "var(--font-ui)" }}>
            Cashback with Secured
          </p>
          <p className="mt-1 font-display text-[20px] leading-[1] tracking-[-0.6px] text-[#ff9a6d]">
            {formatINR(building.cashback)}
            <span className="ml-0.5 text-[11px] text-[#ff9a6d]/50">/yr</span>
            <span className="ml-2 text-[11px] font-normal tracking-normal text-white/60" style={{ fontFamily: "var(--font-ui)" }}>
              {formatINR(Math.round(building.cashback / 12))}/mo
            </span>
          </p>
        </div>
      </div>
      {/* Arrow */}
      <div className="mx-auto h-0 w-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#161616]/95" />
    </div>
  );
}

/* ── Lazy map loader ── */

function LazyActivityMap({ onBuildingSelect, onMapReady }: { onBuildingSelect?: (b: SelectedBuilding | null) => void; onMapReady?: (flyTo: (area: string) => void) => void }) {
  const [ActivityMap, setActivityMap] = useState<React.ComponentType<{ onBuildingSelect?: (b: SelectedBuilding | null) => void; onMapReady?: (flyTo: (area: string) => void) => void }> | null>(null);

  useEffect(() => {
    import("./ActivityMap").then((m) => setActivityMap(() => m.ActivityMap));
  }, []);

  if (!ActivityMap) return null;
  return <ActivityMap onBuildingSelect={onBuildingSelect} onMapReady={onMapReady} />;
}
