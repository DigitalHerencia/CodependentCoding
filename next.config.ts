import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  poweredByHeader: false,
  transpilePackages: ['@hipster-stack/core', '@hipster-stack/schema'],
  turbopack: {},
  typescript: {
    tsconfigPath: 'tsconfig.build.json',
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
