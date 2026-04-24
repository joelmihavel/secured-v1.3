"use client";

import { motion } from "framer-motion";

const TICKER_TEXT = "This month — flat ₹1000 cashback on your rent payment";
const REPEAT = 12;

export function TickerBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[70] w-full overflow-hidden bg-[#ff9a6d] py-1.5">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
      >
        {Array.from({ length: REPEAT }).map((_, i) => (
          <span
            key={i}
            className="mx-4 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#0d0d0d] md:mx-5 md:text-[12px]"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {TICKER_TEXT}
            <span className="mx-4 text-[#0d0d0d]/30 md:mx-5">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
