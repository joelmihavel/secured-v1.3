"use client";
import React, { useState } from "react";
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
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { WHATSAPP_LINK } from "@/constants";

const secureNavLinks = [
    { name: "Benefits", href: "#rent-reward" },
    { name: "Features", href: "#features" },
    { name: "Steps", href: "#get-started" },
    { name: "Download", href: "#download" },
    { name: "FAQ", href: "#faq" },
];

export default function FlentSecurePage() {
    const [activeTab, setActiveTab] = useState<string>("tenant");
    const content = activeTab === "tenant" ? TENANT_CONTENT : LANDLORD_CONTENT;

    return (
        <main className="bg-white-white min-h-screen">
            <Navbar variant="secure" activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Sections changing based on tab */}
            {/* Using key to force re-render when tab changes for animation */}
            <div key={activeTab} className="animate-in fade-in duration-500">
                <section id="overview">
                    <SecureHero data={content.hero} />
                </section>
                <section id="rent-reward">
                    <RentReward data={content.rentReward} variant={activeTab as "tenant" | "landlord"} />
                </section>
                <SecureMarquee data={content.marquee} />
                <section id="features">
                    <ValueProp data={content.valueProp} variant={activeTab as "tenant" | "landlord"} />
                </section>
                <section id="get-started">
                    <GetStarted data={content.getStarted} />
                </section>
                <section id="download">
                    <AppDownload />
                </section>
                <SecureMarquee data={content.marquee} />
                <section id="faq">
                    <SecureFAQ category={activeTab as "tenant" | "landlord"} />
                </section>
            </div>

            <SecureFooter />
            <BottomNavigation
                customLinks={secureNavLinks}
                customWhatsappLink={WHATSAPP_LINK}
                showAtId="rent-reward"
                showChat={false}
            />
        </main>
    );
}
