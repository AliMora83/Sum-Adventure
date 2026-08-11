import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { tours } from "@/data/tours";

/**
 * The sitemap is generated, never hand-maintained.
 *
 * Tour URLs come from `data/tours.ts` — the same array that generates the
 * routes themselves via `generateStaticParams`. A hand-written list would be
 * a second source of truth that drifts the first time a tour is added or a
 * slug changes, and the failure is silent: the page exists, search engines
 * just never hear about it.
 *
 * Every URL is resolved against `siteUrl`, which is `NEXT_PUBLIC_SITE_URL`
 * and the same value backing `metadataBase`. There is no hardcoded host
 * anywhere in this file, so a locally built sitemap emits localhost URLs and
 * a staging build emits staging ones — each correct for the environment that
 * produced it.
 */

/**
 * Routes with no data behind them. Paths only — the origin is added below.
 * `/contact` is included: it is the enquiry route and the site's single
 * conversion point.
 */
const staticPaths = ["/", "/about", "/tours", "/contact"];

/** Absolute URL for a root-relative path, off the configured origin. */
function absolute(path: string): string {
  return new URL(path, siteUrl).href;
}

export default function sitemap(): MetadataRoute.Sitemap {
  // One timestamp per build, so entries in a single sitemap agree with each
  // other. The site is statically generated, so build time is genuinely when
  // this content last changed.
  const lastModified = new Date();

  return [
    ...staticPaths.map((path) => ({
      url: absolute(path),
      lastModified,
    })),
    // Past tours are included deliberately. They are not bookable and render
    // no price CTA (CLAUDE.md invariant 8), but the routes still exist so a
    // link shared from the original flyer resolves instead of 404ing — which
    // only works if the URL is discoverable. This is a URL listing, not a
    // structured-data claim that the departure is on sale.
    ...tours.map((tour) => ({
      url: absolute(`/tours/${tour.slug}`),
      lastModified,
    })),
  ];
}
