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
                        duration,
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
                            {React.Children.map(children, (child) => {
                                if (React.isValidElement(child)) {
                                    return React.cloneElement(child, {
                                        // @ts-ignore
                                        key: `${j}-${child.key || 'child'}`
                                    });
                                }
                                return child;
                            })}
                        </React.Fragment>
                    ))}
                </motion.div>
            ))}
        </div>
    );
};
