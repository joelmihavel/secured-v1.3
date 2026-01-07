"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList } from "@/components/ui/tabs";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

interface MobileFloatingButtonProps {
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

export const MobileFloatingButton = ({ activeTab, onTabChange }: MobileFloatingButtonProps) => {
    // We want the controls to be visible on mobile always (since navbar toggle is hidden)
    // or maybe keep the animation but default to visible?
    // User asked for "Get App" to be bottom left and Toggle to be bottom right.
    // UPDATE: "Get App" moved to Navbar top right. Toggle centered at bottom.
    
    // If we want it always visible, we don't need the scroll listener for visibility.
    // However, the original button had a scroll listener. 
    // If I make it always visible, it covers the screen bottom.
    // I'll make it always visible for now as it replaces primary navigation (Toggle).

    return (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 flex items-end justify-center pointer-events-none gap-2">
            
            {/* Tenant/Landlord Toggle - Bottom Center */}
            {activeTab && onTabChange && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
                    className="pointer-events-auto"
                >
                    <div className="flex items-center bg-white rounded-full shadow-xl border-none p-1 h-auto overflow-hidden">
                        <Tabs value={activeTab} onValueChange={onTabChange}>
                            <TabsList className="bg-gray-50 p-1 gap-1 h-auto rounded-full border border-black/5 shadow-sm flex items-center relative">
                                {['tenant', 'landlord'].map((tabValue) => {
                                    const label = tabValue === 'tenant' ? 'Tenants' : 'Landlords';
                                    const isActive = activeTab === tabValue;

                                    return (
                                        <TabsPrimitive.Trigger
                                            key={tabValue}
                                            value={tabValue}
                                            className={cn(
                                                "relative h-9 rounded-full px-5 transition-colors duration-300 font-heading font-bold tracking-wide text-sm z-10 flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
                                                isActive ? "text-text-main" : "text-gray-500 hover:text-gray-900"
                                            )}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="secure-mobile-tab-pill"
                                                    className="absolute inset-0 bg-pastel-orange border-2 border-text-main shadow-[0px_4px_0px_0px_rgba(21,16,46,1)] rounded-full -z-10"
                                                    style={{ backgroundColor: 'var(--color-pastel-orange)' }}
                                                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                                />
                                            )}
                                            <span className="flex items-center gap-1 relative z-20">
                                                {label}
                                            </span>
                                        </TabsPrimitive.Trigger>
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
