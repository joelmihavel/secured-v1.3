"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconPhone as PhoneIcon } from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { WHATSAPP_LINK, DEMAND_OPS_PHONE } from "@/constants";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

const SCROLL_THRESHOLD_PX = 100;
const SPRING_TRANSITION = { type: "spring" as const, stiffness: 300, damping: 30 };
const MARQUEE_TRANSITION = { duration: 40, repeat: Infinity, ease: "linear" as const };
const CTA_CONTEXT = "campaign_bottom_nav";

const sharedButtonProps = {
  variant: "primary" as const,
  size: "lg" as const,
  "data-cta-context": CTA_CONTEXT,
};

const DiamondIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="currentColor" className={className}>
    <path d="M17.6777 32.3223C12.9893 27.6339 6.63041 25 0 25C6.63041 25 12.9893 22.3661 17.6777 17.6777C22.3661 12.9893 25 6.63041 25 0C25 6.63041 27.6339 12.9893 32.3223 17.6777C37.0107 22.3661 43.3696 25 50 25C43.3696 25 37.0107 27.6339 32.3223 32.3223C27.6339 37.0107 25 43.3696 25 50C25 43.3696 22.3661 37.0107 17.6777 32.3223Z" />
  </svg>
);


const marqueeContent = (
  <>
    {[...Array(6)].map((_, i) => (
      <span
        key={i}
        className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-brand-yellow"
      >
        <DiamondIcon className="w-3 h-3 shrink-0" />
        Book now and get up to ₹9,200 OFF
        <DiamondIcon className="w-3 h-3 shrink-0" />
        Offer Valid till 5th March
      </span>
    ))}
  </>
);

export const CampaignBottomNav = () => {
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowNav(window.scrollY > SCROLL_THRESHOLD_PX);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {showNav && (
        <motion.div
          key="campaign-bottom-nav"
          className="md:hidden fixed bottom-6 left-0 right-0 z-[100] px-4 flex justify-center pointer-events-none"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={SPRING_TRANSITION}
        >
          <div className="w-full pointer-events-auto flex flex-col shadow-2xl rounded-[24px] overflow-hidden border border-text-main">
            {/* Marquee banner */}
            <div className="overflow-hidden bg-forest-green py-2 flex items-center">
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: "-50%" }}
                transition={MARQUEE_TRANSITION}
                className="inline-flex shrink-0 items-center gap-2"
              >
                {marqueeContent}
                {marqueeContent}
              </motion.div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 bg-bg-white p-3 border-t border-text-main">
              <Button
                {...sharedButtonProps}
                href={DEMAND_OPS_PHONE}
                leftIcon={<PhoneIcon />}
                className="shrink-0 rounded-[10rem] px-5"
                style={{ backgroundColor: "white", color: "var(--color-text-main)", borderColor: "var(--color-text-main)" }}
                data-cta-id="campaign_call_us"
              >
                Call Us
              </Button>

              <Button
                {...sharedButtonProps}
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                leftIcon={<WhatsAppIcon className="w-5 h-5" />}
                className="flex-1 rounded-[10rem]"
                data-cta-id="campaign_chat_with_us"
              >
                Chat with us
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
