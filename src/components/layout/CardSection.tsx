import React from "react";
import { cn } from "@/lib/utils";

type PaddingSize = 'none' | 'small' | 'large';

interface CardSectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
    backgroundPattern?: string;
    paddingX?: PaddingSize;
    paddingY?: PaddingSize;
    patternOpacity?: number;
    patternMask?: 'to-bottom' | 'to-top' | 'none';
}

const paddingXMap: Record<PaddingSize, string> = {
    none: 'px-0',
    small: 'px-4 md:px-6',
    large: 'px-4 sm:px-8 lg:px-12',
};

const paddingYMap: Record<PaddingSize, string> = {
    none: 'py-0',
    small: 'py-4 md:py-6',
    large: 'py-8 md:py-16',
};

export const CardSection = ({
    children,
    className,
    id,
    backgroundPattern,
    paddingX = 'large',
    paddingY = 'large',
    patternOpacity = 0.1,
    patternMask = 'none',
}: CardSectionProps) => {
    const maskImage = patternMask === 'to-bottom'
        ? 'linear-gradient(to bottom, transparent 40%, black 60%)'
        : patternMask === 'to-top'
            ? 'linear-gradient(to top, transparent 40%, black 60%)'
            : undefined;

    return (
        <section className="py-8 bg-bg-white relative" id={id}>
            <div
                className={cn(
                    "max-w-[95vw] mx-auto rounded-2xl md:rounded-[4rem] relative overflow-hidden shadow-sm",
                    paddingXMap[paddingX],
                    paddingYMap[paddingY],
                    className
                )}
            >
                {backgroundPattern && (
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: `url('${backgroundPattern}')`,
                            opacity: patternOpacity,
                            maskImage: maskImage,
                            WebkitMaskImage: maskImage,
                            backgroundRepeat: 'repeat',
                        }}
                    />
                )}
                <div className="relative z-10 w-full h-full">
                    {children}
                </div>
            </div>
        </section>
    );
};
