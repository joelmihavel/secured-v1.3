import React from "react";
import type { Metadata } from "next";
import { HeroSection } from "./sections/HeroSection";
import { FlentMagicSection } from "./sections/FlentMagicSection";
import { WhyPartnerSection } from "./sections/WhyPartnerSection";
import { HowFlentWorksSection } from "./sections/HowFlentWorksSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { OwnersFAQ } from "./sections/OwnersFAQ";
import { ContactSection } from "./sections/ContactSection";
import { OpenSection } from "@/components/layout/OpenSection";
import { GetStartedForm } from "@/components/ui/GetStartedForm";
import { OwnersChatContextSetter } from "@/context/SuperchatContext";

export const metadata: Metadata = {
  title: "For Owners | Flent",
  description: "Partner with Flent to rent your home hassle free and earn guaranteed rental income from day 30. We offer premium furnishing, trusted tenants, and complete end to end property management.",
  openGraph: {
    title: "For Owners | Flent",
    description: "Partner with Flent to rent your home hassle free and earn guaranteed rental income from day 30. We offer premium furnishing, trusted tenants, and complete end to end property management.",
    url: "https://www.flent.in/owners",
    type: "website",
    images: "https://www.flent.in/images/og-image.jpg",
  },
  twitter: {
    card: "summary_large_image",
    title: "For Owners | Flent",
    description: "Partner with Flent to rent your home hassle free and earn guaranteed rental income from day 30. We offer premium furnishing, trusted tenants, and complete end to end property management.",
    images: "https://www.flent.in/images/og-image.jpg",
  },
};

export default function OwnersPage() {
    return (
        <main className="min-h-screen bg-bg-white flex flex-col gap-12">
            {/* Set Superchat context for owners page */}
            <OwnersChatContextSetter />

            {/* Hero Section */}
            <HeroSection 
                buttons={{
                    primary: {
                        text: "Get My Rental Quote",
                        url: "#contact",
                    }
                }}
            />

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
