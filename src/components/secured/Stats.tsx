"use client";

import Image from "next/image";
import { SectionWrapper } from "./ui/SectionWrapper";
import { FadeIn } from "./ui/FadeIn";
import { WordReveal, SlideUp } from "./ui/TextReveal";
import type { StatsContent } from "@/lib/secured/types";

export function Stats({ data }: { data: StatsContent }) {
  return (
    <section className="bg-[#1a1a1a] py-8 md:py-20">
      <SectionWrapper>
        {/* Inner container */}
        <div className="relative flex flex-col gap-8 overflow-hidden rounded-3xl p-6 md:flex-row md:items-center md:p-10">
          {/* Left side — brand info + stats */}
          <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:gap-16 md:pr-[40px]" style={{ flex: "1 1 auto" }}>
            {/* Brand info */}
            <div className="flex flex-col gap-3 md:gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-[24px] leading-[1.5] tracking-[-0.5px] text-white md:text-[32px] md:tracking-[-0.704px] xl:text-[38px] 2xl:text-[42px] 3xl:text-[50px] 4xl:text-[60px] 5xl:text-[80px]">
                    <WordReveal delay={0.1}>{data.brandHeading}</WordReveal>
                  </h3>
                  <div className="flex items-center gap-2 self-center">
                    <span
                      className="text-sm leading-[1.5] text-white md:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl"
                      style={{ fontFamily: "var(--font-ui)" }}
                    >
                      by
                    </span>
                    <Image
                      src="/assets/logos/flent-logo-stats.svg"
                      alt="Flent"
                      width={66}
                      height={24}
                      className="3xl:w-[88px] 3xl:h-[32px] 4xl:w-[110px] 4xl:h-[40px] 5xl:w-[154px] 5xl:h-[56px]"
                    />
                  </div>
                </div>
                <SlideUp delay={0.2}>
                  <p
                    className="text-sm font-medium leading-[1.6] text-white md:whitespace-nowrap md:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    {data.brandSubheading}
                  </p>
                </SlideUp>
              </div>

            {/* Stats */}
            <FadeIn delay={0.2}>
              <div className="flex flex-row flex-wrap gap-6 md:flex-col md:gap-4">
                {data.stats.map((stat, i) => (
                  <div key={i} className="flex flex-col gap-1 md:gap-[10px]">
                    <p
                      className="text-[24px] font-medium leading-[36px] tracking-[-0.5px] md:whitespace-nowrap md:text-[32px] md:leading-[48px] md:tracking-[-1px] 3xl:text-[40px] 3xl:leading-[60px] 4xl:text-[48px] 4xl:leading-[72px] 5xl:text-[64px] 5xl:leading-[96px]"
                      style={{ fontFamily: "var(--font-ui)" }}
                    >
                      {stat.prefix ? (
                        <>
                          <span className="text-[#ff9a6d]">{stat.prefix}</span>
                          <span className="text-white">{stat.value}</span>
                        </>
                      ) : stat.separator ? (
                        <>
                          <span className="text-white">{stat.value}</span>
                          <span className="text-[#ff9a6d]">{stat.separator}</span>
                          <span className="text-white">{stat.suffix}</span>
                        </>
                      ) : (
                        <>
                          <span className="text-white">{stat.value}</span>
                          <span className="text-[#ff9a6d]">{stat.suffix}</span>
                        </>
                      )}
                    </p>
                    <p
                      className="text-sm font-medium leading-[1.6] text-[#797979] md:whitespace-nowrap md:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl"
                      style={{ fontFamily: "var(--font-ui)" }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right side — image collage, hidden on mobile */}
          <div className="hidden lg:block lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 xl:scale-110 2xl:scale-125 3xl:scale-150 4xl:scale-[1.8] 5xl:scale-[2.4]" style={{ transformOrigin: "right center" }}>
            <FadeIn>
              <div className="relative flex items-center">
                {/* Gradient */}
                <div
                  className="pointer-events-none absolute z-10"
                  style={{
                    width: 120,
                    top: 0,
                    bottom: 0,
                    left: -1,
                    background: "linear-gradient(to right, #1A1A1A 0%, rgba(26, 26, 26, 0) 100%)",
                  }}
                />

                {/* Image container */}
                <div
                  className="relative overflow-hidden"
                  style={{ width: 403, height: 373 }}
                >
                  {/* Col 1 top */}
                  <div className="absolute overflow-hidden" style={{ left: 0, top: 0, width: 200, height: 183 }}>
                    <Image src="/assets/illustrations/stats-img-1.jpg" alt="" fill className="object-cover" />
                  </div>
                  {/* Col 2 top */}
                  <div className="absolute overflow-hidden" style={{ left: 203, top: 0, width: 200, height: 183 }}>
                    <Image src="/assets/illustrations/stats-img-4.jpg" alt="" fill className="object-cover" />
                  </div>
                  {/* Col 1 bottom */}
                  <div className="absolute overflow-hidden" style={{ left: 0, top: 186, width: 200, height: 187 }}>
                    <Image src="/assets/illustrations/stats-img-2.jpg" alt="" fill className="object-cover" />
                  </div>
                  {/* Col 2 middle */}
                  <div className="absolute overflow-hidden" style={{ left: 203, top: 186, width: 200, height: 93 }}>
                    <Image src="/assets/illustrations/stats-img-5.png" alt="" fill className="object-cover" />
                  </div>
                  {/* Col 2 bottom */}
                  <div className="absolute overflow-hidden" style={{ left: 203, top: 282, width: 200, height: 91 }}>
                    <Image src="/assets/illustrations/stats-img-6.png" alt="" fill className="object-cover" />
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
}
