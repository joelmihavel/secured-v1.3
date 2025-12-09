"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Property, Location, Room, Occupant } from "@/lib/webflow";
import { SearchBar, SearchFilters } from "@/components/ui/SearchBar";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { OpenSection } from "@/components/layout/OpenSection";
import { CardSection } from "@/components/layout/CardSection";

interface PropertyBrowserProps {
  properties: Property[];
  locations: Location[];
  rooms?: Room[];
  occupants?: Occupant[];
}

export const PropertyBrowser = ({
  properties,
  locations,
  rooms = [],
  occupants = [],
}: PropertyBrowserProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locationNameParam = searchParams.get("location") || "";
  const isSyncingFromUrl = useRef(false);

  // Find location ID from location name
  const locationIdFromUrl = useMemo(() => {
    if (!locationNameParam) return "";
    const location = locations.find(
      (loc) =>
        loc.fieldData.name.toLowerCase().trim() ===
        decodeURIComponent(locationNameParam).toLowerCase().trim()
    );
    return location?.id || "";
  }, [locationNameParam, locations]);

  const [filters, setFilters] = useState<SearchFilters>({
    minBudget: 0,
    maxBudget: Infinity,
    locationId: locationIdFromUrl,
    moveInDate: "",
    showAvailable: true,
  });

  // Create a reverse map: locationId -> locationName
  const locationNameMap = useMemo(
    () => new Map(locations.map((loc) => [loc.id, loc.fieldData.name])),
    [locations]
  );

  // Sync filters state when URL param changes (external navigation)
  useEffect(() => {
    if (locationIdFromUrl !== filters.locationId) {
      isSyncingFromUrl.current = true;
      setFilters((prev) => ({
        ...prev,
        locationId: locationIdFromUrl,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationIdFromUrl]);

  // Update URL when location filter changes (from user interaction)
  useEffect(() => {
    // Skip if we're currently syncing from URL
    if (isSyncingFromUrl.current) {
      isSyncingFromUrl.current = false;
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    const currentLocationName = filters.locationId
      ? locationNameMap.get(filters.locationId)
      : null;

    const urlLocationName = locationNameParam
      ? decodeURIComponent(locationNameParam)
      : "";

    // Only update URL if it's different from current state
    if (filters.locationId && currentLocationName) {
      if (urlLocationName !== currentLocationName) {
        params.set("location", encodeURIComponent(currentLocationName));
        const newUrl = params.toString()
          ? `${pathname}?${params.toString()}`
          : pathname;
        router.replace(newUrl, { scroll: false });
      }
    } else if (!filters.locationId && urlLocationName) {
      // Clear location from URL if filter is cleared
      params.delete("location");
      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [
    filters.locationId,
    locationNameMap,
    pathname,
    router,
    searchParams,
    locationNameParam,
  ]);

  const locationMap = useMemo(
    () => new Map(locations.map((loc) => [loc.id, loc.fieldData.name])),
    [locations]
  );

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // do not show upcoming properties
      if (property.fieldData["is-upcoming"]) {
        return false;
      }

      // Filter by Location
      if (
        filters.locationId &&
        property.fieldData.location !== filters.locationId
      ) {
        return false;
      }

      // Filter by Budget
      const rent = parseInt(
        property.fieldData["rent-in-rupees"]?.replace(/,/g, "") || "0"
      );
      if (rent < filters.minBudget || rent > filters.maxBudget) {
        return false;
      }

      // Filter by Availability
      if (filters.showAvailable && !property.fieldData.available) {
        return false;
      }

      // Filter by Date
      if (filters.moveInDate && property.fieldData["available-from"]) {
        const availableFrom = new Date(property.fieldData["available-from"]);
        const moveIn = new Date(filters.moveInDate);
        // If property is available AFTER move-in date, it's not suitable?
        // Or if we want to move in by X date, property must be available by X date.
        if (availableFrom > moveIn) {
          return false;
        }
      }

      return true;
    });
  }, [properties, filters]);

  return (
    <>
      <CardSection
        id="homes"
        className="py-8 my-4"
        backgroundPattern="/patterns/intersecting-circles.svg"
        patternMask="to-bottom"
        patternOpacity={0.06}
      >
        <div className="max-w-5xl mx-auto">
          <SearchBar
            locations={locations}
            filters={filters}
            setFilters={setFilters}
          />
        </div>
      </CardSection>

      <OpenSection className="pt-0">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => {
              const locationId = property.fieldData.location;
              const locationName = locationId
                ? locationMap.get(locationId)
                : undefined;

              return (
                <Link
                  key={property.id}
                  href={`/homes/${property.fieldData.slug}`}
                  className="block h-full"
                >
                  <PropertyCard
                    property={property}
                    locationName={locationName}
                    rooms={rooms}
                    occupants={occupants}
                  />
                </Link>
              );
            })}
            {filteredProperties.length === 0 && (
              <div className="col-span-full text-center py-20">
                <p className="text-xl text-text-main/60">
                  No homes found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </OpenSection>
    </>
  );
};
