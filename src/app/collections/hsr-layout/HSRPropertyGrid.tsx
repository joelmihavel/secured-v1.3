"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Property, Room, Occupant } from "@/lib/webflow";
import { getDiscountSavings } from "@/lib/property-utils";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { OpenSection } from "@/components/layout/OpenSection";
import { Button } from "@/components/ui/Button";
import { Info, InfoStat } from "@/app/(Homepage)/sections/Info";
import { CTA_IDS } from "@/lib/cta-ids";

const INITIAL_VISIBLE = 4;
const LOAD_MORE_COUNT = 3;

const HSR_INFO_STATS: InfoStat[] = [
  {
    value: "450+",
    label: "Tenants trust and love us! <3",
    bgColor: "bg-brick-red",
    color: "text-white",
    rotation: -2,
  },
  {
    value: "200+",
    label: "Items in all homes.\nStart living immediately!",
    bgColor: "bg-forest-green",
    color: "text-white",
    rotation: 3,
  },
];

interface HSRPropertyGridProps {
  properties: Property[];
  rooms: Room[];
  occupants: Occupant[];
  listBanner?: React.ReactNode;
}

export const HSRPropertyGrid = ({
  properties,
  rooms,
  occupants,
  listBanner,
}: HSRPropertyGridProps) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const visibleProperties = properties.slice(0, visibleCount);
  const hasMore = properties.length > visibleCount;

  const renderPropertyCard = (property: Property) => {
    const savings = getDiscountSavings(property, rooms);
    return (
      <Link
        key={property.id}
        href={`/homes/${property.fieldData.slug}`}
        className="block h-full"
      >
        <div className="flex flex-col h-full">
          <PropertyCard
            property={property}
            locationName="HSR Layout"
            rooms={rooms}
            occupants={occupants}
            showCampaignRibbon
          />
          {savings > 0 && (
            <div className="bg-pastel-green border border-t-0 border-text-main rounded-b-xl px-4 py-2 text-center -mt-px">
              <span className="text-xs font-bold font-body text-text-main">
                Save up to ₹{savings.toLocaleString("en-IN")} on first
                month rent
              </span>
            </div>
          )}
        </div>
      </Link>
    );
  };

  return (
    <OpenSection id="properties" className="py-8 bg-bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-fluid-h2 font-heading text-text-main mb-8 text-center">
          Rentals in{" "}
          <span className="font-zin-italic">HSR Layout</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {visibleProperties[0] && renderPropertyCard(visibleProperties[0])}
          {visibleProperties[0] && listBanner && (
            <div className="col-span-1 md:col-span-2 w-full">
              {listBanner}
            </div>
          )}
          {visibleProperties[1] && renderPropertyCard(visibleProperties[1])}
          {visibleProperties.length > 1 && (
            <div className="col-span-1 md:col-span-2 w-full">
              <Info showHeading={false} showVideo={false} stats={HSR_INFO_STATS} />
            </div>
          )}
          {visibleProperties.slice(2).map((property) => renderPropertyCard(property))}
        </div>

        {hasMore && (
          <div className="flex justify-center mt-8">
            <Button
              variant="primary"
              size="md"
              onClick={() => setVisibleCount((c) => c + LOAD_MORE_COUNT)}
              data-cta-id={CTA_IDS.CAMPAIGN_VIEW_MORE}
              data-cta-context="campaign-properties"
            >
              View more
            </Button>
          </div>
        )}

        {properties.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-text-main/60">
              No homes available in HSR Layout right now.
            </p>
          </div>
        )}
      </div>
    </OpenSection>
  );
};
