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
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://ph.flent.in',
        ui_host: 'https://us.posthog.com', // Required for toolbar to work with reverse proxy
        person_profiles: 'identified_only' as const,
        capture_pageview: false,
        // Note: PostHog automatically captures UTM params and click IDs (gclid, fbclid) from URL
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
