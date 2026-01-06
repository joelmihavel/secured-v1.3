"use client";
import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { OpenSection } from "@/components/layout/OpenSection";
import { IconArrowRight } from "@tabler/icons-react";

interface SecureHeroProps {
    data: {
        heading: string;
        subheading: string;
        subtext: string;
        cta: string;
        tagline: string;
        lottie: string;
        themeColor?: string;
        layoutReverse?: boolean;
    };
}

export const SecureHero = ({ data }: SecureHeroProps) => {
    const [animationData, setAnimationData] = useState<object | null>(null);

    useEffect(() => {
        fetch(data.lottie)
            .then((res) => res.json())
            .then((json) => setAnimationData(json))
            .catch((err) => console.error("Failed to load Lottie:", err));
    }, [data.lottie]);

    const TextContent = (
        <div className="w-full flex flex-col items-start text-left relative z-10 max-w-xl mx-auto lg:mx-0">
            {/* Main Heading */}
            <h1
                className="text-hero-h1 font-heading font-medium text-text-main mb-4"
                dangerouslySetInnerHTML={{ __html: data.heading }}
            />
            {/* Subheading */}
            <h2
                className="text-hero-h2 font-heading font-normal text-text-main mb-6"
                dangerouslySetInnerHTML={{ __html: data.subheading }}
            />
            {/* Body Text */}
            <p className="text-hero-body text-gray-500 mb-10 max-w-md font-body">
                {data.subtext}
            </p>
            {/* CTA Button Group */}
            <div className="flex items-center gap-3 w-full max-w-md mb-6">
                <button className="flex-[4] bg-brand-orange text-text-main font-heading font-semibold text-hero-body py-4 md:py-5 px-6 md:px-8 rounded-2xl border-2 border-brand-orange hover:bg-brand-orange/90 transition-all text-center shadow-lg shadow-brand-orange/20">
                    {data.cta}
                </button>
                <button className="flex-1 aspect-square bg-brand-orange text-text-main rounded-2xl border-2 border-brand-orange hover:bg-brand-orange/90 transition-all flex items-center justify-center shadow-lg shadow-brand-orange/20">
                    <IconArrowRight className="w-6 h-6 md:w-7 md:h-7" />
                </button>
            </div>
            {/* Tagline */}
            <p className="text-hero-tagline text-gray-400 font-body opacity-80">
                {data.tagline}
            </p>
        </div>
    );

    const LottieContent = (
        <div className="w-full h-full flex items-center lg:items-end justify-center relative z-10 pt-16 lg:pt-0">
            <div className="w-full h-full flex items-center lg:items-end justify-center overflow-visible">
                {animationData ? (
                    <Lottie
                        animationData={animationData}
                        loop
                        autoplay
                        className="h-full w-auto lg:scale-[1.05]"
                    />
                ) : (
                    <div className="w-full h-40 bg-gray-100/50 rounded-3xl animate-pulse mx-10 mb-20" />
                )}
            </div>
        </div>
    );

    return (
        <OpenSection className="bg-white h-[100vh] md:h-[92vh] relative flex flex-col justify-end">
            {/* Gradient Background - Positioned below content */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-pastel-orange/40 via-pastel-orange/10 to-white" />

            {/* Main Content Container */}
            <div className={`flex flex-col-reverse ${data.layoutReverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-stretch justify-between w-full h-full relative z-10 overflow-hidden`}>

                {/* Lottie Container - 50% height on mobile, 60% Width on desktop */}
                <div className="w-full lg:w-[60%] h-1/2 lg:h-full flex items-end justify-center">
                    {LottieContent}
                </div>

                {/* Content Container - 50% height on mobile, 40% Width on desktop */}
                <div className={`w-full lg:w-[40%] h-1/2 lg:h-full flex items-center pt-48 pb-6 lg:py-0 ${data.layoutReverse ? 'lg:justify-end lg:pl-12' : 'lg:justify-start lg:pr-12'} px-4 md:px-8 lg:px-0`}>
                    {TextContent}
                </div>

            </div>

            {/* Torn Paper Edge */}
            <div className="absolute bottom-0 left-0 w-full h-8 md:h-16 z-[30] translate-y-2 pointer-events-none">
                <svg className="w-full h-full text-white fill-current overflow-visible">
                    <defs>
                        <filter id="paper-tear-hero" x="-20%" y="-20%" width="140%" height="140%">
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="0.012"
                                numOctaves="3"
                                seed="1"
                                result="noise"
                            />
                            <feDisplacementMap
                                in="SourceGraphic"
                                in2="noise"
                                scale="12"
                                xChannelSelector="R"
                                yChannelSelector="G"
                            />
                        </filter>
                    </defs>
                    <rect
                        x="-10%"
                        y="14"
                        width="120%"
                        height="40"
                        filter="url(#paper-tear-hero)"
                        className="md:hidden"
                    />
                    <rect
                        x="-10%"
                        y="28"
                        width="120%"
                        height="60"
                        filter="url(#paper-tear-hero)"
                        className="hidden md:block"
                    />
                </svg>
            </div>
        </OpenSection>
    );
};
