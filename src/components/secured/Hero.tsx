"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import type { HeroContent } from "@/lib/secured/types";

export function Hero({ data, variant = "tenant" }: { data: HeroContent; variant?: "tenant" | "landlord" }) {
  const isLandlord = variant === "landlord";
  const [showText, setShowText] = useState(true);
  const prevVariant = useRef(variant);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (prevVariant.current !== variant) {
      setShowText(false);
      const timer = setTimeout(() => {
        setShowText(true);
      }, 500);
      prevVariant.current = variant;
      return () => clearTimeout(timer);
    }
  }, [variant]);

  return (
    <section className="relative flex min-h-[600px] w-full flex-col overflow-hidden bg-[#131313] pt-4 md:min-h-[calc(100vh-100px)] md:pt-0 lg:h-[calc(100vh-100px)]">
      {/* Background layers */}
      <div className="absolute inset-0">
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

      {/* Content — two-container layout */}
      <div className="relative mx-auto flex w-full flex-1 max-w-[1440px] flex-col-reverse items-center px-6 pt-24 md:px-8 lg:flex-row lg:px-12 lg:pt-0 xl:max-w-[1600px] 2xl:max-w-[1800px] 3xl:max-w-[2200px] 4xl:max-w-[2600px] 5xl:max-w-[3600px]">
        {/* Phone container */}
        <motion.div
          layout
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="flex w-full items-center justify-center lg:h-full lg:w-1/2 lg:items-end"
          style={{ order: isLandlord ? 2 : 1 }}
        >
          <div className="relative z-[1] mt-8 w-[255px] md:w-[360px] lg:mt-0 lg:w-[500px] 3xl:w-[600px] 4xl:w-[720px] 5xl:w-[960px]">
            {/* Clipping container: shows phone screen+frame, crops the hand on desktop */}
            <div className="relative">
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
          </div>
        </motion.div>

        {/* Text container */}
        <motion.div
          layout
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="flex w-full items-center justify-center lg:h-full lg:w-1/2"
          style={{ order: isLandlord ? 1 : 2 }}
        >
          <div
            className="relative z-[2] flex w-full max-w-[446px] flex-col gap-4 text-center transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] md:gap-6 lg:text-left xl:max-w-[520px] 2xl:max-w-[580px] 3xl:max-w-[700px] 4xl:max-w-[900px] 5xl:max-w-[1200px]"
            style={{
              opacity: showText ? 1 : 0,
              transform: showText ? "translateY(0)" : "translateY(8px)",
            }}
          >
            <div className="flex flex-col gap-2 md:gap-3">
              <h1 className="font-display text-[36px] leading-[1] tracking-[-1.5px] text-white md:text-[48px] lg:text-[64px] lg:leading-[64px] lg:tracking-[-2px] xl:text-[72px] xl:leading-[72px] 2xl:text-[80px] 2xl:leading-[80px] 3xl:text-[96px] 3xl:leading-[96px] 4xl:text-[120px] 4xl:leading-[120px] 5xl:text-[160px] 5xl:leading-[160px]">
                {data.headingPrefix}{" "}
                <span className="text-[#ff9a6d]">{data.headingHighlight}</span>
              </h1>
              <p
                className="text-lg leading-[1.4] tracking-[-0.5px] text-[#797979] md:text-[22px] lg:text-[28px] lg:leading-[40px] lg:tracking-[-1px] xl:text-[32px] xl:leading-[44px] 2xl:text-[36px] 2xl:leading-[48px] 3xl:text-[42px] 3xl:leading-[56px] 4xl:text-[52px] 4xl:leading-[68px] 5xl:text-[72px] 5xl:leading-[92px]"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                {data.subheading}
              </p>
            </div>

            <p
              className="text-sm leading-[1.8] tracking-[-0.32px] text-[#8a8a8a] md:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              {data.description}
            </p>

            <div className="flex flex-col gap-4">
              <Button fullWidth onClick={() => document.getElementById("download-app")?.scrollIntoView({ behavior: "smooth" })}>{data.ctaButtonText}</Button>
              <p
                className="text-xs leading-[1.8] tracking-[-0.24px] text-[#8a8a8a] 3xl:text-sm 4xl:text-base 5xl:text-lg"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                {data.ctaDisclaimer}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
