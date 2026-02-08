/**
 * Superchat SDK configuration
 * Centralized config to avoid circular dependencies between components and lib files.
 *
 * @see https://developers.superchat.com/docs/widget-sdk
 */

export const SUPERCHAT_CONFIG = {
  /** Application key from Superchat webchat settings */
  applicationKey: "WCwANeL2GOXrZnzWrkRz4MndbD",

  /** Live Chat channel ID - required for message pre-fill to work */
  channelId: "mc_L2vZ9gZsEHg39VGPO7suY",

  /** SDK script URL */
  sdkUrl: "https://widget.superchat.de/sdk.js",

  /** Desktop breakpoint media query */
  desktopMediaQuery: "(min-width: 768px)",
} as const;

// Named exports for convenience
export const LIVE_CHAT_CHANNEL_ID = SUPERCHAT_CONFIG.channelId;
