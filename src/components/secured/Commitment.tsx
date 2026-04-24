"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { SectionWrapper } from "./ui/SectionWrapper";
import { FadeIn } from "./ui/FadeIn";
import { WordReveal, SlideUp } from "./ui/TextReveal";
import { ICON_COMPONENTS } from "./AnimatedCardIcons";
import type { CommitmentContent } from "@/lib/secured/types";

function ScribbleUnderline() {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-60px" });

  return (
    <svg
      ref={ref}
      className="absolute -bottom-1 left-0 w-full"
      viewBox="0 0 148.598 13.9972"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
    >
      <motion.path
        d="M18.0334 0.75H134.658L0.033393 6.75H148.533L73.2834 13.25"
        stroke="#FF9A6D"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
    </svg>
  );
}

const CARD_DETAILS: Record<string, { topLabel: string; label: string; heading: string; description: string }> = {
  cashback: {
    topLabel: "REWARDS • EVERY MONTH",
    label: "Cashback",
    heading: "Earn cashback every time you pay rent",
    description: "Every rent payment earns you real cashback. No gimmicks, no points — actual money back, every single month.",
  },
  "zero-deposit": {
    topLabel: "INSIGHTS • REAL-TIME",
    label: "Rent insights",
    heading: "Know if you're overpaying",
    description: "See how your rent compares to others in your area. Real data from real tenants, so you always know where you stand.",
  },
  "renter-profile": {
    topLabel: "PROFILE • VERIFIED",
    label: "Renter profile",
    heading: "Build a profile that actually matters",
    description: "Your rent payments build a verified renter profile. Better track record means better homes and lower deposits over time.",
  },
  "better-homes": {
    topLabel: "ACCESS • PROGRESSIVE",
    label: "Unlock more",
    heading: "Unlock better homes over time",
    description: "The longer you use Secured, the more you unlock — premium listings, reduced deposits, and priority access to new homes.",
  },
  "vacancy-cover": {
    topLabel: "COVERAGE • AUTOMATIC",
    label: "Vacancy cover",
    heading: "Get paid even when your home is empty",
    description: "If your tenant leaves, you still get paid. Secured covers vacancy months so your rental income never stops.",
  },
  "tenant-exit": {
    topLabel: "PROTECTION • 45 DAYS",
    label: "Exit protection",
    heading: "Protection from sudden exits",
    description: "Sudden tenant exits cost you months of income. Secured absorbs the shock so you don't have to.",
  },
  verification: {
    topLabel: "SCREENING • ZERO COST",
    label: "Verification",
    heading: "Zero-cost tenant verification",
    description: "Every tenant is verified before they move in — background, employment, and rental history. At no cost to you.",
  },
  growth: {
    topLabel: "DASHBOARD • ALL-IN-ONE",
    label: "Control",
    heading: "Better control over rental income",
    description: "Track payments, manage tenants, and protect your income — all from one place. Your property, your terms.",
  },
};

function BenefitCard({ text, iconKey, index }: { text: string; iconKey: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-40px" });
  const Icon = ICON_COMPONENTS[iconKey];
  const details = CARD_DETAILS[iconKey];

  return (
    <motion.div
      ref={ref}
      className="group relative flex h-full flex-col overflow-hidden border-r border-white/[0.06] last:border-r-0 md:[&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r md:border-b md:border-white/[0.06] md:last:border-b-0 md:[&:nth-child(3)]:border-b-0 lg:border-b-0"
      style={{
        background: "linear-gradient(180deg, #141414 0%, #121212 100%)",
      }}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Subtle radial glow in illustration area */}
      <div
        className="pointer-events-none absolute left-1/2 top-[28%] h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full md:h-[300px] md:w-[300px]"
        style={{ background: "radial-gradient(circle, rgba(255,154,109,0.03) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* 1. Top category label */}
      {details && (
        <div className="relative z-[1] px-5 pt-5 md:px-6 md:pt-6 3xl:px-8 3xl:pt-7 4xl:px-10 4xl:pt-8 5xl:px-12 5xl:pt-10">
          <span
            className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#606060] md:text-[10px] 3xl:text-[11px] 4xl:text-xs 5xl:text-sm"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {details.topLabel}
          </span>
        </div>
      )}

      {/* 2. Illustration area — big open space */}
      <div className="relative z-[1] flex items-center justify-center px-4 py-10 md:px-5 md:py-14 lg:px-4 lg:py-12 3xl:px-6 3xl:py-16 4xl:px-8 4xl:py-20 5xl:px-10 5xl:py-28"
        style={{ minHeight: "280px" }}
      >
        <div className="mx-auto h-[180px] w-full max-w-[320px] md:h-[220px] lg:h-[240px] 3xl:h-[300px] 4xl:h-[360px] 5xl:h-[480px]">
          {Icon && isInView && <Icon className="h-full w-full" />}
        </div>
      </div>

      {/* 3. Large empty gap — breathing room */}
      <div className="flex-1" />

      {/* 4. Content area — pushed to bottom */}
      <div className="relative z-[1] flex flex-col px-5 md:px-6 3xl:px-8 4xl:px-10 5xl:px-12">
        {/* Solid label tag */}
        {details && (
          <span
            className="mb-4 inline-flex w-fit items-center gap-2 rounded-[5px] bg-[#ff9a6d] px-3.5 py-[6px] text-[11px] font-semibold tracking-[0.01em] text-[#131313] md:mb-5 md:px-4 md:py-[7px] md:text-[12px] 3xl:text-[13px] 4xl:text-sm 5xl:text-base"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="opacity-60 3xl:w-4 3xl:h-4 4xl:w-5 4xl:h-5 5xl:w-6 5xl:h-6">
              <circle cx="8" cy="8" r="5.5" stroke="#131313" strokeWidth="1.3" />
              <line x1="4" y1="8" x2="12" y2="8" stroke="#131313" strokeWidth="1" />
              <line x1="4.5" y1="6" x2="11.5" y2="6" stroke="#131313" strokeWidth="0.8" />
              <line x1="5" y1="10" x2="11" y2="10" stroke="#131313" strokeWidth="0.8" />
            </svg>
            {details.label}
          </span>
        )}

        {/* Heading */}
        <h3
          className="font-display text-[21px] leading-[1.2] tracking-[-0.4px] text-white md:text-[24px] lg:text-[24px] 3xl:text-[28px] 4xl:text-[34px] 5xl:text-[46px]"
        >
          {details?.heading ?? text}
        </h3>

        <div className="h-6 md:h-8 3xl:h-10 4xl:h-12 5xl:h-14" />
      </div>
    </motion.div>
  );
}

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
      className="w-[1693px] overflow-hidden py-4 md:py-6 xl:w-[2200px] 2xl:w-[2800px] 3xl:w-[3400px] 4xl:w-[4200px] 5xl:w-[5600px]"
      style={{ transform: `rotate(${rotate})`, backgroundColor: bg }}
    >
      <motion.div className="flex gap-6 whitespace-nowrap md:gap-10" style={{ x }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <span key={i} className="font-display text-base leading-[1.5] text-white md:text-xl 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl">
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function Commitment({ data, variant = "tenant" }: { data: CommitmentContent; variant?: "tenant" | "landlord" }) {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: marqueeRef,
    offset: ["start end", "end start"],
  });

  return (
    <div className="relative overflow-hidden bg-[#131313]">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]" aria-hidden="true">
        <Image
          src="/assets/backgrounds/commitment-bg.svg"
          alt=""
          width={1400}
          height={934}
          className="h-auto w-[1400px] max-w-none"
        />
      </div>

      <SectionWrapper className="relative z-10 py-8 md:py-20">
        <div className="text-center">
          <FadeIn>
            <div className="mx-auto mb-6 w-[200px] md:mb-8 md:w-[280px] 3xl:w-[340px] 4xl:w-[420px] 5xl:w-[560px]">
              <Image
                src={variant === "landlord" ? "/assets/illustrations/commitment-house-landlord.svg" : "/assets/illustrations/commitment-house.svg"}
                alt=""
                width={280}
                height={200}
                aria-hidden="true"
                className="mx-auto"
              />
            </div>
          </FadeIn>

          <h2 className="mx-auto mt-3 max-w-[715px] font-display text-[28px] leading-[1.4] tracking-[-0.5px] text-white md:mt-4 md:text-[34px] lg:text-[40px] lg:leading-[1.5] lg:tracking-[-0.88px] xl:max-w-[850px] xl:text-[48px] 2xl:text-[52px] 3xl:max-w-[1050px] 3xl:text-[60px] 4xl:max-w-[1400px] 4xl:text-[72px] 5xl:max-w-[1800px] 5xl:text-[96px]">
            <WordReveal delay={0.1}>{data.heading}</WordReveal>
          </h2>

          <SlideUp delay={0.3} className="mt-3 md:mt-4">
            <p
              className="mx-auto max-w-[700px] text-base leading-7 text-[#999] md:text-xl md:leading-8 xl:max-w-[800px] xl:text-[22px] xl:leading-9 3xl:max-w-[1000px] 3xl:text-[26px] 3xl:leading-10 4xl:max-w-[1300px] 4xl:text-[32px] 4xl:leading-[48px] 5xl:max-w-[1800px] 5xl:text-[44px] 5xl:leading-[64px]"
              style={{ fontFamily: "var(--font-ui)", whiteSpace: "pre-line" }}
            >
              {data.description}
            </p>
          </SlideUp>
        </div>

        {/* Card grid — flush cards with shared borders */}
        <div className="relative mt-10 overflow-visible md:mt-16 -mx-6 md:-mx-12 lg:-mx-[40px]">
          {/* Crosshair accents at grid corners and column intersections */}
          <div className="pointer-events-none absolute inset-0 z-[4]" aria-hidden="true" style={{ overflow: "visible" }}>
            {/* Top edge: left, 25%, 50%, 75%, right */}
            {[0, 25, 50, 75, 100].map((left) => (
              <span key={`t${left}`} className="absolute hidden lg:block" style={{ top: 0, left: `${left}%`, transform: "translate(-50%, -50%)" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="3xl:w-6 3xl:h-6 4xl:w-7 4xl:h-7 5xl:w-9 5xl:h-9">
                  <line x1="10" y1="0" x2="10" y2="20" stroke="#ff9a6d" strokeWidth="0.5" opacity="0.35" />
                  <line x1="0" y1="10" x2="20" y2="10" stroke="#ff9a6d" strokeWidth="0.5" opacity="0.35" />
                  <circle cx="10" cy="10" r="1.8" fill="#ff9a6d" opacity="0.5" />
                </svg>
              </span>
            ))}
            {/* Bottom edge: left, 25%, 50%, 75%, right */}
            {[0, 25, 50, 75, 100].map((left) => (
              <span key={`b${left}`} className="absolute hidden lg:block" style={{ bottom: 0, left: `${left}%`, transform: "translate(-50%, 50%)" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="3xl:w-6 3xl:h-6 4xl:w-7 4xl:h-7 5xl:w-9 5xl:h-9">
                  <line x1="10" y1="0" x2="10" y2="20" stroke="#ff9a6d" strokeWidth="0.5" opacity="0.35" />
                  <line x1="0" y1="10" x2="20" y2="10" stroke="#ff9a6d" strokeWidth="0.5" opacity="0.35" />
                  <circle cx="10" cy="10" r="1.8" fill="#ff9a6d" opacity="0.5" />
                </svg>
              </span>
            ))}
          </div>

          {/* Full-width top and bottom lines */}
          <div className="absolute top-0 left-1/2 z-[1] h-px w-screen -translate-x-1/2 bg-white/[0.06]" />
          <div className="absolute bottom-0 left-1/2 z-[1] h-px w-screen -translate-x-1/2 bg-white/[0.06]" />

          {/* Card grid — no top/bottom border, only side borders between cards */}
          <div className="grid grid-cols-1 items-stretch border-x border-white/[0.06] md:grid-cols-2 lg:grid-cols-4">
            {data.benefitCards.map((card, i) => (
              <BenefitCard key={i} text={card.text} iconKey={card.iconKey} index={i} />
            ))}
          </div>

          {/* Single continuous bottom accent bar */}
          <div
            className="h-[4px] w-full md:h-[5px] 3xl:h-1.5 4xl:h-2 5xl:h-2.5"
            style={{ background: "linear-gradient(90deg, #ff9a6d 0%, #CC7B57 100%)" }}
          />
        </div>
      </SectionWrapper>

      <div ref={marqueeRef} className="relative mt-10 flex flex-col items-center gap-0 overflow-hidden md:mt-[64px]">
        <ScrollMarquee text={data.marqueeText1} rotate="0.22deg" bg="#1a1a1a" direction="left" scrollYProgress={scrollYProgress} />
        <ScrollMarquee text={data.marqueeText2} rotate="-0.48deg" bg="#202020" direction="right" scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
}
