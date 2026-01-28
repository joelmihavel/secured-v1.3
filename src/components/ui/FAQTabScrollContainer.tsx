"use client";

import React from "react";
import { motion } from "framer-motion";
import { useMobileScrollHint, SCROLL_HINT_ANIMATION } from "@/hooks/useMobileScrollHint";
import { cn } from "@/lib/utils";

const SCROLL_CONTAINER_CLASSES =
    "overflow-x-auto md:overflow-visible -mx-4 md:mx-0 md:px-0 scroll-smooth hide-scrollbar";
const MOTION_WRAPPER_CLASSES = "inline-flex flex-nowrap min-w-max md:min-w-0";

interface FAQTabScrollContainerProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Scrollable tab row for FAQ sections. Hides the scrollbar on mobile and runs a
 * one-off "slide left then back" animation when the row enters view to hint
 * that more tabs exist.
 */
export function FAQTabScrollContainer({
    children,
    className,
}: FAQTabScrollContainerProps) {
    const { containerRef, shouldAnimate } = useMobileScrollHint();
    const { keyframes, duration, times } = SCROLL_HINT_ANIMATION;

    return (
        <div
            ref={containerRef}
            className={cn(SCROLL_CONTAINER_CLASSES, className)}
        >
            <motion.div
                className={MOTION_WRAPPER_CLASSES}
                animate={shouldAnimate ? { x: keyframes } : { x: 0 }}
                transition={{
                    duration,
                    times,
                    ease: "easeInOut",
                    repeat: 0,
                }}
            >
                {children}
            </motion.div>
        </div>
    );
}
