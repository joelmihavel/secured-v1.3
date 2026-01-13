"use client";
import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { OpenSection } from "@/components/layout/OpenSection";
import { Button } from "@/components/ui/Button";

interface ValuePropCard {
    title: string;
    icon: string;
    isFocus?: boolean;
    gridSpan?: {
        cols?: number;
        rows?: number;
    };
}

interface ValuePropData {
    heading: string;
    subtext: string;
    cta: string;
    ctaTagline?: string;
    lottie: string;
    cards: ValuePropCard[];
}

interface ValuePropProps {
    data: ValuePropData;
    variant?: "tenant" | "landlord";
}

export const ValueProp = ({ data, variant = "tenant" }: ValuePropProps) => {
    const [animationData, setAnimationData] = useState<object | null>(null);

    useEffect(() => {
        if (data.lottie && data.lottie.endsWith('.json')) {
            fetch(data.lottie)
                .then((res) => res.json())
                .then((json) => setAnimationData(json))
                .catch((err) => console.error("Failed to load Lottie:", err));
        }
    }, [data.lottie]);

    // Determine grid layout based on variant
    const isTenant = variant === "tenant";

    return (
        <OpenSection className="bg-white py-16 md:py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
                {/* Container 1: Lottie Animation */}
                <div className="flex justify-center mb-10 md:mb-14">
                    <div className="w-full max-w-[400px] md:max-w-[500px] aspect-square flex items-center justify-center">
                        {animationData ? (
                            <Lottie
                                animationData={animationData}
                                loop
                                autoplay
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-50/50 rounded-xl animate-pulse" />
                        )}
                    </div>
                </div>

                {/* Container 2: Heading and Subtext */}
                <div className="text-center mb-12 md:mb-20 max-w-4xl mx-auto">
                    <h2
                        className="text-fluid-h1 font-heading font-zin-italic text-text-main leading-[1.1] mb-6 tracking-tight"
                        dangerouslySetInnerHTML={{ __html: data.heading }}
                    />
                    <p className="text-subtitle text-gray-500 font-body">
                        {data.subtext}
                    </p>
                </div>

                {/* Container 3: Flexible Grid Cards */}
                <div className="mb-12 md:mb-16">
                    {isTenant ? (
                        <TenantGrid cards={data.cards} />
                    ) : (
                        <LandlordGrid cards={data.cards} />
                    )}
                </div>

                {/* CTA Section */}
                <div className="flex flex-col items-center">
                    <Button
                        href="#download"
                        variant="primary-rounded"
                        pastelColor="orange"
                        size="lg"
                        className="w-full max-w-sm text-base md:text-lg"
                    >
                        {data.cta}
                    </Button>
                    {data.ctaTagline && (
                        <p className="mt-4 text-xs md:text-sm text-gray-400 font-body">
                            {data.ctaTagline}
                        </p>
                    )}
                </div>
            </div>
        </OpenSection>
    );
};

// Tenant Grid: CSS Grid with row/column spans
// Layout: 3 cols x 2 rows
// - Cards 0,1: normal (col 1-2, row 1)
// - Card 2: tall (col 3, row 1-2, spans 2 rows)
// - Card 3: wide (col 1-2, row 2, spans 2 cols)
const TenantGrid = ({ cards }: { cards: ValuePropCard[] }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 auto-rows-fr">
            {/* Card 0: One-Time Setup */}
            <ValueCard card={cards[0]} variant="normal" minHeight="min-h-[200px]" />

            {/* Card 1: Collect Points */}
            <ValueCard card={cards[1]} variant="normal" minHeight="min-h-[200px]" />

            {/* Card 2: 45 Days - Spans 2 rows (tall) */}
            <div className="md:row-span-2">
                <ValueCard card={cards[2]} variant="tenant-focus" className="h-full" minHeight="min-h-[200px] md:min-h-[420px]" />
            </div>

            {/* Card 3: 0.85% Fee - Spans 2 cols (wide) */}
            <div className="md:col-span-2">
                <ValueCard card={cards[3]} variant="tenant-focus" minHeight="min-h-[240px]" />
            </div>
        </div>
    );
};

// Landlord Grid: 4 Columns
// Col 1: Card 0 + Card 4 (Stacked)
// Col 2: Card 1 (Tall)
// Col 3: Card 2 (Tall)
// Col 4: Card 3 + Card 5 (Stacked)
const LandlordGrid = ({ cards }: { cards: ValuePropCard[] }) => {
    // Ensure we have enough cards to avoid crashes
    const col1Cards = [cards[0], cards[4]].filter(Boolean);
    const col2Card = cards[1];
    const col3Card = cards[2];
    const col4Cards = [cards[3], cards[5]].filter(Boolean);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Column 1 */}
            <div className="flex flex-col gap-6">
                {col1Cards.map((card, i) => (
                    <ValueCard key={`c1-${i}`} card={card} variant="normal" minHeight="min-h-[200px]" />
                ))}
            </div>

            {/* Column 2 - Tall Card */}
            <div className="flex flex-col h-full">
                {col2Card && <ValueCard card={col2Card} variant="landlord-focus" className="h-full" minHeight="min-h-[420px]" />}
            </div>

            {/* Column 3 - Tall Card */}
            <div className="flex flex-col h-full">
                {col3Card && <ValueCard card={col3Card} variant="landlord-focus" className="h-full" minHeight="min-h-[420px]" />}
            </div>

            {/* Column 4 */}
            <div className="flex flex-col gap-6">
                {col4Cards.map((card, i) => (
                    <ValueCard key={`c4-${i}`} card={card} variant="normal" minHeight="min-h-[200px]" />
                ))}
            </div>
        </div>
    );
};

// Individual Card Component
interface ValueCardProps {
    card: ValuePropCard;
    variant: "normal" | "tenant-focus" | "landlord-focus";
    className?: string;
    minHeight?: string;
}

const ValueCard = ({ card, variant, className = "", minHeight = "min-h-[200px]" }: ValueCardProps) => {
    const isLandlordFocus = variant === "landlord-focus";
    const isTenantFocus = variant === "tenant-focus";

    // Styling logic - Orange/peach borders for all cards
    const bgClass = isLandlordFocus
        ? "bg-pastel-orange/50 border-2 border-brand-orange/40"
        : isTenantFocus
            ? "bg-pastel-orange/20 border-2 border-brand-orange/30"
            : "bg-white border border-brand-orange/25 hover:border-brand-orange/50";

    const titleClass = (isLandlordFocus || isTenantFocus)
        ? "text-fluid-h4 font-semibold max-w-[90%]"
        : "text-subtitle font-medium";

    const imageSizeClass = isLandlordFocus
        ? "w-full max-w-[280px]"
        : isTenantFocus
            ? "w-40 md:w-56"
            : "w-12 md:w-16";

    return (
        <div
            className={`
                relative rounded-3xl border overflow-hidden transition-all duration-300 hover:shadow-xl
                flex flex-col p-6 md:p-8
                ${bgClass}
                ${className}
                ${minHeight}
            `}
        >
            {/* Title - Always at top */}
            <h4 className={`font-heading text-text-main leading-snug z-10 ${titleClass}`}>
                {card.title}
            </h4>

            {/* Spacer */}
            <div className="flex-grow" />

            {/* Image/Icon - Positioned at bottom or bottom-right */}
            {card.icon && (
                <div className={`
                    ${isLandlordFocus
                        ? "self-center mt-6 translate-y-2" // Center bottom for landlord tall cards
                        : isTenantFocus
                            ? "self-end -mb-4 -mr-4" // Bottom right for tenant focus
                            : "self-end mt-4" // Standard bottom right
                    }
                `}>
                    <img
                        src={card.icon}
                        alt=""
                        className={`${imageSizeClass} object-contain`}
                    />
                </div>
            )}
        </div>
    );
};
