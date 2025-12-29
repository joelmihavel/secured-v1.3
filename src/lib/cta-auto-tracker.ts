/**
 * CTA Auto-Discovery System
 * 
 * Automatically discovers and tracks CTAs across the website using heuristics
 * and data attributes. Works with dynamically loaded content via MutationObserver.
 * 
 * Features:
 * - Automatic CTA discovery using pattern matching
 * - Sets ph-no-capture to prevent duplicate autocapture events
 * - Handles dynamically added content via MutationObserver
 * - Tracks clicks with full attribution data
 * 
 * @see {@link docs/POSTHOG_ATTRIBUTION.md} Full Attribution Implementation Guide
 */

import { trackEvent, generateCTAId, extractTextContent, isPostHogAvailable } from './posthog-tracking';

/**
 * CTA patterns to detect
 */
const CTA_PATTERNS = {
  whatsapp: {
    hrefPatterns: ['wa.me', 'whatsapp.com'],
    type: 'link' as const,
  },
  calcom: {
    hrefPatterns: ['cal.com'],
    type: 'link' as const,
  },
  external: {
    hrefPatterns: ['http://', 'https://'],
    type: 'link' as const,
  },
  internal: {
    hrefPatterns: ['/'],
    type: 'link' as const,
  },
  formSubmit: {
    selector: 'button[type="submit"], input[type="submit"]',
    type: 'form_submit' as const,
  },
};

/**
 * Check if an element matches a CTA pattern
 */
function matchesCTAPattern(element: HTMLElement): {
  isCTA: boolean;
  type?: 'button' | 'link' | 'form_submit';
  destination?: string;
} {
  // Skip if already tracked
  if (element.hasAttribute('data-cta-tracked')) {
    return { isCTA: false };
  }

  // Check for explicit data-cta-id attribute (always track)
  if (element.hasAttribute('data-cta-id')) {
    const href = (element as HTMLAnchorElement).href;
    return {
      isCTA: true,
      type: href ? 'link' : 'button',
      destination: href,
    };
  }

  // Check if it's a link
  if (element.tagName === 'A' || element.tagName === 'a') {
    const href = (element as HTMLAnchorElement).href;
    if (!href) return { isCTA: false };

    // Check WhatsApp links
    if (CTA_PATTERNS.whatsapp.hrefPatterns.some(pattern => href.includes(pattern))) {
      return {
        isCTA: true,
        type: 'link',
        destination: href,
      };
    }

    // Check Cal.com links
    if (CTA_PATTERNS.calcom.hrefPatterns.some(pattern => href.includes(pattern))) {
      return {
        isCTA: true,
        type: 'link',
        destination: href,
      };
    }

    // Check external links
    if (CTA_PATTERNS.external.hrefPatterns.some(pattern => href.startsWith(pattern))) {
      return {
        isCTA: true,
        type: 'link',
        destination: href,
      };
    }

    // Check internal navigation links (but skip hash-only links)
    if (href.startsWith('/') || href.startsWith(window.location.origin + '/')) {
      // Skip if it's just a hash link
      if (!href.includes('#') || href.split('#')[0] !== window.location.href.split('#')[0]) {
        return {
          isCTA: true,
          type: 'link',
          destination: href,
        };
      }
    }
  }

  // Check if it's a button
  if (element.tagName === 'BUTTON' || element.tagName === 'button') {
    const button = element as HTMLButtonElement;

    // Check form submit buttons
    if (button.type === 'submit') {
      return {
        isCTA: true,
        type: 'form_submit',
      };
    }

    // Check buttons with onClick or href-like behavior
    if (button.onclick || button.getAttribute('onclick')) {
      return {
        isCTA: true,
        type: 'button',
      };
    }
  }

  // Check for buttons with Button component classes (if they exist)
  if (element.classList.contains('button') || element.classList.contains('btn')) {
    return {
      isCTA: true,
      type: 'button',
    };
  }

  return { isCTA: false };
}

/**
 * Extract CTA metadata from an element
 */
function extractCTAMetadata(element: HTMLElement): {
  cta_id: string;
  cta_text: string;
  cta_type: 'button' | 'link' | 'form_submit';
  cta_destination?: string;
  cta_variant?: string;
  page_section?: string;
} {
  const patternMatch = matchesCTAPattern(element);
  if (!patternMatch.isCTA) {
    throw new Error('Element is not a CTA');
  }

  const ctaText = element.textContent?.trim() || element.innerText?.trim() || '';
  const ctaId = element.getAttribute('data-cta-id') || generateCTAId(element, ctaText);
  const ctaContext = element.getAttribute('data-cta-context') || undefined;
  const ctaVariant = element.getAttribute('data-cta-variant') ||
    element.getAttribute('data-variant') ||
    undefined;

  // Try to find parent section
  let pageSection = ctaContext;
  if (!pageSection) {
    const section = element.closest('section[id], [data-section], [id^="section"]');
    if (section) {
      pageSection = section.id || section.getAttribute('data-section') || undefined;
    }
  }

  return {
    cta_id: ctaId,
    cta_text: ctaText,
    cta_type: patternMatch.type || 'button',
    cta_destination: patternMatch.destination || (element as HTMLAnchorElement).href || undefined,
    cta_variant: ctaVariant,
    page_section: pageSection,
  };
}

/**
 * Track a CTA click
 */
function trackCTAClickFromElement(element: HTMLElement, event: MouseEvent): void {
  if (!isPostHogAvailable()) {
    return;
  }

  try {
    const metadata = extractCTAMetadata(element);

    // trackCTAClick(metadata); // Removed to allow autocapture and prevent duplicates

    // Track specific "External URL Click" event
    if (metadata.cta_type === 'link' && metadata.cta_destination) {
      const url = metadata.cta_destination;
      const isExternal = (url.startsWith('http') && !url.includes(window.location.hostname)) ||
        url.startsWith('whatsapp:') ||
        url.startsWith('mailto:') ||
        url.startsWith('tel:');

      if (isExternal) {
        trackEvent('External URL Click', {
          destination_url: metadata.cta_destination,
          cta_text: metadata.cta_text,
          cta_id: metadata.cta_id,
          page_section: metadata.page_section
        });
      }
    }

    // Mark as tracked to avoid duplicate tracking
    element.setAttribute('data-cta-tracked', 'true');
  } catch (error) {
    // Silently fail if element is not a CTA
    if (process.env.NODE_ENV === 'development') {
      console.debug('Element is not a trackable CTA:', error);
    }
  }
}

/**
 * Process a single element for CTA tracking
 */
function processElement(element: HTMLElement): void {
  if (!isPostHogAvailable()) {
    return;
  }

  const patternMatch = matchesCTAPattern(element);
  if (!patternMatch.isCTA) {
    return;
  }

  // Skip if already processed
  if (element.hasAttribute('data-cta-tracked')) {
    return;
  }

  // Add ph-no-capture to prevent PostHog autocapture from tracking this element
  // Set both attribute (for noCaptureProp config) and class (default behavior)
  // element.setAttribute('ph-no-capture', '');
  // element.classList.add('ph-no-capture');

  // Attach click listener
  const clickHandler = (e: MouseEvent) => {
    trackCTAClickFromElement(element, e);
  };

  element.addEventListener('click', clickHandler, { once: false });
  element.setAttribute('data-cta-tracked', 'true');
}

/**
 * Scan the DOM for CTAs and attach tracking
 */
function scanForCTAs(root: HTMLElement = document.body): void {
  if (!isPostHogAvailable()) {
    return;
  }

  // Find all potential CTA elements
  const selectors = [
    'a[href]',
    'button',
    'input[type="submit"]',
    '[data-cta-id]',
    '[role="button"]',
  ];

  selectors.forEach(selector => {
    try {
      const elements = root.querySelectorAll<HTMLElement>(selector);
      elements.forEach(element => {
        processElement(element);
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Failed to query selector ${selector}:`, error);
      }
    }
  });
}

/**
 * Initialize the CTA auto-tracker
 */
export function initCTAAutoTracker(): () => void {
  if (typeof window === 'undefined') {
    return () => { };
  }

  let mutationObserver: MutationObserver | null = null;
  let bodyObserver: MutationObserver | null = null;
  let checkPostHogInterval: NodeJS.Timeout | null = null;
  let timeoutId: NodeJS.Timeout | null = null;

  function startTracking() {
    // Initial scan
    if (document.body) {
      scanForCTAs(document.body);
    } else {
      // Wait for body to be available
      bodyObserver = new MutationObserver(() => {
        if (document.body) {
          scanForCTAs(document.body);
          bodyObserver?.disconnect();
          bodyObserver = null;
        }
      });
      bodyObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    }

    // Watch for dynamically added content
    mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            // Process the element itself
            processElement(element);
            // Process children
            scanForCTAs(element);
          }
        });
      });
    });

    if (document.body) {
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  // Wait for PostHog to be available
  checkPostHogInterval = setInterval(() => {
    if (isPostHogAvailable()) {
      if (checkPostHogInterval) {
        clearInterval(checkPostHogInterval);
        checkPostHogInterval = null;
      }
      startTracking();
    }
  }, 100);

  // Timeout after 10 seconds
  timeoutId = setTimeout(() => {
    if (checkPostHogInterval) {
      clearInterval(checkPostHogInterval);
      checkPostHogInterval = null;
    }
    if (isPostHogAvailable()) {
      startTracking();
    }
  }, 10000);

  // Return cleanup function
  return () => {
    if (checkPostHogInterval) {
      clearInterval(checkPostHogInterval);
    }
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (mutationObserver) {
      mutationObserver.disconnect();
    }
    if (bodyObserver) {
      bodyObserver.disconnect();
    }
  };
}

