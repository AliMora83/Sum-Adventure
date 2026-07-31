import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * robots.txt is environment-aware, and deliberately not an unconditional
 * "allow all".
 *
 * This branch deploys to a public .vercel.app alias. If staging is indexed,
 * the real domain launches into duplicate content against its own staging
 * copy — competing with itself for the queries it is trying to win, on a
 * site whose entire purpose is being findable.
 *
 * Keyed on VERCEL_ENV, matching next.config.ts's X-Robots-Tag and the
 * provisional-elevation guard in data/stations.ts. It is the only signal
 * that separates a production deploy from a preview one; NEXT_PUBLIC_SITE_URL
 * is a canonical origin shared by every environment and says nothing about
 * which one is building.
 *
 * This is belt and braces with the X-Robots-Tag header from Sprint 6a, not a
 * replacement for it. robots.txt is a request a crawler may ignore, and it
 * cannot stop a URL discovered through an inbound link from being indexed
 * without ever being crawled. The header is the layer that binds; this is the
 * layer that stops well-behaved crawlers before they fetch at all.
 */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV !== "production") {
    // No sitemap reference here on purpose: advertising a sitemap while
    // disallowing the whole origin is a contradictory instruction, and the
    // sitemap of a staging deploy lists staging URLs we do not want crawled.
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: new URL("/sitemap.xml", siteUrl).href,
  };
}
