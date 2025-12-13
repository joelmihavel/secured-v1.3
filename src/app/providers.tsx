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
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false,
        capture_exceptions: true, // Enable automatic exception capturing
        autocapture: {
          noCaptureProp: "ph-no-capture",  // Enable ph-no-capture attribute support
        },
        // Use before_send hook to filter autocapture events for elements with ph-no-capture
        // This prevents duplicate events when we're already tracking CTAs with custom events
        before_send: (event: any) => {
          // Block autocapture events for elements that have ph-no-capture attribute/class
          if (event.event === '$autocapture' && event.properties) {
            const target = event.properties.$event_type === 'click' ? event.properties.$elements?.[0] : null;
            if (target) {
              const hasPhNoCapture = target.attributes?.some((attr: any) =>
                attr.attr === 'ph-no-capture' || (attr.attr === 'class' && attr.value?.includes('ph-no-capture'))
              );

              if (hasPhNoCapture) {
                // Return null to prevent the autocapture event from being sent
                // We're already tracking this with our custom cta_clicked event
                return null;
              }
            }
          }

          return event;
        },
        // Note: PostHog automatically captures UTM params and click IDs (gclid, fbclid) from URL
      };

      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, initConfig as any);
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
