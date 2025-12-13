/**
 * PostHog Tracking Utility
 * 
 * Centralized utility for tracking events to PostHog with comprehensive
 * attribution data including page context, session context, and device info.
 * 
 * This module provides:
 * - CTA click tracking with full attribution data
 * - Automatic extraction of UTM parameters and click IDs (gclid, fbclid, etc.)
 * - Session and device context collection
 * - Integration with PostHog's attribution system
 * 
 * @see {@link https://posthog.com/docs} PostHog Documentation
 * @see {@link docs/POSTHOG_ATTRIBUTION.md} Full Attribution Implementation Guide
 */

import posthog from 'posthog-js';

/**
 * Check if PostHog is available and initialized
 */
export function isPostHogAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  return typeof posthog !== 'undefined' && posthog.__loaded === true;
}

/**
 * Extract page context metadata
 */
export function getPageContext(): {
  page_url: string;
  page_path: string;
  page_title: string;
  page_hash?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  gbraid?: string;
  wbraid?: string;
} {
  if (typeof window === 'undefined') {
    return {
      page_url: '',
      page_path: '',
      page_title: '',
    };
  }

  const url = new URL(window.location.href);
  const searchParams = url.searchParams;

  return {
    page_url: window.location.href,
    page_path: window.location.pathname,
    page_title: document.title,
    page_hash: url.hash || undefined,
    referrer: document.referrer || undefined,
    utm_source: searchParams.get('utm_source') || undefined,
    utm_medium: searchParams.get('utm_medium') || undefined,
    utm_campaign: searchParams.get('utm_campaign') || undefined,
    utm_term: searchParams.get('utm_term') || undefined,
    utm_content: searchParams.get('utm_content') || undefined,
    gclid: searchParams.get('gclid') || undefined,
    fbclid: searchParams.get('fbclid') || undefined,
    gbraid: searchParams.get('gbraid') || undefined,
    wbraid: searchParams.get('wbraid') || undefined,
  };
}

/**
 * Extract session context from PostHog
 */
export function getSessionContext(): {
  session_id?: string;
  distinct_id?: string;
} {
  if (!isPostHogAvailable()) {
    return {};
  }

  try {
    return {
      session_id: posthog.get_session_id?.() || undefined,
      distinct_id: posthog.get_distinct_id?.() || undefined,
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to get PostHog session context:', error);
    }
    return {};
  }
}

/**
 * Extract device and browser context
 */
export function getDeviceContext(): {
  screen_width: number;
  screen_height: number;
  user_agent: string;
} {
  if (typeof window === 'undefined') {
    return {
      screen_width: 0,
      screen_height: 0,
      user_agent: '',
    };
  }

  return {
    screen_width: window.screen?.width || 0,
    screen_height: window.screen?.height || 0,
    user_agent: navigator.userAgent || '',
  };
}

/**
 * CTA click event data interface
 */
export interface CTAClickData {
  cta_id: string;
  cta_text: string;
  cta_type: 'button' | 'link' | 'form_submit';
  cta_variant?: string;
  cta_destination?: string;
  page_section?: string;
}

/**
 * Track a CTA click event to PostHog
 * 
 * @param ctaData - CTA click data
 * @param additionalProperties - Optional additional properties to include
 */
export function trackCTAClick(
  ctaData: CTAClickData,
  additionalProperties?: Record<string, any>
): void {
  if (!isPostHogAvailable()) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('PostHog is not available. CTA click not tracked.');
    }
    return;
  }

  try {
    const pageContext = getPageContext();
    const sessionContext = getSessionContext();
    const deviceContext = getDeviceContext();

    const eventProperties = {
      // CTA Identification
      cta_id: ctaData.cta_id,
      cta_text: ctaData.cta_text,
      cta_type: ctaData.cta_type,
      cta_variant: ctaData.cta_variant,
      cta_destination: ctaData.cta_destination,
      page_section: ctaData.page_section,

      // Page Context
      ...pageContext,

      // Session Context
      ...sessionContext,

      // Device Context
      ...deviceContext,

      // Timestamp
      timestamp: new Date().toISOString(),

      // Additional properties
      ...additionalProperties,
    };

    posthog.capture('cta_clicked', eventProperties);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to track CTA click:', error);
    }
  }
}

/**
 * Extract text content from a React element or DOM node
 */
export function extractTextContent(element: React.ReactNode | HTMLElement | null): string {
  if (!element) return '';

  // Handle React nodes
  if (typeof element === 'string') return element;
  if (typeof element === 'number') return String(element);

  // Handle DOM elements
  if (element instanceof HTMLElement) {
    return element.textContent?.trim() || element.innerText?.trim() || '';
  }

  // Handle React elements (basic extraction)
  if (typeof element === 'object' && 'props' in element) {
    const props = (element as any).props;
    if (props.children) {
      if (typeof props.children === 'string') {
        return props.children;
      }
      if (Array.isArray(props.children)) {
        return props.children
          .map((child: any) => extractTextContent(child))
          .join(' ')
          .trim();
      }
    }
  }

  return '';
}

/**
 * Generate a unique CTA ID from element attributes or content
 */
export function generateCTAId(
  element: HTMLElement | null,
  fallbackText?: string
): string {
  if (!element) {
    return fallbackText ? `cta_${fallbackText.toLowerCase().replace(/\s+/g, '_')}` : 'cta_unknown';
  }

  // Check for data-cta-id attribute (highest priority)
  const dataCtaId = element.getAttribute('data-cta-id');
  if (dataCtaId) return dataCtaId;

  // Check for id attribute
  const id = element.id;
  if (id) return id;

  // Check for name attribute
  const name = element.getAttribute('name');
  if (name) return name;

  // Generate from text content
  const text = element.textContent?.trim() || element.innerText?.trim() || fallbackText || '';
  if (text) {
    return `cta_${text.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 50)}`;
  }

  // Fallback to element type and position
  const tagName = element.tagName.toLowerCase();
  const index = Array.from(element.parentElement?.children || []).indexOf(element);
  return `cta_${tagName}_${index}`;
}


