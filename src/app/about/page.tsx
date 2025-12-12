import React from "react";
import type { Metadata } from "next";
import { HeroSection } from "./sections/HeroSection";
import { StorySection } from "./sections/StorySection";
import { InvestorsSection } from "./sections/InvestorsSection";
import { TeamSection } from "./sections/TeamSection";
import { HiringSection } from "./sections/HiringSection";

export const metadata: Metadata = {
  title: "About Us | Flent",
  description: "Learn how Flent became Bengaluru's go to choice for experience first renting, backed by leading investors and built to reshape how India experiences residential real estate.",
  openGraph: {
    title: "About Us | Flent",
    description: "Learn how Flent became Bengaluru's go to choice for experience first renting, backed by leading investors and built to reshape how India experiences residential real estate.",
    url: "https://www.flent.in/about",
    type: "website",
    images: "https://www.flent.in/images/og-image.jpg",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Flent",
    description: "Learn how Flent became Bengaluru's go to choice for experience first renting, backed by leading investors and built to reshape how India experiences residential real estate.",
    images: "https://www.flent.in/images/og-image.jpg",
  },
};

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
