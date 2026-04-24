"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionWrapper } from "./ui/SectionWrapper";
import { FadeIn } from "./ui/FadeIn";
import { WordReveal, SlideUp } from "./ui/TextReveal";
import type { FaqItem } from "@/lib/secured/types";

function TypewriterText({ text }: { text: string }) {
  const words = text.split(" ");
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);
    if (words.length === 0) return;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= words.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [text, words.length]);

  return (
    <span>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            opacity: i < visibleCount ? 1 : 0,
            transition: "opacity 0.15s ease",
          }}
        >
          {word}{i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FadeIn delay={0.05 * index}>
      <div
        className={`rounded-2xl p-6 transition-colors duration-300 md:p-8 3xl:p-10 4xl:p-12 5xl:p-16 ${
          isOpen
            ? "bg-[#cc7b57]"
            : "border border-transparent bg-[#1a1a1a] hover:border-[#4d4d4d]"
        }`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between gap-6 text-left md:gap-8 5xl:gap-12"
        >
          <span
            className={`font-display text-base leading-[1.2] md:text-2xl xl:text-[28px] 3xl:text-[34px] 4xl:text-[42px] 5xl:text-[56px] ${
              isOpen ? "text-black" : "text-white"
            }`}
          >
            {question}
          </span>
          <div
            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full 3xl:h-8 3xl:w-8 4xl:h-10 4xl:w-10 5xl:h-14 5xl:w-14 ${
              isOpen ? "bg-black/20" : "bg-[#ff9a6d]"
            }`}
          >
            <svg className="w-[14px] h-[14px] 3xl:w-[18px] 3xl:h-[18px] 4xl:w-[22px] 4xl:h-[22px] 5xl:w-[30px] 5xl:h-[30px]" viewBox="0 0 14 14" fill="none">
              {isOpen ? (
                <path d="M1 7h12" stroke={isOpen ? "#0d0d0d" : "#0d0d0d"} strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M7 1v12M1 7h12" stroke="#0d0d0d" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <p
                  className="font-ui text-sm font-medium leading-[1.6] text-[#060606] md:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl"
                >
                  <TypewriterText text={answer} />
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </FadeIn>
  );
}

export function FAQ({ items }: { items: FaqItem[] }) {
  return (
    <section className="bg-[#131313] py-8 md:pb-20 md:pt-[120px]">
      <SectionWrapper>
        {/* Header — centered */}
        <div className="flex flex-col items-center gap-2 text-center">
          <SlideUp>
            <p
              className="text-sm leading-[1.6] tracking-[-0.32px] text-[#d0d0d0] md:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl"
              style={{ fontFamily: "var(--font-ui)" }}
            >
              FAQs
            </p>
          </SlideUp>
          <h2 className="font-display text-[28px] leading-[1.4] tracking-[-0.5px] text-white md:text-[40px] md:leading-[1.5] md:tracking-[-0.88px] xl:text-[48px] 2xl:text-[52px] 3xl:text-[60px] 4xl:text-[72px] 5xl:text-[96px]">
            <WordReveal delay={0.1}>Got questions? We got answers.</WordReveal>
          </h2>
        </div>

        {/* FAQ container */}
        <div className="mt-8 overflow-hidden rounded-2xl bg-[#202020] p-4 shadow-[0px_78px_47px_0px_rgba(0,0,0,0.05),0px_35px_35px_0px_rgba(0,0,0,0.09),0px_9px_19px_0px_rgba(0,0,0,0.1)] md:mt-16 md:rounded-3xl md:p-8">
          <div className="mb-6 md:mb-10">
            <h3 className="font-display text-[28px] leading-[1.5] text-white md:text-[40px] xl:text-[48px] 3xl:text-[56px] 4xl:text-[68px] 5xl:text-[88px]">
              FAQs.
            </h3>
          </div>

          <div className="flex flex-col gap-2">
            {items.map((item, i) => (
              <FAQItem key={i} question={item.question} answer={item.answer} index={i} />
            ))}
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
}
