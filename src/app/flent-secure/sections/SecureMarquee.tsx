"use client";
import React from "react";
import { motion } from "framer-motion";
import { OpenSection } from "@/components/layout/OpenSection";

interface SecureMarqueeProps {
    data: {
        top: string;
        bottom: string;
        // Optional color customization
        topTextColor?: string;   // Tailwind text class e.g. "text-gray-300"
        topBgColor?: string;     // Tailwind bg class e.g. "bg-white"
        bottomTextColor?: string; // Tailwind text class e.g. "text-brand-yellow"
        bottomBgColor?: string;   // Tailwind bg class e.g. "bg-forest-green"
    };
}

export const SecureMarquee = ({ data }: SecureMarqueeProps) => {
    // Defaults
    const topTextColor = data.topTextColor || "text-gray-400";
    const topBgColor = data.topBgColor || "bg-white";
    const bottomTextColor = data.bottomTextColor || "text-brand-yellow";
    const bottomBgColor = data.bottomBgColor || "bg-forest-green";

    const topContent = (
        <>
            {[...Array(8)].map((_, i) => (
                <span key={i} className={`text-xl sm:text-2xl md:text-4xl lg:text-fluid-h1 font-heading ${topTextColor} tracking-tighter shrink-0`}>
                    {data.top}
                </span>
            ))}
        </>
    );

    const bottomContent = (
        <>
            {[...Array(8)].map((_, i) => (
                <span key={i} className={`text-xl sm:text-2xl md:text-4xl lg:text-fluid-h1 font-heading ${bottomTextColor} tracking-tighter shrink-0 drop-shadow-sm`}>
                    {data.bottom}
                </span>
            ))}
        </>
    );

    return (
        <OpenSection className="bg-white py-4 md:py-12 overflow-hidden">
            <div className="relative flex flex-col gap-0 py-4 md:py-8">
                {/* Top strip */}
                <div
                    className={`overflow-hidden ${topBgColor} border-y border-gray-100 flex items-center relative z-0`}
                    style={{
                        transform: 'skewY(1deg)',
                        transformOrigin: '50% 50%'
                    }}
                >
                    <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: "-100%" }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        className="whitespace-nowrap flex items-center space-x-12 md:space-x-24 py-6 md:py-8 shrink-0 pr-12 md:pr-24"
                    >
                        {topContent}
                    </motion.div>
                    <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: "-100%" }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        className="whitespace-nowrap flex items-center space-x-12 md:space-x-24 py-6 md:py-8 shrink-0 pr-12 md:pr-24"
                    >
                        {topContent}
                    </motion.div>
                </div>

                {/* Bottom strip */}
                <div
                    className={`overflow-hidden ${bottomBgColor} border-y border-brand-yellow/30 relative z-10 flex items-center -mt-4 shadow-2xl`}
                    style={{
                        transform: 'skewY(-1deg)',
                        transformOrigin: '50% 50%'
                    }}
                >
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        className="whitespace-nowrap flex items-center space-x-12 md:space-x-24 py-6 md:py-8 shrink-0 pl-12 md:pl-24"
                    >
                        {bottomContent}
                    </motion.div>
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        className="whitespace-nowrap flex items-center space-x-12 md:space-x-24 py-6 md:py-8 shrink-0 pl-12 md:pl-24"
                    >
                        {bottomContent}
                    </motion.div>
                </div>
            </div>
        </OpenSection>
    );
};
