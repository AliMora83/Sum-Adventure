import type { Tour } from "@/data/tours";

/** Client's number, international format, digits only. */
export const WHATSAPP_NUMBER = "26662479447";
export const PHONE_DISPLAY = "+266 6247 9447";
export const EMAIL = "sumadventures3@gmail.com";

/**
 * WhatsApp will very likely out-convert the enquiry form for this audience,
 * so every CTA carries a pre-filled message naming the specific tour.
 */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function tourEnquiryLink(tour: Tour): string {
  return whatsappLink(
    `Hi Sum Adventures, I'd like to enquire about the ${tour.name}. Please send me available dates.`
  );
}

export const generalEnquiryLink = whatsappLink(
  "Hi Sum Adventures, I'd like to plan a trip. Please send me your available tours."
);
