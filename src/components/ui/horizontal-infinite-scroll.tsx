"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { cn } from "@/lib/utils";

interface HorizontalInfiniteScrollProps {
    children: React.ReactNode;
    speed?: number; // pixels per second
    direction?: "left" | "right";
    className?: string;
    pauseOnHover?: boolean;
}

export const HorizontalInfiniteScroll = ({
    children,
    speed = 50,
    direction = "left",
    className,
    pauseOnHover = true,
}: HorizontalInfiniteScrollProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [contentWidth, setContentWidth] = useState(0);
    const controls = useAnimationControls();
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        if (containerRef.current) {
            // Measure the width of the first set of children
            const firstChild = containerRef.current.children[0] as HTMLElement;
            if (firstChild) {
                setContentWidth(firstChild.offsetWidth);
            }
        }
    }, [children]);

    useEffect(() => {
        if (contentWidth === 0) return;

        const duration = contentWidth / speed;

        const animateScroll = async () => {
            if (direction === "left") {
                await controls.start({
                    x: -contentWidth,
                    transition: {
                        duration: duration,
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "loop",
                    },
                });
            } else {
                // For right direction, start at -contentWidth and move to 0
                await controls.start({
                    x: 0,
                    transition: {
                        duration: duration,
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "loop",
                        from: -contentWidth
                    },
                });
            }
        };

        if (!isHovering || !pauseOnHover) {
            animateScroll();
        } else {
            controls.stop();
        }

    }, [contentWidth, speed, direction, controls, isHovering, pauseOnHover]);

    return (
        <div
            className={cn("overflow-hidden relative w-full", className)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <motion.div
                ref={containerRef}
                animate={controls}
                className="flex flex-row"
                style={{ x: direction === "right" ? -contentWidth : 0 }}
            >
                {/* Render children twice for seamless loop */}
                <div className="flex flex-row shrink-0">
                    {children}
                </div>
                <div className="flex flex-row shrink-0">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};
