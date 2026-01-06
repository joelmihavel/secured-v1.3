"use client";
import React, { useState } from "react";
import { TENANT_CONTENT, LANDLORD_CONTENT } from "./constants";
import { SecureNavbar } from "./sections/SecureNavbar";
import { SecureHero } from "./sections/SecureHero";
import { RentReward } from "./sections/RentReward";
import { SecureMarquee } from "./sections/SecureMarquee";
import { ValueProp } from "./sections/ValueProp";
import { GetStarted } from "./sections/GetStarted";
import { SecureForm } from "./sections/SecureForm";
import { SecureFAQ } from "./sections/SecureFAQ";
import { SecureFooter } from "./sections/SecureFooter";

export default function FlentSecurePage() {
    const [activeTab, setActiveTab] = useState<string>("tenant");
    const content = activeTab === "tenant" ? TENANT_CONTENT : LANDLORD_CONTENT;

    return (
        <main className="bg-white-white min-h-screen">
            <SecureNavbar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Sections changing based on tab */}
            {/* Using key to force re-render when tab changes for animation */}
            <div key={activeTab} className="animate-in fade-in duration-500">
                <SecureHero data={content.hero} />
                <RentReward data={content.rentReward} />
                <SecureMarquee data={content.marquee} />
                <ValueProp data={content.valueProp} />
                <GetStarted data={content.getStarted} />
                <SecureForm />
                <SecureFAQ category={activeTab as "tenant" | "landlord"} />
            </div>

            <SecureFooter />
        </main>
    );
}
