'use client'
import { motion, useMotionValue, useAnimationFrame, useTransform } from 'framer-motion';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    speed?: number;
    className?: string;
    itemClassName?: string;
}

export default function Marquee<T>({ items, renderItem, speed = 20, className, itemClassName }: MarqueeProps<T>) {
    const [isPaused, setIsPaused] = useState(false);
    // Triple the items for seamless looping
    const duplicatedItems = [...items, ...items, ...items];
    const baseX = useMotionValue(0);

    useAnimationFrame((time, delta) => {
        if (!isPaused) {
            // Move based on time
            // speed of 10 is roughly original speed
            const moveBy = (delta / 1000) * -(speed / 10);
            let newValue = baseX.get() + moveBy;

            // Reset at -33.33% (one full set of items)
            while (newValue <= -33.33) {
                newValue += 33.33;
            }

            baseX.set(newValue);
        }
    });

    const x = useTransform(baseX, (value) => `${value}%`);

    return (
        <div className={cn("relative flex items-center justify-center w-full overflow-hidden", className)}>
            <motion.div
                className="flex gap-8 py-12 pl-4"
                style={{ x }}
            >
                {duplicatedItems.map((item, index) => {
                    // Generate a consistent random rotation for each unique item
                    const randomRotation = ((index % items.length) * 7.3) % 6 - 3; // Range: -3 to 3 degrees

                    return (
                        <motion.div
                            key={index}
                            className={cn("relative flex-shrink-0 cursor-pointer", itemClassName)}
                            animate={{ rotate: randomRotation }}
                            onHoverStart={() => setIsPaused(true)}
                            onHoverEnd={() => setIsPaused(false)}
                            whileHover={{
                                scale: 1.02,
                                rotate: randomRotation, // Reset rotation or keep it? Let's keep it subtle
                                zIndex: 50,
                                transition: {
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20
                                }
                            }}
                        >
                            {renderItem(item, index)}
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
