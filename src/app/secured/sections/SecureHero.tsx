"use client";
import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { OpenSection } from "@/components/layout/OpenSection";
import { IconArrowRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";


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
    const [lottieData, setLottieData] = useState<{ tenant: object | null; landlord: object | null }>({
        tenant: null,
        landlord: null
    });

    const TENANT_LOTTIE = "/secure-lotties/Fold1/tenantfold.json";
    const LANDLORD_LOTTIE = "/secure-lotties/Fold1/landlordfold.json";

    useEffect(() => {
        const fetchLotties = async () => {
            try {
                const [tenant, landlord] = await Promise.all([
                    fetch(TENANT_LOTTIE).then(res => res.json()),
                    fetch(LANDLORD_LOTTIE).then(res => res.json())
                ]);
                setLottieData({ tenant, landlord });
            } catch (err) {
                console.error("Failed to load Lotties:", err);
            }
        };
        fetchLotties();
    }, []);

    const TextContent = (
        <motion.div
            layout
            className="w-full flex flex-col items-start text-left relative z-10 max-w-xl mx-auto"
        >
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
            <div className="flex flex-col gap-3 w-full max-w-md mb-6">
                <Button
                    href="#download"
                    variant="primary-rounded"
                    pastelColor={data.themeColor as any}
                    size="lg"
                    className="flex-[4] w-full text-base md:text-lg"
                >
                    {data.cta}
                </Button>
                {/* Tagline */}
                <p className="text-hero-tagline text-gray-400 font-body opacity-80 text-center text-sm md:text-xs">
                    {data.tagline}
                </p>
            </div>
        </motion.div>
    );

    const isTenant = data.lottie.includes("tenant");

    const LottieContent = (
        <motion.div
            layout
            className="w-full h-full flex items-center lg:items-end justify-center relative z-10 pt-16 lg:pt-0"
        >
            <div className="w-full h-full flex items-center lg:items-end justify-center overflow-visible relative">
                {/* Placeholder while loading */}
                {(!lottieData.tenant && !lottieData.landlord) && (
                    <div className="w-full h-40 bg-gray-100/50 rounded-3xl animate-pulse mx-10 mb-20" />
                )}

                {/* Tenant Lottie */}
                <motion.div
                    className="absolute inset-0 flex items-center lg:items-end justify-center"
                    animate={{ opacity: isTenant ? 1 : 0, zIndex: isTenant ? 10 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {lottieData.tenant && (
                        <Lottie
                            animationData={lottieData.tenant}
                            loop
                            autoplay
                            className="h-full w-auto lg:scale-[1.05]"
                        />
                    )}
                </motion.div>

                {/* Landlord Lottie */}
                <motion.div
                    className="absolute inset-0 flex items-center lg:items-end justify-center"
                    animate={{ opacity: !isTenant ? 1 : 0, zIndex: !isTenant ? 10 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {lottieData.landlord && (
                        <Lottie
                            animationData={lottieData.landlord}
                            loop
                            autoplay
                            className="h-full w-auto lg:scale-[1.05]"
                        />
                    )}
                </motion.div>
            </div>
        </motion.div>
    );

    return (
        <OpenSection className="bg-white h-[100vh] md:h-[92vh] relative flex flex-col justify-end">
            {/* Gradient Background - Positioned below content */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-pastel-orange/40 via-pastel-orange/10 to-white" />

            {/* Main Content Container */}
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`flex flex-col-reverse ${data.layoutReverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-stretch justify-center w-full h-full relative z-10 overflow-hidden mx-auto max-w-7xl`}
            >
                {/* Lottie Container - 50% height on mobile, 50% Width on desktop */}
                <motion.div
                    layout
                    className="w-full lg:w-1/2 h-1/2 lg:h-full flex items-end justify-center lg:flex-1 pointer-events-none"
                >
                    {LottieContent}
                </motion.div>

                {/* Content Container - 50% height on mobile, 50% Width on desktop */}
                <motion.div
                    layout
                    className={`w-full lg:w-1/2 h-1/2 lg:h-full flex items-center pt-48 pb-6 lg:py-0 justify-center px-4 md:px-8 lg:px-0 lg:flex-1`}
                >
                    {TextContent}
                </motion.div>
            </motion.div>

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
