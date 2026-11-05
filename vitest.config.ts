import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: [{ find: /^@\//, replacement: `${root}/` }],
  },
  test: {
    environment: "node",

    include: [
      "tests/**/*.test.ts",
      "packages/generator/tests/cli/**/*.test.ts",
      "packages/loaded-vibes/tests/**/*.test.ts",
    ],

    exclude: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "packages/maximal-template/**",
    ],

    testTimeout: 15_000,
    hookTimeout: 15_000,

    clearMocks: true,
    restoreMocks: true,
  },
});
