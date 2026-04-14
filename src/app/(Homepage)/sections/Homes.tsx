"use client";

import React from "react";
import Link from "next/link";
import { Property, Location, Room, Occupant } from "@/lib/webflow";
import {
  sortProperties,
  propertyHasDiscount,
  isPropertyActive,
  isUpcomingProperty,
} from "@/lib/property-utils";
import { CardSection } from "@/components/layout/CardSection";
import { trackPropertyCardClick } from "@/lib/posthog-tracking";
import { CTA_IDS } from "@/lib/cta-ids";
import { FlexibleCarousel } from "@/components/ui/flexible-carousel";
import { Button } from "@/components/ui/Button";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { ChevronLeft, ChevronRight } from "lucide-react";


interface HomesProps {
    properties?: Property[];
    locations?: Location[];
    rooms?: Room[];
    occupants?: Occupant[];
}

export const Homes = ({ properties = [], locations = [], rooms = [], occupants = [] }: HomesProps) => {
    const carouselRef = React.useRef<React.ElementRef<typeof FlexibleCarousel>>(null);
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (properties.length === 0) {
        return null;
    }

    const sortedProperties = [...properties]
        .filter(isPropertyActive)
        .filter((p) => !isUpcomingProperty(p))
        .sort(sortProperties)
        .filter(property => {
        // Only show properties that are available or have an available-from date
        // + properties available from today + 30 days
        const availableFrom = property.fieldData["available-from"];
        const availableFromDate = availableFrom ? new Date(availableFrom) : null;

        if(property.fieldData.available && availableFromDate === null){
            return true;
        }


        const today = new Date();
        const todayPlus30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        return property.fieldData.available && (availableFromDate && availableFromDate <= todayPlus30Days);
    });

    const cards = sortedProperties.map((item, index) => {
        const location = locations.find(l => l.id === item.fieldData.location);
        const hasActiveDiscount = propertyHasDiscount(item) === true;
        return (
            <Link
                key={item.id}
                href={`/homes/${item.fieldData.slug}`}
                className="block w-full h-full"
                draggable={false}
                onClick={() =>
                    trackPropertyCardClick({
                        property_slug: item.fieldData.slug,
                        property_type: hasActiveDiscount ? "discounted" : "standard",
                        page_section: "homepage",
                        cta_id: CTA_IDS.PROPERTY_CARD,
                    })
                }
            >
                <PropertyCard
                    property={item}
                    index={index}
                    locationName={location?.fieldData.name || "Bangalore"}
                    rooms={rooms}
                    occupants={occupants}
                />
            </Link>
        );
    });

    return (
        <CardSection id="homes" className="bg-ground-brown py-12 mb-12"
            backgroundPattern="/patterns/zig-zag.svg"
            patternMask="to-top"
            patternOpacity={0.03}
            paddingX="none"
            paddingY="none">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end px-4 sm:px-6 lg:px-8 relative z-10 mb-8">
                <div className="text-center md:text-left px-6">
                    <h2 className="font-heading text-white mb-6">
                        What you see, <span className="font-zin-italic"> <br /> is what you get</span>
                    </h2>

                    <p className="text-subtitle font-body font-medium max-w-2xl !text-white">
                        Take a room or the entire house, your call
                    </p>
                </div>

                {/* Navigation Arrows */}
                <div className="hidden md:flex gap-4">
                    <button
                        onClick={() => carouselRef.current?.scrollPrev()}
                        className="p-3 rounded-full bg-white border border-black text-black hover:bg-black hover:text-white transition-colors shadow-sm"
                        aria-label="Previous"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={() => carouselRef.current?.scrollNext()}
                        className="p-3 rounded-full bg-white border border-black text-black hover:bg-black hover:text-white transition-colors shadow-sm"
                        aria-label="Next"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>

            {/* Carousel Container */}
            <FlexibleCarousel
                ref={carouselRef}
                cards={cards}
                cardWidth={isMobile ? "24vw" : "28vw"}
                isInfinite={false}
                highlightMiddle={false}
                showNavigation={false}
                shadowOnHover={true}
                isDraggable={true}
                friction={0.8}
            />

            {/* CTA Button */}
            <div className="flex justify-center mt-8 mb-4">
                <Link href="/homes">
                    <Button variant="primary">
                        View All Homes
                    </Button>
                </Link>
            </div>
        </CardSection>
    );
};

