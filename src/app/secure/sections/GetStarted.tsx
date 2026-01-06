"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { OpenSection } from "@/components/layout/OpenSection";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
    IconMailFilled,
    IconUserFilled,
    IconShieldCheckFilled,
    IconCoinFilled,
    IconFileTextFilled,
    IconHomeFilled
} from "@tabler/icons-react";

interface Step {
    id: string;
    icon: string;
    title: string;
    desc: string;
    image: string;
}

// Icon map for step cards
const STEP_ICONS: Record<string, React.ElementType> = {
    "mail": IconMailFilled,
    "user-check": IconUserFilled,
    "shield-check": IconShieldCheckFilled,
    "coin": IconCoinFilled,
    "file-text": IconFileTextFilled,
    "home": IconHomeFilled,
    "users": IconUserFilled,
};

interface GetStartedProps {
    data: {
        eyebrow: string;
        heading: string;
        steps: Step[];
    };
}

const AUTO_CHANGE_INTERVAL = 8000; // 8 seconds

// Phone Mockup Component
const PhoneMockup = ({ imageSrc, alt }: { imageSrc: string; alt: string }) => (
    <div className="relative w-[280px] md:w-[320px]">
        {/* Phone Frame */}
        <div className="relative bg-[#2a2a2a] rounded-[44px] p-[6px] shadow-[0_0_80px_rgba(0,0,0,0.6)]">
            {/* Inner Bezel */}
            <div className="relative bg-white rounded-[38px] p-[3px]">
                {/* Inner Screen */}
                <div className="bg-white rounded-[35px] overflow-hidden aspect-[9/19] relative flex flex-col">
                    {/* Screen Content - The Image */}
                    <div className="flex-1 relative w-full h-full">
                        <Image
                            src={imageSrc}
                            alt={alt}
                            fill
                            className="object-cover object-top"
                            sizes="320px"
                        />
                    </div>

                    {/* Home Indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-800 rounded-full z-10" />
                </div>
            </div>
        </div>
    </div>
);

// Step Card Component with progress indicator
const StepCard = React.forwardRef<HTMLButtonElement, {
    step: Step;
    index: number;
    isActive: boolean;
    onClick: () => void;
    progress: number;
}>(({ step, index, isActive, onClick, progress }, ref) => (
    <button
        ref={ref}
        onClick={onClick}
        className={cn(
            "group relative w-full text-left px-5 py-5 rounded-xl transition-all duration-300",
            isActive
                ? "bg-white shadow-lg"
                : "bg-white/90 hover:bg-white"
        )}
    >
        <div className="flex items-start gap-3">
            {/* Icon */}
            {(() => {
                const IconComponent = STEP_ICONS[step.icon];
                return IconComponent ? (
                    <IconComponent className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                ) : null;
            })()}
            <p className={cn(
                "text-subtitle-sm leading-relaxed",
                isActive ? "text-gray-900" : "text-gray-600"
            )}>
                <span className="font-medium">{step.title}</span>
                {step.desc && (
                    <span className="font-normal text-gray-500">, {step.desc}</span>
                )}
            </p>
        </div>

        {/* Progress indicator bar container */}
        {isActive && (
            <div className="mt-3 w-full h-1 bg-brand-orange/30 rounded-full overflow-hidden">
                {/* Animated fill */}
                <div
                    className="h-full bg-brand-orange rounded-full transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>
        )}
    </button>
));

StepCard.displayName = "StepCard";

// Curved Arc Background
const CurvedArc = () => (
    <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
    >
        {/* Main curved arc connecting left to right */}
        <ellipse
            cx="500"
            cy="300"
            rx="420"
            ry="260"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
            strokeDasharray="5 5"
            fill="none"
        />
    </svg>
);

// Dynamic L-shaped connector - receives Y percentage from parent based on actual tab positions
const LShapeConnector = ({ activeYPercent }: { activeYPercent: number }) => {
    const phoneY = 50; // Phone is always centered

    return (
        <div className="w-[100px] xl:w-[120px] self-stretch flex items-center justify-center relative">
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                fill="none"
                preserveAspectRatio="none"
            >
                {/* L-shaped path */}
                <path
                    d={`
                        M 0 ${activeYPercent}
                        L 35 ${activeYPercent}
                        L 35 ${phoneY}
                        L 85 ${phoneY}
                    `}
                    stroke="white"
                    strokeWidth="1"
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                    className="transition-all duration-500 ease-out"
                />
            </svg>
            {/* Dot indicator - positioned with CSS */}
            <div
                className="absolute left-0 w-2 h-2 bg-brand-orange rounded-full transition-all duration-500 ease-out"
                style={{ top: `${activeYPercent}%`, transform: 'translateY(-50%)' }}
            />
            {/* Arrow head - tiny 4px filled triangle */}
            <div
                className="absolute right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[4px] border-l-white"
            />
        </div>
    );
};

export const GetStarted = ({ data }: GetStartedProps) => {
    const steps = data.steps;
    const [activeStep, setActiveStep] = useState(steps[0]?.id || "");
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [activeYPercent, setActiveYPercent] = useState(50); // Start centered

    // Refs for measuring actual DOM positions
    const containerRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const activeIndex = steps.findIndex((s) => s.id === activeStep);
    const activeStepData = steps.find((s) => s.id === activeStep);

    // Calculate the Y position based on actual DOM measurements
    useEffect(() => {
        const calculatePosition = () => {
            const container = containerRef.current;
            const activeTab = tabRefs.current[activeIndex];

            if (!container || !activeTab || activeIndex < 0) return;

            const containerRect = container.getBoundingClientRect();
            const tabRect = activeTab.getBoundingClientRect();

            // Calculate the center of the active tab relative to the container
            const tabCenterY = tabRect.top + tabRect.height / 2;
            const containerTop = containerRect.top;
            const containerHeight = containerRect.height;

            // Convert to percentage (0-100)
            const yPercent = ((tabCenterY - containerTop) / containerHeight) * 100;
            setActiveYPercent(Math.max(0, Math.min(100, yPercent)));
        };

        // Calculate immediately and also after a brief delay for layout settling
        calculatePosition();
        const timeoutId = setTimeout(calculatePosition, 50);

        // Recalculate on resize
        window.addEventListener('resize', calculatePosition);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', calculatePosition);
        };
    }, [activeIndex]);

    // Go to next step
    const goToNextStep = useCallback(() => {
        const currentIndex = steps.findIndex((s) => s.id === activeStep);
        const nextIndex = (currentIndex + 1) % steps.length;
        setActiveStep(steps[nextIndex].id);
        setProgress(0);
    }, [activeStep, steps]);

    // Handle manual step selection
    const handleStepClick = useCallback((stepId: string) => {
        setActiveStep(stepId);
        setProgress(0);
    }, []);

    // Auto-change timer and progress
    useEffect(() => {
        if (isPaused) return;

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    return 0;
                }
                // Update every 100ms, so we need to increment by (100ms / 8000ms) * 100 = 1.25
                return prev + (100 / (AUTO_CHANGE_INTERVAL / 100));
            });
        }, 100);

        const autoChangeTimeout = setTimeout(() => {
            goToNextStep();
        }, AUTO_CHANGE_INTERVAL);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(autoChangeTimeout);
        };
    }, [activeStep, isPaused, goToNextStep]);

    return (
        <OpenSection
            className="bg-[#121212] py-20 md:py-28 text-white overflow-hidden relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 relative z-10">
                {/* Header */}
                <div className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
                    <p className="text-gray-500 text-subtitle-sm mb-4 tracking-wide">
                        {data.eyebrow}
                    </p>
                    <h2
                        className="text-fluid-h1 font-heading font-medium leading-[1.2] tracking-tight"
                        dangerouslySetInnerHTML={{ __html: data.heading }}
                    />
                </div>

                {/* Main Content - Steps on Left, Phone on Right */}
                <div className="relative">
                    {/* Curved Arc Background */}
                    <div className="hidden lg:block absolute inset-0">
                        <CurvedArc />
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:flex items-stretch justify-center gap-4 relative z-10">
                        {/* Left: Step Cards - centered vertically */}
                        <div ref={containerRef} className="flex flex-col justify-center gap-3 flex-shrink-0 w-[380px]">
                            {steps.map((step, index) => (
                                <StepCard
                                    key={step.id}
                                    ref={(el) => { tabRefs.current[index] = el; }}
                                    step={step}
                                    index={index}
                                    isActive={activeStep === step.id}
                                    onClick={() => handleStepClick(step.id)}
                                    progress={activeStep === step.id ? progress : 0}
                                />
                            ))}
                        </div>

                        {/* Center: L-Shape Connector */}
                        <LShapeConnector activeYPercent={activeYPercent} />

                        {/* Right: Phone Mockup */}
                        <div className="flex-shrink-0 flex items-center">
                            <PhoneMockup
                                imageSrc={activeStepData?.image || steps[0]?.image}
                                alt={activeStepData?.title || "Step preview"}
                            />
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="lg:hidden flex flex-col items-center gap-10">
                        {/* Phone on top for mobile */}
                        <PhoneMockup
                            imageSrc={activeStepData?.image || steps[0]?.image}
                            alt={activeStepData?.title || "Step preview"}
                        />

                        <div className="w-full max-w-md flex flex-col gap-3">
                            {steps.map((step, index) => (
                                <StepCard
                                    key={step.id}
                                    step={step}
                                    index={index}
                                    isActive={activeStep === step.id}
                                    onClick={() => handleStepClick(step.id)}
                                    progress={activeStep === step.id ? progress : 0}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </OpenSection>
    );
};
