import { defineConfig } from "vitest/config";

export default defineConfig({
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
