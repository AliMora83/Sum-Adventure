import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is statically generated. There is no dynamic data on the
  // site until the Sprint 4 enquiry action, which is a POST and does not
  // affect prerendering.
  images: {
    // Client's photography is the heaviest asset on the site and the
    // audience is mostly on mobile data. AVIF first, WebP fallback.
    formats: ["image/avif", "image/webp"],
    // Widths tuned for the actual layouts: full-bleed hero, half-width
    // grids, third-width tour cards.
    deviceSizes: [360, 480, 640, 828, 1080, 1200, 1920],
  },
  poweredByHeader: false,

  /**
   * Keep every non-production deploy out of search results.
   *
   * The staging branch deploys to a public .vercel.app alias — reachable by
   * anyone, and Vercel preview URLs do get discovered and crawled. A staging
   * copy of the site competing with the client's real domain would be a
   * duplicate-content problem on a site whose whole point is being findable.
   *
   * This is the layer that actually binds. robots.txt (Sprint 6b) is a
   * request a crawler may ignore, and it cannot stop a URL discovered via an
   * inbound link from being indexed without being crawled. X-Robots-Tag is
   * served on the response itself and is honoured by Google and Bing.
   *
   * Keyed on VERCEL_ENV for the same reason as the provisional-elevation
   * guard in data/stations.ts: it is the only signal that separates a
   * production deploy from a preview one. Undefined locally, so `next dev`
   * and local builds also carry the header — correct, if irrelevant.
   */
  async headers() {
    if (process.env.VERCEL_ENV === "production") return [];

    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
};

export default nextConfig;
