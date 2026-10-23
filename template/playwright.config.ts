import { defineConfig } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://127.0.0.1:${PORT}`;

// Smoke tests use the HTTP request fixture, so no browser download is needed and
// Clerk's development handshake (a browser-only redirect) does not interfere.
export default defineConfig({
  testDir: "./tests/e2e",
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"]] : [["list"]],
  use: { baseURL: BASE_URL },
  webServer: {
    command: `pnpm dev --port ${PORT}`,
    url: `${BASE_URL}/faq`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  outputDir: "test-results",
});
