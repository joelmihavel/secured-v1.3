"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { Property, Location, Room, Occupant } from "@/lib/webflow";
import {
  sortByAvailabilityThenRank,
  propertyHasDiscount,
  isPropertyActive,
  isUpcomingProperty,
} from "@/lib/property-utils";
import { SearchBar, SearchFilters } from "@/components/ui/SearchBar";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { DiscountCta } from "@/components/ui/DiscountCta";
import { Button } from "@/components/ui/Button";
import { OpenSection } from "@/components/layout/OpenSection";
import { CardSection } from "@/components/layout/CardSection";
import { ComingSoon } from "@/app/(Homepage)/sections/ComingSoon";
import { trackSearchFiltersChanged, trackPropertyCardClick } from "@/lib/posthog-tracking";
import { CTA_IDS } from "@/lib/cta-ids";
import { useLottieData } from "@/hooks/useLottieData";
import Lottie from "lottie-react";

interface PropertyBrowserProps {
  properties: Property[];
  locations: Location[];
  rooms?: Room[];
  occupants?: Occupant[];
}

const getMoveInCutoffDate = (moveInPreference: string): Date | null => {
  if (moveInPreference === "within-week" || moveInPreference === "next-15-days") {
    const cutoffDate = new Date();
    cutoffDate.setHours(23, 59, 59, 999);
    cutoffDate.setDate(
      cutoffDate.getDate() + (moveInPreference === "within-week" ? 7 : 15)
    );
    return cutoffDate;
  }

  return null;
};

function useLocationMaps(locations: Location[]) {
  return useMemo(
    () => ({
      locationNameMap: new Map(locations.map((loc) => [loc.id, loc.fieldData.name])),
      locationMap: new Map(locations.map((loc) => [loc.id, loc.fieldData.name])),
    }),
    [locations]
  );
}

function parseLocationIdsFromParam(locationParam: string, locations: Location[]) {
  if (!locationParam) return [];
  const names = locationParam
    .split(",")
    .map((n) => n.trim().toLowerCase())
    .filter((n) => n.length > 0);
  if (names.length === 0) return [];

  const ids: string[] = [];
  names.forEach((name) => {
    const location = locations.find(
      (loc) => loc.fieldData.name.toLowerCase().trim() === name
    );
    if (location) ids.push(location.id);
  });
  return ids;
}

function parseFiltersFromSearchParams(
  searchParams: ReadonlyURLSearchParams,
  locations: Location[]
): SearchFilters {
  const locationNameParam = searchParams.get("location") || "";
  const minBudgetParam = searchParams.get("minBudget");
  const maxBudgetParam = searchParams.get("maxBudget");
  const moveInDateParam = searchParams.get("moveInDate") || "";
  const showFullHomesParam = searchParams.get("showFullHomes");
  const femaleOnlyParam = searchParams.get("femaleOnly");

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

  return {
    minBudget,
    maxBudget,
    locationIds: parseLocationIdsFromParam(locationNameParam, locations),
    moveInDate: moveInDateParam,
    showFullHomes: showFullHomesParam === "true",
    femaleOnly: femaleOnlyParam === "true",
  };
}

function serializeFiltersToSearchParams({
  filters,
  searchParams,
  locationNameMap,
}: {
  filters: SearchFilters;
  searchParams: ReadonlyURLSearchParams;
  locationNameMap: Map<string, string>;
}) {
  const locationNameParam = searchParams.get("location") || "";
  const minBudgetParam = searchParams.get("minBudget");
  const maxBudgetParam = searchParams.get("maxBudget");
  const moveInDateParam = searchParams.get("moveInDate") || "";
  const showFullHomesParam = searchParams.get("showFullHomes");
  const femaleOnlyParam = searchParams.get("femaleOnly");

  const params = new URLSearchParams(searchParams.toString());
  let urlChanged = false;

  const selectedIds = filters.locationIds || [];
  const locationNames: string[] = [];
  selectedIds.forEach((id) => {
    const name = locationNameMap.get(id);
    if (name) locationNames.push(name);
  });

  const newLocationParam = locationNames.join(",");
  const urlLocationParam = locationNameParam || "";

  if (newLocationParam && newLocationParam !== urlLocationParam) {
    params.set("location", newLocationParam);
    urlChanged = true;
  } else if (!newLocationParam && urlLocationParam) {
    params.delete("location");
    urlChanged = true;
  }

  if (filters.minBudget !== 0) {
    if (minBudgetParam !== filters.minBudget.toString()) {
      params.set("minBudget", filters.minBudget.toString());
      urlChanged = true;
    }
  } else if (minBudgetParam) {
    params.delete("minBudget");
    urlChanged = true;
  }

  if (filters.maxBudget !== Infinity) {
    if (maxBudgetParam !== filters.maxBudget.toString()) {
      params.set("maxBudget", filters.maxBudget.toString());
      urlChanged = true;
    }
  } else if (maxBudgetParam) {
    params.delete("maxBudget");
    urlChanged = true;
  }

  if (filters.moveInDate) {
    if (moveInDateParam !== filters.moveInDate) {
      params.set("moveInDate", filters.moveInDate);
      urlChanged = true;
    }
  } else if (moveInDateParam) {
    params.delete("moveInDate");
    urlChanged = true;
  }

  if (filters.showFullHomes) {
    if (showFullHomesParam !== "true") {
      params.set("showFullHomes", "true");
      urlChanged = true;
    }
  } else if (showFullHomesParam === "true") {
    params.delete("showFullHomes");
    urlChanged = true;
  }

  if (filters.femaleOnly) {
    if (femaleOnlyParam !== "true") {
      params.set("femaleOnly", "true");
      urlChanged = true;
    }
  } else if (femaleOnlyParam === "true") {
    params.delete("femaleOnly");
    urlChanged = true;
  }

  return { params, urlChanged };
}

function useHomesSearchFilters(properties: Property[], locations: Location[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locationNameParam = searchParams.get("location") || "";
  const minBudgetParam = searchParams.get("minBudget");
  const maxBudgetParam = searchParams.get("maxBudget");
  const moveInDateParam = searchParams.get("moveInDate") || "";
  const showFullHomesParam = searchParams.get("showFullHomes");
  const femaleOnlyParam = searchParams.get("femaleOnly");
  const isSyncingFromUrl = useRef(false);

  // Find location ID from location name
  const locationIdsFromUrl = useMemo(() => {
    return parseLocationIdsFromParam(locationNameParam, locations);
  }, [locationNameParam, locations]);

  // Initialize filters from URL params
  const initialFilters = useMemo<SearchFilters>(
    () => parseFiltersFromSearchParams(searchParams, locations),
    // NOTE: searchParams is stable per navigation state; keep behavior consistent with prior deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locationIdsFromUrl, minBudgetParam, maxBudgetParam, moveInDateParam, showFullHomesParam, femaleOnlyParam, locations]
  );

  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  const { locationNameMap, locationMap } = useLocationMaps(locations);

  // Sync filters state when URL param changes (external navigation)
  useEffect(() => {
    const urlFilters: Partial<SearchFilters> = {};
    let hasChanges = false;

    // Check location (compare sorted copies to avoid mutating state)
    const currentUrlIds = [...locationIdsFromUrl].sort().join(",");
    const currentFilterIds = [...(filters.locationIds || [])].sort().join(",");
    
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

    // Check showFullHomes
    const urlShowFullHomes = showFullHomesParam === "true";
    if (urlShowFullHomes !== filters.showFullHomes) {
      urlFilters.showFullHomes = urlShowFullHomes;
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
    showFullHomesParam,
    femaleOnlyParam,
  ]);

  // Update URL when filters change (from user interaction)
  useEffect(() => {
    // Skip if we're currently syncing from URL
    if (isSyncingFromUrl.current) {
      isSyncingFromUrl.current = false;
      return;
    }
 
    const { params, urlChanged } = serializeFiltersToSearchParams({
      filters,
      searchParams,
      locationNameMap,
    });

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
    filters.showFullHomes,
    filters.femaleOnly,
    locationNameMap,
    pathname,
    router,
    searchParams,
    locationNameParam,
    minBudgetParam,
    maxBudgetParam,
    moveInDateParam,
    showFullHomesParam,
    femaleOnlyParam,
  ]);

  // Sort locations alphabetically A -> Z
  const sortedLocations = useMemo(
    () => [...locations].sort((a, b) =>
      a.fieldData.name.localeCompare(b.fieldData.name)
    ),
    [locations]
  );

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (!isPropertyActive(property)) return false;
      if (isUpcomingProperty(property)) return false;

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

      // Filter by Full Homes
      if (filters.showFullHomes && !property.fieldData["full-house-available"]) {
        return false;
      }

      // Filter by Female Only
      if (filters.femaleOnly && !property.fieldData["female-only"]) {
        return false;
      }

      // Filter by Move-In Window
      if (filters.moveInDate && property.fieldData["available-from"]) {
        const moveInCutoffDate = getMoveInCutoffDate(filters.moveInDate);
        if (moveInCutoffDate) {
          const availableFrom = new Date(property.fieldData["available-from"]);
          if (availableFrom > moveInCutoffDate) {
            return false;
          }
        }
      }

      return true;
    }).sort(sortByAvailabilityThenRank);
  }, [properties, filters]);

  // Track filter changes for preference analysis (skip initial mount / URL hydration)
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    trackSearchFiltersChanged({
      min_budget: filters.minBudget,
      max_budget: filters.maxBudget === Infinity ? Number.MAX_SAFE_INTEGER : filters.maxBudget,
      location_ids: filters.locationIds ?? [],
      location_names: (filters.locationIds ?? []).map((id) => locationNameMap.get(id)).filter(Boolean) as string[],
      move_in_date: filters.moveInDate ?? "",
      female_only: filters.femaleOnly,
      show_full_homes: filters.showFullHomes,
      result_count: filteredProperties.length,
    });
  }, [filters, filteredProperties.length, locationNameMap]);

  return {
    filters,
    setFilters,
    filteredProperties,
    locationMap,
    sortedLocations,
    searchParams,
  };
}

export const PropertyBrowser = ({
  properties,
  locations,
  rooms = [],
  occupants = [],
}: PropertyBrowserProps) => {
  const rentCalculatorLottie = useLottieData("/lotties/rent-calculator.json");
  const {
    filters,
    setFilters,
    filteredProperties,
    locationMap,
    sortedLocations,
    searchParams,
  } = useHomesSearchFilters(properties, locations);
  const availableFilteredProperties = useMemo(
    () => filteredProperties.filter((property) => property.fieldData.available),
    [filteredProperties]
  );
  const shouldShowDiscountCta = useMemo(
    () =>
      availableFilteredProperties.length > 0 &&
      availableFilteredProperties.some((property) => propertyHasDiscount(property)),
    [availableFilteredProperties]
  );

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

          <div className="mt-6 rounded-2xl border border-black bg-white p-4 md:mx-auto md:w-fit md:p-5">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-center md:gap-10">
              <div className="flex items-center gap-3">
                {rentCalculatorLottie ? (
                  <Lottie
                    animationData={rentCalculatorLottie}
                    loop
                    autoplay
                    className="h-14 w-14 shrink-0"
                  />
                ) : null}
                <div>
                  <h3 className="font-zin text-xl leading-tight text-text-main">
                    Flenting vs Renting
                  </h3>
                  <p className="mt-1 text-sm text-text-main/70">
                    We have no hidden costs. See for yourself!
                  </p>
                </div>
              </div>

              <Link href="/rent-calculator" className="w-full md:w-auto">
                <Button variant="primary" size="md" className="w-full md:w-auto">
                  Calculate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardSection>

      <OpenSection className="pt-0">
        <div className="container mx-auto px-4">
          {availableFilteredProperties.length === 0 && (
            <div className="mb-8">
              <ComingSoon
                properties={properties}
                locations={locations}
                rooms={rooms}
                occupants={occupants}
                title="No available homes match your filters"
                subtitle="Try adjusting your search, or get notified when we launch homes that fit."
                newsletterHeading="Want an email when we have homes that match?"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property, index) => {
              const locationId = property.fieldData.location;
              const locationName = locationId
                ? locationMap.get(locationId)
                : undefined;
              const hasActiveDiscount = propertyHasDiscount(property) === true;

              return (
                <React.Fragment key={property.id}>
                  <Link
                    href={`/homes/${property.fieldData.slug}?${searchParams.toString()}`}
                    className="block h-full"
                    onClick={() =>
                      trackPropertyCardClick({
                        property_slug: property.fieldData.slug,
                        property_type: hasActiveDiscount ? "discounted" : "standard",
                        property_area: locationName,
                        page_section: "search",
                        cta_id: CTA_IDS.PROPERTY_CARD,
                      })
                    }
                  >
                    <PropertyCard
                      property={property}
                      locationName={locationName}
                      rooms={rooms}
                      occupants={occupants}
                    />
                  </Link>
                  {shouldShowDiscountCta && index === 1 && (
                    <div className="md:hidden">
                      <DiscountCta />
                    </div>
                  )}
                  {shouldShowDiscountCta && index === 3 && (
                    <div className="hidden md:block">
                      <DiscountCta />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </OpenSection>
    </>
  );
};
