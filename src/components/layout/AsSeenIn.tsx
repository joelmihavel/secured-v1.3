"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { OpenSection } from "@/components/layout/OpenSection";

const PRESS_ARTICLES = [
    {
        id: 1,
        logo: "/logos/yourstory.svg",
        alt: "YourStory",
        title: "Co-living gets a new identity with Flent's move-in ready rental homes",
        link: "https://yourstory.com/2026/01/proptech-startup-flent-raises-rs-21-cr-to-expand-premium-housing-rental-platform"
    },
    {
        id: 2,
        logo: "/logos/realtycom.svg",
        alt: "ET Realty",
        title: "Flent raises INR 6.5 Cr to build a new standard of renting",
        link: "https://realty.economictimes.indiatimes.com/news/startups/prop-tech-startup-flent-raises-21-crore/126425396"
    },
    {
        id: 3,
        logo: "/logos/entracker.svg",
        alt: "Entrackr",
        title: "This startup helps homeowners with guaranteed rental income in 21 days",
        link: "https://entrackr.com/snippets/proptech-startup-flent-raises-25-mn-in-pre-series-a-round-10977803"
    },
    {
        id: 4,
        logo: "/logos/inc42.svg",
        alt: "Inc42",
        title: "This startup is forever changing how affluent India rents a home",
        link: "https://inc42.com/buzz/proptech-startup-flent-bags-inr-21-cr-to-launch-operations-in-mumbai-gurugram/"
    }
];

export const AsSeenIn = () => {
    const [hoveredId, setHoveredId] = React.useState<number | null>(null);

    return (
        <OpenSection className="bg-bg-white pt-12 pb-4">
            <div className="container mx-auto px-4 text-center">
                <span className="text-sm font-medium text-gray-500 mb-6 md:mb-8 block uppercase tracking-wider">The press has noticed too</span>

                <div className="grid grid-cols-2 gap-4 md:flex md:flex-wrap md:gap-8 justify-center items-start">
                    {PRESS_ARTICLES.map((article) => (
                        <Link
                            key={article.id}
                            href={article.link}
                            target="_blank"
                            className="flex flex-col items-center w-full md:w-64 md:relative"
                            onMouseEnter={() => setHoveredId(article.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <motion.div
                                className="h-16 md:h-32 flex items-center justify-center mb-2 md:mb-6"
                                animate={{
                                    y: hoveredId === article.id ? -16 : 0
                                }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                <Image
                                    src={article.logo}
                                    alt={article.alt}
                                    width={200}
                                    height={100}
                                    className="h-12 md:h-24 w-auto object-contain scale-150 md:scale-125"
                                />
                            </motion.div>

                            {/* Desktop: Animated text on hover */}
                            <motion.div
                                className="hidden md:block md:absolute top-24 left-1/2 -translate-x-1/2 w-56 pt-4 pointer-events-none"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: hoveredId === article.id ? 1 : 0
                                }}
                                transition={{ duration: 0.5, ease: "easeOut", delay: 0.075 }}
                            >
                                <p className="text-[0.64rem] tracking-wider text-text-main font-body uppercase">
                                    {article.title}
                                </p>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </OpenSection>
    );
};
