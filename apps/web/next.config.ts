import type { NextConfig } from 'next';

const config: NextConfig = {
  transpilePackages: ['@hipster-stack/core', '@hipster-stack/schema'],
  webpack(configuration) {
    configuration.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js'],
      '.jsx': ['.tsx', '.jsx'],
    };
    return configuration;
  },
};

export default config;
