"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconPhone as PhoneIcon } from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { WHATSAPP_LINK } from "@/constants";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const DiamondIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="currentColor" className={className}>
    <path d="M17.6777 32.3223C12.9893 27.6339 6.63041 25 0 25C6.63041 25 12.9893 22.3661 17.6777 17.6777C22.3661 12.9893 25 6.63041 25 0C25 6.63041 27.6339 12.9893 32.3223 17.6777C37.0107 22.3661 43.3696 25 50 25C43.3696 25 37.0107 27.6339 32.3223 32.3223C27.6339 37.0107 25 43.3696 25 50C25 43.3696 22.3661 37.0107 17.6777 32.3223Z" />
  </svg>
);

const PHONE_NUMBER = "tel:+918123659925";

const marqueeContent = (
  <>
    {[...Array(6)].map((_, i) => (
      <span
        key={i}
        className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-brand-yellow"
      >
        <DiamondIcon className="w-3 h-3 shrink-0" />
        Save up to ₹9,000 on first month rent
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
      setShowNav(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
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
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="w-full pointer-events-auto flex flex-col shadow-2xl">
            {/* Marquee banner */}
            <div className="overflow-hidden bg-forest-green border border-text-main py-2 flex items-center">
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: "-50%" }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="inline-flex shrink-0 items-center gap-2"
              >
                {marqueeContent}
                {marqueeContent}
              </motion.div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 bg-bg-white p-3 rounded-b-[24px] border border-text-main border-t-0">
              <Button
                href={PHONE_NUMBER}
                variant="primary"
                size="md"
                leftIcon={<PhoneIcon />}
                className="shrink-0 rounded-full px-5"
                style={{ backgroundColor: "white", color: "var(--color-text-main)", borderColor: "var(--color-text-main)" }}
                data-cta-id="campaign_call_us"
                data-cta-context="campaign_bottom_nav"
              >
                Call Us
              </Button>

              <Button
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="md"
                leftIcon={<WhatsAppIcon className="w-5 h-5" />}
                className="flex-1 rounded-full"
                data-cta-id="campaign_chat_with_us"
                data-cta-context="campaign_bottom_nav"
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
