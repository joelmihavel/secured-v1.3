"use client";
import React, { useState, useEffect } from "react";
import { OpenSection } from "@/components/layout/OpenSection";
import Lottie from "lottie-react";
import { cn } from "@/lib/utils";

interface Step {
    id: string;
    title: string;
    desc: string;
    lottie: string;
}

interface GetStartedProps {
    data: {
        heading: string;
        steps: Step[];
    };
}

// Phone Mockup Component - simplified with placeholder Lottie
const PhoneMockup = ({ children }: { children: React.ReactNode }) => (
    <div className="relative w-[260px] md:w-[300px] mx-auto">
        {/* Phone Frame */}
        <div className="relative bg-[#2a2a2a] rounded-[44px] p-[6px] shadow-[0_0_60px_rgba(0,0,0,0.8)]">
            {/* Inner Bezel */}
            <div className="relative bg-white rounded-[38px] p-[3px]">
                {/* Inner Screen */}
                <div className="bg-[#1a1a1a] rounded-[35px] overflow-hidden aspect-[9/19] relative flex flex-col">
                    {/* Status Bar */}
                    <div className="flex items-center justify-between px-5 py-2 text-white text-[10px]">
                        <span className="font-semibold">13:13</span>
                        <div className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                            </svg>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <rect x="2" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                <rect x="20" y="10" width="2" height="4" rx="0.5" fill="currentColor" />
                                <rect x="4" y="9" width="8" height="6" rx="1" fill="currentColor" />
                            </svg>
                        </div>
                    </div>

                    {/* Content Area - Lottie placeholder */}
                    <div className="flex-1 flex items-center justify-center p-4">
                        {children}
                    </div>

                    {/* Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-600 rounded-full" />
                </div>
            </div>
        </div>
    </div>
);

// Step Card Component
const StepCard = ({
    step,
    index,
    isActive,
    onClick,
    position
}: {
    step: Step;
    index: number;
    isActive: boolean;
    onClick: () => void;
    position: "left" | "right";
}) => (
    <button
        onClick={onClick}
        className={cn(
            "group relative w-full max-w-[280px] p-4 md:p-5 rounded-xl border transition-all duration-300 text-left",
            "bg-[#1c1c1c] hover:bg-[#222]",
            isActive
                ? "border-brand-orange/40 bg-[#1f1f1f] shadow-[0_0_20px_rgba(255,163,123,0.1)]"
                : "border-white/[0.08]"
        )}
    >
        {/* Active indicator line */}
        {isActive && (
            <div
                className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-[3px] h-10 bg-brand-orange rounded-full transition-all",
                    position === "left" ? "-right-[1px]" : "-left-[1px]"
                )}
            />
        )}

        <div className="flex flex-col gap-1">
            <p className={cn(
                "text-[13px] md:text-sm leading-relaxed transition-colors",
                isActive ? "text-white/90" : "text-gray-400"
            )}>
                <span className={cn(
                    "font-semibold transition-colors mr-1",
                    isActive ? "text-brand-orange" : "text-gray-500"
                )}>
                    {index + 1}.
                </span>
                <span className="font-medium">{step.title}</span>
                {step.desc && (
                    <span className="font-normal">, {step.desc}</span>
                )}
            </p>
        </div>
    </button>
);

// Curved Arc SVG Component
const CurvedArcs = () => (
    <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
    >
        <ellipse
            cx="600"
            cy="350"
            rx="520"
            ry="300"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
            strokeDasharray="6 4"
            fill="none"
        />
        <ellipse
            cx="600"
            cy="350"
            rx="400"
            ry="220"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
            fill="none"
        />
        <ellipse
            cx="600"
            cy="350"
            rx="280"
            ry="140"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="1"
            fill="none"
        />
    </svg>
);

export const GetStarted = ({ data }: GetStartedProps) => {
    const steps = data.steps;
    const [activeStep, setActiveStep] = useState(steps[0]?.id || "");
    const [animationData, setAnimationData] = useState<Record<string, object | null>>({});

    // Preload all Lottie animations
    useEffect(() => {
        steps.forEach((step) => {
            if (step.lottie && !animationData[step.id]) {
                if (step.lottie.endsWith('.json')) {
                    fetch(step.lottie)
                        .then((res) => res.json())
                        .then((json) => {
                            setAnimationData((prev) => ({ ...prev, [step.id]: json }));
                        })
                        .catch((err) => console.error("Failed to load Lottie:", err));
                }
            }
        });
    }, [steps]);

    const activeStepData = steps.find((s) => s.id === activeStep);
    const leftSteps = steps.slice(0, 2);
    const rightSteps = steps.slice(2, 4);

    // Render content for phone - Lottie or image placeholder
    const renderPhoneContent = () => {
        if (!activeStepData?.lottie) {
            return <div className="w-full h-32 bg-white/10 rounded-xl animate-pulse" />;
        }

        if (activeStepData.lottie.endsWith('.json') && animationData[activeStep]) {
            return (
                <Lottie
                    animationData={animationData[activeStep]}
                    loop
                    autoplay
                    className="w-full h-auto max-h-[80%]"
                />
            );
        }

        // For .png or other image placeholders
        return (
            <img
                src={activeStepData.lottie}
                alt={activeStepData.title}
                className="w-full h-auto max-h-[80%] object-contain rounded-lg"
            />
        );
    };

    return (
        <OpenSection className="bg-[#121212] py-20 md:py-28 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
                    <p className="text-gray-500 text-sm md:text-base mb-4 tracking-wide">
                        How does it work?
                    </p>
                    <h2 className="text-3xl md:text-5xl lg:text-[56px] font-heading font-medium leading-[1.15] tracking-tight">
                        Getting started is simple<br />
                        <span className="font-zin-italic">&amp; straightforward</span>
                    </h2>
                </div>

                {/* Main Content - 3 Column Layout */}
                <div className="relative min-h-[550px] md:min-h-[600px]">
                    {/* Curved Arcs Background */}
                    <div className="hidden lg:block absolute inset-0">
                        <CurvedArcs />
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:flex items-center justify-center gap-8 xl:gap-12 relative z-10">
                        {/* Left Steps */}
                        <div className="flex flex-col gap-6 items-end flex-shrink-0 w-[280px]">
                            {leftSteps.map((step, index) => (
                                <StepCard
                                    key={step.id}
                                    step={step}
                                    index={index}
                                    isActive={activeStep === step.id}
                                    onClick={() => setActiveStep(step.id)}
                                    position="left"
                                />
                            ))}
                        </div>

                        {/* Center Phone Mockup */}
                        <div className="flex-shrink-0 mx-4 xl:mx-8">
                            <PhoneMockup>
                                {renderPhoneContent()}
                            </PhoneMockup>
                        </div>

                        {/* Right Steps */}
                        <div className="flex flex-col gap-6 items-start flex-shrink-0 w-[280px]">
                            {rightSteps.map((step, index) => (
                                <StepCard
                                    key={step.id}
                                    step={step}
                                    index={index + 2}
                                    isActive={activeStep === step.id}
                                    onClick={() => setActiveStep(step.id)}
                                    position="right"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="lg:hidden flex flex-col items-center gap-10">
                        <PhoneMockup>
                            {renderPhoneContent()}
                        </PhoneMockup>

                        <div className="w-full max-w-md flex flex-col gap-3">
                            {steps.map((step, index) => (
                                <StepCard
                                    key={step.id}
                                    step={step}
                                    index={index}
                                    isActive={activeStep === step.id}
                                    onClick={() => setActiveStep(step.id)}
                                    position="left"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </OpenSection>
    );
};
