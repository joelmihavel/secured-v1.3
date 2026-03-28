"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { SectionWrapper } from "./ui/SectionWrapper";
import { FadeIn } from "./ui/FadeIn";
import { Button } from "./ui/Button";
import { WordReveal, SlideUp } from "./ui/TextReveal";
import type { CreditCardContent } from "@/lib/secured/types";

function usePaperSway(baseTilt: number, index: number) {
  const rotate = useMotionValue(baseTilt);
  const smoothRotate = useSpring(rotate, { stiffness: 15, damping: 4, mass: 1.2 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) {
      rotate.set(0);
      return;
    }

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

function FeatureCard({ text, icon, delay, index }: { text: string; icon: string; delay: number; index: number }) {
  const isEven = index % 2 === 0;
  const tilt = isEven ? -2.73 : 2.73;
  const { smoothRotate, setIsHovered } = usePaperSway(tilt, index);

  return (
    <FadeIn delay={delay}>
      <motion.div
        className="relative flex h-[220px] w-full flex-col items-center justify-center gap-6 rounded-xl bg-[#202020] px-4 py-6 md:h-[258px] md:w-[320px] md:gap-8 xl:h-[290px] xl:w-[380px] 2xl:w-[420px] 3xl:h-[340px] 3xl:w-[500px] 4xl:h-[420px] 4xl:w-[620px] 5xl:h-[560px] 5xl:w-[840px]"
        style={{ transformOrigin: "top left", rotate: smoothRotate }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Corner decoration */}
        <div className="absolute right-0 top-0 3xl:scale-125 4xl:scale-150 5xl:scale-[2]" style={{ transformOrigin: "top right" }}>
          <Image
            src="/assets/icons/card-corner.svg"
            alt=""
            width={54}
            height={54}
            aria-hidden="true"
          />
        </div>

        {/* Paper pin */}
        <div className="absolute top-3 left-4 3xl:top-4 3xl:left-5 4xl:top-5 4xl:left-6 5xl:top-6 5xl:left-8">
          <div className="h-4 w-4 rounded-full bg-[#ff9a6d] shadow-[0px_2px_4px_rgba(0,0,0,0.3)] 3xl:h-5 3xl:w-5 4xl:h-6 4xl:w-6 5xl:h-8 5xl:w-8">
            <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#cc7b57] 3xl:h-2 3xl:w-2 4xl:h-2.5 4xl:w-2.5 5xl:h-3.5 5xl:w-3.5" />
          </div>
        </div>

        <div className="flex h-16 items-center justify-center 3xl:h-20 4xl:h-24 5xl:h-32">
          <Image src={icon} alt="" width={80} height={64} aria-hidden="true" className="h-16 w-auto 3xl:h-20 4xl:h-24 5xl:h-32" />
        </div>
        <p className="max-w-[244px] text-center font-body text-sm leading-6 text-[#a9a9a9] md:text-base 3xl:max-w-[320px] 3xl:text-lg 4xl:max-w-[420px] 4xl:text-xl 5xl:max-w-[560px] 5xl:text-2xl">
          {text}
        </p>
      </motion.div>
    </FadeIn>
  );
}

export function CreditCard({ data }: { data: CreditCardContent }) {
  return (
    <section className="relative bg-[#131313] py-8 md:pb-[160px] md:pt-[160px]">
      {/* Background decorative ellipses */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden="true">
        <Image
          src="/assets/backgrounds/creditcard-ellipses.svg"
          alt=""
          width={1534}
          height={767}
          className="h-auto w-[1534px] max-w-none"
        />
      </div>

      <SectionWrapper className="relative z-10 text-center">
        <h2 className="mx-auto max-w-[582px] font-display text-[28px] leading-[1.4] tracking-[-0.5px] text-white md:text-[34px] lg:text-[40px] lg:leading-[1.5] lg:tracking-[-0.88px] xl:max-w-[700px] xl:text-[48px] 2xl:text-[52px] 3xl:max-w-[900px] 3xl:text-[60px] 4xl:max-w-[1200px] 4xl:text-[72px] 5xl:max-w-[1600px] 5xl:text-[96px]">
          <WordReveal>{data.heading}</WordReveal>
        </h2>

        <SlideUp delay={0.3} className="mt-3">
          <p
            className="text-base leading-[1.6] text-[#797979] md:text-xl 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {data.subheading}
          </p>
        </SlideUp>

        {/* Feature cards — 2-col grid */}
        <div className="mx-auto mt-8 max-w-[700px] grid grid-cols-1 gap-7 md:mt-12 md:grid-cols-2 md:gap-10 xl:max-w-[840px] 2xl:max-w-[920px] 3xl:max-w-[1100px] 4xl:max-w-[1400px] 5xl:max-w-[1900px]">
          {data.featureCards.map((card, i) => (
            <FeatureCard key={i} text={card.text} icon={card.icon} delay={0.1 * i} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="mx-auto mt-10 max-w-[480px] md:mt-16 3xl:max-w-[580px] 4xl:max-w-[720px] 5xl:max-w-[960px]">
          <Button fullWidth onClick={() => document.getElementById("download-app")?.scrollIntoView({ behavior: "smooth" })}>{data.ctaButtonText}</Button>
          <p
            className="mt-3 text-center text-xs leading-[1.8] tracking-[-0.24px] text-[#8a8a8a] 3xl:text-sm 4xl:text-base 5xl:text-lg"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {data.ctaDisclaimer}
          </p>
        </div>
      </SectionWrapper>
    </section>
  );
}
