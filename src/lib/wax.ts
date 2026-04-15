const WAX_STORAGE_KEY = "wax_attribution";

/**
 * Reads the WAX session code from localStorage (set by the WAX attribution script in layout).
 * Returns empty string if not present or invalid.
 */
export function getWaxSessionCode(): string {
  if (typeof window === "undefined") return "";
  try {
    const stored = window.localStorage.getItem(WAX_STORAGE_KEY);
    if (!stored) return "";
    const data = JSON.parse(stored) as { sessionCode?: string };
    return data?.sessionCode ?? "";
  } catch {
    return "";
  }
}

/**
 * Appends the WAX session code to a WhatsApp URL message body when present.
 * Mirrors the behavior in public/scripts/wax-attribution.js.
 */
export function appendWaxToWhatsAppUrl(url: string, waxCode: string): string {
  if (!url || !waxCode) return url;

  try {
    const parsed = new URL(url);
    const text = parsed.searchParams.get("text") || "";
    if (text.includes("[WAX-")) {
      return url;
    }

    const nextText = `${text}${text ? " " : ""}[${waxCode}]`;
    parsed.searchParams.set("text", nextText);
    return parsed.toString();
  } catch {
    return url;
  }
}
