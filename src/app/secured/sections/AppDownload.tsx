"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useInView } from "framer-motion";
import { IconBrandApple, IconBrandAndroid } from "@tabler/icons-react";
import { OpenSection } from "@/components/layout/OpenSection";

export const AppDownload = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { margin: "0px", once: true });

    return (
        <OpenSection className="bg-bg-white">
            {/* Full Width Image with Torn Paper Edge Bottom */}
            <div
                ref={containerRef}
                className="w-full bg-bg-white overflow-hidden flex items-center justify-center relative aspect-[3/1] md:aspect-[4/1]"
            >

                {/* Main Image */}
                <Image
                    src="/secure-lotties/AppDownloadAssets/AppDownload_FullWidthImage.png"
                    alt="Flent App Download"
                    fill
                    className="object-cover w-full h-full"
                    priority
                />

                {/* Torn Paper Edge - Bottom */}
                <div className="absolute bottom-0 left-0 w-full h-8 md:h-16 z-20 translate-y-2 pointer-events-none">
                    <svg className="w-full h-full text-bg-white fill-current">
                        <defs>
                            <filter
                                id="paper-tear-app"
                                x="-20%"
                                y="-20%"
                                width="140%"
                                height="140%"
                            >
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
                            height="100%"
                            filter="url(#paper-tear-app)"
                            className="md:hidden"
                        />
                        <rect
                            x="-10%"
                            y="28"
                            width="120%"
                            height="100%"
                            filter="url(#paper-tear-app)"
                            className="hidden md:block"
                        />
                    </svg>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto  px-4 md:px-8 lg:px-12 pb-12 md:pb-24">
                <div className="bg-[#121212] rounded-3xl pt-12 p-8 md:p-12 relative overflow-hidden">

                    {/* Flent Logo Icon using Image */}
                    <div className="absolute top-6 right-6 md:top-8 md:right-8">
                        <Image
                            src="/secure-lotties/AppDownloadAssets/AppDownload_FlentLogo.png"
                            alt="Flent Logo"
                            width={48}
                            height={48}
                            className="w-10 h-10 md:w-12 md:h-12"
                        />
                    </div>

                    <div className="grid md:grid-cols-[auto,1fr] gap-8 md:gap-16 items-center">
                        {/* QR Code */}
                        <div className="bg-bg-white p-4 rounded-2xl w-fit mx-auto md:mx-0">
                            <Image
                                src="/secure-lotties/AppDownloadAssets/AppDownload_QR.png"
                                alt="Scan QR Code"
                                width={160}
                                height={160}
                                className="w-32 h-32 md:w-40 md:h-40"
                            />
                        </div>

                        {/* Text and Buttons */}
                        <div className="text-center md:text-left space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-text-invert text-fluid-h2 font-heading font-medium leading-tight">
                                    Get the Flent app to make renting <br className="hidden md:block" /> simpler, faster, and stress-free.
                                </h3>
                                <p className="text-text-invert/60 text-subtitle">
                                    Scan the QR or tap below to download and get started.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2">
                                <button className="flex items-center justify-center gap-3 bg-brand-orange hover:bg-brand-orange/80 text-text-main px-6 py-4 rounded-xl font-medium transition-colors w-full sm:w-auto">
                                    <IconBrandApple className="w-6 h-6" />
                                    <span>Download on App Store</span>
                                </button>
                                <button className="flex items-center justify-center gap-3 bg-pastel-orange hover:bg-pastel-orange/80 text-text-main px-6 py-4 rounded-xl font-medium transition-colors w-full sm:w-auto">
                                    <IconBrandAndroid className="w-6 h-6" />
                                    <span>Download On Play Store (Coming Soon)</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </OpenSection>
    );
};
