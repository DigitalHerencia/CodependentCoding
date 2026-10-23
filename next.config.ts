import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  poweredByHeader: false,
  turbopack: {},
  typescript: {
    tsconfigPath: "tsconfig.build.json",
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
