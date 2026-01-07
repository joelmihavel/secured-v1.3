"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface MobileFloatingButtonProps {
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

export const MobileFloatingButton = ({ activeTab, onTabChange }: MobileFloatingButtonProps) => {
    // We want the controls to be visible on mobile always (since navbar toggle is hidden)
    // or maybe keep the animation but default to visible?
    // User asked for "Get App" to be bottom left and Toggle to be bottom right.
    
    // If we want it always visible, we don't need the scroll listener for visibility.
    // However, the original button had a scroll listener. 
    // If I make it always visible, it covers the screen bottom.
    // I'll make it always visible for now as it replaces primary navigation (Toggle).

    return (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 flex items-end justify-between pointer-events-none gap-2">
            
            {/* Get App Button - Bottom Left */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="pointer-events-auto shadow-2xl rounded-full"
            >
                <Button
                    href="https://apps.apple.com/in/app/secured-by-flent/id6757275258"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="primary-rounded"
                    size="sm"
                    className="bg-black text-white px-5 py-2.5 font-bold text-xs shadow-xl"
                >
                    Get App
                </Button>
            </motion.div>

            {/* Tenant/Landlord Toggle - Bottom Right */}
            {activeTab && onTabChange && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
                    className="pointer-events-auto"
                >
                    <div className="flex items-center bg-white rounded-full shadow-xl border-none p-1 h-10 overflow-hidden">
                        <Tabs value={activeTab} onValueChange={onTabChange}>
                            <TabsList className="bg-gray-100 p-1 rounded-full h-full border-none flex items-center gap-0">
                                {['tenant', 'landlord'].map((tabValue, index) => {
                                    const label = tabValue === 'tenant' ? 'Tenant' : 'Landlord';
                                    const isFirst = index === 0;
                                    const isLast = index === 1;

                                    return (
                                        <TabsTrigger
                                            key={tabValue}
                                            value={tabValue}
                                            className={cn(
                                                "group relative overflow-hidden px-4 py-1 transition-all h-full shadow-sm border border-transparent data-[state=active]:border-black/10 data-[state=active]:bg-transparent data-[state=active]:text-inherit",
                                                isFirst && "rounded-l-full rounded-r-none border-r-0",
                                                isLast && "rounded-r-full rounded-l-none border-l-0"
                                            )}
                                        >
                                            {/* Background Animation */}
                                            <div className="absolute inset-0 bg-[#ff9a6d] translate-y-[175%] rotate-12 group-data-[state=active]:translate-y-0 group-data-[state=active]:rotate-0 transition-transform duration-500 ease-[cubic-bezier(0.625,0.05,0,1)] z-0 origin-bottom" />

                                            {/* Text Animation Container */}
                                            <div className="relative z-10 overflow-hidden block">
                                                <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.625,0.05,0,1)] group-data-[state=active]:-translate-y-full">
                                                    {/* Default State (Black Text) */}
                                                    <span className="flex items-center gap-1 text-[11px] font-bold font-heading tracking-wide text-black py-0.5 whitespace-nowrap">
                                                        <span>I&apos;m a&nbsp;</span>{label}
                                                    </span>
                                                    {/* Active State (Black Text) */}
                                                    <span className="flex items-center gap-1 text-[11px] font-bold font-heading tracking-wide text-black py-0.5 whitespace-nowrap absolute top-full left-0 w-full">
                                                        <span>I&apos;m a&nbsp;</span>{label}
                                                    </span>
                                                </div>
                                            </div>
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                        </Tabs>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
