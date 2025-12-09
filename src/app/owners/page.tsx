import React from "react";
import { HeroSection } from "./sections/HeroSection";
import { FlentMagicSection } from "./sections/FlentMagicSection";
import { WhyPartnerSection } from "./sections/WhyPartnerSection";
import { HowFlentWorksSection } from "./sections/HowFlentWorksSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { OwnersFAQ } from "./sections/OwnersFAQ";
import { ContactSection } from "./sections/ContactSection";
import { OpenSection } from "@/components/layout/OpenSection";
import { GetStartedForm } from "@/components/ui/GetStartedForm";

export default function OwnersPage() {
    return (
        <main className="min-h-screen bg-bg-white">
            {/* Hero Section */}
            <HeroSection />

            {/* Flent Magic Section */}
            <FlentMagicSection />

            {/* Why Partner With Flent Section */}
            <WhyPartnerSection />

            {/* How Flent Works Section */}
            <HowFlentWorksSection />

            {/* Testimonials Section */}
            <TestimonialsSection />

            {/* Owners FAQ Section */}
            <OwnersFAQ />

            {/* Contact Form Section */}
            <ContactSection />
        </main>
    );
}
