import { defineConfig } from "@playwright/test";

// Owner supplies an existing preview or starts their own local server.
// Tests must never implicitly start builds or servers.
export default defineConfig({
  testDir: "./tests/e2e",
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"]] : [["list"]],
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000" },
  outputDir: "test-results",
});
