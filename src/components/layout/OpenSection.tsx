import React from "react";
import { cn } from "@/lib/utils";

interface OpenSectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
    style?: React.CSSProperties;
}

export const OpenSection = ({ children, className, id, style }: OpenSectionProps) => {
    return (
        <section
            className={cn("relative w-full max-w-[100vw] mx-auto overflow-hidden", className)}
            id={id}
            style={style}
        >
            {children}
        </section>
    );
};
