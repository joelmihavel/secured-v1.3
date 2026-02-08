const DEFAULT_INTEREST_MESSAGE =
  "Curious to know more about Flent—tell me everything!";

export const WHATSAPP_LINK = `https://wa.me/918904695925?text=Curious%20to%20know%20more%20about%20Flent%E2%80%94tell%20me%20everything%21`;
export const OWNERS_WHATSAPP_LINK = `https://wa.me/918904695925?text=Hi%2C%20I'm%20a%20homeowner.%20How%20can%20Flent%20help%3F`;
export const getPropertyWhatsappLink = (name: string) => {
  return `https://wa.me/918904695925?text=Hey%2C+I+am+interested+in+${encodeURIComponent(
    name
  )}`;
};

/**
 * Builds the plain welcome/interest message (no URL) for Superchat widget.
 * Same base strings as getPropertyWhatsappLink/WHATSAPP_LINK and same WAX
 * append rule as layout (space + [waxCode]).
 */
export function getPropertyInterestMessage(
  propertyName: string | null,
  waxCode: string
): string {
  const base = propertyName
    ? `Hey, I am interested in ${propertyName}`
    : DEFAULT_INTEREST_MESSAGE;
  return waxCode ? `${base} [${waxCode}]` : base;
}

export const OCCUPIED_LABEL = "Occupied";
export const AVAILABLE_NOW_LABEL = "Available Now";

// Superchat display message types
export type SuperchatPageType = "property" | "owners" | "default";

/**
 * Returns the friendly display message for the Superchat welcome bubble.
 * This is different from the input pre-fill message (getPropertyInterestMessage).
 */
export function getSuperchatDisplayMessage(
  pageType: SuperchatPageType,
  propertyName?: string | null
): string {
  switch (pageType) {
    case "property":
      return propertyName
        ? `Interested in ${propertyName}? Lets chat`
        : "Interested in this property? Lets chat";
    case "owners":
      return "Are you a homeowner? Lets work together";
    default:
      return "Curious about us? Lets chat";
  }
}
