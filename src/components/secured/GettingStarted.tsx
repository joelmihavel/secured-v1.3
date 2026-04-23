"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap, ScrollTrigger } from "./useGSAP";
import { Floating, RupeeCoin, ShieldShape } from "./FloatingElements";
import { SectionWrapper } from "./ui/SectionWrapper";
import type { GettingStartedContent } from "@/lib/secured/types";

const FRAME = "/assets/illustrations/iphone-frame";

function IPhoneFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: "335 / 682" }}>
      <div className="absolute" style={{ inset: "0 0.46% 0 0.68%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/bezel.svg`} />
      </div>
      <div className="absolute" style={{ inset: "0 0.46% 0 0.68%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/bezel-stroke.svg`} />
      </div>
      <div className="absolute" style={{ inset: "0.67% 1.82% 0.67% 2.05%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/glass.svg`} />
      </div>
      <div className="absolute" style={{ inset: "0.67% 1.82% 0.67% 2.05%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/glass-stroke.svg`} />
      </div>
      <div className="absolute" style={{ inset: "0.73% 39.64% 98.94% 39.41%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/speaker.svg`} />
      </div>
      <div className="absolute" style={{ inset: "0.67% 39.52% 98.88% 39.29%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/speaker-stroke.svg`} />
      </div>
      <div className="absolute overflow-hidden" style={{ inset: "2.02% 4.56% 2.02% 4.78%", borderRadius: "10.5% / 5.2%" }}>
        {children}
      </div>
      <div className="absolute" style={{ inset: "28.33% 0 60.58% 99.32%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/buttons-right.svg`} />
      </div>
      <div className="absolute" style={{ inset: "20.04% 99.09% 55.66% 0" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/buttons-left.svg`} />
      </div>
      <div className="absolute" style={{ inset: "0.11% 0.68% 0.11% 0.91%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/antenna.svg`} />
      </div>
      <div className="absolute" style={{ inset: "3.58% 36.22% 92.16% 35.99%" }}>
        <img alt="" className="absolute block h-full w-full" src={`${FRAME}/dynamic-island.svg`} />
      </div>
    </div>
  );
}

const screenVariants = {
  enter: { x: "100%", opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
};

export function GettingStarted({ data }: { data: GettingStartedContent }) {
  const STEPS = data.steps;
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !pinnedRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: pinnedRef.current,
      scrub: 0.5,
      onUpdate: (self) => {
        setProgress(self.progress);
        const step = Math.min(
          Math.floor(self.progress * STEPS.length),
          STEPS.length - 1
        );
        setActiveStep(step);
      },
    });

    return () => trigger.kill();
  }, [STEPS.length]);

  return (
    <div
      ref={containerRef}
      data-section="how-it-works"
      className="relative bg-[#131313]"
      style={{ height: `${STEPS.length * 100}vh` }}
    >
      <div
        ref={pinnedRef}
        className="relative flex h-screen w-full overflow-hidden"
      >
        {/* Background circle decorations */}
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

        {/* Floating elements */}
        <Floating className="left-[5%] top-[30%] hidden lg:block" speed={0.6} blur={5}>
          <RupeeCoin size={36} />
        </Floating>
        <Floating className="right-[5%] bottom-[30%] hidden lg:block" speed={0.8} direction="down" blur={4}>
          <ShieldShape size={44} />
        </Floating>

        {/* === MOBILE LAYOUT === */}
        <div className="flex flex-1 flex-col lg:hidden">
          <SectionWrapper className="relative z-10 flex flex-1 flex-col justify-center">
            <div className="text-center">
              <p
                className="text-sm leading-[1.6] tracking-[-0.32px] text-[#737373] md:text-base"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                {data.sectionLabel}
              </p>
              <h2 className="mx-auto mt-3 max-w-[850px] font-display text-[28px] leading-[1.2] tracking-[-1px] text-white md:mt-4 md:text-[34px]">
                {data.heading}
              </h2>
            </div>

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

              {/* Step indicator */}
              <div className="flex w-full max-w-[400px] flex-col gap-2 px-4">
                {STEPS.map((step, i) => (
                  <div
                    key={i}
                    className={`rounded-xl px-5 py-3 transition-all duration-300 ${
                      activeStep === i ? "bg-[#1a1a1a] border border-[#282828]" : ""
                    }`}
                  >
                    <p
                      className={`text-sm leading-6 transition-colors duration-300 ${
                        activeStep === i ? "text-[#ff9a6d]" : "text-[#555]"
                      }`}
                      style={{ fontFamily: "var(--font-ui)" }}
                    >
                      {step.number}. {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </SectionWrapper>
        </div>

        {/* === DESKTOP LAYOUT === */}
        <div className="relative z-10 mx-auto hidden h-full w-full max-w-[1200px] px-6 lg:flex lg:items-center xl:max-w-[1320px]">
          <div className="flex w-full items-center justify-between gap-16">
            {/* Left — heading + steps */}
            <div className="flex w-[400px] flex-shrink-0 flex-col gap-6">
              <div>
                <p
                  className="text-base leading-[1.6] tracking-[-0.32px] text-[#737373]"
                  style={{ fontFamily: "var(--font-ui)" }}
                >
                  {data.sectionLabel}
                </p>
                <h2 className="mt-3 font-display text-[36px] leading-[1.15] tracking-[-1.5px] text-white xl:text-[44px]">
                  {data.heading}
                </h2>
              </div>

              <div className="flex flex-col gap-2">
                {STEPS.map((step, i) => (
                  <div
                    key={i}
                    className={`rounded-xl px-6 py-4 transition-all duration-400 ${
                      activeStep === i
                        ? "bg-[#1a1a1a] border border-[#282828]"
                        : "border border-transparent"
                    }`}
                  >
                    <p
                      className={`text-[15px] leading-[1.6] transition-colors duration-300 ${
                        activeStep === i ? "text-[#ff9a6d]" : "text-[#555]"
                      }`}
                      style={{ fontFamily: "var(--font-ui)" }}
                    >
                      <span className="font-semibold">{step.number}.</span> {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — iPhone mockup */}
            <IPhoneFrame className="w-[300px] flex-shrink-0 xl:w-[335px]">
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
          </div>
        </div>
      </div>
    </div>
  );
}
