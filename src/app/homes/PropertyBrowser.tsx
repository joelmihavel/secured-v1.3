"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

export const PropertyBrowser = ({ properties, locations, rooms = [], occupants = [] }: PropertyBrowserProps) => {
    const searchParams = useSearchParams();
    const initialLocationId = searchParams.get("locationId") || "";

    const [filters, setFilters] = useState<SearchFilters>({
        minBudget: 0,
        maxBudget: Infinity,
        locationId: initialLocationId,
        moveInDate: "",
        showAvailable: true,
    });

    const locationMap = useMemo(() => new Map(locations.map(loc => [loc.id, loc.fieldData.name])), [locations]);

    const filteredProperties = useMemo(() => {
        return properties.filter(property => {
            // Filter by Location
            if (filters.locationId && property.fieldData.location !== filters.locationId) {
                return false;
            }

            // Filter by Budget
            const rent = parseInt(property.fieldData["rent-in-rupees"]?.replace(/,/g, "") || "0");
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
            <CardSection id="homes" className="py-8 my-4" backgroundPattern="/patterns/intersecting-circles.svg" patternMask="to-bottom" patternOpacity={0.06}>
                <div className="max-w-5xl mx-auto">
                    <SearchBar locations={locations} filters={filters} setFilters={setFilters} />
                </div>
            </CardSection>

            <OpenSection className="pt-0">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProperties.map((property) => {
                            const locationId = property.fieldData.location;
                            const locationName = locationId ? locationMap.get(locationId) : undefined;

                            return (
                                <Link key={property.id} href={`/homes/${property.fieldData.slug}`} className="block h-full">
                                    <PropertyCard property={property} locationName={locationName} rooms={rooms} occupants={occupants} />
                                </Link>
                            );
                        })}
                        {filteredProperties.length === 0 && (
                            <div className="col-span-full text-center py-20">
                                <p className="text-xl text-text-main/60">No homes found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </OpenSection>
        </>
    );
};
