"use client";

import { useEffect, useState } from "react";
import { MOBILE_BREAKPOINT } from "@/constants/breakpoints";

/**
 * Hook to detect if the current viewport is mobile (< 768px)
 * Uses matchMedia for efficient detection and updates on resize
 * 
 * @returns boolean indicating if viewport is mobile
 * 
 * @example
 * ```tsx
 * const isMobile = useMobile();
 * if (isMobile) {
 *   // Mobile-specific logic
 * }
 * ```
 */
export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Use matchMedia for better performance than window.innerWidth
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    const update = () => setIsMobile(mql.matches);
    
    // Set initial value
    update();
    
    // Listen for changes
    mql.addEventListener("change", update);
    
    return () => mql.removeEventListener("change", update);
  }, []);

  return isMobile;
}
