import React from "react";
import { OpenSection } from "@/components/layout/OpenSection";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { WHATSAPP_LINK } from "@/constants";

const steps = [
    {
        id: "01",
        title: "Find Your Space",
        description: "Explore the homes that feel right for you.",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "02",
        title: "Book A Visit",
        description: "Take a guided tour, confirm your choice, pay the token, and sign online.",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "03",
        title: "Move In, Stress-Free",
        description: "Walk into a fully set up home, with only your suitcase left to unpack.",
        image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: "04",
        title: "Live the Flent Way",
        description: "24/7 resident support, flexible stays, easy extensions, and everyday convenience",
        image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80"
    }
];

export const HowItWorks = () => {
    return (
        <OpenSection id="how-it-works" className="py-20">
            <div className="container mx-auto px-4 md:px-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
                    <div>
                        <p className="text-xs uppercase font-semibold tracking-wider mb-4 text-gray-600">How it Works?</p>
                        <h2 className="text-fluid-h2 font-heading text-text-main leading-tight">
                            Book Now,<br />
                            <span className="font-zin font-light">Move-in Tomorrow </span>
                        </h2>
                    </div>
                    <Button href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" variant="secondary" className="mt-6 md:mt-0 flex items-center gap-2 rounded-full px-8">
                        Talk to Us <span>→</span>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step) => (
                        <div key={step.id} className="flex flex-col group cursor-pointer">
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl mb-6">
                                <Image
                                    src={step.image}
                                    alt={step.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="flex items-baseline gap-2 mb-3">
                                <span className="text-sm font-medium text-gray-500">({step.id})</span>
                                <h3 className="text-xl font-heading text-text-main">{step.title}</h3>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed pr-4">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </OpenSection>
    );
};
