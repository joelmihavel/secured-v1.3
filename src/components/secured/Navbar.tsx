"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useVariant } from "./VariantContext";
import { Button } from "./ui/Button";

/* ── Easing curves ── */
const EASE_SMOOTH = [0.77, 0, 0.175, 1] as const;
const EASE_HAMBURGER = [0.76, 0, 0.24, 1] as const;

/* ── Animated hamburger lines ── */
function MenuIcon({ open }: { open: boolean }) {
  return (
    <div className="relative h-[14px] w-6 3xl:h-[20px] 3xl:w-8 4xl:h-[26px] 4xl:w-10 5xl:h-[34px] 5xl:w-14">
      <motion.span
        className="absolute left-0 h-[1.5px] w-full rounded-full bg-white"
        animate={{
          top: open ? 6 : 0,
          rotate: open ? 45 : 0,
          width: open ? "100%" : "100%",
        }}
        transition={{ duration: 0.4, ease: EASE_HAMBURGER }}
      />
      <motion.span
        className="absolute left-0 top-[6px] h-[1.5px] rounded-full bg-white"
        animate={{
          width: open ? 0 : "60%",
          opacity: open ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: EASE_HAMBURGER }}
      />
      <motion.span
        className="absolute left-0 h-[1.5px] rounded-full bg-white"
        animate={{
          top: open ? 6 : 12,
          rotate: open ? -45 : 0,
          width: open ? "100%" : "80%",
        }}
        transition={{ duration: 0.4, ease: EASE_HAMBURGER }}
      />
    </div>
  );
}

/* ── Masked menu item — text reveals upward from behind overflow mask ── */
const STAGGER_DELAY = 0.1; // 100ms between items

function MaskedMenuItem({
  children,
  href,
  index,
  target,
  rel,
}: {
  children: React.ReactNode;
  href: string;
  index: number;
  target?: string;
  rel?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{
          duration: 0.7,
          ease: EASE_SMOOTH,
          delay: index * STAGGER_DELAY + 0.15,
        }}
      >
        <a
          href={href}
          target={target}
          rel={rel}
          className="block py-2"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <span
            className="relative inline-block font-display text-[clamp(20px,3vw,64px)] leading-[1.2] tracking-[-0.02em]"
          >
            {/* White base text */}
            <span className="text-white/90">{children}</span>
            {/* Orange overlay — clip-path reveal over white */}
            <span
              className="pointer-events-none absolute inset-0 text-[#ff9a6d]"
              style={{
                clipPath: hovered ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                transition: "clip-path 0.3s steps(10, end)",
                willChange: "clip-path",
              }}
              aria-hidden="true"
            >
              {children}
            </span>
          </span>
        </a>
      </motion.div>
    </div>
  );
}

/* ── CTA item with btn-figma style — also masked ── */
function MaskedCTA({ index, variant }: { index: number; variant: "tenant" | "landlord" }) {
  return (
    <div className="w-full overflow-hidden md:w-auto">
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{
          duration: 0.7,
          ease: EASE_SMOOTH,
          delay: index * STAGGER_DELAY + 0.15,
        }}
      >
        <Button
          href="https://apps.apple.com/in/app/secured-by-flent/id6757275258"
          target="_blank"
          rel="noopener noreferrer"
          fullWidth
          className="mt-4"
        >
          {variant === "landlord" ? "Invite your tenant" : "Join the Waitlist"}
        </Button>
      </motion.div>
    </div>
  );
}

/* ── Menu items config ── */
const NAV_ITEMS = [
  { label: "Back to Flent Homes", href: "https://www.flent.in/" },
  {
    label: "Contact Us",
    href: "https://api.whatsapp.com/send/?phone=918904695925&text=Curious+to+know+more+about+Flent%E2%80%94tell+me+everything%21+%5BWAX-UK6N%5D&type=phone_number&app_absent=0",
    target: "_blank",
    rel: "noopener noreferrer",
  },
] as const;

export function Navbar() {
  const { variant, setVariant, menuOpen, setMenuOpen } = useVariant();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hideToggle, setHideToggle] = useState(false);

  // Hide bottom toggle when How It Works section is in view
  useEffect(() => {
    const target = document.querySelector('[data-section="how-it-works"]');
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHideToggle(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const openMenu = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    closeTimer.current = setTimeout(() => setMenuOpen(false), 300);
  }, []);

  return (
    <>
      {/* Top bar — always visible, z-index above overlay */}
      <div className="fixed top-0 z-[60] w-full">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 pb-2 pt-6 md:px-8 lg:px-12 lg:pt-10 xl:max-w-[1600px] 2xl:max-w-[1800px] 3xl:max-w-[2200px] 4xl:max-w-[2600px] 5xl:max-w-[3600px]">
          {/* Left — Logo */}
          <a href="/" data-navbar-logo className="3xl:scale-150 4xl:scale-[2] 5xl:scale-[2.8]" style={{ transformOrigin: "left center" }}>
            <Image
              src="/assets/logos/flent-logo.svg"
              alt="Flent"
              width={67}
              height={24}
              priority
            />
          </a>

          {/* Right — Hamburger (hover-triggered) */}
          <button
            className="relative z-[60] flex h-10 w-10 items-center justify-center rounded-xl bg-[#202020] transition-colors hover:bg-[#2a2a2a] 3xl:h-14 3xl:w-14 4xl:h-[72px] 4xl:w-[72px] 5xl:h-24 5xl:w-24 3xl:rounded-2xl"
            onMouseEnter={openMenu}
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              boxShadow:
                "0px 78px 47px rgba(0,0,0,0.05), 0px 35px 35px rgba(0,0,0,0.09), 0px 9px 19px rgba(0,0,0,0.1)",
            }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {/* Drop-down menu panel — 60% height, hover-triggered */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Click-away backdrop (transparent) */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
              onMouseEnter={closeMenu}
            />

            {/* Panel */}
            <motion.div
              className="fixed left-0 right-0 top-0 z-50 h-auto overflow-hidden md:h-[37vh]"
              initial={{ y: "-100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.7, ease: EASE_SMOOTH }}
              onMouseEnter={openMenu}
              onMouseLeave={closeMenu}
            >
              {/* Background */}
              <div className="absolute inset-0 bg-[#0e0e0e] border-b border-white/[0.06]" />

              {/* Subtle ambient overlay */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 80%, rgba(255,154,109,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)",
                }}
              />

              {/* Menu content */}
              <div className="relative z-10 flex flex-col px-8 pb-8 pt-24 md:h-full md:justify-end md:pb-10 md:pt-0 md:px-16 lg:px-24 xl:px-32">
                {/* Nav items + CTA in a row */}
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <nav className="flex flex-col gap-1">
                    {NAV_ITEMS.map((item, i) => (
                      <MaskedMenuItem
                        key={item.label}
                        href={item.href}
                        index={i}
                        target={"target" in item ? item.target : undefined}
                        rel={"rel" in item ? item.rel : undefined}
                      >
                        {item.label}
                      </MaskedMenuItem>
                    ))}
                  </nav>

                  {/* CTA */}
                  <MaskedCTA index={NAV_ITEMS.length} variant={variant} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom center — Tenant/Landlord toggle */}
      <nav
        className="fixed bottom-6 left-0 right-0 z-50 flex justify-center md:bottom-[108px]"
        style={{
          pointerEvents: hideToggle ? "none" : "auto",
          transition: "transform 0.5s cubic-bezier(0.77, 0, 0.175, 1)",
          transform: hideToggle ? "translateY(calc(100% + 200px))" : "translateY(0)",
        }}
      >
        <div
          className="flex whitespace-nowrap rounded-full border border-[#2e2e2e] bg-[#1f1f1f] p-1 shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3),0px_10px_20px_0px_rgba(0,0,0,0.2)]"
          style={{ fontFamily: "var(--font-ui)" }}
        >
          <button
            onClick={() => setVariant("tenant")}
            className={`relative rounded-[50px] px-4 py-1.5 text-xs leading-5 transition-all duration-200 md:px-6 md:py-2 md:text-sm 3xl:px-8 3xl:py-3 3xl:text-base 4xl:px-10 4xl:py-4 4xl:text-lg 5xl:px-12 5xl:py-5 5xl:text-xl ${
              variant === "tenant" ? "font-semibold text-black" : "font-medium text-[#a6a6a6] hover:text-white"
            }`}
          >
            {variant === "tenant" && (
              <motion.div
                layoutId="toggle-bg"
                className="absolute inset-0 rounded-[50px] bg-[#ff9a6d] shadow-[0px_4px_6px_0px_rgba(255,154,109,0.15),0px_10px_10px_0px_rgba(0,0,0,0.12)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">I&apos;m a Tenant</span>
          </button>
          <button
            onClick={() => setVariant("landlord")}
            className={`relative rounded-[50px] px-4 py-1.5 text-xs leading-5 transition-all duration-200 md:px-6 md:py-2 md:text-sm 3xl:px-8 3xl:py-3 3xl:text-base 4xl:px-10 4xl:py-4 4xl:text-lg 5xl:px-12 5xl:py-5 5xl:text-xl ${
              variant === "landlord" ? "font-semibold text-black" : "font-medium text-[#a6a6a6] hover:text-white"
            }`}
          >
            {variant === "landlord" && (
              <motion.div
                layoutId="toggle-bg"
                className="absolute inset-0 rounded-[50px] bg-[#ff9a6d] shadow-[0px_4px_6px_0px_rgba(255,154,109,0.15),0px_10px_10px_0px_rgba(0,0,0,0.12)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">I&apos;m a Landlord</span>
          </button>
        </div>
      </nav>
    </>
  );
}
