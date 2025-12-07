"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { cn } from "@/lib/utils";

interface VerticalInfiniteScrollProps {
    children: React.ReactNode;
    speed?: number; // pixels per second
    direction?: "up" | "down";
    className?: string;
    pauseOnHover?: boolean;
}

export const VerticalInfiniteScroll = ({
    children,
    speed = 50,
    direction = "up",
    className,
    pauseOnHover = true,
}: VerticalInfiniteScrollProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);
    const controls = useAnimationControls();
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        if (containerRef.current) {
            // Measure the height of the first set of children
            const firstChild = containerRef.current.children[0] as HTMLElement;
            if (firstChild) {
                setContentHeight(firstChild.offsetHeight);
            }
        }
    }, [children]);

    useEffect(() => {
        if (contentHeight === 0) return;

        const duration = contentHeight / speed;

        const animateScroll = async () => {
            if (direction === "up") {
                await controls.start({
                    y: -contentHeight,
                    transition: {
                        duration: duration,
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "loop",
                    },
                });
            } else {
                // For down direction, we start at -contentHeight and move to 0
                // But to loop seamlessly, we need to handle the reset carefully.
                // Simpler approach: animate from -contentHeight to 0
                await controls.start({
                    y: 0,
                    transition: {
                        duration: duration,
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "loop",
                        from: -contentHeight
                    },
                });
            }
        };

        if (!isHovering || !pauseOnHover) {
            animateScroll();
        } else {
            controls.stop();
        }

    }, [contentHeight, speed, direction, controls, isHovering, pauseOnHover]);

    return (
        <div
            className={cn("overflow-hidden relative h-full", className)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <motion.div
                ref={containerRef}
                animate={controls}
                className="flex flex-col"
                style={{ y: direction === "down" ? -contentHeight : 0 }} // Initial position for down
            >
                {/* Render children twice for seamless loop */}
                <div className="flex flex-col shrink-0">
                    {children}
                </div>
                <div className="flex flex-col shrink-0">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};
