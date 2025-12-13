/**
 * React Hook for CTA Tracking
 * 
 * Provides a convenient hook for tracking CTA clicks with automatic
 * context extraction from Next.js routing.
 * 
 * Features:
 * - Automatic page context extraction
 * - Integration with Next.js routing
 * - Full attribution data included in events
 * 
 * @see {@link docs/POSTHOG_ATTRIBUTION.md} Full Attribution Implementation Guide
 */

import { useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { trackCTAClick, CTAClickData, isPostHogAvailable } from '@/lib/posthog-tracking';

/**
 * Hook for tracking CTA clicks
 * 
 * @returns Object with trackCTAClick function
 */
export function useCTATracking() {
  const pathname = usePathname();

  const trackClick = useCallback(
    (
      ctaData: Omit<CTAClickData, 'page_section'> & { page_section?: string },
      additionalProperties?: Record<string, any>
    ) => {
      if (!isPostHogAvailable()) {
        return;
      }

      // Add current pathname as context if page_section not provided
      const data: CTAClickData = {
        ...ctaData,
        page_section: ctaData.page_section || pathname || undefined,
      };

      trackCTAClick(data, additionalProperties);
    },
    [pathname]
  );

  return {
    trackCTAClick: trackClick,
    isPostHogAvailable: isPostHogAvailable(),
  };
}


