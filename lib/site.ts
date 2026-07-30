import type { Metadata } from "next";

/**
 * Canonical site origin, for metadataBase and resolving relative OG image
 * URLs to absolute ones. Prefers an explicit NEXT_PUBLIC_SITE_URL (set once
 * the client's domain is live), falls back to Vercel's own preview/production
 * URL, then localhost for local dev. VERCEL_URL has no protocol, so it's
 * prefixed here.
 */
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
);

/**
 * Fallback OG image for routes with no photo of their own — the hero shot,
 * already the most recognisable "Sum Adventures" image on the site.
 */
export const defaultOgImage = {
  url: "/images/skii-1.jpg",
  alt: "Snow-covered peaks of the Maloti mountains, Lesotho",
};

/** Shared shape for title + description + a matching OG image. */
export function buildMetadata({
  title,
  description,
  image = defaultOgImage.url,
  imageAlt = defaultOgImage.alt,
}: {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, alt: imageAlt }],
    },
  };
}
