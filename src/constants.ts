export const WHATSAPP_LINK = `https://wa.me/918904695925?text=Curious%20to%20know%20more%20about%20Flent%E2%80%94tell%20me%20everything%21`;
export const getPropertyWhatsappLink = (name: string) => {
  return `https://wa.me/918904695925?text=Hey%2C+I+am+interested+in+${encodeURIComponent(
    name
  )}`;
};

export const OCCUPIED_LABEL = "Occupied";
export const AVAILABLE_NOW_LABEL = "Available Now";
