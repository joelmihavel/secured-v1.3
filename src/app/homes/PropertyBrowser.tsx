"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Property, Location, Room, Occupant } from "@/lib/webflow";
import { sortProperties } from "@/lib/property-utils";
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
  const femaleOnlyParam = searchParams.get("femaleOnly");
  const isSyncingFromUrl = useRef(false);

  /* 
    This robust replacement handles the multi-select logic for locations. 
    It parses comma-separated location names from the URL into location IDs, 
    updates the URL with comma-separated names when filters change, 
    and filters properties based on the selected location IDs.
  */

  // Find location ID from location name
  const locationIdsFromUrl = useMemo(() => {
    if (!locationNameParam) return [];
    
    // Split by comma and trim
    const names = decodeURIComponent(locationNameParam)
      .split(",")
      .map(n => n.trim().toLowerCase())
      .filter(n => n.length > 0);
      
    if (names.length === 0) return [];

    const ids: string[] = [];
    names.forEach(name => {
      const location = locations.find(
        (loc) => loc.fieldData.name.toLowerCase().trim() === name
      );
      if (location) {
        ids.push(location.id);
      }
    });
    
    return ids;
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

    const femaleOnly = femaleOnlyParam === "true";

    return {
      minBudget,
      maxBudget,
      locationIds: locationIdsFromUrl,
      moveInDate: moveInDateParam,
      showAvailable,
      femaleOnly,
    };
  }, [
    locationIdsFromUrl,
    minBudgetParam,
    maxBudgetParam,
    moveInDateParam,
    showAvailableParam,
    femaleOnlyParam,
  ]);

  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  // Create a map: locationId -> locationName
  const locationNameMap = useMemo(
    () => new Map(locations.map((loc) => [loc.id, loc.fieldData.name])),
    [locations]
  );

  // Sync filters state when URL param changes (external navigation)
  useEffect(() => {
    const urlFilters: Partial<SearchFilters> = {};
    let hasChanges = false;

    // Check location
    // Simple array equality check (assuming order doesn't matter much or is stable enough for this check)
    const currentUrlIds = locationIdsFromUrl.sort().join(",");
    const currentFilterIds = (filters.locationIds || []).sort().join(",");
    
    if (currentUrlIds !== currentFilterIds) {
      urlFilters.locationIds = locationIdsFromUrl;
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

    // Check femaleOnly
    const urlFemaleOnly = femaleOnlyParam === "true";
    if (urlFemaleOnly !== filters.femaleOnly) {
      urlFilters.femaleOnly = urlFemaleOnly;
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
    locationIdsFromUrl,
    minBudgetParam,
    maxBudgetParam,
    moveInDateParam,
    showAvailableParam,
    femaleOnlyParam,
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
    const selectedIds = filters.locationIds || [];
    const locationNames: string[] = [];
    
    selectedIds.forEach(id => {
        const name = locationNameMap.get(id);
        if (name) locationNames.push(name);
    });
    
    const newLocationParam = locationNames.join(",");
    const urlLocationParam = locationNameParam ? decodeURIComponent(locationNameParam) : "";
    
    // Check if changed (simple string comparison works if order matches, but let's be safe?)
    // Actually, let's just update if the serialized string is different.
    if (newLocationParam && newLocationParam !== urlLocationParam) {
        params.set("location", encodeURIComponent(newLocationParam));
        urlChanged = true;
    } else if (!newLocationParam && urlLocationParam) {
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

    // Update femaleOnly
    if (filters.femaleOnly) {
      if (femaleOnlyParam !== "true") {
        params.set("femaleOnly", "true");
        urlChanged = true;
      }
    } else if (femaleOnlyParam === "true") {
      params.delete("femaleOnly");
      urlChanged = true;
    }

    if (urlChanged) {
      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [
    filters.locationIds,
    filters.minBudget,
    filters.maxBudget,
    filters.moveInDate,
    filters.showAvailable,
    filters.femaleOnly,
    locationNameMap,
    pathname,
    router,
    searchParams,
    locationNameParam,
    minBudgetParam,
    maxBudgetParam,
    moveInDateParam,
    showAvailableParam,
    femaleOnlyParam,
  ]);

  const locationMap = useMemo(
    () => new Map(locations.map((loc) => [loc.id, loc.fieldData.name])),
    [locations]
  );

  // Sort locations alphabetically A -> Z
  const sortedLocations = useMemo(
    () => [...locations].sort((a, b) =>
      a.fieldData.name.localeCompare(b.fieldData.name)
    ),
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
        filters.locationIds && 
        filters.locationIds.length > 0
      ) {
        if (!property.fieldData.location) return false;
        if (!filters.locationIds.includes(property.fieldData.location)) return false;
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

      // Filter by Female Only
      if (filters.femaleOnly && !property.fieldData["female-only"]) {
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
    }).sort(sortProperties);
  }, [properties, filters]);

  return (
    <>
      <CardSection
        id="homes"
        className="py-8 my-4"
        backgroundPattern="/patterns/intersecting-circles.svg"
        patternOpacity={0.03}
      >
        <div className="max-w-5xl mx-auto">
          <SearchBar
            locations={sortedLocations}
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
                  href={`/homes/${property.fieldData.slug}?${searchParams.toString()}`}
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
