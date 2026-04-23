"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export function useScrollPin(
  containerRef: React.RefObject<HTMLElement | null>,
  contentRef: React.RefObject<HTMLElement | null>,
  onUpdate?: (progress: number) => void,
) {
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    triggerRef.current = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: contentRef.current,
      scrub: 0.5,
      onUpdate: (self) => onUpdate?.(self.progress),
    });

    return () => {
      triggerRef.current?.kill();
    };
  }, [containerRef, contentRef, onUpdate]);

  return triggerRef;
}
