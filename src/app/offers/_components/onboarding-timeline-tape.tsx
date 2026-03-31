"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";

function clamp01(n: number): number {
  if (Number.isNaN(n) || !Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function getScrollY(): number {
  if (typeof window === "undefined") return 0;
  return (
    window.scrollY ??
    document.documentElement.scrollTop ??
    document.body.scrollTop ??
    0
  );
}

/** How much of the vertical scroll range maps to 0→1. Lower = tape fills sooner (stays in sync with last cards). */
const TIMELINE_PROGRESS_COMPRESSION = 0.99;

/**
 * Scroll progress [0, 1] through the timeline block.
 * - 0 while scrollY is before the timeline start (empty tape when landing on step 3).
 * - 1 reached partway through the block so the tape is full before Terms (compressed range).
 */
export function useTimelineScrollProgress(
  scopeRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  prefersReducedMotion: boolean | null
): number {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  useLayoutEffect(() => {
    if (!enabled || prefersReducedMotion === true) {
      return;
    }

    let cancelled = false;
    let retryRaf = 0;
    let detach: (() => void) | undefined;

    const attach = (el: HTMLElement) => {
      const update = () => {
        rafRef.current = 0;
        if (cancelled) return;
        const scrollY = getScrollY();
        const rect = el.getBoundingClientRect();
        const elTop = rect.top + scrollY;
        const elHeight = el.offsetHeight;
        const vh = window.innerHeight;

        // Start at 0 when page scroll is before the timeline top (first paint on step 3).
        const scrollStart = elTop;
        // Natural distance to traverse the block in document space (short blocks still get a minimum span).
        const naturalTravel = Math.max(elHeight - vh, elHeight * 0.4, 1);
        const scrollEnd =
          scrollStart + naturalTravel * TIMELINE_PROGRESS_COMPRESSION;
        const denom = scrollEnd - scrollStart;
        const p = denom > 0 ? (scrollY - scrollStart) / denom : 0;
        setProgress(clamp01(p));
      };

      const schedule = () => {
        if (rafRef.current !== 0) return;
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = 0;
          update();
        });
      };

      update();
      window.addEventListener("scroll", schedule, { passive: true, capture: true });
      document.addEventListener("scroll", schedule, { passive: true, capture: true });
      window.addEventListener("resize", schedule, { passive: true });

      const ro = new ResizeObserver(() => schedule());
      ro.observe(el);

      return () => {
        ro.disconnect();
        window.removeEventListener("scroll", schedule, { capture: true });
        document.removeEventListener("scroll", schedule, { capture: true });
        window.removeEventListener("resize", schedule);
        if (rafRef.current !== 0) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = 0;
        }
      };
    };

    const tryAttach = () => {
      const el = scopeRef.current;
      if (el) {
        detach = attach(el);
        return;
      }
      if (!cancelled) {
        retryRaf = requestAnimationFrame(tryAttach);
      }
    };

    tryAttach();

    return () => {
      cancelled = true;
      if (retryRaf !== 0) {
        cancelAnimationFrame(retryRaf);
        retryRaf = 0;
      }
      detach?.();
    };
  }, [enabled, prefersReducedMotion, scopeRef]);

  if (!enabled) {
    return 0;
  }
  if (prefersReducedMotion === true) {
    return 1;
  }
  return progress;
}

type OnboardingTimelineTapeProps = {
  progress: number;
};

/**
 * Decorative measuring-tape rail: yellow track, tick marks, top anchor, fill height = progress.
 */
export function OnboardingTimelineTape({ progress }: OnboardingTimelineTapeProps) {
  const p = clamp01(progress);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm border border-black/25 bg-[#FFE98A]"
      aria-hidden
    >
      {/* Tick marks (ruler) */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: [
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.55) 3px, rgba(0,0,0,0.55) 4px)",
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 15px, rgba(0,0,0,0.35) 15px, rgba(0,0,0,0.35) 16px)",
          ].join(", "),
        }}
      />

      {/* Scroll fill */}
      <div
        className="absolute left-0 right-0 top-0 bg-[#E6B422]/90"
        style={{ height: `${p * 100}%` }}
      />

      {/* Top anchor: red square + dot */}
      <div className="absolute -top-1.5 left-1/2 z-10 flex h-3 w-3 -translate-x-1/2 items-center justify-center rounded-sm border border-black bg-[#E24A4A] shadow-sm">
        <div className="h-1 w-1 rounded-full bg-black" />
      </div>
    </div>
  );
}
