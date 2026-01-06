"use client";

import React from "react";
import Link from "next/link";
import { Property, Location, Room, Occupant } from "@/lib/webflow";
import { CardSection } from "@/components/layout/CardSection";
import { FlexibleCarousel } from "@/components/ui/flexible-carousel";
import { Button } from "@/components/ui/Button";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { IconChevronLeft as ChevronLeft, IconChevronRight as ChevronRight } from "@tabler/icons-react";


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

    const sortedProperties = [...properties].sort((a, b) => {
        // 1. Ranking Order (Ascending)
        // If one has ranking and other doesn't, the one with ranking comes first
        const rankA = a.fieldData["ranking-order"];
        const rankB = b.fieldData["ranking-order"];

        if (rankA !== undefined && rankB !== undefined) {
            return rankA - rankB;
        }
        if (rankA !== undefined) return -1;
        if (rankB !== undefined) return 1;

        // 2. Availability Date (Earliest first)
        const dateAStr = a.fieldData["available-from"];
        const dateBStr = b.fieldData["available-from"];
        const dateA = dateAStr ? new Date(dateAStr).getTime() : Infinity; // No date means far future/unknown? Or treat as available now if 'available'? 
        // Actually, if date is missing but available=true, it's usually "Available Now".
        // Let's refine: "Earliest available first".
        
        // Interpretation:
        // Properties can be "Available Now" (often implied if available=true and no future date) or available from a future date.
        // We want "Available Now" / earliest dates at the top.
        
        const now = Date.now();
        const effectiveDateA = dateAStr ? new Date(dateAStr).getTime() : (a.fieldData.available ? 0 : Infinity);
        const effectiveDateB = dateBStr ? new Date(dateBStr).getTime() : (b.fieldData.available ? 0 : Infinity);

        if (effectiveDateA !== effectiveDateB) {
            return effectiveDateA - effectiveDateB;
        }

        // 3. Properties with images
        const hasImagesA = Boolean(
            a.fieldData["property-thumbnail"]?.url ||
            a.fieldData["property-featured-photo"]?.url ||
            a.fieldData["property-photos"]?.some(p => p.url)
        );
        const hasImagesB = Boolean(
            b.fieldData["property-thumbnail"]?.url ||
            b.fieldData["property-featured-photo"]?.url ||
            b.fieldData["property-photos"]?.some(p => p.url)
        );

        if (hasImagesA !== hasImagesB) {
            return hasImagesA ? -1 : 1;
        }

        return 0;
    }).filter(property => {
        // Only show properties that are available or have an available-from date
        // + properties available from today + 30 days
        const availableFrom = property.fieldData["available-from"];
        const availableFromDate = availableFrom ? new Date(availableFrom) : null;
        const today = new Date();
        const todayPlus30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        return property.fieldData.available && (availableFromDate && availableFromDate <= todayPlus30Days);
    });

    const cards = sortedProperties.map((item, index) => {
        const location = locations.find(l => l.id === item.fieldData.location);
        return (
            <Link key={item.id} href={`/homes/${item.fieldData.slug}`} className="block w-full h-full" draggable={false}>
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

