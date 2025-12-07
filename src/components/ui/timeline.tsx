"use client";
import {
    useScroll,
    useTransform,
    motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
    title: React.ReactNode;
    content: React.ReactNode;
}

const TimelineItem = React.forwardRef<HTMLDivElement, {
    item: TimelineEntry;
    index: number;
    totalItems: number;
    scrollYProgress: any;
}>(({
    item,
    index,
    totalItems,
    scrollYProgress
}, ref) => {
    // Calculate when this item should appear based on its position
    const itemStart = index / totalItems;
    const itemEnd = (index + 0.5) / totalItems;

    const opacity = useTransform(scrollYProgress, [itemStart, itemEnd], [0, 1]);
    const y = useTransform(scrollYProgress, [itemStart, itemEnd], [20, 0]);

    return (
        <motion.div
            ref={ref}
            style={{ opacity, y }}
            className="flex gap-6 md:gap-10 py-6 md:py-10 last:pb-0"
        >
            {/* Dot Column - fixed width matching tape position */}
            <div className="flex-shrink-0 w-4 md:w-5 flex justify-center pt-1">
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-text-main border-2 md:border-[3px] border-white shadow-sm z-10" />
            </div>

            {/* Content Column - Title + Card stacked vertically */}
            <div className="flex-1 flex flex-col gap-3 md:gap-5 min-w-0">
                {/* Title Section */}
                <div>
                    {item.title}
                </div>

                {/* Card Content */}
                <div>
                    {item.content}
                </div>
            </div>
        </motion.div>
    );
});

TimelineItem.displayName = 'TimelineItem';

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
    const ref = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const lastItemRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);
    const [tapeLength, setTapeLength] = useState(0);

    useEffect(() => {
        if (ref.current && lastItemRef.current) {
            const containerRect = ref.current.getBoundingClientRect();
            const lastItemRect = lastItemRef.current.getBoundingClientRect();

            // Calculate total height for scroll tracking
            const totalHeight = ref.current.scrollHeight;
            setHeight(totalHeight);

            // Calculate tape length to last dot
            // Last dot is at: (lastItem top relative to container) + py-6 (24px) + pt-1 (4px)
            const relativeTop = lastItemRect.top - containerRect.top;
            const dotOffset = window.innerWidth >= 768 ? 44 : 28; // md:py-10 + pt-1 : py-6 + pt-1
            const tapeLengthToLastDot = relativeTop + dotOffset;
            setTapeLength(tapeLengthToLastDot);
        }
    }, [data]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 20%", "end 60%"],
    });

    const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

    return (
        <div
            className="w-full font-sans"
            ref={containerRef}
        >
            <div ref={ref} className="relative max-w-5xl mx-auto">
                {/* Measurement Tape - positioned in the dot column */}
                <div className="absolute left-[8px] md:left-[10px] top-0 z-20">
                    {/* Tape Housing/Case at top */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 w-8 h-8 md:w-10 md:h-10 bg-brick-red border-2 border-text-main rounded-lg shadow-lg flex items-center justify-center">
                        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-text-main" />
                    </div>

                    {/* Tape Track (background) */}
                    <div
                        style={{ height: Math.max(0, tapeLength) + "px" }}
                        className="absolute left-1/2 -translate-x-1/2 top-8 md:top-10 w-2 md:w-3 bg-pastel-brown rounded-b-sm"
                    />

                    {/* Animated Tape Extending */}
                    <motion.div
                        style={{
                            height: useTransform(scrollYProgress, [0, 1], [0, Math.max(0, tapeLength)]),
                            opacity: opacityTransform,
                        }}
                        className="absolute left-1/2 -translate-x-1/2 top-8 md:top-10 w-3 md:w-[18px] bg-brand-yellow border-x-2 border-text-main rounded-b-sm overflow-hidden origin-top"
                    >
                        {/* Tape Measurements */}
                        {Array.from({ length: Math.floor(Math.max(0, tapeLength) / 16) }).map((_, i) => (
                            <div key={i} className="relative" style={{ height: '16px' }}>
                                {/* Main tick - centered */}
                                <div
                                    className="absolute left-1/2 -translate-x-1/2 top-0 h-[1.5px] bg-text-main"
                                    style={{ width: i % 5 === 0 ? '60%' : i % 2 === 0 ? '40%' : '25%' }}
                                />
                                {/* Number on major ticks */}
                                {i % 5 === 0 && i > 0 && (
                                    <span className="absolute left-1 top-0 text-[5px] md:text-[6px] font-bold text-text-main leading-none">
                                        {i}
                                    </span>
                                )}
                            </div>
                        ))}

                        {/* Tape end hook */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 md:w-4 h-2 bg-brick-red border border-text-main rounded-b-sm" />
                    </motion.div>
                </div>

                {/* Timeline Items - with padding to account for tape */}
                <div className="pt-12 md:pt-14">
                    {data.map((item, index) => (
                        <TimelineItem
                            key={index}
                            item={item}
                            index={index}
                            totalItems={data.length}
                            scrollYProgress={scrollYProgress}
                            ref={index === data.length - 1 ? lastItemRef : undefined}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
