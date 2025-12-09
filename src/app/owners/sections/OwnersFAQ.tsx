"use client";

import React, { useState } from "react";
import { FaqAccordion } from "@/components/ui/faq-chat-accordion";
import { CardSection } from "@/components/layout/CardSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const OwnersFAQ = () => {
    const [activeTab, setActiveTab] = useState("owners");

    const faqCategories = [
        {
            value: "owners",
            label: "Owners",
            questions: [
                {
                    id: 1,
                    question: "How does the guarantee rent model work?",
                    answer: "We sign a fixed lease with you and guarantee rent payment on a specific date every month, regardless of occupancy. You get steady income without the hassle of finding or managing tenants."
                },
                {
                    id: 2,
                    question: "Do I need to furnish my property?",
                    answer: "We prefer unfurnished properties as we furnish them to our standard. However, if your property is already furnished, we can discuss how to incorporate your furniture or if any changes are needed."
                },
                {
                    id: 3,
                    question: "How does Flent select tenants?",
                    answer: "We have a rigorous rigorous vetting process including identity verification, employment checks, and background screening to ensure high-quality, responsible tenants."
                },
                {
                    id: 4,
                    question: "What happens if a tenant damages my property?",
                    answer: "We take full responsibility for the condition of your property. Any damages caused by tenants are covered by us, and we handle all repairs and maintenance to ensure the property stays in top condition."
                },
                {
                    id: 5,
                    question: "Can I sell my property during the lease?",
                    answer: "Yes, you can sell your property. We would need prior notice as per the agreement terms, and the lease would typically be transferred to the new owner, or we can work out a mutually agreeable exit plan."
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
            <Tabs defaultValue="owners" className="w-full" onValueChange={(value) => setActiveTab(value)}>
                <div className="flex flex-col md:flex-row justify-between items-start container gap-4 mx-auto md:px-20">
                    <div className="w-full md:w-1/2 text-left mb-8 px-4 md:mb-0">
                        <h2 className="font-heading text-text-main mb-6">
                            You got questions? <br className="hidden md:block" />
                            <span className="font-zin font-light">
                                <br className="md:hidden" />
                                We got answers.
                            </span>
                        </h2>

                        <p className="text-subtitle font-body font-medium max-w-2xl md:mx-0 mb-8">
                            Everything you need to know about partnering with Flent.
                        </p>

                        {/* Hidden TabsList as requested */}
                        <div className="hidden">
                            <TabsList>
                                {faqCategories.map((category) => (
                                    <TabsTrigger key={category.value} value={category.value}>
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
                                        timestamp={`Common questions for ${category.label.toLowerCase()}`}
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
