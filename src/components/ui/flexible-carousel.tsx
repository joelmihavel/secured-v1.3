"use client";

import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from "react";
import { motion, useMotionValue, animate, PanInfo, useDragControls, useMotionValueEvent } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---

export type CardSize = 'sm' | 'md' | 'xl' | '2xl';

interface FlexibleCarouselProps {
    cards: React.ReactNode[];
    isInfinite?: boolean;
    highlightMiddle?: boolean;
    isAutoscrolling?: boolean;
    showNavigation?: boolean;
    cardSize?: CardSize;
    cardWidth?: number | string;
    shadowOnHover?: boolean;
    className?: string;
    onSlideChange?: (index: number) => void;
    isDraggable?: boolean;
    friction?: number;
}

// --- Configuration ---

const CARD_SIZES: Record<CardSize, { width: number; height: number }> = {
    sm: { width: 250, height: 350 },
    md: { width: 350, height: 500 },
    xl: { width: 500, height: 640 },
    '2xl': { width: 600, height: 800 },
};

const GAP = 24;
const MOBILE_GAP = 14;

// Number of complete sets to render on each side for infinite scroll
const INFINITE_BUFFER_SETS = 4;

export interface FlexibleCarouselHandle {
    scrollPrev: () => void;
    scrollNext: () => void;
}

export const FlexibleCarousel = React.forwardRef<FlexibleCarouselHandle, FlexibleCarouselProps>(({
    cards,
    isInfinite = false,
    highlightMiddle = false,
    isAutoscrolling = false,
    showNavigation = true,
    cardWidth,
    cardSize = 'xl',
    shadowOnHover = false,
    className,
    onSlideChange,
    isDraggable = true,
    friction = 0.2,
}, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [constraints, setConstraints] = useState({ left: 0, right: 0 });
    const [containerHeight, setContainerHeight] = useState<number>(500);
    const isDraggingRef = useRef(false);
    const isScrollingRef = useRef(false);
    const dragControls = useDragControls();

    // Real-time tracking of which virtual index is centered
    const [visualCenterVirtualIndex, setVisualCenterVirtualIndex] = useState(0);

    // Responsive config
    const [config, setConfig] = useState({
        width: typeof cardWidth === 'number' ? cardWidth : CARD_SIZES[cardSize].width,
        gap: GAP
    });

    useEffect(() => {
        const updateConfig = () => {
            const isMobile = window.innerWidth < 768;
            let baseWidth: number;

            if (typeof cardWidth === 'string' && cardWidth.endsWith('vw')) {
                const vwValue = parseFloat(cardWidth);
                baseWidth = (vwValue * window.innerWidth) / 100;
            } else if (typeof cardWidth === 'number') {
                baseWidth = cardWidth;
            } else {
                baseWidth = CARD_SIZES[cardSize].width;
            }

            // For highlightMiddle variant, respect the cardWidth prop on mobile
            // For non-highlightMiddle, use the full-width mobile override
            const mobileWidth = highlightMiddle ? baseWidth : Math.min(window.innerWidth * 0.85, 400);

            setConfig({
                width: isMobile ? mobileWidth : baseWidth,
                gap: isMobile ? MOBILE_GAP : GAP
            });
        };

        updateConfig();
        window.addEventListener('resize', updateConfig);
        return () => window.removeEventListener('resize', updateConfig);
    }, [cardSize, cardWidth, highlightMiddle]);

    // Animation value for track position
    const x = useMotionValue(0);

    // Calculate item width including gap
    const itemWidth = config.width + config.gap;

    // Offset calculation - center if highlightMiddle, otherwise align to edge
    const getOffset = useCallback(() => {
        if (!containerRef.current) return 0;
        if (highlightMiddle) {
            const containerWidth = containerRef.current.offsetWidth;
            return (containerWidth / 2) - (config.width / 2);
        }
        return 0;
    }, [config.width, highlightMiddle]);

    // Track visual center in real-time for highlightMiddle
    useMotionValueEvent(x, "change", (latestX) => {
        if (highlightMiddle) {
            const offset = getOffset();
            // Calculate which virtual index is centered
            const centeredVirtualIndex = Math.round((offset - latestX) / itemWidth);
            setVisualCenterVirtualIndex(centeredVirtualIndex);
        }
    });

    // Generate visible indices based on mode
    const getVisibleIndices = useCallback((): number[] => {
        if (isInfinite) {
            // Render multiple complete sets centered around 0
            // This ensures smooth infinite scrolling without gaps
            const indices: number[] = [];
            const totalSets = INFINITE_BUFFER_SETS * 2 + 1;
            const startSet = -INFINITE_BUFFER_SETS;

            for (let set = startSet; set <= INFINITE_BUFFER_SETS; set++) {
                for (let i = 0; i < cards.length; i++) {
                    indices.push(set * cards.length + i);
                }
            }
            return indices;
        } else {
            return cards.map((_, i) => i);
        }
    }, [isInfinite, cards.length]);

    const visibleIndices = getVisibleIndices();

    // Calculate constraints
    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const offset = getOffset();
        const containerWidth = containerRef.current.offsetWidth;

        if (isInfinite) {
            // For infinite: no real constraints, we'll wrap position instead
            // Set very wide bounds to allow free movement
            const setWidth = cards.length * itemWidth;
            const totalBound = setWidth * (INFINITE_BUFFER_SETS + 1);
            setConstraints({ left: -totalBound, right: totalBound });
        } else {
            if (highlightMiddle) {
                const minX = offset - ((cards.length - 1) * itemWidth);
                const maxX = offset;
                setConstraints({ left: minX, right: maxX });
            } else {
                const totalWidth = (cards.length * itemWidth) - config.gap;
                const minX = Math.min(0, containerWidth - totalWidth);
                const maxX = 0;
                setConstraints({ left: minX, right: maxX });
            }
        }
    }, [isInfinite, cards.length, itemWidth, getOffset, config.gap, highlightMiddle]);

    // Wrap position for infinite scroll - teleport when too far from center
    const wrapPosition = useCallback(() => {
        if (!isInfinite || cards.length === 0) return;

        const currentX = x.get();
        const offset = getOffset();
        const setWidth = cards.length * itemWidth;

        // Calculate how far we are from the "center set" (index 0)
        const rawIndex = (offset - currentX) / itemWidth;
        const setOffset = Math.floor(rawIndex / cards.length);

        // If we've drifted more than 1 set away, wrap back
        if (Math.abs(setOffset) >= 1) {
            const wrapAmount = setOffset * setWidth;
            x.set(currentX + wrapAmount);
            // Update currentIndex to maintain continuity
            setCurrentIndex(prev => {
                const newIndex = prev - setOffset * cards.length;
                return newIndex;
            });
        }
    }, [isInfinite, x, getOffset, cards.length, itemWidth]);

    // Snap to index with animation
    const snapToIndex = useCallback((index: number, immediate = false) => {
        const offset = getOffset();
        const targetX = offset - (index * itemWidth);

        if (immediate) {
            x.set(targetX);
        } else {
            animate(x, targetX, {
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 1
            });
        }

        // Normalize index for callback
        let normalizedIndex = ((index % cards.length) + cards.length) % cards.length;

        setCurrentIndex(index);
        setVisualCenterVirtualIndex(index);
        onSlideChange?.(normalizedIndex);
    }, [getOffset, itemWidth, x, cards.length, onSlideChange]);

    // Initialize position
    useLayoutEffect(() => {
        snapToIndex(currentIndex, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [config.width, config.gap]);

    // Handle Drag End
    const handleDragEnd = useCallback((_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const velocity = info.velocity.x;
        const currentX = x.get();
        const offset = getOffset();

        // Predict end position based on velocity
        const predictedEnd = currentX + velocity * 0.2;

        // Calculate closest index
        let targetIndex = Math.round((offset - predictedEnd) / itemWidth);

        if (!isInfinite) {
            targetIndex = Math.max(0, Math.min(cards.length - 1, targetIndex));
        }

        snapToIndex(targetIndex);

        // Wrap position after animation settles (for infinite)
        if (isInfinite) {
            setTimeout(wrapPosition, 500);
        }
    }, [x, getOffset, itemWidth, isInfinite, cards.length, snapToIndex, wrapPosition]);

    // Auto-scroll
    useEffect(() => {
        if (isAutoscrolling && !isHovering && !isDraggingRef.current && !isScrollingRef.current) {
            const interval = setInterval(() => {
                const nextIndex = currentIndex + 1;
                if (!isInfinite && nextIndex >= cards.length) {
                    snapToIndex(0);
                } else {
                    snapToIndex(nextIndex);
                }

                // Wrap after each auto-scroll for infinite
                if (isInfinite) {
                    setTimeout(wrapPosition, 500);
                }
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [isAutoscrolling, isHovering, currentIndex, isInfinite, snapToIndex, cards.length, wrapPosition]);

    // Mouse Wheel / Trackpad Scrolling
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let scrollTimeout: NodeJS.Timeout;

        const onWheel = (e: WheelEvent) => {
            // Only handle if horizontal scrolling is dominant
            const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) * 0.5;
            if (!isHorizontal) return;

            e.preventDefault();
            isScrollingRef.current = true;
            setIsHovering(true);

            const currentX = x.get();
            let newX = currentX - e.deltaX;

            // Apply constraints if not infinite
            if (!isInfinite) {
                newX = Math.max(constraints.left, Math.min(constraints.right, newX));
            } else if (cards.length > 0) {
                // Instant wrap for infinite scroll during wheel
                const offset = getOffset();
                const setWidth = cards.length * itemWidth;
                const distFromCenter = offset - newX;
                const rawIndex = distFromCenter / itemWidth;
                const setOffset = Math.floor(rawIndex / cards.length);

                if (Math.abs(setOffset) >= 1) {
                    const wrapAmount = setOffset * setWidth;
                    newX = newX + wrapAmount;
                }
            }

            x.set(newX);

            // Debounce the snap
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrollingRef.current = false;

                const offset = getOffset();
                const approximateIndex = Math.round((offset - x.get()) / itemWidth);

                let targetIndex = approximateIndex;
                if (!isInfinite) {
                    targetIndex = Math.max(0, Math.min(cards.length - 1, targetIndex));
                }

                snapToIndex(targetIndex);

                // Wrap position for infinite
                if (isInfinite) {
                    setTimeout(wrapPosition, 500);
                }
            }, 150);
        };

        container.addEventListener("wheel", onWheel, { passive: false });

        return () => {
            container.removeEventListener("wheel", onWheel);
            clearTimeout(scrollTimeout);
        };
    }, [x, isInfinite, constraints, itemWidth, getOffset, cards.length, snapToIndex, wrapPosition]);

    // Measure height of cards
    useEffect(() => {
        if (!containerRef.current) return;

        const updateHeight = () => {
            const elements = containerRef.current?.querySelectorAll('[data-carousel-card]');
            if (!elements?.length) return;

            let maxH = 0;
            elements.forEach(el => {
                maxH = Math.max(maxH, el.getBoundingClientRect().height);
            });

            const isMobile = window.innerWidth < 768;
            const padding = isMobile ? 40 : 80;
            if (maxH > 0) setContainerHeight(maxH + padding);
        };

        updateHeight();

        const observer = new ResizeObserver(updateHeight);
        const elements = containerRef.current.querySelectorAll('[data-carousel-card]');
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [cards]);

    // Native scroll ref
    const nativeContainerRef = useRef<HTMLDivElement>(null);

    // Navigation handlers
    const scrollPrev = useCallback(() => {
        if (!highlightMiddle && nativeContainerRef.current) {
            const container = nativeContainerRef.current;
            const scrollAmount = itemWidth;
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            return;
        }

        const newIndex = currentIndex - 1;
        if (!isInfinite && newIndex < 0) return;
        snapToIndex(newIndex);
        if (isInfinite) setTimeout(wrapPosition, 500);
    }, [currentIndex, isInfinite, snapToIndex, wrapPosition, highlightMiddle, itemWidth]);

    const scrollNext = useCallback(() => {
        if (!highlightMiddle && nativeContainerRef.current) {
            const container = nativeContainerRef.current;
            const scrollAmount = itemWidth;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            return;
        }

        const newIndex = currentIndex + 1;
        if (!isInfinite && newIndex >= cards.length) return;
        snapToIndex(newIndex);
        if (isInfinite) setTimeout(wrapPosition, 500);
    }, [currentIndex, isInfinite, cards.length, snapToIndex, wrapPosition, highlightMiddle, itemWidth]);

    // Expose methods via ref
    React.useImperativeHandle(ref, () => ({
        scrollPrev,
        scrollNext
    }));

    if (!highlightMiddle) {
        return (
            <div
                className={cn("flex flex-col w-full group", className)}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <div
                    ref={nativeContainerRef}
                    className="flex w-full overflow-x-auto pb-4 hide-scrollbar"
                    style={{
                        gap: config.gap,
                        paddingLeft: config.gap,
                        paddingRight: config.gap,
                        scrollBehavior: 'smooth',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className={cn(
                                "shrink-0",
                                shadowOnHover && "hover:drop-shadow-2xl transition-all duration-300"
                            )}
                            style={{
                                width: config.width,
                            }}
                        >
                            {card}
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                {showNavigation && (
                    <div className="flex justify-center gap-4 mt-4 z-20">
                        <button
                            onClick={scrollPrev}
                            className="p-3 rounded-full bg-white border border-black text-black hover:bg-black hover:text-white transition-colors shadow-sm"
                            aria-label="Previous"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={scrollNext}
                            className="p-3 rounded-full bg-white border border-black text-black hover:bg-black hover:text-white transition-colors shadow-sm"
                            aria-label="Next"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            className={cn("flex flex-col w-full group", className)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div
                className={cn(
                    "relative w-full",
                    isDraggable ? "cursor-grab active:cursor-grabbing touch-none" : ""
                )}
                ref={containerRef}
                style={{ height: containerHeight }}
                onPointerDown={(e) => {
                    if (isDraggable) {
                        dragControls.start(e);
                    }
                }}
            >
                <motion.div
                    className="flex absolute left-0 top-0 h-full items-center"
                    style={{ x }}
                    drag={isDraggable ? "x" : false}
                    dragControls={dragControls}
                    dragListener={false}
                    dragConstraints={isInfinite ? undefined : constraints}
                    dragElastic={0.1}
                    dragTransition={{
                        power: 1 - friction,
                        timeConstant: 200
                    }}
                    onDragStart={() => {
                        setIsHovering(true);
                        isDraggingRef.current = true;
                    }}
                    onDragEnd={(e, info) => {
                        handleDragEnd(e, info);
                        setTimeout(() => {
                            isDraggingRef.current = false;
                        }, 50);
                    }}
                    onClickCapture={(e) => {
                        if (isDraggingRef.current) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }}
                >
                    {visibleIndices.map((virtualIndex, index) => {
                        // Calculate actual data index (handle negative indices)
                        const dataIndex = ((virtualIndex % cards.length) + cards.length) % cards.length;

                        // For highlightMiddle: check if this specific virtual position is centered
                        const isCenter = highlightMiddle && virtualIndex === visualCenterVirtualIndex;

                        // Determine if this is the first or last item in the visible list
                        const isFirst = index === 0;
                        const isLast = index === visibleIndices.length - 1;

                        return (
                            <motion.div
                                key={virtualIndex}
                                className={cn(
                                    "relative shrink-0",
                                    shadowOnHover && "hover:drop-shadow-2xl"
                                )}
                                style={{
                                    width: config.width,
                                    left: virtualIndex * itemWidth,
                                    position: 'absolute',
                                    paddingLeft: isFirst ? config.gap : 0,
                                    paddingRight: isLast ? config.gap : 0,
                                }}
                                data-carousel-card
                                animate={{
                                    scale: highlightMiddle ? (isCenter ? 1.1 : 0.9) : 1,
                                    zIndex: isCenter ? 10 : 0,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 30
                                }}
                            >
                                {cards[dataIndex]}
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

            {/* Navigation Buttons */}
            {showNavigation && (
                <div className="flex justify-center gap-4 mt-4 z-20">
                    <button
                        onClick={scrollPrev}
                        className="p-3 rounded-full bg-white border border-black text-black hover:bg-black hover:text-white transition-colors shadow-sm"
                        aria-label="Previous"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="p-3 rounded-full bg-white border border-black text-black hover:bg-black hover:text-white transition-colors shadow-sm"
                        aria-label="Next"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            )}
        </div>
    );
});

FlexibleCarousel.displayName = "FlexibleCarousel";
