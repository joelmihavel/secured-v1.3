"use client";
import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { OpenSection } from "@/components/layout/OpenSection";
import { IconCreditCard, IconTrophy, IconCircleCheck, IconLayoutDashboard, IconHomeShield, IconUserCheck, IconCoin, IconHome } from "@tabler/icons-react";

interface Feature {
    icon: string;
    title: string;
}

interface RentRewardProps {
    data: {
        heading: string;
        subtext: string;
        features: Feature[];
        lottie: string;
        eyebrow?: string;
    };
}

const ICON_MAP: Record<string, any> = {
    credit_card: IconCreditCard,
    trophy: IconTrophy,
    check_circle: IconCircleCheck,
    design_services: IconLayoutDashboard,
    "Zero-Cost Vacancy Cover": IconHomeShield,
    "Zero-cost tenant background verification": IconUserCheck,
    "Loan Against Rental Income": IconCoin,
    "Property Damage Cover": IconHome
};

const DefaultIcon = IconCircleCheck;

export const RentReward = ({ data }: RentRewardProps) => {
    const [animationData, setAnimationData] = useState<object | null>(null);

    const leftFeatures = data.features.slice(0, 2);
    const rightFeatures = data.features.slice(2, 4);

    useEffect(() => {
        fetch(data.lottie)
            .then((res) => res.json())
            .then((json) => setAnimationData(json))
            .catch((err) => console.error("Failed to load Lottie:", err));
    }, [data.lottie]);

    return (
        <OpenSection className="bg-white py-12 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Top Section - Heading */}
                <div className="flex flex-col items-center text-center mb-16 lg:mb-28">
                    {/* Eyebrow */}
                    {data.eyebrow && (
                        <p
                            className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-gray-400 font-semibold mb-8 whitespace-nowrap"
                            dangerouslySetInnerHTML={{ __html: data.eyebrow }}
                        />
                    )}
                    {/* Main Heading */}
                    <h2
                        className="text-4xl md:text-5xl lg:text-7xl font-heading font-normal text-[#1A1A1A] leading-[1.05] mb-10 max-w-5xl tracking-tight"
                        dangerouslySetInnerHTML={{ __html: data.heading }}
                    />
                    {/* Subtext */}
                    <p className="text-sm md:text-lg text-gray-500 max-w-2xl font-body leading-relaxed opacity-80">
                        {data.subtext}
                    </p>
                </div>

                {/* Bottom Section - 3 Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start mt-4">
                    {/* Left Features */}
                    <div className="lg:col-span-3 flex flex-col items-center lg:items-start gap-24 lg:gap-36 pt-12 lg:pt-32">
                        {leftFeatures.map((feature, index) => {
                            const IconComponent = ICON_MAP[feature.icon] || ICON_MAP[feature.title] || DefaultIcon;
                            return (
                                <div key={index} className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 group">
                                    <div className="text-brand-orange transition-transform duration-500 group-hover:scale-110">
                                        <IconComponent className="w-5 h-5 md:w-7 md:h-7" strokeWidth={1.2} />
                                    </div>
                                    <h3 className="text-lg md:text-xl lg:text-[24px] font-heading font-bold text-[#1A1A1A] leading-[1.2] tracking-tight max-w-[220px] lg:max-w-[280px]">
                                        {feature.title}
                                    </h3>
                                </div>
                            );
                        })}
                    </div>

                    {/* Center Lottie */}
                    <div className="lg:col-span-6 flex justify-center items-center py-12 lg:py-0">
                        <div className="w-full max-w-xs md:max-w-md lg:max-w-[450px] xl:max-w-[500px]">
                            {animationData ? (
                                <Lottie
                                    animationData={animationData}
                                    loop
                                    autoplay
                                    className="w-full h-auto scale-110 lg:scale-125"
                                />
                            ) : (
                                <div className="w-full aspect-square bg-gray-50/50 rounded-full animate-pulse" />
                            )}
                        </div>
                    </div>

                    {/* Right Features */}
                    <div className="lg:col-span-3 flex flex-col items-center lg:items-end gap-24 lg:gap-36 pt-12 lg:pt-32">
                        {rightFeatures.map((feature, index) => {
                            const IconComponent = ICON_MAP[feature.icon] || ICON_MAP[feature.title] || DefaultIcon;
                            return (
                                <div key={index} className="flex flex-col items-center lg:items-end text-center lg:text-right gap-4 group">
                                    <div className="text-brand-orange transition-transform duration-500 group-hover:scale-110">
                                        <IconComponent className="w-5 h-5 md:w-7 md:h-7" strokeWidth={1.2} />
                                    </div>
                                    <h3 className="text-lg md:text-xl lg:text-[24px] font-heading font-bold text-[#1A1A1A] leading-[1.2] tracking-tight max-w-[220px] lg:max-w-[280px]">
                                        {feature.title}
                                    </h3>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </OpenSection>
    );
};
