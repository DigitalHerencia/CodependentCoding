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
    clearMocks: true,
    restoreMocks: true,
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["tests/**/*.test.ts"],
          exclude: ["tests/e2e/**", "tests/rls/**"],
          testTimeout: 15_000,
          hookTimeout: 15_000,
        },
      },
      {
        // Real Postgres (DATABASE_URL_TEST); run with `pnpm test:rls`.
        extends: true,
        test: {
          name: "rls",
          include: ["tests/rls/**/*.test.ts"],
          testTimeout: 60_000,
          hookTimeout: 300_000,
        },
      },
    ],
  },
});
