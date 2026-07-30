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
};

export default nextConfig;
