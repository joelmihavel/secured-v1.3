"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FadeIn } from "./ui/FadeIn";
import { Button } from "./ui/Button";
import { WordReveal, SlideUp } from "./ui/TextReveal";
import type { DownloadAppContent } from "@/lib/secured/types";

export function DownloadApp({ data }: { data: DownloadAppContent }) {
  return (
    <section id="download-app" className="relative overflow-hidden bg-[#131313] py-6">
      {/* Background concentric circles */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {[1032, 1316, 1688].map((size) => (
          <div
            key={`g1-${size}`}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1a1a1a]"
            style={{ width: size, height: size }}
          />
        ))}
        {[1032, 1316, 1688].map((size) => (
          <div
            key={`g2-${size}`}
            className="absolute left-1/2 rounded-full border border-[#1a1a1a]"
            style={{
              width: size,
              height: size,
              top: "calc(50% + 86px)",
              transform: "translateX(-50%) translateY(-50%)",
            }}
          />
        ))}
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 mx-auto w-full max-w-[1440px] px-4 md:px-6 xl:max-w-[1600px] 2xl:max-w-[1800px]"
      >
        <div className="relative overflow-hidden rounded-2xl bg-[#1a1a1a] md:rounded-3xl">
          {/* Geometric line art illustration */}
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
            aria-hidden="true"
          >
            <Image
              src="/assets/backgrounds/downloadapp-illustration.svg"
              alt=""
              width={809}
              height={590}
              className="absolute flex-none"
              style={{ transform: "rotate(120deg)", left: "-5%", top: "0" }}
            />
          </div>

          {/* Card content */}
          <div className="relative flex flex-col gap-12 p-6 md:gap-[120px] md:p-8 lg:gap-[195px] lg:p-12">
            {/* Top row: heading + Flent icon */}
            <div className="flex items-start justify-between">
              <h2 className="font-display text-[28px] leading-[1.4] tracking-[-0.5px] text-white md:text-[34px] lg:text-[40px] lg:leading-[1.5] lg:tracking-[-0.88px] xl:text-[48px] 2xl:text-[52px]">
                <WordReveal>{data.heading}</WordReveal>
              </h2>
              <Image
                src="/assets/logos/flent-icon-download.svg"
                alt="Flent"
                width={32}
                height={38}
              />
            </div>

            {/* Bottom row: QR left + text & buttons right */}
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:gap-[40px]">
              {/* QR Code — hidden on small mobile */}
              <div className="hidden flex-shrink-0 rounded-2xl bg-black p-3 md:block">
                <Image
                  src="/assets/logos/qr-code.svg"
                  alt="Scan QR to download Flent"
                  width={216}
                  height={216}
                />
              </div>

              {/* Right side: description + buttons */}
              <div className="flex flex-1 flex-col gap-4 md:gap-6">
                <SlideUp>
                  <p
                    className="max-w-[1016px] text-base leading-[1.7] tracking-[-0.22px] text-white md:text-xl md:leading-[1.8]"
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    {data.description}
                  </p>
                </SlideUp>

                <div className="flex flex-col gap-3 md:flex-row md:gap-4">
                  {/* App Store button */}
                  <div className="flex-1">
                    <Button
                      fullWidth
                      href="https://apps.apple.com/in/app/secured-by-flent/id6757275258"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data.appStoreButtonText}
                    </Button>
                  </div>

                  {/* Play Store button */}
                  <div className="flex-1">
                    <Button fullWidth disabled>
                      {data.playStoreButtonText}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
