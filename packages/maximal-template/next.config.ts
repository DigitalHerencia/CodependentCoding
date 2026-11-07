import type { NextConfig } from "next";

// Security headers for every route (tech-requirements.md §5).
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
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
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // The admin route group owns the pages, while existing admin URLs keep their prefix.
  async rewrites() {
    return [
      { source: "/admin/users/:path*", destination: "/users/:path*" },
      { source: "/admin/records/:path*", destination: "/records/:path*" },
      { source: "/admin/audit", destination: "/audit" },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/sw.js",
        headers: [
          ...securityHeaders,
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          { key: "Content-Security-Policy", value: "script-src 'self'" },
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
