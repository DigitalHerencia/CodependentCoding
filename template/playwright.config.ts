import { defineConfig } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://127.0.0.1:${PORT}`;

// Most tests use the HTTP request fixture. The CSP tests also open Chromium
// (`pnpm exec playwright install chromium` once). A browser follows Clerk's
// development handshake to the Frontend API, so with placeholder keys use a
// production-format publishable key (CI does); real development keys work too.
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
