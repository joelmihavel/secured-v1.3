"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type PastelColor = "brown" | "violet" | "green" | "orange" | "pink" | "cyan" | "red" | "yellow";

interface BaseButtonProps {
    variant?: "primary" | "primary-rounded" | "secondary" | "white" | "ghost" | "outline";
    size?: "sm" | "md" | "lg";
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children?: React.ReactNode;
    pastelColor?: PastelColor;
    className?: string;
}

interface ButtonAsButton extends BaseButtonProps, Omit<HTMLMotionProps<"button">, keyof BaseButtonProps> {
    href?: never;
}

interface ButtonAsLink extends BaseButtonProps, Omit<HTMLMotionProps<"a">, keyof BaseButtonProps> {
    href: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", leftIcon, rightIcon, children, pastelColor, href, ...props }, ref) => {
        const variants = {
            primary: "bg-black text-white border border-white shadow-[-3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[-1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[-3px] active:translate-y-[3px]",
            "primary-rounded": "bg-black text-white border-2 border-text-main rounded-full shadow-[0px_4px_0px_0px_rgba(21,16,46,1)] hover:shadow-[0px_2px_0px_0px_rgba(21,16,46,1)] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]",
            secondary: "bg-black text-white border-none hover:bg-gray-900 rounded-full",
            white: "bg-white text-black border-none hover:bg-gray-100 letter-spacing-[0.1em]",
            ghost: "bg-transparent text-text-main hover:bg-ground-brown/5 rounded-full",
            outline: "bg-transparent text-text-main border border-text-main hover:bg-text-main/5",
        };

        // Pastel color mapping
        const pastelColors: Record<PastelColor, string> = {
            brown: "pastel-brown",
            violet: "pastel-violet",
            green: "pastel-green",
            orange: "pastel-orange",
            pink: "pastel-pink",
            cyan: "pastel-cyan",
            red: "pastel-red",
            yellow: "pastel-yellow",
        };

        // Build pastel styles dynamically when pastelColor is provided
        const pastelStyle = pastelColor ? (
            variant === "secondary" ? {
                // Secondary variant: pastel background with black text, no border
                backgroundColor: `var(--color-${pastelColors[pastelColor]})`,
                color: `var(--color-text-main)`,
            } : {
                // Primary variants: pastel background with black border and text-main
                backgroundColor: `var(--color-${pastelColors[pastelColor]})`,
                borderColor: `var(--color-text-main)`,
                color: `var(--color-text-main)`,
            }
        ) : (variant === "primary" || variant === "primary-rounded" || variant === "secondary") ? {
            // Primary and secondary variants without pastelColor: white text (and white border for primary)
            color: `white`,
            ...(variant === "primary" || variant === "primary-rounded" ? { borderColor: `white` } : {}),
        } : undefined;

        const sizes = {
            sm: "px-2 py-1.5 text-button-link",
            md: "px-3 py-3 text-button-link",
            lg: "px-4 py-4 text-button-link",
        };

        const iconSizes = {
            sm: "w-4 h-4 [&>svg]:w-4 [&>svg]:h-4",
            md: "w-5 h-5 [&>svg]:w-5 [&>svg]:h-5",
            lg: "w-6 h-6 [&>svg]:w-6 [&>svg]:h-6",
        };

        const iconGap = {
            sm: "gap-1.5",
            md: "gap-2",
            lg: "gap-2.5",
        };

        const commonProps = {
            whileHover: { scale: 1.02, y: -2 },
            whileTap: { scale: 0.98, y: 0 },
            className: cn(
                "inline-flex items-center justify-center font-bold transition-colors duration-200 cursor-pointer font-heading tracking-wide whitespace-nowrap",
                variant === "primary-rounded" ? "rounded-full" : "rounded-r-[1rem]",
                pastelColor && variant === "secondary" ? "" : variants[variant],
                sizes[size],
                iconGap[size],
                className
            ),
            ...(pastelStyle && { style: pastelStyle }),
        };

        const content = (
            <>
                {leftIcon && (
                    <span className={cn("flex items-center justify-center flex-shrink-0", iconSizes[size])}>
                        {leftIcon}
                    </span>
                )}
                {children && <span className="flex-shrink-0">{children}</span>}
                {rightIcon && (
                    <span className={cn("flex items-center justify-center flex-shrink-0", iconSizes[size])}>
                        {rightIcon}
                    </span>
                )}
            </>
        );

        if (href) {
            return (
                <motion.a
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    href={href}
                    {...commonProps}
                    {...(props as Omit<HTMLMotionProps<"a">, keyof BaseButtonProps>)}
                >
                    {content}
                </motion.a>
            );
        }

        return (
            <motion.button
                ref={ref as React.Ref<HTMLButtonElement>}
                {...commonProps}
                {...(props as Omit<HTMLMotionProps<"button">, keyof BaseButtonProps>)}
            >
                {content}
            </motion.button>
        );
    }
);

Button.displayName = "Button";
