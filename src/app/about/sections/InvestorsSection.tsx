"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { OpenSection } from "@/components/layout/OpenSection";
import { Marquee } from "@/components/ui/Marquee";
import { cn } from "@/lib/utils";
import investorsData from "@/data/investors-data.json";
import institutionsData from "@/data/institutions-data.json";

// Separate investors and institutions
const investors = investorsData.map(inv => ({
    type: inv.type,
    src: inv.image,
    name: inv.name,
    role: inv.title,
    linkedin: inv.linkedin
}));

const institutions = institutionsData.map(inst => ({
    type: inst.type,
    src: inst.image,
    name: inst.name,
    link: inst.link
}));

// Distribute into columns ensuring alternation within each column
const COLUMN_1: any[] = [];
const COLUMN_2: any[] = [];

let invIndex = 0;
let instIndex = 0;

// Alternate adding to columns, and within each column, alternate types
let targetColumn = 1;
let col1NextType: 'person' | 'logo' = 'person';  // Start column 1 with investor
let col2NextType: 'person' | 'logo' = 'logo';    // Start column 2 with institution

while (invIndex < investors.length || instIndex < institutions.length) {
    if (targetColumn === 1) {
        // Add to column 1
        if (col1NextType === 'person' && invIndex < investors.length) {
            COLUMN_1.push(investors[invIndex]);
            invIndex++;
            col1NextType = 'logo';
        } else if (col1NextType === 'logo' && instIndex < institutions.length) {
            COLUMN_1.push(institutions[instIndex]);
            instIndex++;
            col1NextType = 'person';
        } else {
            // Fallback: add whatever is available
            if (invIndex < investors.length) {
                COLUMN_1.push(investors[invIndex]);
                invIndex++;
                col1NextType = 'logo';
            } else if (instIndex < institutions.length) {
                COLUMN_1.push(institutions[instIndex]);
                instIndex++;
                col1NextType = 'person';
            }
        }
        targetColumn = 2;
    } else {
        // Add to column 2
        if (col2NextType === 'logo' && instIndex < institutions.length) {
            COLUMN_2.push(institutions[instIndex]);
            instIndex++;
            col2NextType = 'person';
        } else if (col2NextType === 'person' && invIndex < investors.length) {
            COLUMN_2.push(investors[invIndex]);
            invIndex++;
            col2NextType = 'logo';
        } else {
            // Fallback: add whatever is available
            if (instIndex < institutions.length) {
                COLUMN_2.push(institutions[instIndex]);
                instIndex++;
                col2NextType = 'person';
            } else if (invIndex < investors.length) {
                COLUMN_2.push(investors[invIndex]);
                invIndex++;
                col2NextType = 'logo';
            }
        }
        targetColumn = 1;
    }
}

const InvestorCard = ({ item }: { item: any }) => {
    if (item.type === "logo") {
        const content = (
            <div className="bg-white rounded-xl p-8 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow w-full max-w-[280px] mx-auto min-h-[140px]">
                <div className="relative w-full h-20">
                    <Image
                        src={item.src}
                        alt={item.name}
                        fill
                        className="object-contain"
                    />
                </div>
            </div>
        )
        return content;
    }

    const personContent = (
        <div className="bg-white p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow w-full max-w-[280px] mx-auto">
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-gray-100">
                <Image
                    src={item.src}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>
            <div className="pt-4 pb-2 px-1 text-left">
                <h4 className="text-primary-black font-bold text-lg leading-tight mb-1">{item.name}</h4>
                <p className="text-primary-black/60 text-sm leading-snug">{item.role}</p>
            </div>
        </div>
    );

    if (item.linkedin) {
        return (
            <a href={item.linkedin} target="_blank" rel="noopener noreferrer" className="block w-full group">
                {personContent}
            </a>
        );
    }
    return <div className="group">{personContent}</div>;
};



export const InvestorsSection = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <OpenSection className="bg-ground-brown/6">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-4 mx-4">
                        <div className="mb-8 mt-12">
                            <span className="inline-block px-3 py-1 rounded-full bg-pastel-brown text-sm font-medium text-primary-black/60">
                                About / <span className="text-primary-black">Investors</span>
                            </span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold font-heading leading-[1.1] tracking-tight text-text-main mb-8">
                            They gave us money
                            <span className="font-zin-italic"> <br className="block md:hidden" /> (and a chance)</span>
                        </h2>
                        <p className="text-subtitle text-primary-black/80 leading-relaxed">
                            Meet the investors who believed in our mission long before the market did.
                        </p>
                    </div>

                    {/* Carousel Columns - Desktop: Vertical, Mobile: Horizontal */}
                    {isMobile ? (
                        <div className="lg:col-span-8 flex flex-col gap-4 w-full overflow-hidden pb-4 md:pb-0">
                            <Marquee duration={200} className="w-full">
                                {COLUMN_1.map((item, index) => (
                                    <div key={index} className="mx-2 w-[200px]">
                                        <InvestorCard item={item} />
                                    </div>
                                ))}
                            </Marquee>
                            <Marquee duration={200} reverse className="w-full">
                                {COLUMN_2.map((item, index) => (
                                    <div key={index} className="mx-2 w-[200px]">
                                        <InvestorCard item={item} />
                                    </div>
                                ))}
                            </Marquee>
                        </div>
                    ) : (
                        <div className="lg:col-span-8 flex justify-center gap-6 h-[100vh] overflow-hidden">
                            <div className="w-full max-w-[280px] h-full">
                                <Marquee vertical duration={200} className="h-full">
                                    {COLUMN_1.map((item, index) => (
                                        <div key={index} className="my-4">
                                            <InvestorCard item={item} />
                                        </div>
                                    ))}
                                </Marquee>
                            </div>
                            <div className="w-full max-w-[280px] h-full">
                                <Marquee vertical duration={200} reverse className="h-full">
                                    {COLUMN_2.map((item, index) => (
                                        <div key={index} className="my-4">
                                            <InvestorCard item={item} />
                                        </div>
                                    ))}
                                </Marquee>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </OpenSection>
    );
};
