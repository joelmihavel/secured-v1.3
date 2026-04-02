"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";
import { SectionWrapper } from "./ui/SectionWrapper";
import { FadeIn } from "./ui/FadeIn";
import { WordReveal, SlideUp } from "./ui/TextReveal";
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

function AnimatedHouseIllustration() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-40px" });

  return (
    <div ref={ref} className="relative mx-auto w-full" style={{ aspectRatio: "256.57 / 149.85" }} aria-hidden="true">
      {/* Base illustration */}
      <Image
        src="/assets/illustrations/commitment-house-full.svg"
        alt=""
        fill
        className="object-contain"
      />

      {/* Moon — gentle float */}
      <motion.img
        src="/assets/illustrations/commitment-moon.svg"
        alt=""
        className="absolute object-contain"
        style={{ left: "35.15%", top: "12.08%", width: "8.61%", height: "17.59%" }}
        animate={isInView ? { y: [0, -4, 0, 3, 0], opacity: [0.65, 1, 0.65] } : {}}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Clock — pendulum tick */}
      <motion.img
        src="/assets/illustrations/commitment-clock.svg"
        alt=""
        className="absolute object-contain"
        style={{ left: "79.21%", top: "14%", width: "9.19%", height: "16.83%", transformOrigin: "top center" }}
        animate={isInView ? { rotate: [0, 4, 0, -4, 0] } : {}}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Plant leaves — sway from base */}
      <motion.img
        src="/assets/illustrations/commitment-plant.svg"
        alt=""
        className="absolute object-contain"
        style={{ left: "80.17%", top: "41.73%", width: "17.47%", height: "38.13%", transformOrigin: "bottom center" }}
        animate={isInView ? { rotate: [0, 3, 0, -2.5, 0] } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Lamp — brightness pulse */}
      <motion.img
        src="/assets/illustrations/commitment-lamp.svg"
        alt=""
        className="absolute object-contain"
        style={{ left: "3.96%", top: "30.26%", width: "11.25%", height: "68.08%" }}
        animate={isInView ? { opacity: [0.5, 1, 0.5] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function SparkleIcon() {
  return (
    <Image
      src="/assets/cards/sparkle-card.svg"
      alt=""
      width={35}
      height={37}
      aria-hidden="true"
      className="3xl:w-[48px] 3xl:h-[50px] 4xl:w-[60px] 4xl:h-[64px] 5xl:w-[84px] 5xl:h-[88px]"
    />
  );
}

function usePaperSway(baseTilt: number, index: number) {
  const rotate = useMotionValue(baseTilt);
  const smoothRotate = useSpring(rotate, { stiffness: 15, damping: 4, mass: 1.2 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) {
      rotate.set(0);
      return;
    }

    // Random wind-like forces for organic feel
    const sway = () => {
      const wind = (Math.random() - 0.4) * 5;
      const target = baseTilt + wind;
      rotate.set(target);
    };

    sway();
    const interval = setInterval(sway, 1800 + index * 400);
    return () => clearInterval(interval);
  }, [baseTilt, index, isHovered, rotate]);

  return { smoothRotate, setIsHovered };
}

function TicketCard({ text, delay, index }: { text: string; delay: number; index: number }) {
  const isEven = index % 2 === 0;
  const tilt = isEven ? -3.64 : 3.64;
  const { smoothRotate, setIsHovered } = usePaperSway(tilt, index);

  return (
    <FadeIn delay={delay} className="w-full md:w-[244px] xl:w-[280px] 2xl:w-[300px] 3xl:w-[360px] 4xl:w-[440px] 5xl:w-[600px]">
      <motion.div
        className="relative flex h-[260px] flex-col items-center justify-center rounded-lg bg-[#202020] px-4 py-6 shadow-[0px_78px_47px_rgba(0,0,0,0.05),0px_35px_35px_rgba(0,0,0,0.09),0px_9px_19px_rgba(0,0,0,0.1)] md:h-[321px] xl:h-[360px] 3xl:h-[420px] 4xl:h-[520px] 5xl:h-[700px]"
        style={{ transformOrigin: "top left", rotate: smoothRotate }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Ticket top edge — scalloped cutouts */}
        <div className="absolute -top-[7px] left-0 right-0 flex justify-center gap-[2px]">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="h-[14px] w-[14px] rounded-full bg-[#131313]"
            />
          ))}
        </div>

        {/* Paper pin */}
        <div className="absolute top-3 left-4 3xl:top-4 3xl:left-5 4xl:top-5 4xl:left-6 5xl:top-6 5xl:left-8">
          <div className="h-4 w-4 rounded-full bg-[#ff9a6d] shadow-[0px_2px_4px_rgba(0,0,0,0.3)] 3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-8 5xl:w-8">
            <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#cc7b57] 3xl:h-2 3xl:w-2 4xl:h-2.5 4xl:w-2.5 5xl:h-3.5 5xl:w-3.5" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <SparkleIcon />
          <p className="font-body text-center text-sm leading-6 text-[#a9a9a9] md:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl">
            {text}
          </p>
        </div>
      </motion.div>
    </FadeIn>
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
      {/* Background decorative grid at 6% opacity */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]" aria-hidden="true">
        <Image
          src="/assets/backgrounds/commitment-bg.svg"
          alt=""
          width={1400}
          height={934}
          className="h-auto w-[1400px] max-w-none"
        />
      </div>

      <SectionWrapper className="relative z-10 py-8 text-center md:py-20">
        {/* House illustration */}
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

        {/* Subtitle with orange underline */}
        <FadeIn>
          <p
            className="text-sm uppercase leading-[1.6] tracking-[0.309px] text-[#797979] md:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {variant === "landlord" ? (
              <>
                {data.subtitle.replace("THAT HOME", "")}{" "}
                <span className="relative inline-block">
                  THAT HOME
                  <ScribbleUnderline />
                </span>
              </>
            ) : (
              <>
                {data.subtitle.replace("COMMITMENT.", "")}{" "}
                <span className="relative inline-block">
                  COMMITMENT.
                  <ScribbleUnderline />
                </span>
              </>
            )}
          </p>
        </FadeIn>

        <h2 className="mx-auto mt-3 max-w-[715px] font-display text-[28px] leading-[1.4] tracking-[-0.5px] text-white md:mt-4 md:text-[34px] lg:text-[40px] lg:leading-[1.5] lg:tracking-[-0.88px] xl:max-w-[850px] xl:text-[48px] 2xl:text-[52px] 3xl:max-w-[1050px] 3xl:text-[60px] 4xl:max-w-[1400px] 4xl:text-[72px] 5xl:max-w-[1800px] 5xl:text-[96px]">
          <WordReveal delay={0.1}>{data.heading}</WordReveal>
        </h2>

        <SlideUp delay={0.3} className="mt-3 md:mt-4">
          <p
            className="mx-auto max-w-[700px] text-base leading-7 text-[#797979] md:text-xl md:leading-8 xl:max-w-[800px] xl:text-[22px] xl:leading-9 3xl:max-w-[1000px] 3xl:text-[26px] 3xl:leading-10 4xl:max-w-[1300px] 4xl:text-[32px] 4xl:leading-[48px] 5xl:max-w-[1800px] 5xl:text-[44px] 5xl:leading-[64px]"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {data.description}
          </p>
        </SlideUp>

        {/* Benefit cards */}
        <div className="mt-10 grid grid-cols-2 gap-6 md:mt-16 md:flex md:flex-wrap md:items-center md:justify-center md:gap-7">
          {data.benefitCards.map((text, i) => (
            <TicketCard key={i} text={text} delay={0.1 * i} index={i} />
          ))}
        </div>
      </SectionWrapper>

      {/* Marquee banners — scroll-driven */}
      <div ref={marqueeRef} className="relative mt-10 flex flex-col items-center gap-0 overflow-hidden md:mt-[64px]">
        <ScrollMarquee
          text={data.marqueeText1}
          rotate="0.22deg"
          bg="#1a1a1a"
          direction="left"
          scrollYProgress={scrollYProgress}
        />
        <ScrollMarquee
          text={data.marqueeText2}
          rotate="-0.48deg"
          bg="#202020"
          direction="right"
          scrollYProgress={scrollYProgress}
        />
      </div>
    </div>
  );
}
