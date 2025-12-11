"use client";

import React from "react";
import { OpenSection } from "@/components/layout/OpenSection";
import { motion } from "framer-motion";
import { IconTrendingUp as TrendingUp, IconShieldCheck as ShieldCheck, IconUsers as Users, IconHome as Home } from "@tabler/icons-react";

const benefits = [
    {
        title: "100% Rental Guarantee",
        description: "List your home with Flent - we guarantee you a tenant placement within 30 days. If not, we start paying you the rent from Day 31.",
        icon: TrendingUp,
        bgColor: "bg-forest-green",
        textColor: "text-white",
        rotation: -1,
    },
    {
        title: "Minimal Management Fee",
        description: "From tenant placement to ongoing property management, we handle everything—at minimal cost.",
        icon: ShieldCheck,
        bgColor: "bg-brick-red",
        textColor: "text-white",
        rotation: 1,
    },
    {
        title: "Top 1% Tenant",
        description: "Your property is only rented to trustworthy professionals and families who appreciate quality living.",
        icon: Users,
        bgColor: "bg-ground-brown",
        textColor: "text-white",
        rotation: -1,
    },
    {
        title: "Premium Furnishing",
        description: "We upgrade your property into a designer home that commands premium rent—all with 0 effort from your end.",
        icon: Home,
        bgColor: "bg-brand-cyan",
        textColor: "text-black",
        rotation: 2,
    },
];

export const WhyPartnerSection = () => {
    return (
        <OpenSection className="py-16 md:py-24 bg-bg-white">
            <div className="container mx-auto px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-fluid-h2 font-heading text-text-main mb-6">
                            Why Partner With <span className="font-zin-italic">Flent</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20, rotate: benefit.rotation }}
                                whileInView={{ opacity: 1, y: 0, rotate: benefit.rotation }}
                                whileHover={{ scale: 1.05, rotate: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`flex flex-col p-8 rounded-3xl shadow-lg h-full ${benefit.bgColor} ${benefit.textColor}`}
                            >
                                <div className="mb-6 p-3 bg-white/20 rounded-2xl w-fit backdrop-blur-sm">
                                    <benefit.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-heading mb-4 leading-tight">
                                    {benefit.title}
                                </h3>
                                <p className="text-sm font-body opacity-90 leading-relaxed">
                                    {benefit.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </OpenSection>
    );
};
