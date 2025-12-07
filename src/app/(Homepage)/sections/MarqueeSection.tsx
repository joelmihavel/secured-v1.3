"use client";

import React from "react";
import { motion } from "framer-motion";
import { OpenSection } from "@/components/layout/OpenSection";

export const MarqueeSection = () => {
    const topContent = (
        <>
            {[...Array(8)].map((_, i) => (
                <span key={i} className="text-xl sm:text-2xl md:text-4xl lg:text-fluid-h1 font-heading text-gray-200 tracking-tight">
                    Others connect you to <span className="font-zin font-light">landlords.</span>
                </span>
            ))}
        </>
    );

    const bottomContent = (
        <>
            {[...Array(8)].map((_, i) => (
                <span key={i} className="text-xl sm:text-2xl md:text-4xl lg:text-fluid-h1 font-heading text-brand-yellow tracking-tight">
                    We build and run the <span className="font-zin font-light">entire living experience.</span>
                </span>
            ))}
        </>
    );

    return (
        <OpenSection className="bg-bg-white pb-16 pt-24 md:pt-12">
            <div className="relative flex flex-col gap-0">
                {/* Top strip - Others' Approach (Gray tones, The Problem) */}
                <div
                    className="overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 border-1 border-gray-200 flex items-center z-1"
                    style={{
                        transform: 'skewY(2deg)',
                        transformOrigin: 'center',
                    }}
                >
                    <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: "-100%" }}
                        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                        className="whitespace-nowrap flex items-center space-x-12 py-4 md:py-8 pl-4 pr-8 shrink-0"
                    >
                        {topContent}
                    </motion.div>
                    <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: "-100%" }}
                        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                        className="whitespace-nowrap flex items-center space-x-12 py-4 md:py-8 pl-4 pr-8 shrink-0"
                    >
                        {topContent}
                    </motion.div>
                </div>

                {/* Bottom strip - Flent's Approach (Night Violet with Cyan, The Solution) */}
                <div
                    className="overflow-hidden bg-forest-green border-2 border-brand-yellow relative z-10 flex items-center"
                    style={{
                        transform: 'skewY(-2deg)',
                        transformOrigin: 'center',
                        marginTop: '-4rem'
                    }}
                >
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                        className="whitespace-nowrap flex items-center space-x-12 py-4 md:py-8 pl-4 pr-8 shrink-0"
                    >
                        {bottomContent}
                    </motion.div>
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                        className="whitespace-nowrap flex items-center space-x-12 py-4 md:py-8 pl-4 pr-8 shrink-0"
                    >
                        {bottomContent}
                    </motion.div>
                </div>
            </div>
        </OpenSection>
    );
};
