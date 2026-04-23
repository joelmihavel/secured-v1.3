"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

/* ── Types ── */

export interface AreaRentRange {
  area: string;
  min: number;
  max: number;
  median: number;
  p25: number;
  p75: number;
}

interface BuildingData {
  id: number;
  lat: number;
  lng: number;
  area: string;
  rent: number;
  market_avg: number;
  cashback: number;
  users: number;
}

/* ── Data ── */

export const AREA_RENT_RANGES: AreaRentRange[] = [
  { area: "Whitefield", min: 12000, max: 55000, median: 28000, p25: 18000, p75: 38000 },
  { area: "HSR Layout", min: 14000, max: 50000, median: 26000, p25: 19000, p75: 35000 },
  { area: "Indiranagar", min: 18000, max: 65000, median: 35000, p25: 24000, p75: 48000 },
  { area: "Koramangala", min: 15000, max: 60000, median: 32000, p25: 22000, p75: 45000 },
  { area: "Jayanagar", min: 10000, max: 40000, median: 22000, p25: 15000, p75: 30000 },
  { area: "Marathahalli", min: 10000, max: 45000, median: 24000, p25: 16000, p75: 32000 },
  { area: "BTM Layout", min: 10000, max: 42000, median: 22000, p25: 15000, p75: 30000 },
  { area: "Electronic City", min: 8000, max: 35000, median: 18000, p25: 12000, p75: 25000 },
  { area: "Hebbal", min: 10000, max: 45000, median: 24000, p25: 16000, p75: 33000 },
  { area: "JP Nagar", min: 10000, max: 40000, median: 21000, p25: 14000, p75: 28000 },
  { area: "Bellandur", min: 14000, max: 52000, median: 28000, p25: 19000, p75: 38000 },
  { area: "Sarjapur Road", min: 12000, max: 48000, median: 25000, p25: 17000, p75: 34000 },
  { area: "Rajajinagar", min: 10000, max: 38000, median: 20000, p25: 14000, p75: 28000 },
  { area: "Yelahanka", min: 8000, max: 32000, median: 16000, p25: 11000, p75: 22000 },
  { area: "Bannerghatta Road", min: 10000, max: 40000, median: 20000, p25: 14000, p75: 28000 },
];

export const AREA_NAMES = AREA_RENT_RANGES.map((a) => a.area);

const AREA_COORDS: Record<string, [number, number]> = {
  "Whitefield": [77.7499, 12.9698],
  "HSR Layout": [77.6474, 12.9116],
  "Indiranagar": [77.6412, 12.9719],
  "Koramangala": [77.6245, 12.9352],
  "Jayanagar": [77.5938, 12.9250],
  "Marathahalli": [77.7009, 12.9591],
  "BTM Layout": [77.6101, 12.9166],
  "Electronic City": [77.6770, 12.8399],
  "Hebbal": [77.5970, 13.0358],
  "JP Nagar": [77.5857, 12.9063],
  "Bellandur": [77.6762, 12.9256],
  "Sarjapur Road": [77.6872, 12.9107],
  "Rajajinagar": [77.5528, 12.9867],
  "Yelahanka": [77.5963, 13.1007],
  "Bannerghatta Road": [77.5969, 12.8876],
};

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateBuildings(): BuildingData[] {
  const buildings: BuildingData[] = [];
  const rng = seededRandom(42);
  let id = 1;
  for (const [area, coords] of Object.entries(AREA_COORDS)) {
    const range = AREA_RENT_RANGES.find((r) => r.area === area)!;
    const count = 4 + Math.floor(rng() * 4);
    for (let i = 0; i < count; i++) {
      const lngOffset = (rng() - 0.5) * 0.014;
      const latOffset = (rng() - 0.5) * 0.014;
      const rent = Math.round((range.min + rng() * (range.max - range.min)) / 1000) * 1000;
      const marketAvg = range.median;
      const users = 2 + Math.floor(rng() * 18);
      buildings.push({
        id: id++,
        lng: coords[0] + lngOffset,
        lat: coords[1] + latOffset,
        area,
        rent,
        market_avg: marketAvg,
        cashback: Math.round(rent * 0.01 * 12),
        users,
      });
    }
  }
  return buildings;
}

const BUILDINGS = generateBuildings();

function formatINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

function getFilteredBuildings(filter: "all" | "overpaying" | "cashback"): BuildingData[] {
  if (filter === "overpaying") return BUILDINGS.filter((b) => b.rent > b.market_avg);
  if (filter === "cashback") return BUILDINGS.filter((b) => b.cashback >= 2400);
  return BUILDINGS;
}

/* ── Map style with vector tiles for 3D buildings ── */

const MAP_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  name: "Secured Dark 3D",
  sources: {
    "carto-dark": {
      type: "raster",
      tiles: ["https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"],
      tileSize: 256,
      attribution: "",
    },
    openmaptiles: {
      type: "vector",
      url: "https://tiles.openfreemap.org/planet",
    },
  },
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  layers: [
    {
      id: "carto-dark-layer",
      type: "raster",
      source: "carto-dark",
      minzoom: 0,
      maxzoom: 20,
    },
    {
      id: "3d-buildings",
      source: "openmaptiles",
      "source-layer": "building",
      type: "fill-extrusion",
      minzoom: 13,
      paint: {
        "fill-extrusion-color": [
          "interpolate", ["linear"], ["get", "render_height"],
          0, "#1a1a2e",
          15, "#252547",
          30, "#2d2d5e",
        ],
        "fill-extrusion-height": [
          "interpolate", ["linear"], ["zoom"],
          13, 0,
          14, ["*", ["coalesce", ["get", "render_height"], 10], 1.5],
        ],
        "fill-extrusion-base": [
          "coalesce", ["get", "render_min_height"], 0,
        ],
        "fill-extrusion-opacity": 0.7,
      },
    },
  ],
};

/* ── Explore Street (car mode) path ── */

const EXPLORE_PATHS: Record<string, Array<{ center: [number, number]; bearing: number; pitch: number; zoom: number }>> = {
  "Koramangala": [
    { center: [77.6200, 12.9370], bearing: 30, pitch: 60, zoom: 15.5 },
    { center: [77.6230, 12.9350], bearing: 60, pitch: 60, zoom: 15.5 },
    { center: [77.6260, 12.9340], bearing: 90, pitch: 55, zoom: 15.5 },
    { center: [77.6280, 12.9330], bearing: 120, pitch: 55, zoom: 15.5 },
    { center: [77.6250, 12.9320], bearing: 180, pitch: 60, zoom: 15.5 },
    { center: [77.6220, 12.9330], bearing: 240, pitch: 55, zoom: 15.5 },
    { center: [77.6200, 12.9350], bearing: 300, pitch: 60, zoom: 15.5 },
    { center: [77.6200, 12.9370], bearing: 360, pitch: 60, zoom: 15.5 },
  ],
  "Whitefield": [
    { center: [77.7460, 12.9710], bearing: 20, pitch: 60, zoom: 15.5 },
    { center: [77.7490, 12.9700], bearing: 50, pitch: 58, zoom: 15.5 },
    { center: [77.7520, 12.9690], bearing: 80, pitch: 55, zoom: 15.5 },
    { center: [77.7540, 12.9680], bearing: 130, pitch: 58, zoom: 15.5 },
    { center: [77.7510, 12.9670], bearing: 200, pitch: 60, zoom: 15.5 },
    { center: [77.7480, 12.9680], bearing: 280, pitch: 58, zoom: 15.5 },
    { center: [77.7460, 12.9700], bearing: 340, pitch: 60, zoom: 15.5 },
    { center: [77.7460, 12.9710], bearing: 380, pitch: 60, zoom: 15.5 },
  ],
  "Indiranagar": [
    { center: [77.6380, 12.9730], bearing: 10, pitch: 60, zoom: 15.5 },
    { center: [77.6410, 12.9720], bearing: 45, pitch: 58, zoom: 15.5 },
    { center: [77.6440, 12.9710], bearing: 90, pitch: 55, zoom: 15.5 },
    { center: [77.6430, 12.9700], bearing: 150, pitch: 58, zoom: 15.5 },
    { center: [77.6400, 12.9710], bearing: 240, pitch: 60, zoom: 15.5 },
    { center: [77.6380, 12.9720], bearing: 320, pitch: 58, zoom: 15.5 },
    { center: [77.6380, 12.9730], bearing: 370, pitch: 60, zoom: 15.5 },
  ],
};

function getExplorePath(area: string) {
  return EXPLORE_PATHS[area] || EXPLORE_PATHS["Koramangala"];
}

/* ── Component ── */

export function ActivityMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const exploreAnimRef = useRef<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "overpaying" | "cashback">("all");
  const [flyArea, setFlyArea] = useState("");
  const [exploring, setExploring] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const activeFilterRef = useRef(activeFilter);
  activeFilterRef.current = activeFilter;

  /* ── Render markers for a given filter ── */
  const renderMarkers = useCallback((map: maplibregl.Map, filter: "all" | "overpaying" | "cashback") => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    if (popupRef.current) { popupRef.current.remove(); popupRef.current = null; }

    const buildings = getFilteredBuildings(filter);

    for (const b of buildings) {
      const isOverpaying = b.rent > b.market_avg;
      const overpayAmount = b.rent - b.market_avg;
      const isHighUsers = b.users >= 10;

      const glowColor = isOverpaying
        ? "rgba(239, 68, 68, 0.6)"
        : isHighUsers
        ? "rgba(139, 92, 246, 0.6)"
        : "rgba(255, 154, 109, 0.4)";

      const dotColor = isOverpaying ? "#ef4444" : isHighUsers ? "#8b5cf6" : "#ff9a6d";

      const el = document.createElement("div");
      el.className = "secured-3d-marker";
      el.innerHTML = `
        <div class="secured-3d-pulse" style="background: ${glowColor}"></div>
        <div class="secured-3d-dot" style="background: ${dotColor}; box-shadow: 0 0 8px ${glowColor}"></div>
        <div class="secured-3d-label">${formatINR(b.rent)}</div>
      `;

      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([b.lng, b.lat])
        .addTo(map);

      const popupHTML = `
        <div class="secured-3d-popup">
          <div class="secured-3d-popup-area">${b.area}</div>
          <div class="secured-3d-popup-rent">
            <span class="secured-3d-popup-label">Rent</span>
            <span class="secured-3d-popup-value">${formatINR(b.rent)}/mo</span>
          </div>
          <div class="secured-3d-popup-rent">
            <span class="secured-3d-popup-label">Market avg</span>
            <span class="secured-3d-popup-value">${formatINR(b.market_avg)}/mo</span>
          </div>
          ${isOverpaying
            ? `<div class="secured-3d-popup-alert">Overpaying by ${formatINR(overpayAmount)}/mo</div>`
            : `<div class="secured-3d-popup-good">Below market rate — good deal</div>`
          }
          <div class="secured-3d-popup-divider"></div>
          <div class="secured-3d-popup-cashback">Earn <strong>${formatINR(b.cashback)}/year</strong> cashback</div>
          <div class="secured-3d-popup-users">${b.users} people nearby use Secured</div>
          <a href="https://apps.apple.com/in/app/secured-by-flent/id6757275258" target="_blank" rel="noopener noreferrer" class="secured-3d-popup-cta">Optimize your rent</a>
        </div>
      `;

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        if (popupRef.current) popupRef.current.remove();
        const popup = new maplibregl.Popup({
          offset: 12,
          closeButton: true,
          closeOnClick: true,
          maxWidth: "260px",
          className: "secured-3d-popup-wrapper",
        })
          .setLngLat([b.lng, b.lat])
          .setHTML(popupHTML)
          .addTo(map);
        popupRef.current = popup;
      });

      el.addEventListener("mouseenter", () => el.classList.add("secured-3d-marker-hover"));
      el.addEventListener("mouseleave", () => el.classList.remove("secured-3d-marker-hover"));

      markersRef.current.push(marker);
    }
  }, []);

  /* ── Init map ── */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [77.6245, 12.9352],
      zoom: 13,
      pitch: 50,
      bearing: -15,
      minZoom: 11,
      maxZoom: 17,
      maxBounds: [[77.35, 12.75], [77.85, 13.20]],
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    map.on("load", () => {
      mapRef.current = map;
      setMapReady(true);
      renderMarkers(map, activeFilterRef.current);
    });

    return () => {
      if (exploreAnimRef.current) cancelAnimationFrame(exploreAnimRef.current);
      markersRef.current.forEach((m) => m.remove());
      if (popupRef.current) popupRef.current.remove();
      map.remove();
      mapRef.current = null;
    };
  }, [renderMarkers]);

  /* ── React to filter changes ── */
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    renderMarkers(mapRef.current, activeFilter);
  }, [activeFilter, mapReady, renderMarkers]);

  /* ── Fly to area ── */
  const handleFlyTo = useCallback((area: string) => {
    if (!area || !mapRef.current) return;
    const coords = AREA_COORDS[area];
    if (!coords) return;
    setFlyArea(area);
    stopExplore();
    mapRef.current.flyTo({
      center: coords,
      zoom: 14.5,
      pitch: 55,
      bearing: -20 + Math.random() * 40,
      duration: 2000,
      essential: true,
    });
  }, []);

  /* ── Explore street (car mode) ── */
  const startExplore = useCallback(() => {
    if (!mapRef.current) return;
    setExploring(true);
    const map = mapRef.current;
    const currentCenter = map.getCenter();

    let closestArea = "Koramangala";
    let minDist = Infinity;
    for (const [area, coords] of Object.entries(AREA_COORDS)) {
      const dist = Math.hypot(coords[0] - currentCenter.lng, coords[1] - currentCenter.lat);
      if (dist < minDist) { minDist = dist; closestArea = area; }
    }

    const path = getExplorePath(closestArea);
    let step = 0;
    const totalSteps = path.length;
    const STEP_DURATION = 3000;

    function animateStep() {
      if (!mapRef.current) return;
      const waypoint = path[step % totalSteps];
      mapRef.current.easeTo({
        center: waypoint.center,
        bearing: waypoint.bearing,
        pitch: waypoint.pitch,
        zoom: waypoint.zoom,
        duration: STEP_DURATION,
        easing: (t) => t * (2 - t),
      });

      step++;
      exploreAnimRef.current = window.setTimeout(() => {
        animateStep();
      }, STEP_DURATION) as unknown as number;
    }

    animateStep();
  }, []);

  const stopExplore = useCallback(() => {
    setExploring(false);
    if (exploreAnimRef.current) {
      clearTimeout(exploreAnimRef.current);
      exploreAnimRef.current = null;
    }
  }, []);

  return (
    <div className="relative h-full w-full" data-lenis-prevent>
      <div ref={containerRef} className="h-full w-full" />

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[10] h-32 bg-gradient-to-b from-[#131313] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[10] h-[55%] bg-gradient-to-t from-[#131313] via-[#131313]/90 via-30% to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[10] w-24 bg-gradient-to-r from-[#131313] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[10] w-24 bg-gradient-to-l from-[#131313] to-transparent" />

      {/* Controls — left column: filters + explore */}
      <div className="absolute left-5 top-20 z-[20] flex flex-col gap-1.5 md:left-6 md:top-24">
        {(["all", "overpaying", "cashback"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[1px] backdrop-blur-md transition-all md:text-[11px] ${
              activeFilter === f
                ? "border-[#ff9a6d]/40 bg-[#ff9a6d]/10 text-[#ff9a6d]"
                : "border-white/[0.06] bg-[#1a1a1a]/70 text-[#666] hover:text-white"
            }`}
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {f === "all" ? "All Homes" : f === "overpaying" ? "Overpaying" : "Cashback Hotspots"}
          </button>
        ))}

        <div className="mt-1 h-px w-8 bg-white/[0.06]" />

        <button
          onClick={exploring ? stopExplore : startExplore}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[1px] backdrop-blur-md transition-all md:text-[11px] ${
            exploring
              ? "border-[#8b5cf6]/40 bg-[#8b5cf6]/10 text-[#8b5cf6]"
              : "border-white/[0.06] bg-[#1a1a1a]/70 text-[#666] hover:text-white"
          }`}
          style={{ fontFamily: "var(--font-ui)" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {exploring ? (
              <>
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </>
            ) : (
              <polygon points="5,3 19,12 5,21" />
            )}
          </svg>
          {exploring ? "Stop" : "Explore Street"}
        </button>
      </div>

      {/* Area fly-to — top center */}
      <div className="absolute left-1/2 top-20 z-[20] -translate-x-1/2 md:top-24">
        <div className="flex items-center overflow-hidden rounded-full border border-white/10 bg-[#1a1a1a]/80 backdrop-blur-md">
          <svg className="ml-3 text-white/30" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <select
            value={flyArea}
            onChange={(e) => handleFlyTo(e.target.value)}
            className="w-48 appearance-none bg-transparent px-3 py-2.5 text-xs text-white outline-none md:w-64"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            <option value="" className="bg-[#1a1a1a] text-[#666]">
              Fly to area...
            </option>
            {AREA_NAMES.map((name) => (
              <option key={name} value={name} className="bg-[#1a1a1a] text-white">
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
