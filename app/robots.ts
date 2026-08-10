import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { isIndexableBuild } from "@/lib/indexable";

/**
 * robots.txt is environment-aware, and deliberately not an unconditional
 * "allow all".
 *
 * The condition is shared with the `X-Robots-Tag` header in next.config.ts —
 * one function in lib/indexable.ts, so the two cannot drift. It allows
 * crawling only on a production build served from a non-Netlify canonical
 * host: a placeholder or preview host must never be indexable, and the real
 * domain must never inherit a stray noindex.
 *
 * The Netlify-hostname half is the one that matters before launch. A freshly
 * connected site's production branch has CONTEXT=production while its only
 * address is still `<name>.netlify.app`. Allowing that to be crawled means
 * the client's real domain launches into duplicate content against its own
 * staging copy.
 *
 * This is belt and braces with the header, not a replacement for it.
 * robots.txt is a request a crawler may ignore, and it cannot stop a URL
 * discovered through an inbound link from being indexed without ever being
 * crawled. The header is the layer that binds; this is the layer that stops
 * well-behaved crawlers before they fetch at all.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexableBuild()) {
    // No sitemap reference here on purpose: advertising a sitemap while
    // disallowing the whole origin is a contradictory instruction, and the
    // sitemap of a non-production deploy lists URLs we do not want crawled.
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: new URL("/sitemap.xml", siteUrl).href,
  };
}
