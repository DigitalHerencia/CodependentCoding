import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  poweredByHeader: false,
  // AGENTS.md already routes agents to CLAUDE.md; stop `next dev` rewriting it.
  agentRules: false,
  turbopack: {},
  typescript: {
    tsconfigPath: "tsconfig.build.json",
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
