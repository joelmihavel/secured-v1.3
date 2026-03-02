"use client";

import { useCallback } from "react";
import { useMobile } from "@/hooks/useMobile";
import { openChat } from "@/lib/open-chat";

/**
 * Props to spread onto a Button (or <a>) that opens WhatsApp.
 * On desktop: prevents navigation and opens URL in a new tab via openChat().
 * On mobile: allows default link behavior (opens WhatsApp app or web).
 */
export interface WhatsAppCtaProps {
  href: string;
  target: "_blank";
  rel: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Hook for WhatsApp / "Talk to us" / "Get a Call Back" CTAs.
 * Returns href, target, rel, and onClick so you can spread onto <Button href={...} />.
 * Use with data-cta-id and data-cta-context for PostHog tracking (Button tracks the click).
 *
 * @param url - WhatsApp URL (e.g. from getPropertyWhatsappLink or WHATSAPP_LINK)
 * @returns Props to spread onto Button: href, target, rel, onClick
 *
 * @example
 *   const whatsAppProps = useWhatsAppCta(getPropertyWhatsappLink(propertyName));
 *   <Button {...whatsAppProps} data-cta-id={CTA_IDS.LIGHTBOX_CHAT_WITH_US} data-cta-context="lightbox">
 *     Chat with us
 *   </Button>
 */
export function useWhatsAppCta(url: string): WhatsAppCtaProps {
  const isMobile = useMobile();

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!isMobile) {
        e.preventDefault();
        openChat(url);
      }
    },
    [isMobile, url]
  );

  return {
    href: url,
    target: "_blank",
    rel: "noopener noreferrer",
    onClick,
  };
}
