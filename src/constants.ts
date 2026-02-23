const DEFAULT_INTEREST_MESSAGE =
  "Curious to know more about Flent—tell me everything!";

export const WHATSAPP_LINK = `https://wa.me/918904695925?text=Curious%20to%20know%20more%20about%20Flent%E2%80%94tell%20me%20everything%21`;
export const OWNERS_WHATSAPP_LINK = `https://wa.me/918904695925?text=Hi%2C%20I'm%20a%20homeowner.%20How%20can%20Flent%20help%3F`;
export const getPropertyWhatsappLink = (name: string) => {
  return `https://wa.me/918904695925?text=Hey%2C+I+am+interested+in+${encodeURIComponent(
    name
  )}`;
};

export const OCCUPIED_LABEL = "Occupied";
export const AVAILABLE_NOW_LABEL = "Available Now";
