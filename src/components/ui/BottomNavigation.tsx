"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconChevronUp as ChevronUp } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { getPropertyWhatsappLink, WHATSAPP_LINK } from "@/constants";
import { Property } from "@/lib/webflow";

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const navLinks = [
  { name: "Rooms", href: "#rooms" },
  { name: "Amenities", href: "#amenities-heading" },
  { name: "Neighborhood", href: "#neighborhood" },
  { name: "How it Works", href: "#how-it-works" },
  { name: "FAQ", href: "#faq" },
];

export const BottomNavigation: React.FC<{ property: Property }> = ({
  property,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Rooms");
  const [showMobileNav, setShowMobileNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      // Check if user has scrolled to the rooms section for mobile nav visibility
      const roomsSection = document.getElementById("rooms");
      if (roomsSection) {
        const roomsTop = roomsSection.offsetTop;
        setShowMobileNav(window.scrollY >= roomsTop - 100);
      }

      for (const link of navLinks) {
        const element = document.querySelector(link.href) as HTMLElement;
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(link.name);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
    e.preventDefault();
    e.stopPropagation();

    const targetId = href.replace("#", "");
    const link = navLinks.find((l) => l.href === href);
    if (link) setActiveSection(link.name);

    // Close the modal first
    setIsOpen(false);

    // Wait for modal to close, then scroll
    setTimeout(() => {
      const element = document.getElementById(targetId);

      if (element) {
        const navbarHeight = 100; // Account for navbar + some breathing room
        const elementPosition =
          element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 300); // Match the modal close animation duration
  };

  return (
    <>
      {/* Mobile Navigation (Expandable Menu) */}
      <AnimatePresence>
        {showMobileNav && (
          <motion.div
            className="md:hidden fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.div
              className="bg-white shadow-2xl border border-black pointer-events-auto overflow-hidden mx-auto"
              initial="closed"
              animate={isOpen ? "open" : "closed"}
              variants={{
                open: {
                  height: "auto",
                  width: "340px",
                  borderRadius: "24px",
                },
                closed: {
                  height: "68px",
                  width: "fit-content",
                  minWidth: "90vw",
                  borderRadius: "34px",
                },
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ maxWidth: "calc(100vw - 32px)" }}
            >
              <div className="flex flex-col w-full">
                {/* Header / Collapsed View */}
                <div
                  className="flex items-center justify-between p-2 gap-1 w-full cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {/* Left: Section Selector */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors">
                    <span className="font-heading text-fuild-medium text-text-main whitespace-nowrap">
                      {activeSection}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <ChevronUp className="w-5 h-5 text-text-main" />
                    </motion.div>
                  </div>

                  {/* Right: CTA */}
                  <Button
                    href={getPropertyWhatsappLink(property.fieldData.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="secondary"
                    size="md"
                    leftIcon={<WhatsAppIcon />}
                    className="rounded-full"
                  >
                    Chat With Us
                  </Button>
                </div>

                {/* Expanded Content: Other Links */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-2 pb-2 flex flex-col"
                    >
                      <div className="h-px bg-gray-100 w-full my-2 mx-2" />
                      {navLinks.map((link) => (
                        <div
                          key={link.name}
                          onClick={(e) => handleLinkClick(e, link.href)}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-3 rounded-full cursor-pointer transition-colors duration-200 hover:bg-ground-brown/5",
                            activeSection === link.name && "bg-black/5"
                          )}
                        >
                          <span className="font-heading text-button-link text-text-main font-bold tracking-wide">
                            {link.name}
                          </span>
                          {activeSection === link.name && (
                            <div className="w-2 h-2 rounded-full bg-black flex-shrink-0" />
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navigation (Simple List) */}
      <motion.nav
        className="hidden md:block fixed bottom-0 left-1/2 -translate-x-1/2 z-50 pb-8"
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          delay: 1.5,
        }}
      >
        <div className="bg-white/95 backdrop-blur-lg rounded-full shadow-2xl border border-text-main px-3 py-2">
          <div className="flex items-center gap-4">
            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  // Use the same reliable scrolling logic for desktop too
                  handleLinkClick(e, link.href);
                }}
              >
                {link.name}
              </Button>
            ))}

            {/* Chat With Us Button */}
            <Button
              href={getPropertyWhatsappLink(property.fieldData.name)}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="md"
              leftIcon={<WhatsAppIcon />}
              className="rounded-full"
            >
              Chat With Us
            </Button>
          </div>
        </div>
      </motion.nav>
    </>
  );
};
