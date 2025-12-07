"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { OpenSection } from "@/components/layout/OpenSection";
import { cn } from "@/lib/utils";

import teamData from "@/data/team-data.json";

const ROTATIONS = [-6, 4, -3, 5, -5, 3, -4, 6, -2];

const TEAM_MEMBERS = teamData.map((member, index) => ({
    id: index + 1,
    src: member.image,
    name: member.name,
    role: member.title,
    rotation: ROTATIONS[index % ROTATIONS.length],
    linkedin: member.linkedin
}));

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
                "relative p-2.5 shadow-lg transition-transform hover:scale-105 hover:z-10 duration-300 ease-out rounded-[12px] max-w-[200px] block cursor-pointer",
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
                        className="object-cover rounded-[8px]"
                    />
                </div>
            </div>
            <div className="text-center px-0.5">
                <h4
                    className="font-heading text-sm font-bold mb-0. pb-2"
                    style={{ color: headingColor }}
                >
                    {name}
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

const ParallaxColumn = ({
    children,
    y,
    className,
}: {
    children: React.ReactNode;
    y: MotionValue<string>;
    className?: string;
}) => {
    return (
        <motion.div style={{ y }} className={cn("flex flex-col gap-12", className)}>
            {children}
        </motion.div>
    );
};

export const TeamSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
    const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
    const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

    return (
        <OpenSection className="bg-[#FDFCF8] min-h-screen overflow-hidden py-12">
            <div className="container mx-auto px-4 md:px-6 " ref={containerRef}>
                <div className="text-center mb-24">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#F3F1EB] text-sm font-medium text-primary-black/60 mb-6">
                        About / <span className="text-primary-black">Team</span>
                    </span>
                    <h2 className="text-5xl md:text-7xl font-bold font-heading leading-[1.1] tracking-tight text-text-main">
                        The People<br /><span className="font-zin font-light italic">Behind the scenes.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16 max-w-7xl mx-auto -mb-80">
                    <ParallaxColumn y={y1} className="pt-0">
                        {TEAM_MEMBERS.slice(0, 6).map((member, i) => (
                            <PolaroidCard
                                key={member.id}
                                {...member}
                                index={i}
                                className="w-full"
                            />
                        ))}
                    </ParallaxColumn>
                    <ParallaxColumn y={y2} className="pt-16">
                        {TEAM_MEMBERS.slice(6, 11).map((member, i) => (
                            <PolaroidCard
                                key={member.id}
                                {...member}
                                index={i + 6}
                                className="w-full"
                            />
                        ))}
                    </ParallaxColumn>
                    <ParallaxColumn y={y3} className="pt-8">
                        {TEAM_MEMBERS.slice(11, 16).map((member, i) => (
                            <PolaroidCard
                                key={member.id}
                                {...member}
                                index={i + 11}
                                className="w-full"
                            />
                        ))}
                    </ParallaxColumn>
                    <ParallaxColumn y={y1} className="pt-20">
                        {TEAM_MEMBERS.slice(16, 21).map((member, i) => (
                            <PolaroidCard
                                key={member.id}
                                {...member}
                                index={i + 16}
                                className="w-full"
                            />
                        ))}
                    </ParallaxColumn>
                </div>
            </div>
        </OpenSection>
    );
};
