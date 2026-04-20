function sanitizeWhatsappNumber(value: string | undefined): string {
  return (value || "").replace(/\D/g, "");
}

export function getWhatsAppNumber(): string {
  return sanitizeWhatsappNumber(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || process.env.WHATSAPP_NUMBER
  );
}

export function buildWhatsAppWaMeLink(message: string): string {
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppApiLink(message: string): string {
  return `https://api.whatsapp.com/send/?phone=${getWhatsAppNumber()}&text=${encodeURIComponent(
    message
  )}&type=phone_number&app_absent=0`;
}
