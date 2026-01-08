"use client";
import React, { useState, useEffect } from "react";
import { TENANT_CONTENT, LANDLORD_CONTENT } from "./constants";
import { Navbar } from "@/components/layout/Navbar";
import { SecureHero } from "./sections/SecureHero";
import { RentReward } from "./sections/RentReward";
import { SecureMarquee } from "./sections/SecureMarquee";
import { ValueProp } from "./sections/ValueProp";
import { GetStarted } from "./sections/GetStarted";
import { AppDownload } from "./sections/AppDownload";
import { SecureFAQ } from "./sections/SecureFAQ";
import { SecureFooter } from "./sections/SecureFooter";
import { DesktopFloatingQR } from "@/components/ui/DesktopFloatingQR";
import { MobileFloatingButton } from "@/components/ui/MobileFloatingButton";
import { useSearchParams, useRouter } from "next/navigation";

// Separate component to handle search params and main logic
function SecurePageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const landlordParam = searchParams.get("landlord");

    const [activeTab, setActiveTab] = useState<"tenant" | "landlord">("tenant");

    const handleTabChange = (tab: string) => {
        const newTab = tab as "tenant" | "landlord";
        setActiveTab(newTab);
        // Defer URL update to prevent frame drops during the switcher animation
        setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (newTab === "landlord") {
                params.set("landlord", "true");
            } else {
                params.delete("landlord");
            }
            router.replace(`/secured?${params.toString()}`, { scroll: false });
        }, 10);
    };

    useEffect(() => {
        if (landlordParam === "true") {
            setActiveTab("landlord");
        } else {
            setActiveTab("tenant");
        }
    }, [landlordParam]);

    const deferredTab = React.useDeferredValue(activeTab);
    const content = deferredTab === "tenant" ? TENANT_CONTENT : LANDLORD_CONTENT;

    return (
        <main className="bg-white-white min-h-screen">
            <Navbar
                variant="secure"
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

            {/* Sections changing based on tab */}
            {/* Using key to force re-render when tab changes for animation */}
            <div className="animate-in fade-in duration-500">
                <section id="overview">
                    <SecureHero data={content.hero} />
                </section>
                <section id="rent-reward">
                    <RentReward data={content.rentReward} variant={deferredTab as "tenant" | "landlord"} />
                </section>
                <SecureMarquee data={content.marquee} />
                <section id="features">
                    <ValueProp data={content.valueProp} variant={deferredTab as "tenant" | "landlord"} />
                </section>
                <section id="get-started">
                    <GetStarted data={content.getStarted} />
                </section>
                <section id="download">
                    <AppDownload />
                </section>
                <SecureMarquee data={content.marquee} />
                <section id="faq">
                    <SecureFAQ key={deferredTab} category={deferredTab as "tenant" | "landlord"} />
                </section>
            </div>

            <SecureFooter />
            <DesktopFloatingQR />
            <MobileFloatingButton
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />
        </main>
    );
}

export default function FlentSecurePage() {
    return (
        <React.Suspense fallback={<div className="min-h-screen bg-white" />}>
            <SecurePageContent />
        </React.Suspense>
    );
}
