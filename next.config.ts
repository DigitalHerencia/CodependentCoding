import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable font optimization in CI environments to avoid network issues
  optimizeFonts: process.env.CI ? false : true,
};

export default nextConfig;
