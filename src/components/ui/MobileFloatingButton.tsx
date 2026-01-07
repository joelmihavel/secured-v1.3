"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

export const MobileFloatingButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling a bit
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <div className="pointer-events-auto shadow-2xl rounded-full">
                        <Button
                            href="https://apps.apple.com/in/app/secured-by-flent/id6757275258"
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="primary-rounded"
                            size="md"
                            className="bg-black text-white px-6 py-3 font-bold text-sm shadow-xl"
                        >
                            Get the app
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

