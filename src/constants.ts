import { buildWhatsAppWaMeLink } from "@/lib/whatsapp";

const DEFAULT_INTEREST_MESSAGE =
  "Curious to know more about Flent—tell me everything!";

export const WHATSAPP_LINK = buildWhatsAppWaMeLink(DEFAULT_INTEREST_MESSAGE);
export const OWNERS_WHATSAPP_LINK = buildWhatsAppWaMeLink(
  "Hi, I'm a homeowner. How can Flent help?"
);
export const getPropertyWhatsappLink = (name: string) => {
  return buildWhatsAppWaMeLink(`Hey, I am interested in ${name}`);
};

export const DEMAND_OPS_PHONE = "tel:+918123659925";

export const OCCUPIED_LABEL = "Occupied";
export const AVAILABLE_NOW_LABEL = "Available Now";
