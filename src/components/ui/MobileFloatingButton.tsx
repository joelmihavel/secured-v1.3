"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MobileFloatingButtonProps {
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

export const MobileFloatingButton = ({ activeTab, onTabChange }: MobileFloatingButtonProps) => {
    const tabs = [
        { value: 'tenant', label: 'Tenants' },
        { value: 'landlord', label: 'Landlords' }
    ];

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
                        <div className="bg-gray-50 p-1 h-auto rounded-full border border-black/5 shadow-sm relative grid grid-cols-2 isolate">
                            {/* Tab buttons - grid ensures equal widths */}
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.value;
                                return (
                                    <button
                                        key={tab.value}
                                        onClick={() => onTabChange(tab.value)}
                                        className={cn(
                                            "relative h-9 rounded-full px-5 font-heading font-bold tracking-wide text-sm z-10 flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 transition-colors duration-200",
                                            isActive ? "text-text-main" : "text-gray-500 hover:text-gray-700"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="secure-tab-pill-mobile"
                                                className="absolute inset-0 bg-pastel-orange border-2 border-text-main shadow-[0px_4px_0px_0px_rgba(21,16,46,1)] rounded-full -z-10"
                                                style={{
                                                    backgroundColor: 'var(--color-pastel-orange)',
                                                }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 200,
                                                    damping: 25,
                                                }}
                                            />
                                        )}
                                        <span className="relative z-10">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
