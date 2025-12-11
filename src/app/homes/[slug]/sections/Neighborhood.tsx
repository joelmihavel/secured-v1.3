"use client";

import React, { useMemo, useState, useCallback } from "react";
import { Property, Location } from "@/lib/webflow";
import { CardSection } from "@/components/layout/CardSection";
import dynamic from "next/dynamic";
import { useGooglePlacesAutocomplete } from "@/hooks/useGooglePlacesAutocomplete";

const GoogleMap = dynamic(() => import("@/components/ui/GoogleMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400 font-medium">
      Loading Map...
    </div>
  ),
});

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

interface NeighborhoodProps {
  property: Property;
  location?: Location;
  neighborhoodProperties?: Property[];
}

export const Neighborhood = ({
  property,
  location,
  neighborhoodProperties = [],
}: NeighborhoodProps) => {
  const lat = parseFloat(property.fieldData["map-latitude"] || "0");
  const lng = parseFloat(property.fieldData["map-longitude"] || "0");
  const locationName = location?.fieldData.name || "Neighborhood";
  const [selectedPlace, setSelectedPlace] = useState<{
    lat: number;
    lng: number;
    name: string;
  } | null>(null);
  const [directionsInfo, setDirectionsInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  const neighbors = useMemo(() => {
    return neighborhoodProperties
      .map((p) => ({
        lat: parseFloat(p.fieldData["map-latitude"] || "0"),
        lng: parseFloat(p.fieldData["map-longitude"] || "0"),
        name: p.fieldData.name,
        slug: p.fieldData.slug,
      }))
      .filter((n) => n.lat !== 0 && n.lng !== 0);
  }, [neighborhoodProperties]);

  const hasCoordinates = lat !== 0 && lng !== 0;

  const handlePlaceSelected = useCallback(
    (place: google.maps.places.PlaceResult) => {
      if (place.geometry?.location) {
        const placeLat = place.geometry.location.lat();
        const placeLng = place.geometry.location.lng();
        setSelectedPlace({
          lat: placeLat,
          lng: placeLng,
          name: place.name || place.formatted_address || "Selected Location",
        });
        // Clear previous directions info when new place is selected
        setDirectionsInfo(null);
      }
    },
    []
  );

  const inputRef = useGooglePlacesAutocomplete({
    onPlaceSelected: handlePlaceSelected,
    apiKey: GOOGLE_MAPS_API_KEY,
  });

  const handleDirectionsResult = useCallback(
    (distance: string, duration: string) => {
      if (distance && duration) {
        setDirectionsInfo({ distance, duration });
      } else {
        setDirectionsInfo(null);
      }
    },
    []
  );

  const svgPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05' fill-rule='nonzero'%3E%3Cpath d='M29 58.58l7.38-7.39A30.95 30.95 0 0 1 29 37.84a30.95 30.95 0 0 1-7.38 13.36l7.37 7.38zm1.4 1.41l.01.01h-2.84l-7.37-7.38A30.95 30.95 0 0 1 6.84 60H0v-1.02a28.9 28.9 0 0 0 18.79-7.78L0 32.41v-4.84L18.78 8.79A28.9 28.9 0 0 0 0 1.02V0h6.84a30.95 30.95 0 0 1 13.35 7.38L27.57 0h2.84l7.39 7.38A30.95 30.95 0 0 1 51.16 0H60v27.58-.01V60h-8.84a30.95 30.95 0 0 1-13.37-7.4L30.4 60zM29 1.41l-7.4 7.38A30.95 30.95 0 0 1 29 22.16 30.95 30.95 0 0 1 36.38 8.8L29 1.4zM58 1A28.9 28.9 0 0 0 39.2 8.8L58 27.58V1.02zm-20.2 9.2A28.9 28.9 0 0 0 30.02 29h26.56L37.8 10.21zM30.02 31a28.9 28.9 0 0 0 7.77 18.79l18.79-18.79H30.02zm9.18 20.2A28.9 28.9 0 0 0 58 59V32.4L39.2 51.19zm-19-1.4a28.9 28.9 0 0 0 7.78-18.8H1.41l18.8 18.8zm7.78-20.8A28.9 28.9 0 0 0 20.2 10.2L1.41 29h26.57z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <CardSection
      id="neighborhood"

      backgroundPattern="/patterns/stamp-collection.svg"
      patternOpacity={0.02}
      patternMask="to-top"
      className="bg-ground-brown"
      paddingX="small"
      paddingY="small"
    >
      <div className="space-y-8 pt-16">
        {/* Header Section */}
        <div className="text-center space-y-4 pb-8">
          <p className="text-white/80 text-sm font-medium tracking-wide uppercase">
            Neighborhood
          </p>
          <h2 className="font-heading text-white text-fluid-h2">
            See what's around
            <br />
            <span className="font-zin font-light italic">{locationName}</span>
          </h2>
        </div>

        {/* Map Section with Search Overlay */}
        <div className="h-[64vh] rounded-3xl overflow-hidden relative">
          {hasCoordinates ? (
            <div key={`map-${lat}-${lng}`} className="w-full h-full relative">
              <GoogleMap
                center={[lat, lng]}
                zoom={15}
                mainProperty={{ lat, lng, name: property.fieldData.name }}
                neighbors={neighbors}
                apiKey={GOOGLE_MAPS_API_KEY}
                selectedPlace={selectedPlace}
                onDirectionsResult={handleDirectionsResult}
              />
              {/* Search Bar Overlay */}
              <div className="absolute top-4 left-4 right-4 z-[1000]">
                <div className="bg-white rounded-full shadow-lg px-6 py-3 flex items-center gap-3 max-w-md">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Find Distance from your Home"
                    className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-sm"
                  />
                  {selectedPlace && (
                    <button
                      onClick={() => {
                        setSelectedPlace(null);
                        setDirectionsInfo(null);
                      }}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Clear selection"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              {/* Directions Info Display */}
              {directionsInfo && (
                <div className="absolute top-20 left-4 right-4 z-[1000]">
                  <div className="bg-white rounded-2xl shadow-lg px-6 py-4 w-fit">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-sm font-medium">
                          {directionsInfo.distance}
                        </span>
                      </div>
                      <div className="h-4 w-px bg-gray-300"></div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm font-medium">
                          {directionsInfo.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
              Map not available
            </div>
          )}
        </div>
      </div>
    </CardSection>
  );
};
