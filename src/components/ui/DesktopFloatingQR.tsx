"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export const DesktopFloatingQR = () => {
    return (
        <motion.div
            className="hidden md:flex fixed bottom-8 right-8 z-50 flex-col items-center bg-white p-4 rounded-3xl shadow-2xl border border-gray-100"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
        >
            <div className="text-sm font-bold text-center mb-3 text-text-main">Get the app</div>
            <a 
                href="https://apps.apple.com/in/app/secured-by-flent/id6757275258" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white rounded-xl overflow-hidden w-28 h-28 relative block transition-transform hover:scale-105 cursor-pointer"
            >
                <Image
                    src="/secure-lotties/AppDownloadAssets/AppDownload_QR.png"
                    alt="Get the app"
                    fill
                    className="object-cover"
                />
            </a>
        </motion.div>
    );
};

