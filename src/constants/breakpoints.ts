/**
 * Breakpoint constants for responsive design
 * These values align with Tailwind's default breakpoints
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Mobile breakpoint - matches Tailwind's md breakpoint
 * Use this for mobile/desktop detection
 */
export const MOBILE_BREAKPOINT = BREAKPOINTS.md;
