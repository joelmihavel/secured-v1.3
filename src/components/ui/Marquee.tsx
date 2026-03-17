"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface MarqueeProps {
    className?: string; // Applied to the outer container
    children: React.ReactNode;
    vertical?: boolean;
    repeat?: number; // How many times to repeat children in one strip
    reverse?: boolean; // Reverses direction
    duration?: number; // In seconds
}

export const Marquee = ({
    className,
    children,
    vertical = false,
    repeat = 4,
    reverse = false,
    duration = 50,
    ...props
}: MarqueeProps) => {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const media = window.matchMedia("(max-width: 767px)");
        const onChange = () => setIsMobile(media.matches);
        onChange();
        media.addEventListener?.("change", onChange);
        return () => media.removeEventListener?.("change", onChange);
    }, []);

    // Mobile felt too fast; slow down by 25% under md breakpoint.
    const effectiveDuration = isMobile ? duration * 1.25 : duration;

    return (
        <div
            {...props}
            className={cn(
                "group flex overflow-hidden",
                vertical ? "flex-col" : "flex-row",
                className
            )}
        >
            {[0, 1].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: vertical ? 0 : (reverse ? "-100%" : "0%"),
                        y: vertical ? (reverse ? "-100%" : "0%") : 0
                    }}
                    animate={{
                        x: vertical ? 0 : (reverse ? "0%" : "-100%"),
                        y: vertical ? (reverse ? "0%" : "-100%") : 0
                    }}
                    transition={{
                        duration: effectiveDuration,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                    className={cn(
                        "flex shrink-0 justify-around",
                        vertical ? "flex-col" : "flex-row items-center",
                    )}
                >
                    {Array.from({ length: repeat }).map((_, j) => (
                        <React.Fragment key={j}>
                            {React.Children.toArray(children).map((child, idx) => (
                                <React.Fragment key={`${j}-${idx}`}>{child}</React.Fragment>
                            ))}
                        </React.Fragment>
                    ))}
                </motion.div>
            ))}
        </div>
    );
};
