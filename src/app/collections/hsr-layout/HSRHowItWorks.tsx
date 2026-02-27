"use client";

import React, { useMemo } from "react";
import { Timeline } from "@/components/ui/timeline";
import { CardSection } from "@/components/layout/CardSection";
import {
  IconCalendarEvent as CalendarEvent,
  IconCash as Cash,
  IconHome as Home,
} from "@tabler/icons-react";

export const HSRHowItWorks = () => {
  const getOrdinal = (day: number): string => {
    const j = day % 10;
    const k = day % 100;
    if (j === 1 && k !== 11) return `${day}st`;
    if (j === 2 && k !== 12) return `${day}nd`;
    if (j === 3 && k !== 13) return `${day}rd`;
    return `${day}th`;
  };

  const formatDate = (date: Date): string => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return `${getOrdinal(date.getDate())} ${monthNames[date.getMonth()]}`;
  };

  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const dates = useMemo(() => {
    const today = new Date();
    return {
      day1: today,
      day2: addDays(today, 1),
      day3: addDays(today, 2),
    };
  }, []);

  const timelineData = [
    {
      title: (
        <div className="text-2xl md:text-5xl font-zin font-light tracking-tight">
          Day 1 ({formatDate(dates.day1)})
        </div>
      ),
      content: (
        <div className="bg-pastel-green border-2 border-text-main rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4 p-6 md:p-8 pb-4 md:pb-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white flex items-center justify-center border-2 border-text-main shadow-sm">
              <CalendarEvent className="w-8 h-8 text-text-main" />
            </div>
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-text-main">
              Feel What Flent Feels Like
            </h3>
          </div>
          <div className="px-6 md:px-8 pb-6 md:pb-8">
            <p className="text-base md:text-lg font-body text-text-main/80 leading-relaxed">
              Found a home you like? Schedule a free house tour to fall in love :)
            </p>
          </div>
        </div>
      ),
    },
    {
      title: (
        <div className="text-2xl md:text-5xl font-zin font-light tracking-tight">
          Day 2 ({formatDate(dates.day2)})
        </div>
      ),
      content: (
        <div className="bg-pastel-violet border-2 border-text-main rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4 p-6 md:p-8 pb-4 md:pb-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white flex items-center justify-center border-2 border-text-main shadow-sm">
              <Cash className="w-8 h-8 text-text-main" />
            </div>
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-text-main">
              Pay Your Token
            </h3>
          </div>
          <div className="px-6 md:px-8 pb-6 md:pb-8">
            <p className="text-base md:text-lg font-body text-text-main/80 leading-relaxed">
              Yes, tokens again. But good ones. Make your chosen Flent property yours.
              Start packing that suitcase, &apos;cause we&apos;re drafting your rent agreement.
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
        <div className="bg-pastel-orange border-2 border-text-main rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4 p-6 md:p-8 pb-4 md:pb-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white flex items-center justify-center border-2 border-text-main shadow-sm">
              <Home className="w-8 h-8 text-text-main" />
            </div>
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-text-main">
              It&apos;s Time To Move In!
            </h3>
          </div>
          <div className="px-6 md:px-8 pb-6 md:pb-8">
            <p className="text-base md:text-lg font-body text-text-main/80 leading-relaxed">
              As soon as we receive your refundable deposit and your first month&apos;s rent,
              the red carpet&apos;s rolled out for you. Now, you can officially move in!
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <CardSection
      className="py-16 md:py-24 bg-ground-brown/10"
      backgroundPattern="/patterns/zig-zag.svg"
      patternMask="to-top"
      patternOpacity={0.04}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-fluid-h2 font-heading text-text-main">
            How It <span className="font-zin-italic">Works</span>
          </h2>
        </div>

        <Timeline data={timelineData} />
      </div>
    </CardSection>
  );
};
