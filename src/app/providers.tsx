/**
 * PostHog Provider
 * 
 * Initializes PostHog analytics with autocapture exclusion for tracked CTAs.
 * Configures attribution tracking for Meta Ads (fbclid) and Google Ads (gclid).
 * 
 * Features:
 * - Prevents duplicate events by excluding tracked CTAs from autocapture
 * - Captures pageviews with full URL (including attribution parameters)
 * - Automatically captures UTM parameters and click IDs from URLs
 * 
 * @see {@link docs/POSTHOG_ATTRIBUTION.md} Full Attribution Implementation Guide
 */
'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from "next/navigation"
import { CTATracker } from "@/components/tracking/CTATracker"

type CaptureResultLike = {
  event?: string;
  properties?: {
    $elements?: Array<{
      attributes?: Record<string, unknown>;
      attr_class?: string;
    }>;
  };
}

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture('$pageview', {
        '$current_url': url,
      })
    }
  }, [pathname, searchParams])

  return null
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      const initConfig = {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://ph.flent.in',
        ui_host: 'https://us.posthog.com', // Required for toolbar to work with reverse proxy
        person_profiles: 'identified_only' as const,
        capture_pageview: false,
        capture_pageleave: true,
        // Note: PostHog automatically captures UTM params and click IDs (gclid, fbclid) from URL
        autocapture: {
          // Respect ph-no-capture attribute to prevent duplicate events on tracked CTAs
          css_selector_allowlist: undefined,
          dom_event_allowlist: undefined,
          element_allowlist: undefined,
        },
        // Safety net: filter autocapture events for elements already tracked by our CTA system
        before_send: (cr: CaptureResultLike | null) => {
          if (!cr) return null;
          if (cr.event === '$autocapture') {
            const elements = cr.properties?.$elements;
            if (Array.isArray(elements) && elements.length > 0) {
              const targetEl = elements[0];
              // Drop autocapture if the element has ph-no-capture attribute or class
              if (
                targetEl?.attributes?.['ph-no-capture'] !== undefined ||
                targetEl?.attr_class?.includes('ph-no-capture')
              ) {
                return null;
              }
            }
          }
          return cr;
        },
      };

      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, initConfig);
    }
  }, [])

  return (
    <PostHogProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      <CTATracker />
      {children}
    </PostHogProvider>
  )
}
