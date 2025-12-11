import React from "react";
import { HeroSection } from "./sections/HeroSection";
import { StorySection } from "./sections/StorySection";
import { InvestorsSection } from "./sections/InvestorsSection";
import { TeamSection } from "./sections/TeamSection";
import { HiringSection } from "./sections/HiringSection";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-ground-brown/2">
            <HeroSection />
            <StorySection />
            <InvestorsSection />
            <TeamSection />
            <HiringSection />
        </main>
    );
}
