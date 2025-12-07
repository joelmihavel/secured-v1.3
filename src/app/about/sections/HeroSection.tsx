"use client";
import React from "react";
import { CardSection } from "@/components/layout/CardSection";
import Image from "next/image";
import { OpenSection } from "@/components/layout/OpenSection";

export const HeroSection = () => {
    return (
        <OpenSection
            className="min-h-[60vh] flex flex-col items-center justify-center text-center pt-16"

        >
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url('/patterns/pie-factory.svg')`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '60px 60px',
                    opacity: 0.02
                }}
            />


            <div className="w-full relative h-[320px] overflow-hidden">
                {/* Torn Paper Edge - Top */}
                <div className="absolute top-0 left-0 w-full h-16 z-20 -translate-y-2 pointer-events-none">
                    <svg className="w-full h-full text-bg-white fill-current">
                        <defs>
                            <filter id="paper-tear-top-about" x="-20%" y="-20%" width="140%" height="140%">
                                <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="42" result="noise" />
                                <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
                            </filter>
                        </defs>
                        <rect x="-10%" y="0" width="120%" height="36" filter="url(#paper-tear-top-about)" />
                    </svg>
                </div>

                <Image
                    src="/team-photos-normalized/About Us.webp"
                    alt="Flent Team"
                    fill
                    className="object-contain hidden md:block"
                    priority
                />
                <Image
                    src="/team-photos-normalized/about-us-mobile.webp"
                    alt="Flent Team"
                    fill
                    className="object-contain md:hidden"
                    priority
                />

                {/* Torn Paper Edge - Bottom */}
                <div className="absolute bottom-0 left-0 w-full h-16 z-20 translate-y-2 pointer-events-none">
                    <svg className="w-full h-full text-bg-white fill-current">
                        <defs>
                            <filter id="paper-tear-bottom-about" x="-20%" y="-20%" width="140%" height="140%">
                                <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="1" result="noise" />
                                <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
                            </filter>
                        </defs>
                        <rect x="-10%" y="28" width="120%" height="100%" filter="url(#paper-tear-bottom-about)" />
                    </svg>
                </div>
            </div>
        </OpenSection>
    );
};
