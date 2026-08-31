import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  poweredByHeader: false,
  transpilePackages: ['@hipster-stack/core', '@hipster-stack/schema'],
  turbopack: {},
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
