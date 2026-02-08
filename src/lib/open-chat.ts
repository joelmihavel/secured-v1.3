import { getWaxSessionCode } from "@/lib/wax";
import { LIVE_CHAT_CHANNEL_ID } from "@/lib/superchat-config";

/**
 * Opens the Superchat Live Chat widget when available (desktop),
 * otherwise opens the fallback URL (e.g. WhatsApp) in a new tab.
 *
 * When opening Superchat, extracts the message from the WhatsApp URL's `text`
 * param and passes it to `Superchat.open({ channelId, message })` so the chat
 * input is pre-filled with the property interest message + WAX code.
 *
 * NOTE: channelId is REQUIRED for the message pre-fill to work.
 */
export function openChat(fallbackUrl: string): void {
  if (typeof window === "undefined") return;

  if (window.Superchat?.open) {
    // Extract message from WhatsApp URL and pre-fill the chat input
    const message = extractAndEnhanceMessage(fallbackUrl);
    window.Superchat.open({
      channelId: LIVE_CHAT_CHANNEL_ID, // Required for pre-fill to work
      message,
    });
  } else {
    window.open(fallbackUrl, "_blank", "noopener,noreferrer");
  }
}

/**
 * Extracts the `text` param from a WhatsApp URL and appends WAX code if not present.
 */
function extractAndEnhanceMessage(url: string): string {
  try {
    const parsed = new URL(url);
    let text = parsed.searchParams.get("text") || "";
    text = decodeURIComponent(text.replace(/\+/g, " "));

    // Append WAX code if not already present
    const waxCode = getWaxSessionCode();
    if (waxCode && !text.includes("[WAX-")) {
      text = text ? `${text} [${waxCode}]` : `[${waxCode}]`;
    }

    return text;
  } catch {
    return "";
  }
}
