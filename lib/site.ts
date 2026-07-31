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
 * Drawn only from docs/client-profile.md — service lines, destinations and
 * products. No claim here that isn't in that file.
 *
 * The "run out of Hlotse, Leribe" clause was cut in Sprint 6b: it pushed this
 * past the ~155 characters a search result shows, so it was truncated away
 * anyway, and it appeared verbatim at the end of three descriptions, which
 * reads as boilerplate. It now appears on /about only, where the company's
 * base is the actual subject.
 */
export const defaultDescription =
  "Adventure tours, photography and events across Lesotho and Southern Africa. Tsikoane plateau camping, Afriski winter trips and educational tours.";

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

/** Locale for og:locale and <html lang>. Site is South African English. */
export const ogLocale = "en_ZA";

/**
 * Shared shape for title + description + a matching share image.
 *
 * `title` is the bare page name — the brand suffix comes from the templates
 * in app/layout.tsx. Twitter fields are set explicitly because Next does not
 * fall back from openGraph to twitter per-route; without them every page
 * would inherit the homepage's card.
 *
 * `type`, `locale` and `siteName` are repeated here rather than inherited
 * from the root layout because **Next replaces the `openGraph` object
 * wholesale, it does not deep-merge it**. Before Sprint 6b every route that
 * called this function silently dropped og:site_name, og:locale and og:type,
 * which the root layout does set — only the homepage, which had no metadata
 * of its own, kept them. Removing any of these will quietly reintroduce that.
 *
 * `path` is a root-relative route ("/tours"), resolved against metadataBase
 * for both og:url and the canonical link. It is required rather than
 * optional so a new route cannot forget it — every call site is a type error
 * until it supplies one. Never pass an absolute URL: the host must keep
 * coming from NEXT_PUBLIC_SITE_URL.
 */
export function buildMetadata({
  title,
  description,
  path,
  image = defaultOgImage.url,
  imageAlt = defaultOgImage.alt,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
}): Metadata {
  const images = [{ url: image, alt: imageAlt }];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: ogLocale,
      siteName,
      title,
      description,
      url: path,
      images,
    },
    twitter: {
      title,
      description,
      images,
    },
  };
}
