"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap, ScrollTrigger } from "./useGSAP";
import { Floating, RupeeCoin, ShieldShape, HouseShape, StairShape } from "./FloatingElements";
import type { CommitmentContent } from "@/lib/secured/types";

function ScrollMarquee({
  text,
  rotate,
  bg,
  direction,
  scrollYProgress,
}: {
  text: string;
  rotate: string;
  bg: string;
  direction: "left" | "right";
  scrollYProgress: import("framer-motion").MotionValue<number>;
}) {
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "left" ? ["0%", "-30%"] : ["-30%", "0%"]
  );

  return (
    <div
      className="w-[1693px] overflow-hidden py-4 md:py-6 xl:w-[2200px] 2xl:w-[2800px]"
      style={{ transform: `rotate(${rotate})`, backgroundColor: bg }}
    >
      <motion.div className="flex gap-6 whitespace-nowrap md:gap-10" style={{ x }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <span key={i} className="font-display text-base leading-[1.5] text-white md:text-xl">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function Commitment({ data, variant = "tenant" }: { data: CommitmentContent; variant?: "tenant" | "landlord" }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const marqueeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: marqueeRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    if (!containerRef.current || !pinnedRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: pinnedRef.current,
      scrub: 0.6,
      onUpdate: (self) => setProgress(self.progress),
    });

    return () => trigger.kill();
  }, []);

  const headingOpacity = Math.min(1, progress * 4);
  const headingY = Math.max(0, (1 - progress * 3) * 60);
  const descOpacity = Math.min(1, Math.max(0, (progress - 0.15) * 4));
  const descY = Math.max(0, (1 - (progress - 0.15) * 3) * 40);

  const cards = data.benefitCards;
  const cardProgress = (i: number) => {
    const start = 0.25 + i * 0.12;
    const p = Math.min(1, Math.max(0, (progress - start) * 5));
    return p;
  };

  return (
    <div className="relative bg-[#131313]">
      {/* Scroll container — 300vh gives scroll runway */}
      <div ref={containerRef} style={{ height: "300vh" }}>
        <div
          ref={pinnedRef}
          className="relative flex h-screen w-full items-center justify-center overflow-hidden"
        >
          {/* Floating decorative elements */}
          <Floating className="left-[5%] top-[15%] hidden md:block" speed={0.8} blur={4}>
            <RupeeCoin size={48} />
          </Floating>
          <Floating className="right-[8%] top-[20%] hidden md:block" speed={1.2} direction="down" blur={2}>
            <ShieldShape size={56} />
          </Floating>
          <Floating className="left-[12%] bottom-[20%] hidden md:block" speed={0.6} blur={6} rotate={15}>
            <StairShape size={64} />
          </Floating>
          <Floating className="right-[10%] bottom-[25%] hidden md:block" speed={1} blur={3}>
            <HouseShape size={52} />
          </Floating>
          <Floating className="left-[30%] top-[10%] hidden lg:block" speed={0.5} blur={8}>
            <RupeeCoin size={32} />
          </Floating>
          <Floating className="right-[25%] bottom-[15%] hidden lg:block" speed={0.7} direction="down" blur={7}>
            <RupeeCoin size={40} />
          </Floating>

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-[900px] px-6 text-center xl:max-w-[1000px]">
            {/* Subtitle */}
            <p
              className="text-xs uppercase tracking-[0.2em] text-[#666] md:text-sm"
              style={{
                fontFamily: "var(--font-ui)",
                opacity: headingOpacity,
                transform: `translateY(${headingY + 20}px)`,
              }}
            >
              {data.subtitle}
            </p>

            {/* Heading */}
            <h2
              className="mx-auto mt-4 max-w-[700px] font-display text-[32px] leading-[1.1] tracking-[-1.5px] text-white md:text-[48px] lg:text-[56px] xl:text-[64px]"
              style={{
                opacity: headingOpacity,
                transform: `translateY(${headingY}px)`,
              }}
            >
              {data.heading}
            </h2>

            {/* Description */}
            <p
              className="mx-auto mt-5 max-w-[600px] text-base leading-[1.7] text-[#797979] md:text-lg"
              style={{
                fontFamily: "var(--font-ui)",
                opacity: descOpacity,
                transform: `translateY(${descY}px)`,
              }}
            >
              {data.description}
            </p>

            {/* Benefit cards — staggered reveal */}
            <div className="mx-auto mt-10 grid max-w-[700px] grid-cols-2 gap-4 md:mt-14 md:gap-5">
              {cards.map((text, i) => {
                const p = cardProgress(i);
                return (
                  <div
                    key={i}
                    className="group relative overflow-hidden rounded-2xl border border-[#282828] bg-[#1a1a1a] p-5 text-left transition-colors duration-300 hover:border-[#ff9a6d]/30 md:p-7"
                    style={{
                      opacity: p,
                      transform: `translateY(${(1 - p) * 30}px) scale(${0.95 + p * 0.05})`,
                    }}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#ff9a6d]/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff9a6d]/10 md:h-10 md:w-10">
                      <svg className="h-4 w-4 text-[#ff9a6d] md:h-5 md:w-5" viewBox="0 0 20 20" fill="none">
                        <path d="M10 2L2 7V13L10 18L18 13V7L10 2Z" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <p
                      className="text-sm leading-[1.6] text-[#b0b0b0] md:text-[15px]"
                      style={{ fontFamily: "var(--font-ui)" }}
                    >
                      {text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Radial gradient background glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 50% 40%, rgba(255,154,109,0.04) 0%, transparent 60%)",
              opacity: progress > 0.1 ? 1 : 0,
              transition: "opacity 0.5s",
            }}
          />
        </div>
      </div>

      {/* Marquee banners */}
      <div ref={marqueeRef} className="relative flex flex-col items-center gap-0 overflow-hidden">
        <ScrollMarquee text={data.marqueeText1} rotate="0.22deg" bg="#1a1a1a" direction="left" scrollYProgress={scrollYProgress} />
        <ScrollMarquee text={data.marqueeText2} rotate="-0.48deg" bg="#202020" direction="right" scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
}
