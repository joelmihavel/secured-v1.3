"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Property, Location, Room, Occupant } from "@/lib/webflow";
import { CardSection } from "@/components/layout/CardSection";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { PhoneSubscribeForm } from "@/components/ui/PhoneSubscribeForm";

interface ComingSoonProps {
    properties?: Property[];
    locations?: Location[];
    rooms?: Room[];
    occupants?: Occupant[];
}

export const ComingSoon = ({ properties = [], locations = [], rooms = [], occupants = [] }: ComingSoonProps) => {
    // Select 3 random properties
    const [randomProperties, setRandomProperties] = useState<Property[]>([]);

    useEffect(() => {
        const comingSoonProperties = properties.filter(p => p.fieldData["is-upcoming"]);

        if (comingSoonProperties.length === 0) {
            setRandomProperties([]);
            return;
        }
        // Use a consistent seed or just random on client is fine since it's client-only now
        const shuffled = [...comingSoonProperties].sort(() => 0.5 - Math.random());
        setRandomProperties(shuffled.slice(0, 3));
    }, [properties]);

    if (randomProperties.length === 0) {
        return null;
    }

    return (
        <CardSection
            id="coming-soon"
            className="bg-ground-brown"
            backgroundPattern="/patterns/endless-clouds.svg"
            patternOpacity={0.03}
            patternMask="to-bottom"
        >

            {/* Top Section - Centered */}
            <div className="flex flex-col items-center text-center mb-12 px-4 sm:px-6 lg:px-8 relative z-10">
                <h2 className="font-heading text-fluid-h2 text-white mb-6">
                    Flent homes are  <br /><span className="font-zin font-light">a scarce commodity</span>
                </h2>

                <p className="text-subtitle !text-white/90 font-body font-medium max-w-2xl">
                    Be the first to find out when Flent launches
                </p>
            </div>

            {/* Cards Carousel */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-4 sm:px-6 lg:px-8 pb-8 -mx-4 sm:-mx-6 lg:-mx-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] relative z-10">
                {randomProperties.map((item, index) => {
                    const location = locations.find(l => l.id === item.fieldData.location);
                    return (
                        <div key={item.id} className="flex-none w-[85vw] sm:w-[calc(50vw-2rem)] lg:w-[calc(33.33vw-2.5rem)] snap-center">
                            <PropertyCard
                                property={item}
                                index={index}
                                locationName={location?.fieldData.name || "Bangalore"}
                                variant="coming-soon"
                                rooms={rooms}
                                occupants={occupants}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Newsletter Section */}
            <div className="mx-4 sm:mx-2 lg:mx-8 rounded-[2rem] p-12 lg:p-20 md:px-8 text-center relative z-10">
                <h3 className="font-heading text-fluid-h3 text-white mb-8">
                    Be the first to know when new homes drop
                </h3>

                <PhoneSubscribeForm propertyInterest="all_properties" />

                <div className="mb-16"></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-center">
                    <div>
                        <p className="text-subtitle-sm !text-white/80 font-body leading-relaxed">
                            “Everything I liked kept getting rented out. Early access finally gave me a chance”
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <p className="text-subtitle-sm !text-white/80 font-body leading-relaxed">
                            “I just subscribed because all their homes  are aesthetically pleasing”
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <p className="text-subtitle-sm !text-white/80 font-body leading-relaxed">
                            “I used to check the website every day. Now I don’t have FOMO anymore”
                        </p>
                    </div>
                </div>
            </div>
        </CardSection>
    );
};
