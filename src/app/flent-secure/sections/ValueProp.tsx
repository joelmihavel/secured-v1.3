"use client";
import React from "react";
import { OpenSection } from "@/components/layout/OpenSection";
import { Button } from "@/components/ui/Button";

interface ValuePropProps {
    data: {
        heading: string;
        subtext: string;
        cta: string;
        lottie: string;
    };
}

export const ValueProp = ({ data }: ValuePropProps) => {
    return (
        <OpenSection className="bg-white py-20 lg:py-32">
            <div className="max-w-7xl mx-auto px-4 md:px-12 text-center">
                {/* Top Content */}
                <div className="mb-16 flex flex-col items-center max-w-4xl mx-auto">
                    <h2
                        className="text-4xl md:text-5xl lg:text-7xl font-heading font-medium text-black mb-8 leading-tight tracking-tight"
                        dangerouslySetInnerHTML={{ __html: data.heading }}
                    />
                    <p className="text-lg md:text-xl text-gray-500 mb-10 font-body">
                        {data.subtext}
                    </p>
                    <Button variant="primary" size="lg" className="rounded-full px-10 py-6 text-lg bg-black text-white hover:bg-gray-900 border-none shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                        {data.cta}
                    </Button>
                </div>

                {/* Bottom Lottie */}
                <div className="w-full bg-slate-50 border border-slate-100 rounded-[3rem] overflow-hidden aspect-[16/9] md:aspect-[2.4/1] flex items-center justify-center shadow-inner relative">
                    <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5 pointer-events-none"></div>
                    <div className="relative z-10 transform scale-90 md:scale-100 transition-transform">
                        <img src={data.lottie} alt="Value Prop Illustration" className="h-full w-auto object-contain max-h-[60vh]" />
                    </div>
                </div>
            </div>
        </OpenSection>
    );
};
