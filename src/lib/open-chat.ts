/**
 * Opens the given URL (e.g. WhatsApp) in a new tab.
 */
export function openChat(url: string): void {
  if (typeof window === "undefined") return;
  window.open(url, "_blank", "noopener,noreferrer");
}
