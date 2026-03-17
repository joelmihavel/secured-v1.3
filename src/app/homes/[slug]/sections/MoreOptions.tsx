"use client";

import React from "react";
import { Property, Room, Occupant } from "@/lib/webflow";
import { OpenSection } from "@/components/layout/OpenSection";
import Link from "next/link";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { propertyHasDiscount } from "@/lib/property-utils";
import { trackPropertyCardClick } from "@/lib/posthog-tracking";
import { CTA_IDS } from "@/lib/cta-ids";

interface MoreOptionsProps {
    properties: Property[];
    currentPropertyId: string;
    rooms?: Room[];
    occupants?: Occupant[];
}

export const MoreOptions = ({ properties, currentPropertyId, rooms = [], occupants = [] }: MoreOptionsProps) => {
    const otherProperties = properties
        .filter(p => p.id !== currentPropertyId && p.fieldData.available)
        .slice(0, 3);

    if (otherProperties.length === 0) {
        return null;
    }

    return (
        <OpenSection className="py-20">
            <div className="container mx-auto px-4">
                <h2 className="font-heading text-text-main mb-12 text-center">
                    Other  <span className="font-zin-italic">Available Homes</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {otherProperties.map((property, index) => (
                        <Link
                            key={property.id}
                            href={`/homes/${property.fieldData.slug}`}
                            className="block w-full min-h-[500px]"
                            draggable={false}
                            onClick={() =>
                                trackPropertyCardClick({
                                    property_slug: property.fieldData.slug,
                                    property_type: propertyHasDiscount(property) ? "discounted" : "standard",
                                    page_section: "more_options",
                                    cta_id: CTA_IDS.PROPERTY_CARD,
                                })
                            }
                        >
                            <PropertyCard
                                property={property}
                                index={index}
                                rooms={rooms}
                                occupants={occupants}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </OpenSection>
    );
};
