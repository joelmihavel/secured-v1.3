"use client";

import React, { useState } from "react";
import { FaqAccordion } from "@/components/ui/faq-chat-accordion";
import { CardSection } from "@/components/layout/CardSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FAQTabScrollContainer } from "@/components/ui/FAQTabScrollContainer";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FAQCategory {
    value: string;
    label: string;
    color?: string;
    questions: Array<{
        id: number;
        question: string;
        answer: string;
    }>;
}

interface FAQSectionProps {
    id: string;
    title: string | React.ReactNode; // Allow JSX for complex titles with line breaks
    description: string;
    categories: FAQCategory[];
    defaultTab?: string;
    inactiveTabBorder?: string; // e.g., "border-black/1" or "border-black/10"
    className?: string;
}

/**
 * Reusable FAQ section component with tabbed categories and scrollable tabs on mobile
 */
export const FAQSection = React.forwardRef<HTMLElement, FAQSectionProps>(({
    id,
    title,
    description,
    categories,
    defaultTab,
    inactiveTabBorder = "border-black/1",
    className,
}, ref) => {
    const [activeTab, setActiveTab] = useState(defaultTab || categories[0]?.value || "");

    return (
        <CardSection
            ref={ref}
            id={id}
            className={cn("py-12 md:py-20 bg-white", className)}
            backgroundPattern="/patterns/temple.svg"
            patternOpacity={0.02}
            patternMask="to-bottom"
        >
            <Tabs defaultValue={defaultTab || categories[0]?.value} className="w-full" onValueChange={(value) => setActiveTab(value)}>
                <div className="flex flex-col md:flex-row justify-between items-start container gap-4 mx-auto md:px-20">
                    <div className="w-full md:w-1/2 text-left mb-2 px-4 md:mb-0">
                        <h2 className="font-heading text-text-main mb-2">
                            {title}
                        </h2>

                        <p className="text-subtitle font-body font-medium max-w-2xl md:mx-0 mb-8">
                            {description}
                        </p>

                        <FAQTabScrollContainer>
                            <TabsList className="flex flex-nowrap md:flex-wrap justify-start gap-2 bg-transparent p-0 h-auto min-w-max md:min-w-0">
                                {categories.map((category) => (
                                    <TabsTrigger
                                        key={category.value}
                                        value={category.value}
                                        className={cn(
                                            "rounded-full px-6 py-2.5 text-sm font-semibold text-black transition-all hover:scale-105 border-2 bg-white flex-shrink-0",
                                            activeTab === category.value ? "border-black" : inactiveTabBorder
                                        )}
                                    >
                                        {category.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </FAQTabScrollContainer>
                    </div>

                    <div className="w-full md:w-1/2 max-w-3xl mx-auto md:mx-0">
                        {categories.map((category) => (
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
});

FAQSection.displayName = "FAQSection";
