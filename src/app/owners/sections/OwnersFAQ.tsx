"use client";

import React from "react";
import { FAQSection, type FAQCategory } from "@/components/sections/FAQSection";

const faqCategories: FAQCategory[] = [
        {
            value: "general",
            label: "General",
            questions: [
                {
                    id: 1,
                    question: "How does Flent select tenants?",
                    answer: "Flent follows a thorough tenant selection process. Every tenant goes through identity verification, background checks, and internal screening standards to ensure reliability and responsible occupancy. This helps protect the property and ensures a smooth rental experience for you."
                },
                {
                    id: 2,
                    question: "Do I need to furnish my property?",
                    answer: "Flent handles the furnishing end to end. We accept both furnished and semi-furnished properties. Based on the condition and suitability of the existing furniture, we either retain it or request you to take it back before we set up the home."
                },
                {
                    id: 5,
                    question: "Who is responsible for property maintenance?",
                    answer: "Flent takes full responsibility for maintaining the property. We conduct regular inspections and handle repairs proactively so that minor issues are resolved before they become major problems."
                },
                {
                    id: 6,
                    question: "Am I allowed to visit the property while it's leased?",
                    answer: "Yes. Landlords are allowed to visit the property during the tenancy. We request that you inform Flent at least 24 to 48 hours in advance so the visit can be coordinated smoothly."
                },
                {
                    id: 7,
                    question: "What happens if a tenant damages my property?",
                    answer: "Flent has a comprehensive tenant damage policy. Any damages caused by the tenant are covered as per the terms of the agreement, ensuring the property is restored without financial burden on you."
                }
            ]
        },
        {
            value: "payments",
            label: "Payments",
            questions: [
                {
                    id: 3,
                    question: "How does the 100% rental guarantee work?",
                    answer: "Once your property is onboarded, rent starts as per the agreed terms in the contract. Even if the apartment is temporarily unoccupied, Flent continues to pay rent on time as agreed, ensuring uninterrupted income for you."
                }
            ]
        },
        {
            value: "agreement",
            label: "Agreement",
            questions: [
                {
                    id: 4,
                    question: "Can I end the agreement before the contract period ends?",
                    answer: "Yes. Landlords can terminate the agreement by serving the notice period mentioned in the contract. Flent ensures a structured and transparent exit process."
                },
                {
                    id: 8,
                    question: "Can I sell my property during the lease?",
                    answer: "Yes, you can sell your property during the tenancy. The sale can proceed as long as the notice period for termination mentioned in the agreement is followed."
                },
                {
                    id: 9,
                    question: "How is the agreement structured?",
                    answer: "You first sign a principal–agent agreement with Flent that allows us to manage and lease your home. Once a tenant is placed, a tripartite agreement is signed between you, Flent, and the tenant."
                }
            ]
        }
];

export const OwnersFAQ = () => {
    return (
        <FAQSection
            id="owners-faq"
            title={
                <>
                    You got questions? <br className="hidden md:block" />
                    <span className="font-zin-italic">
                        <br className="md:hidden" />
                        We got answers.
                    </span>
                </>
            }
            description="Everything you need to know about partnering with Flent."
            categories={faqCategories}
            defaultTab="general"
            inactiveTabBorder="border-black/10"
        />
    );
};
