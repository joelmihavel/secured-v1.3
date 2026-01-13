"use client";
import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { OpenSection } from "@/components/layout/OpenSection";
import { IconCreditCardFilled, IconTrophyFilled, IconCircleCheckFilled, IconLayoutDashboard, IconHomeShield, IconUserCheck, IconCoinFilled, IconHomeFilled } from "@tabler/icons-react";

interface Feature {
    icon: string;
    title: string;
    comingSoon?: boolean;
}

interface RentRewardProps {
    data: {
        heading: string;
        subtext: string;
        features: Feature[];
        lottie: string;
        eyebrow?: string;
    };
    variant?: "tenant" | "landlord";
}

const ICON_MAP: Record<string, any> = {
    credit_card: IconCreditCardFilled,
    trophy: IconTrophyFilled,
    check_circle: IconCircleCheckFilled,
    design_services: IconLayoutDashboard,
    "Zero-Cost Vacancy Cover": IconHomeShield,
    "Zero-cost tenant background verification": IconUserCheck,
    "Loan Against Rental Income": IconCoinFilled,
    "Property Damage Cover": IconHomeFilled
};

const DefaultIcon = IconCircleCheckFilled;

export const RentReward = ({ data, variant = "tenant" }: RentRewardProps) => {
    const [animationData, setAnimationData] = useState<object | null>(null);

    // Conditional scaling based on variant
    const lottieScale = variant === "landlord" ? "scale-110" : "scale-105";

    const leftFeatures = data.features.slice(0, 2);
    const rightFeatures = data.features.slice(2, 4);

    useEffect(() => {
        fetch(data.lottie)
            .then((res) => res.json())
            .then((json) => setAnimationData(json))
            .catch((err) => console.error("Failed to load Lottie:", err));
    }, [data.lottie]);

    // Helper function to render feature title with optional [Coming Soon] label
    const renderFeatureTitle = (feature: Feature) => {
        if (feature.comingSoon) {
            // Split title to insert [Coming Soon] appropriately
            return (
                <>
                    {feature.title}
                    <br />
                    <span className="text-gray-400 font-normal text-sm">[Coming Soon]</span>
                </>
            );
        }
        return feature.title;
    };

    return (
        <OpenSection className="bg-white py-16 md:py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
                {/* Top Section - Heading */}
                <div className="flex flex-col items-center text-center mb-16 lg:mb-24">
                    {/* Eyebrow */}
                    {data.eyebrow && (
                        <p
                            className="text-[20px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-6"
                            dangerouslySetInnerHTML={{ __html: data.eyebrow }}
                        />
                    )}
                    {/* Main Heading - Using h2 with fluid sizing from globals.css */}
                    <h2
                        className="text-fluid-h2 font-heading font-semibold text-text-main leading-[1.15] mb-6 max-w-4xl"
                        dangerouslySetInnerHTML={{ __html: data.heading }}
                    />
                    {/* Subtext */}
                    <p className="text-hero-body text-gray-500 max-w-2xl font-body leading-relaxed">
                        {data.subtext}
                    </p>
                </div>

                {/* Bottom Section - 3 Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-start">
                    {/* Left Features */}
                    <div className="lg:col-span-3 flex flex-col items-center lg:items-start gap-16 lg:gap-28 pt-8 lg:pt-16">
                        {leftFeatures.map((feature, index) => {
                            const IconComponent = ICON_MAP[feature.icon] || ICON_MAP[feature.title] || DefaultIcon;
                            return (
                                <div key={index} className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3 group">
                                    <div className="text-brand-orange transition-transform duration-500 group-hover:scale-110">
                                        <IconComponent className="w-6 h-6" strokeWidth={1.5} />
                                    </div>
                                    <h5 className="text-subtitle font-heading font-semibold text-text-main leading-[1.3] max-w-[200px]">
                                        {renderFeatureTitle(feature)}
                                    </h5>
                                </div>
                            );
                        })}
                    </div>

                    {/* Center Lottie */}
                    <div className="lg:col-span-6 flex justify-center items-center py-8 lg:py-0">
                        {/* Square container with clipped content */}
                        <div className="w-full max-w-xs md:max-w-sm lg:max-w-[400px] xl:max-w-[450px] aspect-square overflow-hidden flex items-center justify-center">
                            {animationData ? (
                                <Lottie
                                    animationData={animationData}
                                    loop
                                    autoplay
                                    className={`w-full h-full object-contain ${lottieScale}`}
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-50/50 rounded-full animate-pulse" />
                            )}
                        </div>
                    </div>

                    {/* Right Features */}
                    <div className="lg:col-span-3 flex flex-col items-center lg:items-end gap-16 lg:gap-28 pt-8 lg:pt-16">
                        {rightFeatures.map((feature, index) => {
                            const IconComponent = ICON_MAP[feature.icon] || ICON_MAP[feature.title] || DefaultIcon;
                            return (
                                <div key={index} className="flex flex-col items-center lg:items-end text-center lg:text-right gap-3 group">
                                    <div className="text-brand-orange transition-transform duration-500 group-hover:scale-110">
                                        <IconComponent className="w-6 h-6" strokeWidth={1.5} />
                                    </div>
                                    <h5 className="text-subtitle font-heading font-semibold text-text-main leading-[1.3] max-w-[200px]">
                                        {renderFeatureTitle(feature)}
                                    </h5>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </OpenSection>
    );
};
