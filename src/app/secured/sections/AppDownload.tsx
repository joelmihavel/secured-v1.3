"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useInView } from "framer-motion";
import { IconBrandApple, IconBrandAndroid } from "@tabler/icons-react";
import { OpenSection } from "@/components/layout/OpenSection";
import { Button } from "@/components/ui/Button";
import { CTA_IDS } from "@/lib/cta-ids";

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

                    {/* Flent Logo Icon using Image - REMOVED */}
                    {/* <div className="absolute top-6 right-6 md:top-8 md:right-8">
                        <Image
                            src="/secure-lotties/AppDownloadAssets/AppDownload_FlentLogo.png"
                            alt="Flent Logo"
                            width={48}
                            height={48}
                            className="w-10 h-10 md:w-12 md:h-12"
                        />
                    </div> */}

                    <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center justify-center">
                        {/* QR Code */}
                        <a 
                            href="https://apps.apple.com/in/app/secured-by-flent/id6757275258"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-bg-white p-4 rounded-2xl w-fit mx-auto md:mx-0 flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
                        >
                            <Image
                                src="/secure-lotties/AppDownloadAssets/AppDownload_QR.png"
                                alt="Scan QR Code"
                                width={160}
                                height={160}
                                className="w-32 h-32 md:w-40 md:h-40"
                            />
                        </a>

                        {/* Text and Buttons */}
                        <div className="text-center md:text-left space-y-6 max-w-xl">
                            <div className="space-y-4">
                                <h3 className="text-text-invert text-fluid-h2 font-heading font-medium leading-tight">
                                    Make your rent work <br className="hidden md:block" /> for you
                                </h3>
                                <p className="text-text-invert/60 text-subtitle">
                                    Scan the QR or tap below to download and get started.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2 px-4 sm:px-0">
                                <Button
                                    href="https://apps.apple.com/in/app/secured-by-flent/id6757275258"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="primary-rounded"
                                    size="lg"
                                    className="w-full sm:w-auto bg-brand-orange border-black text-black hover:bg-brand-orange/90 shadow-[0px_4px_0px_0px_rgba(21,16,46,0.1)] px-6"
                                    leftIcon={<IconBrandApple className="w-5 h-5 flex-shrink-0" />}
                                    style={{ color: "black", borderColor: "black" }}
                                    data-cta-id={CTA_IDS.SECURED_APP_STORE}
                                    data-cta-context="secured_app_download"
                                >
                                    <span className="whitespace-normal text-center leading-tight">Download on App Store</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </OpenSection>
    );
};
