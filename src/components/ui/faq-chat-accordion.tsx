"use client";

import * as React from "react";
import { motion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { IconMinus as Minus, IconPlus as Plus } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface FAQItem {
    id: number;
    question: string;
    answer: string;
    icon?: string;
    iconPosition?: "left" | "right";
}

interface FaqAccordionProps {
    data: FAQItem[];
    className?: string;
    timestamp?: string;
    questionClassName?: string;
    answerClassName?: string;
}

export function FaqAccordion({
    data,
    className,
    timestamp = "Every day, 9:01 AM",
    questionClassName,
    answerClassName,
}: FaqAccordionProps) {
    const [openItem, setOpenItem] = React.useState<string | null>(null);

    return (
        <div className={cn("p-4", className)}>
            {timestamp && (
                <div className="mb-4 text-sm text-muted-foreground">{timestamp}</div>
            )}

            <Accordion.Root
                type="single"
                collapsible
                value={openItem || ""}
                onValueChange={(value) => setOpenItem(value)}
            >
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.08,
                            },
                        },
                    }}
                >
                    {data.map((item, index) => (
                        <motion.div
                            key={item.id}
                            variants={{
                                hidden: { opacity: 0, y: 20, scale: 0.95 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    transition: {
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                    },
                                },
                            }}
                        >
                            <Accordion.Item
                                value={item.id.toString()}
                                className="mb-2"
                            >
                                <Accordion.Header>
                                    <Accordion.Trigger className="flex w-full items-center justify-start gap-x-4">
                                        <div
                                            className={cn(
                                                "relative flex items-center space-x-2 rounded-t-xl rounded-bl-none rounded-br-xl p-2 transition-colors",
                                                openItem === item.id.toString()
                                                    ? "bg-primary/20 text-primary"
                                                    : "bg-muted hover:bg-primary/10",
                                                questionClassName
                                            )}
                                        >
                                            {item.icon && (
                                                <span
                                                    className={cn(
                                                        "absolute bottom-6",
                                                        item.iconPosition === "right" ? "right-0" : "left-0"
                                                    )}
                                                    style={{
                                                        transform: item.iconPosition === "right"
                                                            ? "rotate(7deg)"
                                                            : "rotate(-4deg)",
                                                    }}
                                                >
                                                    {item.icon}
                                                </span>
                                            )}
                                            <span className="font-medium text-left">{item.question}</span>
                                        </div>

                                        <span
                                            className={cn(
                                                "text-muted-foreground",
                                                openItem === item.id.toString() && "text-primary"
                                            )}
                                        >
                                            {openItem === item.id.toString() ? (
                                                <Minus className="h-5 w-5" />
                                            ) : (
                                                <Plus className="h-5 w-5" />
                                            )}
                                        </span>
                                    </Accordion.Trigger>
                                </Accordion.Header>
                                <Accordion.Content asChild forceMount>
                                    <motion.div
                                        initial="collapsed"
                                        animate={openItem === item.id.toString() ? "open" : "collapsed"}
                                        variants={{
                                            open: { opacity: 1, height: "auto" },
                                            collapsed: { opacity: 0, height: 0 },
                                        }}
                                        transition={{ duration: 0.4 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="ml-7 my-4 md:ml-16">
                                            <div
                                                className={cn(
                                                    "relative max-w-xs rounded-t-2xl rounded-bl-xl bg-night-violet px-4 py-2 text-primary-foreground text-subtitle",
                                                    answerClassName
                                                )}
                                            >
                                                {item.answer}
                                            </div>
                                        </div>
                                    </motion.div>
                                </Accordion.Content>
                            </Accordion.Item>
                        </motion.div>
                    ))}
                </motion.div>
            </Accordion.Root>
        </div>
    );
}
