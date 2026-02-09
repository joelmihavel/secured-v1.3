"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useSuperchatContext } from "@/context/SuperchatContext";
import { SUPERCHAT_CONFIG } from "@/lib/superchat-config";

export default function SuperchatWidget() {
  const [isDesktop, setIsDesktop] = useState(false);
  const hasLoadedForDesktop = useRef(false);
  const initCalled = useRef(false);
  const { pageType } = useSuperchatContext() ?? {
    pageType: "default" as const,
  };

  // Track route changes
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  // Handle viewport changes and property page visibility
  useEffect(() => {
    const media = window.matchMedia(SUPERCHAT_CONFIG.desktopMediaQuery);
    const update = () => {
      if (media.matches) {
        hasLoadedForDesktop.current = true;
        // Hide on property pages, show on others
        if (pageType === "property") {
          window.Superchat?.hide();
        } else {
          window.Superchat?.show();
        }
      } else {
        window.Superchat?.hide();
      }
      setIsDesktop(hasLoadedForDesktop.current || media.matches);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [pageType]);

  // Close widget on route change, then re-show if appropriate
  useEffect(() => {
    if (prevPathname.current !== pathname && initCalled.current) {
      // Route changed - close the chat panel
      window.Superchat?.hide();
      setTimeout(() => {
        const media = window.matchMedia(SUPERCHAT_CONFIG.desktopMediaQuery);
        // Only show if desktop AND not a property page
        if (media.matches && pageType !== "property") {
          window.Superchat?.show();
        }
      }, 100);
      prevPathname.current = pathname;
    }
  }, [pathname, pageType]);

  const handleScriptLoad = useCallback(() => {
    if (typeof window === "undefined" || !window.Superchat?.init) return;
    const media = window.matchMedia(SUPERCHAT_CONFIG.desktopMediaQuery);
    if (!media.matches) return;
    // Initialize without welcome message - just show the floating button
    window.Superchat.init({
      applicationKey: SUPERCHAT_CONFIG.applicationKey,
    });
    initCalled.current = true;
    // Hide immediately if on a property page
    if (pageType === "property") {
      window.Superchat.hide();
    }
  }, [pageType]);

  if (!isDesktop) return null;

  return (
    <Script
      src={SUPERCHAT_CONFIG.sdkUrl}
      referrerPolicy="no-referrer-when-downgrade"
      strategy="afterInteractive"
      onLoad={handleScriptLoad}
    />
  );
}
