"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const KORAMANGALA_CENTER: [number, number] = [12.9352, 77.6245];
const DEFAULT_ZOOM = 14;

interface HotspotData {
  area: string;
  lat: number;
  lng: number;
  users: number;
  cashback: number;
}

interface TenantPin {
  lat: number;
  lng: number;
  rent: number;
  cashback: number;
  area: string;
}

export interface AreaRentRange {
  area: string;
  min: number;
  max: number;
  median: number;
  p25: number;
  p75: number;
}

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

const HOTSPOTS: HotspotData[] = [
  { area: "Whitefield", lat: 12.9698, lng: 77.7499, users: 48, cashback: 120000 },
  { area: "HSR Layout", lat: 12.9116, lng: 77.6474, users: 32, cashback: 80000 },
  { area: "Indiranagar", lat: 12.9719, lng: 77.6412, users: 27, cashback: 65000 },
  { area: "Koramangala", lat: 12.9352, lng: 77.6245, users: 41, cashback: 100000 },
  { area: "Jayanagar", lat: 12.9250, lng: 77.5938, users: 22, cashback: 55000 },
  { area: "Marathahalli", lat: 12.9591, lng: 77.7009, users: 35, cashback: 88000 },
  { area: "BTM Layout", lat: 12.9166, lng: 77.6101, users: 29, cashback: 72000 },
  { area: "Electronic City", lat: 12.8399, lng: 77.6770, users: 18, cashback: 45000 },
  { area: "Hebbal", lat: 13.0358, lng: 77.5970, users: 15, cashback: 38000 },
  { area: "JP Nagar", lat: 12.9063, lng: 77.5857, users: 24, cashback: 60000 },
  { area: "Bellandur", lat: 12.9256, lng: 77.6762, users: 38, cashback: 95000 },
  { area: "Sarjapur Road", lat: 12.9107, lng: 77.6872, users: 31, cashback: 78000 },
  { area: "Rajajinagar", lat: 12.9867, lng: 77.5528, users: 12, cashback: 30000 },
  { area: "Yelahanka", lat: 13.1007, lng: 77.5963, users: 10, cashback: 25000 },
  { area: "Bannerghatta Road", lat: 12.8876, lng: 77.5969, users: 20, cashback: 50000 },
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateTenantPins(): TenantPin[] {
  const pins: TenantPin[] = [];
  const rng = seededRandom(42);

  for (const hotspot of HOTSPOTS) {
    const count = Math.min(hotspot.users, 5);
    for (let i = 0; i < count; i++) {
      const latOffset = (rng() - 0.5) * 0.012;
      const lngOffset = (rng() - 0.5) * 0.012;
      const rent = Math.round((15000 + rng() * 30000) / 1000) * 1000;
      const cashback = Math.round(rent * (0.008 + rng() * 0.007));
      pins.push({
        lat: hotspot.lat + latOffset,
        lng: hotspot.lng + lngOffset,
        rent,
        cashback,
        area: hotspot.area,
      });
    }
  }
  return pins;
}

const TENANT_PINS = generateTenantPins();

function formatRent(amount: number): string {
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}

function formatCashback(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}


function AreaHighlights() {
  const map = useMap();

  useEffect(() => {
    const layers: L.Layer[] = [];

    for (const hotspot of HOTSPOTS) {
      const radius = 300 + hotspot.users * 12;

      const circle = L.circle([hotspot.lat, hotspot.lng], {
        radius,
        color: "rgba(255, 154, 109, 0.25)",
        weight: 1,
        fillColor: "rgba(255, 154, 109, 0.06)",
        fillOpacity: 1,
        dashArray: "4 4",
      }).addTo(map);

      const label = L.divIcon({
        className: "",
        html: `<div class="secured-area-label">${hotspot.area}</div>`,
        iconSize: [120, 20],
        iconAnchor: [60, 10],
      });
      const labelMarker = L.marker([hotspot.lat, hotspot.lng], { icon: label, interactive: false }).addTo(map);

      layers.push(circle, labelMarker);
    }

    return () => {
      layers.forEach((l) => map.removeLayer(l));
    };
  }, [map]);

  return null;
}


function TenantMarkers({
  onHover,
  onLeave,
}: {
  onHover: (pin: TenantPin, x: number, y: number) => void;
  onLeave: () => void;
}) {
  const map = useMap();

  useEffect(() => {
    const markers: L.Marker[] = [];

    for (const pin of TENANT_PINS) {
      const icon = L.divIcon({
        className: "",
        html: `
          <div class="secured-tenant-pin">
            <div class="secured-tenant-dot"></div>
            <div class="secured-tenant-info">
              <span class="secured-tenant-rent">${formatRent(pin.rent)}</span>
              <span class="secured-tenant-cashback">↩ ₹${pin.cashback.toLocaleString("en-IN")}</span>
            </div>
          </div>
        `,
        iconSize: [90, 28],
        iconAnchor: [6, 14],
      });

      const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(map);

      marker.on("mouseover", (e: L.LeafletMouseEvent) => {
        const point = map.latLngToContainerPoint(e.latlng);
        onHover(pin, point.x, point.y);
      });
      marker.on("mouseout", () => onLeave());
      marker.on("click", (e: L.LeafletMouseEvent) => {
        const point = map.latLngToContainerPoint(e.latlng);
        onHover(pin, point.x, point.y);
      });

      markers.push(marker);
    }

    return () => {
      markers.forEach((m) => map.removeLayer(m));
    };
  }, [map, onHover, onLeave]);

  return null;
}

function FlyToArea({ area }: { area: string }) {
  const map = useMap();

  useEffect(() => {
    if (!area) return;
    const match = HOTSPOTS.find(
      (h) => h.area.toLowerCase().includes(area.toLowerCase())
    );
    if (match) {
      map.flyTo([match.lat, match.lng], 14, { duration: 1.2 });
    }
  }, [area, map]);

  return null;
}

export function ActivityMap() {
  const [tooltip, setTooltip] = useState<{
    data: TenantPin;
    x: number;
    y: number;
  } | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [flyTarget, setFlyTarget] = useState("");

  const handleHover = useCallback((data: TenantPin, x: number, y: number) => {
    setTooltip({ data, x, y });
  }, []);

  const handleLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const handleSearch = useCallback(() => {
    if (searchValue.trim()) setFlyTarget(searchValue.trim());
  }, [searchValue]);

  return (
    <div className="relative h-full w-full" data-lenis-prevent>
      <MapContainer
        center={KORAMANGALA_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={true}
        attributionControl={false}
        scrollWheelZoom={false}
        dragging={true}
        doubleClickZoom={true}
        touchZoom={true}
        minZoom={11}
        maxZoom={16}
        maxBounds={[[12.75, 77.35], [13.20, 77.85]]}
        maxBoundsViscosity={1.0}
        style={{ height: "100%", width: "100%", background: "#131313", zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />
        <AreaHighlights />
        <TenantMarkers onHover={handleHover} onLeave={handleLeave} />
        {flyTarget && <FlyToArea area={flyTarget} />}
      </MapContainer>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[400] h-32 bg-gradient-to-b from-[#131313] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[400] h-[55%] bg-gradient-to-t from-[#131313] via-[#131313]/90 via-30% to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[400] w-24 bg-gradient-to-r from-[#131313] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[400] w-24 bg-gradient-to-l from-[#131313] to-transparent" />

      {tooltip && (
        <div
          className="pointer-events-none absolute z-[500] animate-[fadeScale_0.2s_ease-out]"
          style={{
            left: tooltip.x,
            top: tooltip.y - 12,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="rounded-xl border border-white/10 bg-[#1a1a1a]/90 px-4 py-3 shadow-xl backdrop-blur-md">
            <p className="text-sm font-semibold text-white">{tooltip.data.area}</p>
            <p className="mt-1 text-xs text-[#aaa]">
              Rent: {formatRent(tooltip.data.rent)}/mo
            </p>
            <p className="mt-0.5 text-xs font-medium text-[#c4a0ff]">
              ₹{tooltip.data.cashback.toLocaleString("en-IN")} cashback earned
            </p>
          </div>
        </div>
      )}

      <div className="absolute left-1/2 top-20 z-[500] -translate-x-1/2 md:top-24">
        <div className="flex items-center overflow-hidden rounded-full border border-white/10 bg-[#1a1a1a]/80 backdrop-blur-md">
          <svg className="ml-3 text-white/30" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Find your area..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-48 bg-transparent px-3 py-2.5 text-xs text-white placeholder-white/30 outline-none md:w-64"
            style={{ fontFamily: "var(--font-ui)" }}
          />
        </div>
      </div>
    </div>
  );
}
