"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva } from "class-variance-authority"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
    variant?: "default" | "pill" | "bar"
}>({
    variant: "default",
})

const Tabs = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
        variant?: "default" | "pill" | "bar"
    }
>(({ className, variant = "default", ...props }, ref) => (
    <TabsContext.Provider value={{ variant }}>
        <TabsPrimitive.Root
            ref={ref}
            className={cn(className)}
            {...props}
        />
    </TabsContext.Provider>
))
Tabs.displayName = TabsPrimitive.Root.displayName

const tabsListVariants = cva(
    "inline-flex items-center justify-center",
    {
        variants: {
            variant: {
                default: "h-10 rounded-md bg-muted text-muted-foreground",
                pill: " rounded-full bg-white border border-border pb-2 pt-1 pl-2 pr-1",
                bar: "w-full justify-start bg-transparent p-0 h-auto",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

const TabsList = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.List>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
    const { variant } = React.useContext(TabsContext)
    return (
        <TabsPrimitive.List
            ref={ref}
            className={cn(tabsListVariants({ variant }), className)}
            {...props}
        />
    )
})
TabsList.displayName = TabsPrimitive.List.displayName

const tabsTriggerVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap text-fluid-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "rounded-sm px-3 py-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
                pill: "rounded-full p-4 py-2 md:px-6 text-gray-600 hover:text-gray-900 data-[state=active]:bg-black data-[state=active]:text-white text-fluid-sm data-[state=active]:border border-white data-[state=active]:shadow-[-3px_3px_0px_0px_rgba(0,0,0,1)] w-32 md:w-40 truncate",
                bar: "rounded-none border-b-2 border-transparent px-4 py-2 text-muted-foreground hover:text-foreground data-[state=active]:border-black data-[state=active]:text-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

// Motion variants for each tab style
const getMotionProps = (variant?: "default" | "pill" | "bar", isActive?: boolean) => {
    switch (variant) {
        case "pill":
            return {
                whileHover: { scale: 1 },
                whileTap: { scale: 0.95 },
                animate: isActive
                    ? { scale: 1, y: 0 }
                    : { scale: 1, y: 0 },
                transition: {
                    type: "spring" as const,
                    stiffness: 400,
                    damping: 17
                }
            }
        case "bar":
            return {
                whileHover: { y: -2 },
                whileTap: { y: 0 },
                transition: {
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 20
                }
            }
        default:
            return {
                whileHover: { scale: 1 },
                whileTap: { scale: 0.98 },
                transition: {
                    type: "spring" as const,
                    stiffness: 400,
                    damping: 17
                }
            }
    }
}

const TabsTrigger = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
    const { variant } = React.useContext(TabsContext)
    const [isActive, setIsActive] = React.useState(false)

    return (
        <TabsPrimitive.Trigger
            ref={ref}
            className={cn(tabsTriggerVariants({ variant }), className)}
            asChild
            onMouseEnter={() => setIsActive(true)}
            onMouseLeave={() => setIsActive(false)}
            {...props}
        >
            <motion.button
                type="button"
                {...getMotionProps(variant, isActive)}
            >
                {props.children}
            </motion.button>
        </TabsPrimitive.Trigger>
    )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
    React.ElementRef<typeof TabsPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className
        )}
        {...props}
    />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
