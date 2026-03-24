"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import type { HeroContent } from "@/lib/secured/types";

export function Hero({ data, variant = "tenant" }: { data: HeroContent; variant?: "tenant" | "landlord" }) {
  const isLandlord = variant === "landlord";
  const [showText, setShowText] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [phoneOffset, setPhoneOffset] = useState(237);
  const prevVariant = useRef(variant);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setIsDesktop(w >= 1024);
      // Scale phone offset proportionally beyond 1440px
      if (w >= 1536) setPhoneOffset(Math.round(w * 0.165));
      else if (w >= 1280) setPhoneOffset(Math.round(w * 0.165));
      else setPhoneOffset(237);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (prevVariant.current !== variant) {
      // Hide text, wait for phone to slide, then show new text
      setShowText(false);
      const timer = setTimeout(() => {
        setShowText(true);
      }, 500);
      prevVariant.current = variant;
      return () => clearTimeout(timer);
    }
  }, [variant]);

  return (
    <section className="relative min-h-[600px] w-full overflow-visible bg-[#131313] pt-4 md:h-[calc(100vh-100px)] md:pt-0">
      {/* Background layers */}
      <div className="absolute inset-x-0 top-0" style={{ height: "calc(100% + 80px)" }}>
        <div className="absolute inset-0 bg-[#131313] lg:left-[205px]" />
        <div className="absolute top-0 left-0 hidden h-full w-[205px] bg-[#1a1a1a] lg:block" />

        {/* Left texture */}
        <div className="absolute left-0 top-0 h-full w-[70%] opacity-[0.65] lg:w-[579px] lg:opacity-100">
          <Image src="/assets/backgrounds/hero-texture-left.svg" alt="" fill className="object-cover" aria-hidden="true" />
        </div>

        {/* Right texture */}
        <div className="absolute right-0 top-0 hidden h-full w-[591px] opacity-[0.32] lg:block">
          <Image src="/assets/backgrounds/hero-texture-right.png" alt="" fill className="object-cover opacity-[0.48]" aria-hidden="true" />
        </div>
      </div>

      {/* Content */}
      <div className="relative mx-auto flex h-full max-w-[1440px] flex-col-reverse items-center px-6 pt-24 md:px-8 lg:block lg:px-12 lg:pt-0 xl:max-w-[1600px] 2xl:max-w-[1800px]">
        {/* Phone mockup — slides smoothly */}
        <motion.div
          className="relative z-[1] mt-8 -mb-[80px] w-[255px] md:-mb-[120px] md:w-[360px] lg:absolute lg:top-[110px] lg:mb-0 lg:mt-0 lg:w-[500px]"
          animate={isDesktop ? {
            left: isLandlord ? "auto" : phoneOffset,
            right: isLandlord ? phoneOffset : "auto",
          } : undefined}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{ willChange: isDesktop ? "transform" : undefined }}
        >
          {/* Clipping container: shows phone screen+frame, crops the hand on desktop */}
          <div className="relative lg:h-[calc(100vh-160px)] lg:overflow-hidden">
            {/* Tenant phone */}
            <Image
              src="/assets/illustrations/hero-phone-mockup.png"
              alt="Flent Secured app showing rent payment"
              width={706}
              height={1003}
              priority
              className="h-auto w-full transition-opacity duration-300"
              style={{ opacity: isLandlord ? 0 : 1 }}
            />
            {/* Landlord phone overlaid */}
            <Image
              src="/assets/illustrations/hero-phone-mockup-landlord.png"
              alt="Flent Secured app showing payment receipt"
              width={706}
              height={1003}
              priority
              className="absolute inset-0 h-auto w-full transition-opacity duration-300"
              style={{ opacity: isLandlord ? 1 : 0 }}
            />
          </div>
        </motion.div>

        {/* Text content — disappears, reappears after phone slides */}
        <div
          className={`relative z-[2] flex w-full max-w-[446px] flex-col gap-4 text-center transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] md:gap-6 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:text-left xl:max-w-[520px] 2xl:max-w-[580px] ${
            isLandlord ? "lg:left-[120px] xl:left-[8%] lg:right-auto" : "lg:left-[851px] xl:left-[59%]"
          }`}
          style={{
            opacity: showText ? 1 : 0,
            transform: showText ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <div className="flex flex-col gap-2 md:gap-3">
            <h1 className="font-display text-[36px] leading-[1] tracking-[-1.5px] text-white md:text-[48px] lg:text-[64px] lg:leading-[64px] lg:tracking-[-2px] xl:text-[72px] xl:leading-[72px] 2xl:text-[80px] 2xl:leading-[80px]">
              {data.headingPrefix}{" "}
              <span className="text-[#ff9a6d]">{data.headingHighlight}</span>
            </h1>
            <p
              className="text-lg leading-[1.4] tracking-[-0.5px] text-[#797979] md:text-[22px] lg:text-[28px] lg:leading-[40px] lg:tracking-[-1px] xl:text-[32px] xl:leading-[44px] 2xl:text-[36px] 2xl:leading-[48px]"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              {data.subheading}
            </p>
          </div>

          <p
            className="text-sm leading-[1.8] tracking-[-0.32px] text-[#8a8a8a] md:text-base"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {data.description}
          </p>

          <div className="flex flex-col gap-4">
            <Button fullWidth onClick={() => document.getElementById("download-app")?.scrollIntoView({ behavior: "smooth" })}>{data.ctaButtonText}</Button>
            <p
              className="text-xs leading-[1.8] tracking-[-0.24px] text-[#8a8a8a]"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              {data.ctaDisclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
