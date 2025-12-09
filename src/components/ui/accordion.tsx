"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { IconChevronDown as ChevronDown } from "@tabler/icons-react"
import { motion, HTMLMotionProps } from "framer-motion"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
    <AccordionPrimitive.Item
        ref={ref}
        className={cn("", className)}
        {...props}
    />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
            ref={ref}
            className={cn(
                "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                className,
            )}
            {...props}
        >
            {children}
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className="overflow-hidden text-sm"
        {...props}
        asChild
        forceMount
    >
        <AccordionContentMotion>
            <div className={cn("pb-4 pt-0", className)}>{children}</div>
        </AccordionContentMotion>
    </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

const AccordionContentMotion = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
    const { "data-state": dataState, ...rest } = props as { "data-state"?: string } & HTMLMotionProps<"div">
    return (
        <motion.div
            ref={ref}
            initial="closed"
            animate={dataState}
            variants={{
                open: { height: "auto", opacity: 1 },
                closed: { height: 0, opacity: 0 },
            }}
            transition={{ duration: 0.2 }}
            {...rest}
        >
            {children}
        </motion.div>
    )
})
AccordionContentMotion.displayName = "AccordionContentMotion"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
