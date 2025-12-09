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
  const minBudgetParam = searchParams.get("minBudget");
  const maxBudgetParam = searchParams.get("maxBudget");
  const moveInDateParam = searchParams.get("moveInDate") || "";
  const showAvailableParam = searchParams.get("showAvailable");
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

  // Initialize filters from URL params
  const initialFilters = useMemo<SearchFilters>(() => {
    let minBudget = 0;
    let maxBudget = Infinity;

    if (minBudgetParam) {
      const parsed = parseInt(minBudgetParam, 10);
      if (!isNaN(parsed)) minBudget = parsed;
    }

    if (maxBudgetParam) {
      const parsed = parseInt(maxBudgetParam, 10);
      if (!isNaN(parsed)) maxBudget = parsed;
    }

    const showAvailable =
      showAvailableParam === null ? true : showAvailableParam === "true";

    return {
      minBudget,
      maxBudget,
      locationId: locationIdFromUrl,
      moveInDate: moveInDateParam,
      showAvailable,
    };
  }, [
    locationIdFromUrl,
    minBudgetParam,
    maxBudgetParam,
    moveInDateParam,
    showAvailableParam,
  ]);

  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  // Create a reverse map: locationId -> locationName
  const locationNameMap = useMemo(
    () => new Map(locations.map((loc) => [loc.id, loc.fieldData.name])),
    [locations]
  );

  // Sync filters state when URL param changes (external navigation)
  useEffect(() => {
    const urlFilters: Partial<SearchFilters> = {};
    let hasChanges = false;

    // Check location
    if (locationIdFromUrl !== filters.locationId) {
      urlFilters.locationId = locationIdFromUrl;
      hasChanges = true;
    }

    // Check minBudget
    const urlMinBudget = minBudgetParam ? parseInt(minBudgetParam, 10) : 0;
    if (!isNaN(urlMinBudget) && urlMinBudget !== filters.minBudget) {
      urlFilters.minBudget = urlMinBudget;
      hasChanges = true;
    } else if (!minBudgetParam && filters.minBudget !== 0) {
      urlFilters.minBudget = 0;
      hasChanges = true;
    }

    // Check maxBudget
    const urlMaxBudget = maxBudgetParam
      ? parseInt(maxBudgetParam, 10)
      : Infinity;
    if (!isNaN(urlMaxBudget) && urlMaxBudget !== filters.maxBudget) {
      urlFilters.maxBudget = urlMaxBudget;
      hasChanges = true;
    } else if (!maxBudgetParam && filters.maxBudget !== Infinity) {
      urlFilters.maxBudget = Infinity;
      hasChanges = true;
    }

    // Check moveInDate
    if (moveInDateParam !== filters.moveInDate) {
      urlFilters.moveInDate = moveInDateParam;
      hasChanges = true;
    }

    // Check showAvailable
    const urlShowAvailable =
      showAvailableParam === null ? true : showAvailableParam === "true";
    if (urlShowAvailable !== filters.showAvailable) {
      urlFilters.showAvailable = urlShowAvailable;
      hasChanges = true;
    }

    if (hasChanges) {
      isSyncingFromUrl.current = true;
      setFilters((prev) => ({
        ...prev,
        ...urlFilters,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    locationIdFromUrl,
    minBudgetParam,
    maxBudgetParam,
    moveInDateParam,
    showAvailableParam,
  ]);

  // Update URL when filters change (from user interaction)
  useEffect(() => {
    // Skip if we're currently syncing from URL
    if (isSyncingFromUrl.current) {
      isSyncingFromUrl.current = false;
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    let urlChanged = false;

    // Update location
    const currentLocationName = filters.locationId
      ? locationNameMap.get(filters.locationId)
      : null;
    const urlLocationName = locationNameParam
      ? decodeURIComponent(locationNameParam)
      : "";

    if (filters.locationId && currentLocationName) {
      if (urlLocationName !== currentLocationName) {
        params.set("location", encodeURIComponent(currentLocationName));
        urlChanged = true;
      }
    } else if (!filters.locationId && urlLocationName) {
      params.delete("location");
      urlChanged = true;
    }

    // Update minBudget
    if (filters.minBudget !== 0) {
      if (minBudgetParam !== filters.minBudget.toString()) {
        params.set("minBudget", filters.minBudget.toString());
        urlChanged = true;
      }
    } else if (minBudgetParam) {
      params.delete("minBudget");
      urlChanged = true;
    }

    // Update maxBudget
    if (filters.maxBudget !== Infinity) {
      if (maxBudgetParam !== filters.maxBudget.toString()) {
        params.set("maxBudget", filters.maxBudget.toString());
        urlChanged = true;
      }
    } else if (maxBudgetParam) {
      params.delete("maxBudget");
      urlChanged = true;
    }

    // Update moveInDate
    if (filters.moveInDate) {
      if (moveInDateParam !== filters.moveInDate) {
        params.set("moveInDate", filters.moveInDate);
        urlChanged = true;
      }
    } else if (moveInDateParam) {
      params.delete("moveInDate");
      urlChanged = true;
    }

    // Update showAvailable
    if (filters.showAvailable !== true) {
      if (showAvailableParam !== "false") {
        params.set("showAvailable", "false");
        urlChanged = true;
      }
    } else if (showAvailableParam === "false") {
      params.delete("showAvailable");
      urlChanged = true;
    }

    if (urlChanged) {
      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [
    filters.locationId,
    filters.minBudget,
    filters.maxBudget,
    filters.moveInDate,
    filters.showAvailable,
    locationNameMap,
    pathname,
    router,
    searchParams,
    locationNameParam,
    minBudgetParam,
    maxBudgetParam,
    moveInDateParam,
    showAvailableParam,
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
