"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { SectionWrapper } from "./ui/SectionWrapper";
import { Button } from "./ui/Button";
import { WordReveal, SlideUp } from "./ui/TextReveal";
import { ICON_COMPONENTS } from "./AnimatedCardIcons";
import type { CreditCardContent } from "@/lib/secured/types";

function FeatureCard({ text, iconKey, index }: { text: string; iconKey: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-40px" });
  const Icon = ICON_COMPONENTS[iconKey];

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
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-[35%] h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full md:h-[260px] md:w-[260px]"
        style={{ background: "radial-gradient(circle, rgba(255,154,109,0.03) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* Illustration area */}
      <div className="relative z-[1] flex items-center justify-center px-4 py-8 md:px-6 md:py-12 3xl:px-8 3xl:py-14 4xl:px-10 4xl:py-18 5xl:px-14 5xl:py-24"
        style={{ minHeight: "220px" }}
      >
        <div className="mx-auto h-[140px] w-full max-w-[280px] md:h-[170px] 3xl:h-[210px] 4xl:h-[260px] 5xl:h-[340px]">
          {Icon && isInView && <Icon className="h-full w-full" />}
        </div>
      </div>

      {/* Spacer to push text to bottom */}
      <div className="flex-1" />

      {/* Text area */}
      <div className="relative z-[1] px-5 pb-6 md:px-6 md:pb-8 3xl:px-8 3xl:pb-10 4xl:px-10 4xl:pb-12 5xl:px-14 5xl:pb-14">
        <h3
          className="font-display text-[21px] leading-[1.2] tracking-[-0.4px] text-white md:text-[24px] 3xl:text-[28px] 4xl:text-[34px] 5xl:text-[46px]"
        >
          {text}
        </h3>
      </div>
    </motion.div>
  );
}

export function CreditCard({ data }: { data: CreditCardContent }) {
  return (
    <section className="relative bg-[#131313] py-8 md:pb-[120px] md:pt-[120px]">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden="true">
        <Image
          src="/assets/backgrounds/creditcard-ellipses.svg"
          alt=""
          width={1534}
          height={767}
          className="h-auto w-[1534px] max-w-none"
        />
      </div>

      <SectionWrapper className="relative z-10">
        <div className="text-center">
          <h2 className="mx-auto max-w-[582px] font-display text-[28px] leading-[1.4] tracking-[-0.5px] text-white md:text-[34px] lg:text-[40px] lg:leading-[1.5] lg:tracking-[-0.88px] xl:max-w-[700px] xl:text-[48px] 2xl:text-[52px] 3xl:max-w-[900px] 3xl:text-[60px] 4xl:max-w-[1200px] 4xl:text-[72px] 5xl:max-w-[1600px] 5xl:text-[96px]">
            <WordReveal>{data.heading}</WordReveal>
          </h2>

          <SlideUp delay={0.3} className="mt-3">
            <p
              className="text-base leading-[1.6] text-[#999] md:text-xl 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              {data.subheading}
            </p>
          </SlideUp>
        </div>

        {/* Card grid — flush, shared borders */}
        <div className="relative mt-10 overflow-visible md:mt-14 -mx-6 md:-mx-12 lg:-mx-[40px]">
          {/* Crosshair accents at grid corners */}
          <div className="pointer-events-none absolute inset-0 z-[4]" aria-hidden="true" style={{ overflow: "visible" }}>
            {[0, 25, 50, 75, 100].map((left) => (
              <span key={`t${left}`} className="absolute hidden lg:block" style={{ top: 0, left: `${left}%`, transform: "translate(-50%, -50%)" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="3xl:w-6 3xl:h-6 4xl:w-7 4xl:h-7 5xl:w-9 5xl:h-9">
                  <line x1="10" y1="0" x2="10" y2="20" stroke="#ff9a6d" strokeWidth="0.5" opacity="0.35" />
                  <line x1="0" y1="10" x2="20" y2="10" stroke="#ff9a6d" strokeWidth="0.5" opacity="0.35" />
                  <circle cx="10" cy="10" r="1.8" fill="#ff9a6d" opacity="0.5" />
                </svg>
              </span>
            ))}
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

          {/* Grid */}
          <div className="grid grid-cols-1 items-stretch border-x border-white/[0.06] md:grid-cols-2 lg:grid-cols-4">
            {data.featureCards.map((card, i) => (
              <FeatureCard key={i} text={card.text} iconKey={card.iconKey} index={i} />
            ))}
          </div>

          {/* Continuous bottom accent bar */}
          <div
            className="h-[4px] w-full md:h-[5px] 3xl:h-1.5 4xl:h-2 5xl:h-2.5"
            style={{ background: "linear-gradient(90deg, #ff9a6d 0%, #CC7B57 100%)" }}
          />
        </div>

        {/* CTA */}
        <div className="mx-auto mt-10 max-w-[480px] text-center md:mt-16 3xl:max-w-[580px] 4xl:max-w-[720px] 5xl:max-w-[960px]">
          <Button fullWidth onClick={() => document.getElementById("download-app")?.scrollIntoView({ behavior: "smooth" })}>{data.ctaButtonText}</Button>
          {data.ctaDisclaimer && (
            <p
              className="mt-3 text-center text-xs leading-[1.8] tracking-[-0.24px] text-[#aaa] 3xl:text-sm 4xl:text-base 5xl:text-lg"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              {data.ctaDisclaimer}
            </p>
          )}
        </div>
      </SectionWrapper>
    </section>
  );
}
