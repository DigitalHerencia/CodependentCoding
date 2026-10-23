import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\//, replacement: `${root}/` },
      // Server modules import the marker; tests run them outside React Server Components.
      {
        find: /^server-only$/,
        replacement: `${root}/node_modules/server-only/empty.js`,
      },
    ],
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**", "tests/e2e/**", "tests/rls/**"],
    testTimeout: 15_000,
    hookTimeout: 15_000,
    clearMocks: true,
    restoreMocks: true,
  },
});
