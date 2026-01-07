# PostHog Attribution & CTA Tracking Implementation

## Overview

This document describes the complete attribution and CTA (Call-to-Action) tracking implementation using PostHog. The system tracks CTA clicks with full attribution data including UTM parameters and click IDs from Meta Ads (Facebook) and Google Ads, while preventing duplicate events from PostHog's autocapture feature.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PostHog Integration                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐    ┌──────────────────────────┐   │
│  │  PostHog Init     │───▶│  Autocapture Config      │   │
│  │  (providers.tsx)  │    │  - noCaptureProp         │   │
│  │                   │    │  - before_send filter    │   │
│  └──────────────────┘    └──────────────────────────┘   │
│           │                                               │
│           ▼                                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │         CTA Tracking System                       │   │
│  ├──────────────────────────────────────────────────┤   │
│  │                                                   │   │
│  │  ┌──────────────┐      ┌────────────────────┐   │   │
│  │  │ Button       │      │ Auto-Tracker       │   │   │
│  │  │ Component    │      │ (cta-auto-tracker) │   │   │
│  │  │              │      │                    │   │   │
│  │  │ - Sets       │      │ - Discovers CTAs   │   │   │
│  │  │   ph-no-     │      │ - Sets ph-no-      │   │   │
│  │  │   capture    │      │   capture          │   │   │
│  │  │ - Tracks     │      │ - Tracks clicks    │   │   │
│  │  │   clicks     │      │                    │   │   │
│  │  └──────────────┘      └────────────────────┘   │   │
│  │           │                      │               │   │
│  │           └──────────┬───────────┘               │   │
│  │                      ▼                           │   │
│  │            ┌──────────────────┐                  │   │
│  │            │  trackCTAClick() │                  │   │
│  │            │  (posthog-      │                  │   │
│  │            │   tracking.ts)  │                  │   │
│  │            └──────────────────┘                  │   │
│  │                      │                           │   │
│  │                      ▼                           │   │
│  │         ┌────────────────────────┐               │   │
│  │         │  Attribution Data      │               │   │
│  │         │  - UTM params          │               │   │
│  │         │  - Click IDs (gclid,   │               │   │
│  │         │    fbclid, etc.)       │               │   │
│  │         │  - Page context        │               │   │
│  │         │  - Session context     │               │   │
│  │         └────────────────────────┘               │   │
│  │                      │                           │   │
│  │                      ▼                           │   │
│  │            posthog.capture('cta_clicked')         │   │
│  │                                                   │   │
│  └───────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. PostHog Provider (`src/app/providers.tsx`)

**Purpose**: Initializes PostHog and configures autocapture exclusion.

**Key Features**:
- Configures `autocapture.noCaptureProp: "ph-no-capture"` to enable attribute-based exclusion
- Uses `before_send` hook to filter autocapture events for elements with `ph-no-capture`
- Manually captures pageviews with full URL (including query parameters for attribution)

**Configuration**:
```typescript
{
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
  person_profiles: 'identified_only',
  capture_pageview: false, // Manual pageview tracking
  autocapture: {
    noCaptureProp: "ph-no-capture", // Enable attribute-based exclusion
  },
  before_send: (event) => {
    // Block autocapture events for elements with ph-no-capture
    if (event.event === '$autocapture' && hasPhNoCapture) {
      return null; // Prevent duplicate events
    }
    return event;
  }
}
```

### 2. Button Component (`src/components/ui/Button.tsx`)

**Purpose**: Reusable button component with automatic CTA tracking.

**Key Features**:
- Automatically sets `ph-no-capture` attribute and class on mount
- Tracks clicks with comprehensive attribution data
- Supports both link (`<a>`) and button (`<button>`) variants
- Uses callback ref to set `ph-no-capture` immediately when element is created

**Usage**:
```tsx
<Button 
  href="/homes"
  data-cta-id="hero_explore_homes"
  data-cta-context="homepage_hero"
>
  Explore Homes
</Button>
```

**Props**:
- `data-cta-id`: Optional custom CTA identifier (auto-generated if not provided)
- `data-cta-context`: Optional section context (e.g., "hero", "footer", "nav")

### 3. CTA Auto-Tracker (`src/lib/cta-auto-tracker.ts`)

**Purpose**: Automatically discovers and tracks CTAs that aren't using the Button component.

**Key Features**:
- Scans DOM for CTA patterns (WhatsApp links, Cal.com links, etc.)
- Uses `MutationObserver` to handle dynamically added content
- Sets `ph-no-capture` on discovered CTAs
- Attaches click listeners for custom tracking

**Patterns Detected**:
- WhatsApp links (`wa.me`, `whatsapp.com`)
- Cal.com booking links (`cal.com/flent/`)
- Links with specific text patterns (e.g., "Book a Tour", "Chat With Us")

### 4. PostHog Tracking Utility (`src/lib/posthog-tracking.ts`)

**Purpose**: Centralized utility for tracking events with comprehensive attribution data.

**Key Functions**:

#### `getPageContext()`
Extracts page-level attribution data:
- URL and path information
- UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`)
- Click IDs: `gclid` (Google Ads), `fbclid` (Meta/Facebook Ads), `gbraid`, `wbraid` (Google Ads variants)
- Referrer information

#### `getSessionContext()`
Extracts session-level data:
- `session_id`: PostHog session identifier
- `distinct_id`: PostHog user identifier

#### `getDeviceContext()`
Extracts device information:
- Screen dimensions
- User agent

#### `trackCTAClick(ctaData)`
Tracks a CTA click event with all attribution data:
```typescript
trackCTAClick({
  cta_id: 'hero_explore_homes',
  cta_text: 'Explore Homes',
  cta_type: 'button',
  cta_variant: 'primary',
  cta_destination: '/homes',
  page_section: 'homepage_hero'
});
```

### 5. CTA Tracking Hook (`src/hooks/useCTATracking.ts`)

**Purpose**: React hook for tracking CTAs with automatic context extraction.

**Usage**:
```tsx
const { trackCTAClick } = useCTATracking();

trackCTAClick({
  cta_id: 'custom_cta',
  cta_text: 'Click Me',
  cta_type: 'button'
});
```

## Attribution Data Captured

### UTM Parameters
Automatically captured from URL query parameters:
- `utm_source`: Traffic source (e.g., "google", "facebook")
- `utm_medium`: Marketing medium (e.g., "cpc", "social")
- `utm_campaign`: Campaign name
- `utm_term`: Campaign term/keyword
- `utm_content`: Campaign content variant

### Click IDs
Automatically captured from URL query parameters:
- `gclid`: Google Ads click identifier
- `fbclid`: Meta/Facebook Ads click identifier
- `gbraid`: Google Ads browser click identifier
- `wbraid`: Google Ads web click identifier

### Page Context
- `page_url`: Full URL including query parameters
- `page_path`: URL pathname
- `page_title`: Document title
- `page_hash`: URL hash fragment (if present)
- `referrer`: HTTP referrer

### Session Context
- `session_id`: PostHog session ID
- `distinct_id`: PostHog distinct user ID

### Device Context
- `screen_width`: Screen width in pixels
- `screen_height`: Screen height in pixels
- `user_agent`: Browser user agent string

## Event Schema

### `cta_clicked` Event

**Event Name**: `cta_clicked`

**Properties**:
```typescript
{
  // CTA Identification
  cta_id: string;                    // Unique CTA identifier
  cta_text: string;                   // CTA button/link text
  cta_type: 'button' | 'link' | 'form_submit';
  cta_variant?: string;              // Button variant (e.g., "primary")
  cta_destination?: string;          // URL destination (for links)
  page_section?: string;              // Section context (e.g., "hero", "footer")
  
  // Attribution Data
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;                    // Google Ads click ID
  fbclid?: string;                   // Facebook/Meta Ads click ID
  gbraid?: string;                   // Google Ads browser click ID
  wbraid?: string;                   // Google Ads web click ID
  
  // Page Context
  page_url: string;
  page_path: string;
  page_title: string;
  page_hash?: string;
  referrer?: string;
  
  // Session Context
  session_id?: string;
  distinct_id?: string;
  
  // Device Context
  screen_width: number;
  screen_height: number;
  user_agent: string;
  
  // Timestamp
  timestamp: string;                 // ISO 8601 timestamp
}
```

## Preventing Duplicate Events

### Problem
PostHog's autocapture feature automatically tracks clicks on buttons and links. Without proper configuration, this would create duplicate events:
- One from autocapture (`$autocapture`)
- One from our custom tracking (`cta_clicked`)

### Solution
We use a two-layer approach:

1. **`ph-no-capture` Attribute/Class**: 
   - Set on all tracked CTAs (Button component and auto-discovered CTAs)
   - PostHog autocapture checks for this attribute/class and skips tracking

2. **`before_send` Hook**:
   - Additional safety layer that filters any autocapture events that slip through
   - Returns `null` for autocapture events on elements with `ph-no-capture`

### Implementation
```typescript
// In Button component and auto-tracker
element.setAttribute('ph-no-capture', '');
element.classList.add('ph-no-capture');

// In PostHog init config
before_send: (event) => {
  if (event.event === '$autocapture' && hasPhNoCapture) {
    return null; // Block the event
  }
  return event;
}
```

## PostHog Person Properties

PostHog automatically stores attribution data as person properties:

### Initial Attribution (First Touch)
- `Initial UTM Source`: First `utm_source` value
- `Initial UTM Medium`: First `utm_medium` value
- `Initial UTM Campaign`: First `utm_campaign` value

### Current Attribution (Last Touch)
- `UTM Source`: Current `utm_source` value
- `UTM Medium`: Current `utm_medium` value
- `UTM Campaign`: Current `utm_campaign` value

### Click IDs
- `$gclid`: Google Ads click ID (when present)
- `$fbclid`: Facebook/Meta Ads click ID (when present)

These properties enable:
- **First-touch attribution**: See where users first came from
- **Last-touch attribution**: See what brought users to convert
- **Ad performance analysis**: Filter by click IDs to analyze specific ad campaigns

## Usage Examples

### Basic Button with Tracking
```tsx
import { Button } from '@/components/ui/Button';

<Button 
  href="/homes"
  data-cta-id="hero_explore_homes"
  data-cta-context="homepage_hero"
>
  Explore Homes
</Button>
```

### Custom CTA Tracking
```tsx
import { useCTATracking } from '@/hooks/useCTATracking';

function CustomCTA() {
  const { trackCTAClick } = useCTATracking();
  
  return (
    <button onClick={() => {
      trackCTAClick({
        cta_id: 'custom_action',
        cta_text: 'Custom Action',
        cta_type: 'button',
        page_section: 'custom_section'
      });
      // Your custom logic here
    }}>
      Click Me
    </button>
  );
}
```

### Direct Tracking Utility
```tsx
import { trackCTAClick } from '@/lib/posthog-tracking';

trackCTAClick({
  cta_id: 'form_submit',
  cta_text: 'Submit',
  cta_type: 'form_submit',
  page_section: 'contact_form'
});
```

## Environment Variables

Required environment variables:

```bash
# PostHog API Key (required)
NEXT_PUBLIC_POSTHOG_KEY=phx_your_api_key_here

# PostHog Host (optional, defaults to https://us.i.posthog.com)
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Testing Attribution

### Test with Google Ads Click ID
```
http://localhost:3000/?gclid=test123&utm_source=google&utm_campaign=test_campaign
```

### Test with Meta Ads Click ID
```
http://localhost:3000/?fbclid=test456&utm_source=facebook&utm_campaign=test_campaign
```

### Verify in PostHog
1. Navigate to PostHog dashboard
2. Go to **Activity** or **Events**
3. Filter for `cta_clicked` events
4. Check event properties for:
   - `gclid` or `fbclid` values
   - UTM parameters
   - Complete attribution data

## Analyzing Attribution Data

### In PostHog Insights

1. **Filter by Click ID**:
   - Filter events where `gclid` is not null (Google Ads traffic)
   - Filter events where `fbclid` is not null (Meta Ads traffic)

2. **Breakdown by UTM Source**:
   - Breakdown `cta_clicked` events by `utm_source`
   - Compare performance across different traffic sources

3. **First vs Last Touch**:
   - Use `Initial UTM Source` for first-touch attribution
   - Use `UTM Source` for last-touch attribution

4. **CTA Performance**:
   - Filter by `cta_id` to see performance of specific CTAs
   - Breakdown by `page_section` to see which sections drive most clicks

### Example Queries

**Google Ads Performance**:
```
Event: cta_clicked
Filter: gclid is not null
Breakdown: utm_campaign
```

**Meta Ads Performance**:
```
Event: cta_clicked
Filter: fbclid is not null
Breakdown: utm_campaign
```

**CTA Performance by Section**:
```
Event: cta_clicked
Breakdown: page_section
```

## Best Practices

1. **Always provide `data-cta-id`**: Makes it easier to identify and analyze specific CTAs
2. **Use descriptive `data-cta-context`**: Helps understand where CTAs are placed
3. **Include attribution in ad URLs**: Ensure your ad campaigns include UTM parameters and click IDs
4. **Monitor for duplicates**: Check PostHog dashboard periodically to ensure no duplicate events
5. **Test attribution**: Regularly test with attribution parameters to verify data is captured

## Troubleshooting

### Events Not Appearing in PostHog
1. Check `NEXT_PUBLIC_POSTHOG_KEY` is set correctly
2. Verify PostHog is initialized (check browser console for errors)
3. Check network tab to see if events are being sent

### Duplicate Events
1. Verify `ph-no-capture` is set on tracked elements (inspect in browser DevTools)
2. Check `before_send` hook is configured correctly
3. Verify `autocapture.noCaptureProp` is set to `"ph-no-capture"`

### Missing Attribution Data
1. Verify URL includes attribution parameters (check browser address bar)
2. Check that `getPageContext()` is extracting parameters correctly
3. Verify PostHog is capturing pageviews with full URL (including query params)

## Files Reference

- **PostHog Provider**: `src/app/providers.tsx`
- **Button Component**: `src/components/ui/Button.tsx`
- **CTA Auto-Tracker**: `src/lib/cta-auto-tracker.ts`
- **Tracking Utility**: `src/lib/posthog-tracking.ts`
- **Tracking Hook**: `src/hooks/useCTATracking.ts`
- **CTA Tracker Component**: `src/components/tracking/CTATracker.tsx`

## Additional Resources

- [PostHog Documentation](https://posthog.com/docs)
- [PostHog Autocapture](https://posthog.com/docs/product-analytics/autocapture)
- [PostHog Attribution](https://posthog.com/docs/web-analytics/marketing-analytics)
- [UTM Parameters Guide](https://en.wikipedia.org/wiki/UTM_parameters)




