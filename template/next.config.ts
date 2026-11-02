import type { NextConfig } from "next";

// Security headers for every route (tech-requirements.md §5).
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  reactCompiler: true,
  // Nothing is cached unless code says so ('use cache'); links prefetch only
  // the static parts of a route (doctrine Ch. 03, ledger R-1).
  cacheComponents: true,
  partialPrefetching: true,
  // Each route group is its own root layout, so unmatched URLs need their
  // own document (app/global-not-found.tsx).
  experimental: { globalNotFound: true },
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
