"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { WordReveal, SlideUp } from "./ui/TextReveal";
import type { TrustContent } from "@/lib/secured/types";

function TrustPoint({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-20px" });

  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-2.5 3xl:gap-3 4xl:gap-4 5xl:gap-5"
      initial={{ opacity: 0, y: 8 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
    >
      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#ff9a6d]/10 3xl:h-6 3xl:w-6 4xl:h-7 4xl:w-7 5xl:h-9 5xl:w-9">
        <svg className="w-3 h-3 3xl:w-3.5 3xl:h-3.5 4xl:w-4 4xl:h-4 5xl:w-5 5xl:h-5" viewBox="0 0 12 12" fill="none">
          <motion.path
            d="M2.5 6L5 8.5L9.5 3.5"
            stroke="#ff9a6d"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
          />
        </svg>
      </div>
      <span
        className="text-[13px] leading-[1.4] text-[#aaa] md:text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl"
        style={{ fontFamily: "var(--font-ui)" }}
      >
        {text}
      </span>
    </motion.div>
  );
}

export function TrustSection({ data }: { data: TrustContent }) {
  return (
    <section className="relative bg-[#131313] py-10 md:py-16">
      <div className="mx-auto w-full px-6 md:px-12 lg:px-[200px]">
        {/* Heading + description */}
        <div className="text-center">
          <h2 className="font-display text-[28px] leading-[1.3] tracking-[-0.5px] text-white md:text-[34px] lg:text-[40px] xl:text-[48px] 3xl:text-[60px] 4xl:text-[72px] 5xl:text-[96px]">
            <WordReveal>{data.heading}</WordReveal>
          </h2>

          <SlideUp delay={0.2} className="mt-3 md:mt-4">
            <p
              className="mx-auto max-w-[600px] text-base leading-[1.7] text-[#888] md:text-lg xl:max-w-[700px] 3xl:max-w-[900px] 3xl:text-xl 4xl:max-w-[1200px] 4xl:text-2xl 5xl:max-w-[1600px] 5xl:text-3xl"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              {data.description}
            </p>
          </SlideUp>
        </div>

        {/* Trust bar — horizontal row */}
        <SlideUp delay={0.4} className="mt-8 md:mt-10">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8 lg:gap-12 3xl:gap-14 4xl:gap-16 5xl:gap-20">
            {data.points.map((point, i) => (
              <TrustPoint key={i} text={point} index={i} />
            ))}
          </div>
        </SlideUp>
      </div>
    </section>
  );
}
