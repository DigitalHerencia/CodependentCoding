import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['packages/cli/src/cli.ts'],
  outDir: 'dist',

  format: 'esm',
  clean: true,
  dts: false,

  banner: {
    js: '#!/usr/bin/env node',
  },

  noExternal: [
    /^@clack\/prompts$/,
    /^@hipster-stack\//,
    /^commander$/,
    /^execa$/,
    /^validate-npm-package-name$/,
    /^zod$/,
  ],
});
