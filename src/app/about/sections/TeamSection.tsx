"use client";
import React, { useRef, useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { OpenSection } from "@/components/layout/OpenSection";
import { cn } from "@/lib/utils";

import teamData from "@/data/team-data.json";

const ROTATIONS = [-6, 4, -3, 5, -5, 3, -4, 6, -2];

// Seeded shuffle for consistent randomization
const seededShuffle = <T,>(array: T[], seed: number): T[] => {
    const shuffled = [...array];
    let currentSeed = seed;

    const random = () => {
        currentSeed = (currentSeed * 9301 + 49297) % 233280;
        return currentSeed / 233280;
    };

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
};

const TEAM_MEMBERS_RAW = teamData.map((member, index) => ({
    id: index + 1,
    src: member.image,
    name: member.name,
    role: member.title,
    rotation: ROTATIONS[index % ROTATIONS.length],
    linkedin: member.linkedin,
    originalIndex: index // Keep original index for consistent coloring
}));

// Shuffle team members for visual variety while maintaining consistent coloring
const TEAM_MEMBERS = seededShuffle(TEAM_MEMBERS_RAW, 42);

// Ensure specific people lead the first three columns while keeping the rest of the order intact
const reorderTeamForLeadColumns = (items: typeof TEAM_MEMBERS) => {
    const desiredOrder = ["Rishabh Agnihotri", "Shail Daswani", "Mayank Lalwani"];
    const desiredSet = new Set(desiredOrder);

    // Pick desired members in order, then append the remaining in their original order
    const leading = desiredOrder
        .map((name) => items.find((member) => member.name === name))
        .filter(Boolean) as typeof TEAM_MEMBERS;

    const remaining = items.filter((member) => !desiredSet.has(member.name));
    return [...leading, ...remaining];
};

const moveNamesToEnd = (items: typeof TEAM_MEMBERS, namesToMove: string[]) => {
    const endSet = new Set(namesToMove);
    const keep = items.filter((member) => !endSet.has(member.name));
    const moved = namesToMove
        .map((name) => items.find((member) => member.name === name))
        .filter(Boolean) as typeof TEAM_MEMBERS;
    return [...keep, ...moved];
};

const swapMembers = (items: typeof TEAM_MEMBERS, nameA: string, nameB: string) => {
    const next = [...items];
    const indexA = next.findIndex((member) => member.name === nameA);
    const indexB = next.findIndex((member) => member.name === nameB);
    if (indexA === -1 || indexB === -1) return next;
    [next[indexA], next[indexB]] = [next[indexB], next[indexA]];
    return next;
};

const moveMemberToMiddle = (items: typeof TEAM_MEMBERS, name: string) => {
    const next = [...items];
    const fromIndex = next.findIndex((member) => member.name === name);
    if (fromIndex === -1) return next;
    const [member] = next.splice(fromIndex, 1);
    const middleIndex = Math.floor(next.length / 2);
    next.splice(middleIndex, 0, member);
    return next;
};

const TEAM_MEMBERS_ORDERED = (() => {
    // Keep previous ordering rules and then apply explicit placement requests.
    let items = reorderTeamForLeadColumns(TEAM_MEMBERS).filter(
        (member) => member.name !== "Nikhil Khandave"
    );
    items = moveNamesToEnd(items, ["Nayan S K"]);
    items = swapMembers(items, "Dhiram Shah", "Vidyuth Sridhar");
    items = swapMembers(items, "Srinandh Gosala", "Pratik Kulkarni");
    items = moveMemberToMiddle(items, "Srinandh Gosala");
    return items;
})();

const BACKGROUND_COLORS = [
    "var(--color-forest-green)",
    "var(--color-ground-brown)",
    "var(--color-brick-red)",
    "var(--color-night-violet)",
];

const HEADING_COLORS = [
    "var(--color-brand-pink)",
    "var(--color-brand-orange)",
    "var(--color-brand-yellow)",
    "var(--color-brand-cyan)",
];

const ROLE_COLORS = [
    "var(--color-pastel-pink)",
    "var(--color-pastel-orange)",
    "var(--color-pastel-yellow)",
    "var(--color-pastel-cyan)",
];

// Pastel backgrounds matching the card background colors
const PASTEL_BG_COLORS = [
    "var(--color-pastel-green)",    // matches forest-green
    "var(--color-pastel-brown)",    // matches ground-brown
    "var(--color-pastel-red)",      // matches brick-red
    "var(--color-pastel-violet)",   // matches night-violet
];

// Lag configuration - center columns move less, outer columns move more
// Higher values = more dramatic parallax effect
const BASE_LAG = 0.30; // Base vertical movement for center column
const LAG_SCALE = 0.12; // Additional movement per column from center

const PolaroidCard = ({
    src,
    name,
    role,
    className,
    style,
    rotation = 0,
    index = 0,
    linkedin,
}: {
    src: string;
    name: string;
    role: string;
    className?: string;
    style?: React.CSSProperties;
    rotation?: number;
    index?: number;
    linkedin?: string;
}) => {
    const bgColor = BACKGROUND_COLORS[index % BACKGROUND_COLORS.length];
    const headingColor = HEADING_COLORS[index % HEADING_COLORS.length];
    const roleColor = ROLE_COLORS[index % ROLE_COLORS.length];
    const imageBgColor = PASTEL_BG_COLORS[index % PASTEL_BG_COLORS.length];

    const Component = linkedin ? 'a' : 'div';
    const linkProps = linkedin ? {
        href: linkedin,
        target: "_blank",
        rel: "noopener noreferrer"
    } : {};

    return (
        <Component
            {...linkProps}
            className={cn(
                "relative p-2.5 shadow-lg transition-transform hover:scale-105 hover:z-10 duration-300 ease-out rounded-[12px] block cursor-pointer",
                className
            )}
            style={{
                transform: `rotate(${rotation}deg)`,
                backgroundColor: bgColor,
                ...style,
            }}
        >
            <div
                className="relative aspect-[4/5] w-full overflow-hidden rounded-[10px] mb-3"
                style={{ backgroundColor: imageBgColor }}
            >
                <div className="relative w-full h-full">
                    <Image
                        src={src}
                        alt={name}
                        fill
                        className={cn(
                            "object-cover rounded-[8px]",
                            (name === "Rishabh Agnihotri" || name === "Purva Jadhav") && "scale-x-[-1]"
                        )}
                    />
                </div>
            </div>
            <div className="text-center px-0.5">
                <h4
                    className="font-heading text-sm font-bold mb-0. pb-2"
                    style={{ color: headingColor }}
                >
                    {name.includes('Balasubramanyam') ? (
                        <>Abhimanyu Balasubraman<wbr />yam</>
                    ) : (
                        name
                    )}
                </h4>
                <p
                    className="font-zin text-sm leading-tight pb-2"
                    style={{ color: roleColor }}
                >
                    {role}
                </p>
            </div>
        </Component>
    );
};

// Hook to get current column count based on breakpoints
const useColumnCount = () => {
    const [columnCount, setColumnCount] = useState(4);

    useEffect(() => {
        const updateColumnCount = () => {
            if (window.innerWidth < 768) {
                setColumnCount(2);
            } else if (window.innerWidth < 1024) {
                setColumnCount(3);
            } else {
                setColumnCount(4);
            }
        };

        updateColumnCount();
        window.addEventListener('resize', updateColumnCount);
        return () => window.removeEventListener('resize', updateColumnCount);
    }, []);

    return columnCount;
};

// Group items into columns for parallax effect
const useGroupedColumns = (items: typeof TEAM_MEMBERS, columnCount: number) => {
    return useMemo(() => {
        const columns: (typeof TEAM_MEMBERS)[] = Array.from({ length: columnCount }, () => []);

        items.forEach((item, index) => {
            const columnIndex = index % columnCount;
            columns[columnIndex].push(item);
        });

        // Calculate lag for each column based on distance from center
        const mid = (columnCount - 1) / 2;

        return columns.map((column, colIndex) => {
            const distance = Math.abs(colIndex - mid);
            const lag = BASE_LAG + distance * LAG_SCALE;
            return { items: column, lag, colIndex };
        });
    }, [items, columnCount]);
};

// Individual column with its own parallax effect
const ParallaxGridColumn = ({
    items,
    lag,
    colIndex,
    scrollYProgress,
}: {
    items: typeof TEAM_MEMBERS;
    lag: number;
    colIndex: number;
    scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) => {
    // Create a unique vertical offset based on the lag
    // Outer columns move more, center moves less - creates depth effect
    const startOffset = colIndex % 2 === 0 ? 80 : 0;

    const yOffset = useTransform(
        scrollYProgress,
        [0, 1],
        [`${startOffset}px`, `${-lag * 1200}px`]
    );

    // Stagger initial offset for visual variety
    const initialOffset = [0, 100, 50, 120][colIndex % 4];

    return (
        <motion.div
            style={{ y: yOffset }}
            className="flex flex-col gap-12 md:gap-16"
        >
            <div style={{ height: initialOffset }} className="shrink-0" />
            {items.map((member) => {
                return (
                    <PolaroidCard
                        key={member.id}
                        {...member}
                        index={member.originalIndex}
                        className="w-full max-w-[200px] mx-auto"
                    />
                );
            })}
        </motion.div>
    );
};

export const TeamSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const columnCount = useColumnCount();
    const groupedColumns = useGroupedColumns(TEAM_MEMBERS_ORDERED, columnCount);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    return (
        <OpenSection className="bg-ground-brown/2 min-h-screen overflow-hidden pt-16 pb-4">
            <div className="container mx-auto" ref={containerRef}>
                <div className="text-center mb-16 md:mb-24">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#F3F1EB] text-sm font-medium text-primary-black/60 mb-6">
                        About / <span className="text-primary-black">Team</span>
                    </span>
                    <h2 className="text-5xl md:text-7xl font-bold font-heading leading-[1.1] tracking-tight text-text-main">
                    The people<br /><span className="font-zin-italic font-light italic">behind the scenes</span>
                    </h2>
                </div>

                {/* Grid container with dynamic columns */}
                <div
                    className="grid gap-6 md:gap-12 lg:gap-16 max-w-7xl mx-auto -mb-64"
                    style={{
                        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                    }}
                >
                    {groupedColumns.map(({ items, lag, colIndex }) => (
                        <ParallaxGridColumn
                            key={colIndex}
                            items={items}
                            lag={lag}
                            colIndex={colIndex}
                            scrollYProgress={scrollYProgress}
                        />
                    ))}
                </div>
            </div>
        </OpenSection>
    );
};
