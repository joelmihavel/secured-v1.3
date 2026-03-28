"use client";

import { motion } from "framer-motion";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({ children, className = "", id }: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`mx-auto w-full max-w-[1200px] px-6 xl:max-w-[1320px] 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] 5xl:max-w-[3200px] ${className}`}
    >
      {children}
    </motion.section>
  );
}
