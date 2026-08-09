import type { NextConfig } from 'next';

const config: NextConfig = {
  transpilePackages: [
    '@loaded-vibes/core',
    '@loaded-vibes/schema',
    '@loaded-vibes/recipes',
  ],
  webpack(configuration) {
    configuration.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js'],
      '.jsx': ['.tsx', '.jsx'],
    };
    return configuration;
  },
};

export default config;
