"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper } from "./ui/SectionWrapper";
import { SlideUp } from "./ui/TextReveal";
import type { GettingStartedContent } from "@/lib/secured/types";

/* ── iPhone 14 Pro Frame (Figma asset layers) ── */
const FRAME = "/assets/illustrations/iphone-frame";

function IPhoneFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: "335 / 682" }}>
      {/* Bezel (phone body) */}
      <div className="absolute" style={{ inset: "0 0.46% 0 0.68%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/bezel.svg`} />
      </div>
      <div className="absolute" style={{ inset: "0 0.46% 0 0.68%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/bezel-stroke.svg`} />
      </div>

      {/* Glass (screen backing) */}
      <div className="absolute" style={{ inset: "0.67% 1.82% 0.67% 2.05%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/glass.svg`} />
      </div>
      <div className="absolute" style={{ inset: "0.67% 1.82% 0.67% 2.05%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/glass-stroke.svg`} />
      </div>

      {/* Speaker */}
      <div className="absolute" style={{ inset: "0.73% 39.64% 98.94% 39.41%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/speaker.svg`} />
      </div>
      <div className="absolute" style={{ inset: "0.67% 39.52% 98.88% 39.29%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/speaker-stroke.svg`} />
      </div>

      {/* Screen content area */}
      <div
        className="absolute overflow-hidden"
        style={{ inset: "2.02% 4.56% 2.02% 4.78%", borderRadius: "10.5% / 5.2%" }}
      >
        {children}
      </div>

      {/* Buttons */}
      <div className="absolute" style={{ inset: "28.33% 0 60.58% 99.32%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/buttons-right.svg`} />
      </div>
      <div className="absolute" style={{ inset: "20.04% 99.09% 55.66% 0" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/buttons-left.svg`} />
      </div>

      {/* Antenna */}
      <div className="absolute" style={{ inset: "0.11% 0.68% 0.11% 0.91%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/antenna.svg`} />
      </div>

      {/* Dynamic Island */}
      <div className="absolute" style={{ inset: "3.58% 36.22% 92.16% 35.99%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/dynamic-island.svg`} />
      </div>
    </div>
  );
}

/* ── Screen swipe animation variants ── */
const screenVariants = {
  enter: { x: "100%", opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
};

export function GettingStarted({ data }: { data: GettingStartedContent }) {
  const STEPS = data.steps;
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardScrollRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Sync horizontal card scroll when activeStep changes on mobile
  useEffect(() => {
    if (!isMobile || !cardScrollRef.current) return;
    const container = cardScrollRef.current;
    const cardWidth = container.offsetWidth;
    container.scrollTo({ left: activeStep * cardWidth, behavior: "smooth" });
  }, [activeStep, isMobile]);

  const handleScroll = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const scrollableDistance = section.scrollHeight - window.innerHeight;
    const scrolled = -rect.top;
    const totalProgress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

    const stepCount = STEPS.length;
    const rawStep = totalProgress * stepCount;
    const currentStep = Math.min(Math.floor(rawStep), stepCount - 1);
    setActiveStep(currentStep);
  }, [STEPS.length]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div ref={sectionRef} data-section="how-it-works" style={{ height: `${STEPS.length * 100}vh` }}>
      <section
        className="sticky top-0 overflow-hidden bg-[#131313]"
        style={{ height: "100vh" }}
      >
        {/* Background circle decorations — centered, flipped horizontally */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
          style={{ width: 1025, height: 1025 }}
          aria-hidden="true"
        >
          <Image
            src="/assets/backgrounds/gettingstarted-bg.svg"
            alt=""
            fill
            className="object-contain -scale-x-100 -scale-y-100 rotate-90"
          />
        </div>

        <div className="flex h-full flex-col">
          {/* === MOBILE LAYOUT (< lg) === */}
          <div className="flex flex-1 flex-col lg:hidden">
            <SectionWrapper className="relative z-10 flex flex-1 flex-col justify-center">
              {/* Header */}
              <div className="text-center">
                <SlideUp>
                  <p
                    className="text-sm leading-[1.6] tracking-[-0.32px] text-[#737373] md:text-base"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    {data.sectionLabel}
                  </p>
                </SlideUp>
                <h2 className="mx-auto mt-3 max-w-[850px] font-display text-[28px] leading-[1.4] tracking-[-0.5px] text-white md:mt-4 md:text-[34px]">
                  {data.heading}
                </h2>
              </div>

              {/* Phone mockup with iPhone frame */}
              <div className="mt-6 flex flex-col items-center gap-5">
                <IPhoneFrame className="w-[180px]">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={activeStep}
                      variants={screenVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={STEPS[activeStep].phone}
                        alt={`Step ${activeStep + 1}`}
                        width={608}
                        height={1309}
                        className="h-full w-full object-cover object-top"
                      />
                    </motion.div>
                  </AnimatePresence>
                </IPhoneFrame>

                {/* Horizontal scrolling cards */}
                <div
                  ref={cardScrollRef}
                  className="no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto"
                  style={{ scrollbarWidth: "none" }}
                >
                  {STEPS.map((step, i) => (
                    <div
                      key={i}
                      className="w-full flex-shrink-0 snap-center px-4"
                    >
                      <div
                        className={`w-full px-5 py-4 transition-colors duration-300 ${
                          activeStep === i
                            ? "rounded-2xl bg-[#202020]"
                            : ""
                        }`}
                        style={{
                          boxShadow:
                            activeStep === i
                              ? "0px 78px 47px rgba(0,0,0,0.05), 0px 35px 35px rgba(0,0,0,0.09), 0px 9px 19px rgba(0,0,0,0.1)"
                              : "none",
                        }}
                      >
                        <p
                          className={`font-body text-sm leading-6 ${
                            activeStep === i
                              ? "text-[#ff9a6d]"
                              : "text-[#8a8a8a]"
                          }`}
                        >
                          {step.number}. {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionWrapper>
          </div>

          {/* === DESKTOP LAYOUT (lg+) === */}
          <div className="relative z-10 mx-auto hidden h-full w-full max-w-[1200px] px-6 lg:flex lg:items-center xl:max-w-[1320px] 2xl:max-w-[1536px] 3xl:max-w-[1800px] 4xl:max-w-[2200px] 5xl:max-w-[3200px]">
            <div className="flex w-full items-center justify-between gap-16">
              {/* Left — heading */}
              <div className="flex w-[376px] flex-shrink-0 flex-col gap-4 3xl:w-[460px] 4xl:w-[560px] 5xl:w-[760px]">
                <p
                  className="text-base leading-[1.6] tracking-[-0.32px] text-[#737373] 3xl:text-lg 4xl:text-xl 5xl:text-2xl"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  {data.sectionLabel}
                </p>
                <h2 className="font-display text-[32px] leading-[1.5] tracking-[-0.704px] text-white xl:text-[36px] 2xl:text-[40px] 3xl:text-[48px] 4xl:text-[60px] 5xl:text-[80px]">
                  {data.heading}
                </h2>
              </div>

              {/* Center — iPhone mockup */}
              <IPhoneFrame className="w-[335px] flex-shrink-0 3xl:w-[400px] 4xl:w-[500px] 5xl:w-[680px]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={activeStep}
                    variants={screenVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={STEPS[activeStep].phone}
                      alt={`Step ${activeStep + 1}`}
                      width={608}
                      height={1309}
                      className="h-full w-full object-cover object-top"
                    />
                  </motion.div>
                </AnimatePresence>
              </IPhoneFrame>

              {/* Right — step list */}
              <div className="flex w-[376px] flex-shrink-0 flex-col gap-2 3xl:w-[460px] 4xl:w-[560px] 5xl:w-[760px]">
                {STEPS.map((step, i) => (
                  <div
                    key={i}
                    className={`px-8 py-4 transition-all duration-300 ${
                      activeStep === i
                        ? "rounded-2xl bg-[#202020]"
                        : ""
                    }`}
                    style={{
                      boxShadow:
                        activeStep === i
                          ? "0px 78px 47px rgba(0,0,0,0.05), 0px 35px 35px rgba(0,0,0,0.09), 0px 9px 19px rgba(0,0,0,0.1)"
                          : "none",
                    }}
                  >
                    <ol
                      className={`list-decimal font-body text-base leading-6 transition-colors duration-300 3xl:text-lg 4xl:text-xl 5xl:text-2xl ${
                        activeStep === i
                          ? "text-[#ff9a6d]"
                          : "text-[#8a8a8a]"
                      }`}
                      start={step.number}
                    >
                      <li className="ms-6">
                        <span>{step.description}</span>
                      </li>
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
