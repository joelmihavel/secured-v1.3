"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { useMobile } from "./useMobile";

/**
 * Hook for the FAQ tab "scroll hint" on mobile: when the tab row scrolls into view,
 * we run a one-off slide-left-then-back animation to hint that more tabs exist.
 * Returns a ref for the scroll container and whether to run the animation.
 */
export function useMobileScrollHint() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { margin: "0px", once: true });
    const isMobile = useMobile();

    return {
        containerRef,
        shouldAnimate: isInView && isMobile,
    };
}

export const SCROLL_HINT_ANIMATION = {
    keyframes: [0, -72, 0] as [number, number, number],
    duration: 1.1,
    times: [0, 0.4, 1] as [number, number, number],
};
