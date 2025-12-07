"use client";
import { cn } from "@/lib/utils";
import React, { useRef, createContext, useContext, useState } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    PanInfo,
    animate,
} from "framer-motion";

// Context to share container ref with all cards
const DraggableContainerContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null);

export const DraggableCardBody = ({
    className,
    children,
    style,
    onSwipeAway,
    enableSwipeAway = false,
    onDragStartCallback,
}: {
    className?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    onSwipeAway?: (direction: 'left' | 'right') => void;
    enableSwipeAway?: boolean;
    onDragStartCallback?: () => void;
}) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const cardRef = useRef<HTMLDivElement>(null);
    const [isExiting, setIsExiting] = useState(false);

    // Motion values for drag position (used for swipe-away animation)
    const dragX = useMotionValue(0);
    const dragRotate = useTransform(dragX, [-200, 200], [-15, 15]);

    // Get the container ref from context for constraints (desktop only)
    const containerRef = useContext(DraggableContainerContext);

    const springConfig = {
        stiffness: 100,
        damping: 20,
        mass: 0.5,
    };

    const rotateX = useSpring(
        useTransform(mouseY, [-300, 300], [25, -25]),
        springConfig,
    );
    const rotateY = useSpring(
        useTransform(mouseX, [-300, 300], [-25, 25]),
        springConfig,
    );

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isExiting) return;
        const { clientX, clientY } = e;
        const { width, height, left, top } =
            cardRef.current?.getBoundingClientRect() ?? {
                width: 0,
                height: 0,
                left: 0,
                top: 0,
            };
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;
        mouseX.set(deltaX);
        mouseY.set(deltaY);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        document.body.style.cursor = "default";

        if (enableSwipeAway && onSwipeAway) {
            const swipeThreshold = 100;
            const velocityThreshold = 500;

            // Check if card was swiped away (by distance OR velocity)
            const isSwipedByDistance = Math.abs(info.offset.x) > swipeThreshold;
            const isSwipedByVelocity = Math.abs(info.velocity.x) > velocityThreshold;

            if (isSwipedByDistance || isSwipedByVelocity) {
                const direction = info.offset.x > 0 ? 'right' : 'left';
                const exitX = direction === 'right' ? 500 : -500;

                setIsExiting(true);

                // Animate the card off-screen
                animate(dragX, exitX, {
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    onComplete: () => {
                        onSwipeAway(direction);
                    }
                });
                return;
            }
        }

        // Reset position if not swiped away
        if (enableSwipeAway) {
            animate(dragX, 0, {
                type: "spring",
                stiffness: 500,
                damping: 30,
            });
        }
    };

    return (
        <motion.div
            ref={cardRef}
            layout={!enableSwipeAway}
            drag={enableSwipeAway ? "x" : true}
            dragConstraints={enableSwipeAway ? undefined : (containerRef ?? undefined)}
            dragElastic={enableSwipeAway ? 1 : 0.28}
            dragMomentum={false}
            onDragStart={() => {
                document.body.style.cursor = "grabbing";
                onDragStartCallback?.();
            }}
            onDrag={enableSwipeAway ? (_, info) => {
                dragX.set(info.offset.x);
            } : undefined}
            onDragEnd={handleDragEnd}
            style={{
                x: enableSwipeAway ? dragX : undefined,
                rotate: enableSwipeAway ? dragRotate : undefined,
                rotateX: enableSwipeAway ? 0 : rotateX,
                rotateY: enableSwipeAway ? 0 : rotateY,
                opacity: isExiting ? 0.8 : 1,
                willChange: "transform",
                ...style,
            }}
            whileHover={enableSwipeAway ? undefined : { scale: 1.02 }}
            whileDrag={{ scale: 1.05 }}
            onMouseMove={enableSwipeAway ? undefined : handleMouseMove}
            onMouseLeave={enableSwipeAway ? undefined : handleMouseLeave}
            className={cn(
                "relative min-h-96 w-80 overflow-hidden rounded-xl bg-white p-6 cursor-grab active:cursor-grabbing",
                className,
            )}
        >
            {children}
        </motion.div>
    );
};

export const DraggableCardContainer = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <DraggableContainerContext.Provider value={containerRef}>
            <div
                ref={containerRef}
                className={cn("[perspective:3000px]", className)}
            >
                {children}
            </div>
        </DraggableContainerContext.Provider>
    );
};
