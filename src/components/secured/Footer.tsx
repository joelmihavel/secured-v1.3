"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { FooterContent } from "@/lib/secured/types";

export function Footer({ data }: { data: FooterContent }) {
  return (
    <footer className="relative flex flex-col items-center overflow-hidden bg-[#131313] px-6 pb-[140px] pt-8 md:px-16 md:pb-[220px] md:pt-20 lg:px-[120px]">
      {/* Background halftone dot pattern — tiled across entire footer */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          backgroundImage: "url(/assets/backgrounds/footer-halftone-tile.svg)",
          backgroundRepeat: "repeat",
          backgroundSize: "720px 360px",
        }}
      />

      <div className="relative z-10 flex w-full max-w-[600px] flex-col items-center gap-6 md:gap-8 xl:max-w-[700px] 2xl:max-w-[800px] 3xl:max-w-[1000px] 4xl:max-w-[1300px] 5xl:max-w-[1800px]">
        {/* Flent icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/assets/logos/flent-icon-footer.svg"
            alt="Flent"
            width={32}
            height={38}
            className="3xl:w-[48px] 3xl:h-[56px] 4xl:w-[64px] 4xl:h-[76px] 5xl:w-[96px] 5xl:h-[114px]"
          />
        </motion.div>

        {/* Explore + Contact buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex w-full flex-col items-center gap-3 md:w-[70%]"
        >
          <a
            href="https://www.flent.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-xl bg-[#202020] px-6 py-4 text-sm leading-5 text-white transition-colors 3xl:text-base 3xl:py-5 4xl:text-lg 4xl:py-6 5xl:text-xl 5xl:py-8"
            style={{
              fontFamily: "var(--font-display)",
              boxShadow: "0px 78px 47px rgba(0,0,0,0.05), 0px 35px 35px rgba(0,0,0,0.09), 0px 9px 19px rgba(0,0,0,0.1)",
            }}
          >
            {data.exploreLabel}
          </a>
          <a
            href="https://api.whatsapp.com/send/?phone=918904695925&text=Curious+to+know+more+about+Flent%E2%80%94tell+me+everything%21+%5BWAX-UK6N%5D&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-xl bg-[#202020] px-6 py-4 text-sm leading-5 text-white transition-colors 3xl:text-base 3xl:py-5 4xl:text-lg 4xl:py-6 5xl:text-xl 5xl:py-8"
            style={{
              fontFamily: "var(--font-display)",
              boxShadow: "0px 78px 47px rgba(0,0,0,0.05), 0px 35px 35px rgba(0,0,0,0.09), 0px 9px 19px rgba(0,0,0,0.1)",
            }}
          >
            {data.contactLabel}
          </a>
        </motion.div>

        {/* Orange vertical line + diamond */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex origin-top flex-col items-center pt-4 md:pt-8"
        >
          <div className="h-12 w-px bg-[#ff9a6d] md:h-20 3xl:h-28 4xl:h-36 5xl:h-48" />
          <svg className="w-3 h-3 3xl:w-4 3xl:h-4 4xl:w-5 4xl:h-5 5xl:w-7 5xl:h-7" viewBox="0 0 12 12" fill="none">
            <path d="M6 0L12 6L6 12L0 6L6 0Z" fill="#FF9A6D" />
          </svg>
        </motion.div>

        {/* Tagline + copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center gap-4 pt-4 md:pt-8"
        >
          <div className="flex flex-col items-center">
            <span className="font-body text-center text-[28px] leading-[130%] text-[#797979] md:text-[36px] lg:text-[48px] xl:text-[56px] 2xl:text-[64px] 3xl:text-[76px] 4xl:text-[96px] 5xl:text-[128px]">
              {data.taglineLine1}
            </span>
            <span className="font-body text-center text-[28px] leading-[130%] text-[#ff9a6d] md:text-[36px] lg:text-[48px] xl:text-[56px] 2xl:text-[64px] 3xl:text-[76px] 4xl:text-[96px] 5xl:text-[128px]">
              {data.taglineLine2}
            </span>
          </div>
          <p className="font-body text-center text-xs uppercase leading-[18px] tracking-[1px] text-[#5a5a5a] md:text-sm 3xl:text-base 4xl:text-lg 5xl:text-xl">
            {data.copyright}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
