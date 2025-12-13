/**
 * CTA Tracker Component
 * 
 * Client component that initializes the CTA auto-discovery system
 * after PostHog is available.
 */

'use client';

import { useEffect } from 'react';
import { initCTAAutoTracker } from '@/lib/cta-auto-tracker';

/**
 * Component that initializes CTA tracking
 * Should be placed inside the PostHog provider
 */
export function CTATracker() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Initialize the auto-tracker
    const cleanup = initCTAAutoTracker();

    // Cleanup on unmount
    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  // This component doesn't render anything
  return null;
}


