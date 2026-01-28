/**
 * Hook for tracking when a section comes into view
 * 
 * Uses Intersection Observer to track when sections become visible
 * and fires a PostHog event with comprehensive attribution data.
 * 
 * Features:
 * - Tracks once per session (prevents duplicate events)
 * - Configurable threshold and rootMargin
 * - Minimum view time requirement
 * - Full attribution data included
 * - Automatically includes page path from Next.js router
 */

import { useEffect, useRef, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent, isPostHogAvailable } from '@/lib/posthog-tracking';

export interface SectionViewTrackingConfig {
  sectionId: string;
  sectionName: string;
  threshold?: number; // 0-1, percentage of element visible
  rootMargin?: string; // e.g., '0px' or '-100px'
  minViewTime?: number; // Minimum milliseconds visible before tracking
  additionalProperties?: Record<string, any>;
}

// Default configuration for section tracking
const DEFAULT_CONFIG = {
  threshold: 0.3,
  rootMargin: '0px',
  minViewTime: 1000, // 1 second
} as const;

/**
 * Hook to track when a section comes into view
 * 
 * @example
 * const sectionRef = useSectionViewTracking({
 *   sectionId: 'coming-soon',
 *   sectionName: 'Upcoming Homes',
 * });
 * 
 * return <section ref={sectionRef}>...</section>
 */
export function useSectionViewTracking({
  sectionId,
  sectionName,
  threshold = DEFAULT_CONFIG.threshold,
  rootMargin = DEFAULT_CONFIG.rootMargin,
  minViewTime = DEFAULT_CONFIG.minViewTime,
  additionalProperties = {},
}: SectionViewTrackingConfig) {
  const pathname = usePathname();
  const sectionRef = useRef<HTMLElement>(null);
  const viewStartTimeRef = useRef<number | null>(null);
  const hasTrackedRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize observer options to prevent unnecessary re-creation
  const observerOptions = useMemo(
    () => ({
      threshold,
      rootMargin,
    }),
    [threshold, rootMargin]
  );

  // Memoize session key
  const sessionKey = useMemo(() => `section_viewed_${sectionId}`, [sectionId]);

  useEffect(() => {
    // Check if already tracked in this session
    if (typeof window !== 'undefined' && sessionStorage.getItem(sessionKey)) {
      hasTrackedRef.current = true;
      return;
    }

    const element = sectionRef.current;
    if (!element || hasTrackedRef.current) return;

    // Wait for PostHog to be available
    if (!isPostHogAvailable()) {
      // Retry after a short delay
      checkIntervalRef.current = setInterval(() => {
        if (isPostHogAvailable() && element && !hasTrackedRef.current) {
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
            checkIntervalRef.current = null;
          }
          setupObserver();
        }
      }, 100);

      // Timeout after 5 seconds
      const timeoutId = setTimeout(() => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
          checkIntervalRef.current = null;
        }
      }, 5000);

      return () => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current);
        }
        clearTimeout(timeoutId);
      };
    }

    function setupObserver() {
      if (!element || hasTrackedRef.current || !isPostHogAvailable()) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Start tracking view time
              if (viewStartTimeRef.current === null) {
                viewStartTimeRef.current = Date.now();
              }
            } else {
              // Check if minimum view time met
              if (viewStartTimeRef.current !== null) {
                const viewDuration = Date.now() - viewStartTimeRef.current;
                if (viewDuration >= minViewTime && !hasTrackedRef.current) {
                  // Mark as tracked in session storage
                  if (typeof window !== 'undefined') {
                    sessionStorage.setItem(sessionKey, 'true');
                  }

                  // Track the event with automatic page path
                  trackEvent('section_viewed', {
                    section_id: sectionId,
                    section_name: sectionName,
                    view_duration_ms: viewDuration,
                    view_threshold: threshold,
                    page_path: pathname || undefined,
                    ...additionalProperties,
                  });

                  hasTrackedRef.current = true;
                  
                  // Disconnect observer after tracking
                  if (observerRef.current) {
                    observerRef.current.disconnect();
                    observerRef.current = null;
                  }
                }
                viewStartTimeRef.current = null;
              }
            }
          });
        },
        observerOptions
      );

      observerRef.current.observe(element);
    }

    setupObserver();

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
    // Note: We intentionally exclude additionalProperties from deps to prevent
    // unnecessary re-runs. The properties are captured at tracking time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId, sectionName, threshold, rootMargin, minViewTime, pathname, sessionKey, observerOptions]);

  return sectionRef;
}
