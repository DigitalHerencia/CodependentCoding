import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: [{ find: /^@\//, replacement: `${root}/` }],
  },
  test: {
    environment: "node",

    include: ["tests/**/*.test.ts"],

    exclude: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "template/**",
    ],

    testTimeout: 15_000,
    hookTimeout: 15_000,

    clearMocks: true,
    restoreMocks: true,
  },
});
