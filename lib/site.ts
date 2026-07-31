import type { Metadata } from "next";

/**
 * Canonical site origin, for metadataBase and for resolving relative OG image
 * URLs to absolute ones.
 *
 * There is deliberately **no VERCEL_URL fallback**. VERCEL_URL is unique per
 * deployment, so OG image URLs would change on every push — every preview
 * already scraped by WhatsApp, Facebook or a search engine would keep
 * pointing at a dead deployment. One canonical origin per environment is the
 * whole point of the value.
 *
 * An unset value is a hard failure rather than a silent fallback because the
 * failure mode is invisible: Next emits *relative* Open Graph paths, no
 * scraper can resolve them, and nothing in the build output mentions it. A
 * link that silently previews as a blank card is worse than a failed build.
 */
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!configuredSiteUrl) {
  throw new Error(
    "lib/site.ts: NEXT_PUBLIC_SITE_URL is not set. It is required for " +
      "metadataBase — without it Next silently emits relative Open Graph " +
      "paths that no scraper can resolve. Set it to the canonical origin " +
      "for this environment: http://localhost:3000 for local dev, the " +
      ".vercel.app alias for staging, the client's domain for production. " +
      "See .env.example."
  );
}

export const siteUrl = (() => {
  try {
    return new URL(configuredSiteUrl);
  } catch {
    throw new Error(
      `lib/site.ts: NEXT_PUBLIC_SITE_URL is set to "${configuredSiteUrl}", ` +
        `which is not a valid absolute URL. It needs a protocol — ` +
        `"https://example.com", not "example.com".`
    );
  }
})();

/** Registered name is "Sum Adventures (Pty) Ltd"; the site brand is this. */
export const siteName = "Sum Adventures";

/** Tagline per docs/client-profile.md. "Travel Is Adventure Having Fun" is retired. */
export const defaultTitle = `${siteName} — More Than Just A Trip`;

/**
 * Applied to every route's title. Routes pass a bare title ("About") and get
 * the brand suffix from here, so the suffix is spelled out in exactly one
 * place. Mirrored onto openGraph and twitter in app/layout.tsx.
 */
export const titleTemplate = `%s — ${siteName}`;

/**
 * Drawn only from docs/client-profile.md — service lines, destinations,
 * products and base. No claim here that isn't in that file.
 */
export const defaultDescription =
  "Adventure tours, photography and events across Lesotho and Southern Africa. Tsikoane plateau camping, Afriski winter trips and educational tours, run out of Hlotse, Leribe.";

/** Shorter variant for share cards, where long descriptions get truncated. */
export const shortDescription =
  "Adventure tours, photography and events across Lesotho and Southern Africa.";

/**
 * Fallback OG image for routes with no photo of their own — the hero shot,
 * already the most recognisable "Sum Adventures" image on the site.
 */
export const defaultOgImage = {
  url: "/images/skii-1.jpg",
  alt: "Snow-covered peaks of the Maloti mountains, Lesotho",
};

/**
 * Shared shape for title + description + a matching share image.
 *
 * `title` is the bare page name — the brand suffix comes from the templates
 * in app/layout.tsx. Twitter fields are set explicitly because Next does not
 * fall back from openGraph to twitter per-route; without them every page
 * would inherit the homepage's card.
 */
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
  const images = [{ url: image, alt: imageAlt }];
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
    },
    twitter: {
      title,
      description,
      images,
    },
  };
}
