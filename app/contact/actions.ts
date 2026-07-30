"use server";

import { Resend } from "resend";
import { tours } from "@/data/tours";
import { PHONE_DISPLAY, whatsappLink } from "@/lib/whatsapp";

export type EnquiryFieldErrors = Partial<
  Record<"name" | "phone" | "email" | "message", string>
>;

export type EnquiryState = {
  status: "idle" | "success" | "error" | "fallback";
  message?: string;
  fieldErrors?: EnquiryFieldErrors;
  whatsappHref?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildWhatsAppFallback(fields: {
  name: string;
  tourName?: string;
  dates: string;
  groupSize: string;
  message: string;
}): string {
  const lines = [
    `Hi Sum Adventures, I'd like to enquire.`,
    `Name: ${fields.name}`,
    fields.tourName ? `Tour: ${fields.tourName}` : null,
    fields.dates ? `Preferred dates: ${fields.dates}` : null,
    fields.groupSize ? `Group size: ${fields.groupSize}` : null,
    `Message: ${fields.message}`,
  ].filter((line): line is string => Boolean(line));

  return whatsappLink(lines.join("\n"));
}

export async function submitEnquiry(
  _prevState: EnquiryState,
  formData: FormData
): Promise<EnquiryState> {
  // Honeypot: real visitors never see or fill this field. If it's filled,
  // pretend success so the bot moves on, without sending anything.
  if (String(formData.get("company") || "").trim()) {
    return { status: "success", message: "Thanks — we've received your enquiry." };
  }

  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const tourSlug = String(formData.get("tour") || "").trim();
  const dates = String(formData.get("dates") || "").trim();
  const groupSize = String(formData.get("groupSize") || "").trim();
  const message = String(formData.get("message") || "").trim();

  const fieldErrors: EnquiryFieldErrors = {};
  if (!name) fieldErrors.name = "Please tell us your name.";
  if (!phone) fieldErrors.phone = "Please add a phone or WhatsApp number.";
  if (!email) {
    fieldErrors.email = "Please add an email address so we can confirm your enquiry.";
  } else if (!EMAIL_RE.test(email)) {
    fieldErrors.email = "That doesn't look like a valid email address.";
  }
  if (!message) fieldErrors.message = "Let us know a little about what you're after.";

  const tour = tours.find((t) => t.slug === tourSlug);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      fieldErrors,
      message: "Please fix the highlighted fields and try again.",
    };
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const ENQUIRY_TO_EMAIL = process.env.ENQUIRY_TO_EMAIL;
  const ENQUIRY_FROM_EMAIL = process.env.ENQUIRY_FROM_EMAIL;

  const whatsappHref = buildWhatsAppFallback({
    name,
    tourName: tour?.name,
    dates,
    groupSize,
    message,
  });

  if (!RESEND_API_KEY || !ENQUIRY_TO_EMAIL || !ENQUIRY_FROM_EMAIL) {
    return {
      status: "fallback",
      message:
        "We couldn't send that just now. Please continue on WhatsApp instead — your details are carried over.",
      whatsappHref,
    };
  }

  try {
    const resend = new Resend(RESEND_API_KEY);

    await resend.emails.send({
      from: ENQUIRY_FROM_EMAIL,
      to: ENQUIRY_TO_EMAIL,
      replyTo: email,
      subject: `New enquiry from ${name}${tour ? ` — ${tour.name}` : ""}`,
      text: [
        `Name: ${name}`,
        `Phone/WhatsApp: ${phone}`,
        `Email: ${email}`,
        `Tour of interest: ${tour ? tour.name : "(general enquiry)"}`,
        `Preferred dates: ${dates || "(not provided)"}`,
        `Group size: ${groupSize || "(not provided)"}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    await resend.emails.send({
      from: ENQUIRY_FROM_EMAIL,
      to: email,
      subject: "We've received your enquiry — Sum Adventures",
      text: [
        `Hi ${name},`,
        "",
        "Thanks for your enquiry with Sum Adventures. We've received it and will be in touch soon.",
        "",
        tour ? `Tour: ${tour.name}` : "General enquiry",
        dates ? `Preferred dates: ${dates}` : null,
        groupSize ? `Group size: ${groupSize}` : null,
        "",
        `If it's urgent, message us directly on WhatsApp: ${PHONE_DISPLAY}.`,
        "",
        "— Sum Adventures",
      ]
        .filter((line): line is string => line !== null)
        .join("\n"),
    });

    return {
      status: "success",
      message: "Thanks — we've received your enquiry and will be in touch soon.",
    };
  } catch {
    return {
      status: "fallback",
      message:
        "We couldn't send that just now. Please continue on WhatsApp instead — your details are carried over.",
      whatsappHref,
    };
  }
}
