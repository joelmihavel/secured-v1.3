"use client";

import { useRef, useEffect, useState } from "react";
import { gsap, ScrollTrigger } from "./useGSAP";
import { Floating, CreditCardShape, RupeeCoin } from "./FloatingElements";
import { Button } from "./ui/Button";
import type { CreditCardContent } from "@/lib/secured/types";

export function CreditCard({ data }: { data: CreditCardContent }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

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

  const bgScale = 0.7 + progress * 0.3;
  const headingOpacity = Math.min(1, progress * 5);
  const headingY = Math.max(0, (1 - progress * 4) * 80);

  const cardProgress = (i: number) => {
    const start = 0.2 + i * 0.1;
    return Math.min(1, Math.max(0, (progress - start) * 5));
  };

  const ctaOpacity = Math.min(1, Math.max(0, (progress - 0.7) * 4));

  return (
    <div ref={containerRef} className="relative bg-[#131313]" style={{ height: "280vh" }}>
      <div
        ref={pinnedRef}
        className="relative flex h-screen w-full items-center justify-center overflow-hidden"
      >
        {/* Expanding background panel */}
        <div
          className="absolute inset-x-0 top-0 mx-auto h-full max-w-[1400px] origin-top rounded-b-[40px] bg-[#0f0f0f]"
          style={{
            transform: `scaleX(${bgScale})`,
            opacity: 0.6 + progress * 0.4,
          }}
        />

        {/* Floating decorative elements */}
        <Floating className="left-[6%] top-[18%] hidden md:block" speed={0.9} blur={5}>
          <CreditCardShape size={80} />
        </Floating>
        <Floating className="right-[6%] top-[22%] hidden md:block" speed={1.1} direction="down" blur={3} rotate={-10}>
          <CreditCardShape size={56} />
        </Floating>
        <Floating className="left-[15%] bottom-[22%] hidden md:block" speed={0.7} blur={6}>
          <RupeeCoin size={44} />
        </Floating>
        <Floating className="right-[12%] bottom-[18%] hidden md:block" speed={0.8} direction="down" blur={4}>
          <RupeeCoin size={36} />
        </Floating>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-[900px] px-6 text-center xl:max-w-[1000px]">
          {/* Heading */}
          <h2
            className="mx-auto max-w-[700px] font-display text-[32px] leading-[1.1] tracking-[-1.5px] text-white md:text-[48px] lg:text-[56px] xl:text-[64px]"
            style={{
              opacity: headingOpacity,
              transform: `translateY(${headingY}px)`,
            }}
          >
            {data.heading}
          </h2>

          <p
            className="mx-auto mt-4 text-base leading-[1.6] text-[#797979] md:text-lg"
            style={{
              fontFamily: "var(--font-ui)",
              opacity: Math.min(1, Math.max(0, (progress - 0.1) * 5)),
              transform: `translateY(${Math.max(0, (1 - (progress - 0.1) * 4) * 40)}px)`,
            }}
          >
            {data.subheading}
          </p>

          {/* Feature cards */}
          <div className="mx-auto mt-10 grid max-w-[800px] grid-cols-1 gap-4 md:mt-14 md:grid-cols-2 md:gap-5">
            {data.featureCards.map((card, i) => {
              const p = cardProgress(i);
              return (
                <div
                  key={i}
                  className="group flex items-start gap-4 rounded-2xl border border-[#282828] bg-[#161616] p-5 text-left transition-colors duration-300 hover:border-[#ff9a6d]/30 md:p-6"
                  style={{
                    opacity: p,
                    transform: `translateY(${(1 - p) * 24}px)`,
                  }}
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#ff9a6d]/10 md:h-12 md:w-12">
                    <svg className="h-5 w-5 text-[#ff9a6d] md:h-6 md:w-6" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
                      <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <p
                    className="text-sm leading-[1.6] text-[#b0b0b0] md:text-[15px]"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    {card.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div
            className="mx-auto mt-10 max-w-[400px]"
            style={{ opacity: ctaOpacity }}
          >
            <Button
              fullWidth
              onClick={() => document.getElementById("download-app")?.scrollIntoView({ behavior: "smooth" })}
            >
              {data.ctaButtonText}
            </Button>
            {data.ctaDisclaimer && (
              <p
                className="mt-3 text-xs text-[#666]"
                style={{ fontFamily: "var(--font-ui)" }}
              >
                {data.ctaDisclaimer}
              </p>
            )}
          </div>
        </div>

        {/* Gradient overlay at top */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-32"
          style={{
            background: "linear-gradient(180deg, #131313 0%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}
