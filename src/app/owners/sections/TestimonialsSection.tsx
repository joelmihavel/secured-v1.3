"use client";

import React from "react";
import { FlexibleCarousel } from "@/components/ui/flexible-carousel";
import { OpenSection } from "@/components/layout/OpenSection";
import { IconQuote as Quote } from "@tabler/icons-react";

interface Testimonial {
    name: string;
    location: string;
    message: string;
}

const testimonials: Testimonial[] = [
    {
        name: "Ravi",
        location: "Mumbai",
        message:
            "Partnering with Flent has been a game-changer for my property. They handle everything, from furnishing to finding quality tenants, and I get my rent on time every month. Couldn't be happier.",
    },
    {
        name: "Anjali",
        location: "Bangalore",
        message:
            "I was initially hesitant to rent my home to a management company, but Flent exceeded my expectations. My property was quickly furnished, and they found high-quality tenants within days. I've had zero issues since.",
    },
    {
        name: "Sushant",
        location: "Sydney",
        message:
            "I live outside India and faced challenges with finding and managing the tenants and my flat. It was in bad shape but the Flent Team did all repairs and maintenance before move-in. Their customer support team is very responsive regarding all matters.",
    },
];

export const TestimonialsSection = () => {
    return (
        <OpenSection className="py-24 bg-bg-white">
            {/* Header */}
            <div className="container mx-auto px-4 mb-12 text-center">
                <h2 className="font-heading text-text-main">
                    What Owners Say About{" "}
                    <span className="font-zin-italic">Flent</span>
                </h2>
            </div>

            {/* Carousel */}
            <div className="mb-8">
                <FlexibleCarousel
                    cards={testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] h-full flex flex-col justify-between w-full min-h-[400px]"
                        >
                            <div>
                                <Quote className="w-8 h-8 text-text-main mb-6 fill-current" />
                                <p className="text-gray-600 leading-relaxed mb-8">
                                    {testimonial.message}
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div>
                                    <h4 className="font-zin text-xl text-text-main mb-1">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-sm text-gray-500 font-medium">
                                        {testimonial.location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    cardSize="md"
                    showNavigation={false}
                    highlightMiddle={true}
                />
            </div>
        </OpenSection>
    );
};
