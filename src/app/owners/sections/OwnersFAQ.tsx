"use client";

import React, { useState } from "react";
import { FaqAccordion } from "@/components/ui/faq-chat-accordion";
import { CardSection } from "@/components/layout/CardSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const OwnersFAQ = () => {
    const [activeTab, setActiveTab] = useState("general");

    const faqCategories = [
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

    return (
        <CardSection
            id="owners-faq"
            className="py-12 md:py-20 bg-white"
            backgroundPattern="/patterns/temple.svg"
            patternOpacity={0.02}
            patternMask="to-bottom"
        >
            <Tabs defaultValue="general" className="w-full" onValueChange={(value) => setActiveTab(value)}>
                <div className="flex flex-col md:flex-row justify-between items-start container gap-4 mx-auto md:px-20">
                    <div className="w-full md:w-1/2 text-left mb-8 px-4 md:mb-0">
                        <h2 className="font-heading text-text-main mb-6">
                            You got questions? <br className="hidden md:block" />
                            <span className="font-zin-italic">
                                <br className="md:hidden" />
                                We got answers.
                            </span>
                        </h2>

                        <p className="text-subtitle font-body font-medium max-w-2xl md:mx-0 mb-8">
                            Everything you need to know about partnering with Flent.
                        </p>

                        <div className="overflow-x-auto md:overflow-visible -mx-4 md:mx-0 md:px-0 scroll-smooth scrollbar-hide">
                            <TabsList className="flex flex-nowrap md:flex-wrap justify-start gap-2 bg-transparent p-0 h-auto min-w-max md:min-w-0">
                                {faqCategories.map((category) => (
                                    <TabsTrigger
                                        key={category.value}
                                        value={category.value}
                                        className={cn(
                                            "rounded-full px-6 py-2.5 text-sm font-semibold text-black transition-all hover:scale-105 border-2 bg-white flex-shrink-0",
                                            activeTab === category.value ? "border-black" : "border-black/10"
                                        )}
                                    >
                                        {category.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 max-w-3xl mx-auto md:mx-0">
                        {faqCategories.map((category) => (
                            <TabsContent key={category.value} value={category.value} className="mt-0">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <FaqAccordion
                                        data={category.questions}
                                        className="w-full"
                                        questionClassName="bg-white border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
                                        answerClassName="bg-night-violet text-white border border-black shadow-md"
                                        timestamp={`Common questions about ${category.label.toLowerCase()}`}
                                    />
                                </motion.div>
                            </TabsContent>
                        ))}
                    </div>
                </div>
            </Tabs>
        </CardSection>
    );
};
