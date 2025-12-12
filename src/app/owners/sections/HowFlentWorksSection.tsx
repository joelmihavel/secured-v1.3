"use client";

import React, { useMemo } from "react";
import { OpenSection } from "@/components/layout/OpenSection";
import { Timeline } from "@/components/ui/timeline";
import { IconClipboardCheck as ClipboardCheck, IconBrush as Paintbrush, IconUserCheck as UserCheck, IconRefresh as RefreshCw } from "@tabler/icons-react";
import { CardSection } from "@/components/layout/CardSection";

export const HowFlentWorksSection = () => {
    // Helper function to format dates
    const formatDate = (date: Date, showToday = false): string => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        if (showToday && checkDate.getTime() === today.getTime()) {
            return `Today (${monthNames[date.getMonth()]} ${date.getDate()})`;
        }

        return `${monthNames[date.getMonth()]} ${date.getDate()}`;
    };

    // Helper function to add days to a date
    const addDays = (date: Date, days: number): Date => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    // Calculate dates dynamically
    const dates = useMemo(() => {
        const today = new Date();
        return {
            day1: today,
            day3: addDays(today, 3),
            day30: addDays(today, 30),
        };
    }, []);

    const timelineData = [
        {
            title: (
                <div className="text-2xl md:text-5xl font-zin font-light tracking-tight">
                    {formatDate(dates.day1, true)}
                </div>
            ),
            content: (
                <div className="bg-pastel-green border-2 border-text-main rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {/* Icon and Title Section */}
                    <div className="flex items-center gap-4 p-6 md:p-8 pb-4 md:pb-6">
                        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white flex items-center justify-center border-2 border-text-main shadow-sm">
                            <ClipboardCheck className="w-8 h-8 text-text-main" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-heading font-bold text-text-main">
                            Property Evaluation
                        </h3>
                    </div>

                    {/* Description Section */}
                    <div className="px-6 md:px-8 pb-6 md:pb-8">
                        <p className="text-base md:text-lg font-body text-text-main/80 leading-relaxed">
                            Once you submit your details, we assess your home's earning potential using Flent's in house property intelligence and share a competitive rental offer within 48 hours. Pricing is always transparent with no hidden fees.
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: (
                <div className="text-2xl md:text-5xl font-zin font-light tracking-tight">
                    Day 3 ({formatDate(dates.day3)})
                </div>
            ),
            content: (
                <div className="bg-pastel-violet border-2 border-text-main rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {/* Icon and Title Section */}
                    <div className="flex items-center gap-4 p-6 md:p-8 pb-4 md:pb-6">
                        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white flex items-center justify-center border-2 border-text-main shadow-sm">
                            <Paintbrush className="w-8 h-8 text-text-main" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-heading font-bold text-text-main">
                            Curated Furnishing
                        </h3>
                    </div>

                    {/* Description Section */}
                    <div className="px-6 md:px-8 pb-6 md:pb-8">
                        <p className="text-base md:text-lg font-body text-text-main/80 leading-relaxed">
                        After onboarding is complete, the security deposit is paid upfront and our design team begins transforming your home into a fully furnished, premium living space within 72 hours.
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: (
                <div className="text-2xl md:text-5xl font-zin font-light text-text-main tracking-tight">
                    Day 30 ({formatDate(dates.day30)})
                </div>
            ),
            content: (
                <div className="bg-pastel-orange border-2 border-text-main rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {/* Icon and Title Section */}
                    <div className="flex items-center gap-4 p-6 md:p-8 pb-4 md:pb-6">
                        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white flex items-center justify-center border-2 border-text-main shadow-sm">
                            <UserCheck className="w-8 h-8 text-text-main" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-heading font-bold text-text-main">
                            Tenant Placement
                        </h3>
                    </div>

                    {/* Description Section */}
                    <div className="px-6 md:px-8 pb-6 md:pb-8">
                        <p className="text-base md:text-lg font-body text-text-main/80 leading-relaxed">
                        Your guaranteed rental income starts from day 30. We place tenants from the top 1 percent of working professionals, all vetted internally by Flent and verified through independent third party background checks.
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: (
                <div className="text-2xl md:text-5xl font-zin font-light text-text-main tracking-tight">
                    End of Contract
                </div>
            ),
            content: (
                <div className="bg-pastel-cyan border-2 border-text-main rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {/* Icon and Title Section */}
                    <div className="flex items-center gap-4 p-6 md:p-8 pb-4 md:pb-6">
                        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white flex items-center justify-center border-2 border-text-main shadow-sm">
                            <RefreshCw className="w-8 h-8 text-text-main" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-heading font-bold text-text-main">
                            Flexible Renewals
                        </h3>
                    </div>

                    {/* Description Section */}
                    <div className="px-6 md:px-8 pb-6 md:pb-8">
                        <p className="text-base md:text-lg font-body text-text-main/80 leading-relaxed">
                            When the agreement ends, you can choose to renew with a 5 to 6 % rental revision or take your property back in the same condition it was handed over to us.
                        </p>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <CardSection className="py-16 md:py-24 bg-ground-brown/10" backgroundPattern="/patterns/zig-zag.svg" patternMask="to-top" patternOpacity={0.04}>
            <div className="container mx-auto px-4">
                {/* Section Header - Left Aligned */}
                <div className="max-w-5xl mx-auto mb-12">
                    <h2 className="text-fluid-h2 font-heading text-text-main">
                        How <span className="font-zin-italic">Flent</span> Works
                    </h2>
                </div>

                {/* Timeline */}
                <Timeline data={timelineData} />
            </div>
        </CardSection>
    );
};


