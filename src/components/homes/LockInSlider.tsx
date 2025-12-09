"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LockInPeriod } from "@/lib/property-utils";

export type { LockInPeriod };

interface LockInSliderProps {
    value: LockInPeriod;
    onChange: (value: LockInPeriod) => void;
    className?: string;
    compact?: boolean;
}

const LOCK_IN_OPTIONS: { value: LockInPeriod; label: string }[] = [
    { value: 6, label: "6 mo" },
    { value: 9, label: "9 mo" },
    { value: 11, label: "11 mo" },
];

export const LockInSlider = ({ value, onChange, className, compact = false }: LockInSliderProps) => {
    const getPosition = (val: LockInPeriod): number => {
        const index = LOCK_IN_OPTIONS.findIndex(opt => opt.value === val);
        return (index / (LOCK_IN_OPTIONS.length - 1)) * 100;
    };

    return (
        <div className={cn("w-full", className)}>
            {!compact && (
                <div className="flex justify-between mb-2">
                    <span className="text-xs font-medium text-text-main/70">Lock-in Period</span>
                    <span className="text-xs font-medium text-text-main">{value} months</span>
                </div>
            )}

            {/* Slider Track */}
            <div className="relative h-8 flex items-center">
                {/* Background Track */}
                <div className="absolute w-full h-1.5 bg-ground-brown/20 rounded-full" />

                {/* Active Track */}
                <div
                    className="absolute h-1.5 bg-text-main rounded-full transition-all duration-200"
                    style={{ width: `${getPosition(value)}%` }}
                />

                {/* Tick Marks */}
                <div className="absolute w-full flex justify-between">
                    {LOCK_IN_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => onChange(option.value)}
                            className={cn(
                                "w-4 h-4 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-text-main/20",
                                value === option.value
                                    ? "bg-text-main border-text-main scale-110"
                                    : value > option.value
                                        ? "bg-text-main border-text-main"
                                        : "bg-white border-ground-brown/30 hover:border-text-main/50"
                            )}
                            aria-label={`Select ${option.value} months lock-in`}
                        />
                    ))}
                </div>
            </div>

            {/* Labels */}
            <div className="flex justify-between mt-1.5">
                {LOCK_IN_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "text-xs transition-colors",
                            value === option.value
                                ? "font-semibold text-text-main"
                                : "text-text-main/50 hover:text-text-main/70"
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
