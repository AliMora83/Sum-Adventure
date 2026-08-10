import type { NextConfig } from "next";
import { isIndexableBuild } from "./lib/indexable";

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
   * Keep every build that is not the real production site out of search
   * results.
   *
   * This is the layer that actually binds. robots.txt (Sprint 6b) is a
   * request a crawler may ignore, and it cannot stop a URL discovered via an
   * inbound link from being indexed without being crawled. X-Robots-Tag is
   * served on the response itself and is honoured by Google and Bing.
   *
   * The condition lives in lib/indexable.ts and is shared with app/robots.ts
   * so the header and robots.txt cannot drift apart. It requires **both** a
   * production context and a non-Netlify canonical hostname: a placeholder or
   * preview host must never be indexable, and the real domain must never
   * inherit a stray noindex. See that file for why each half is load-bearing.
   *
   * Undefined locally, so `next dev` and local builds also carry the header —
   * correct, if irrelevant.
   */
  async headers() {
    if (isIndexableBuild()) return [];

    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
};

export default nextConfig;
