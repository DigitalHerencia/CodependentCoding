import { defineConfig } from "@playwright/test";

const PORT = 3000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

// The site smoke test uses the HTTP request fixture, so no browser download is
// needed. It runs against a production build to match what Vercel serves.
export default defineConfig({
  testDir: "./tests/e2e",
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"]] : [["list"]],
  use: { baseURL: BASE_URL },
  webServer: {
    command: `pnpm build && pnpm start --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
  outputDir: "test-results",
});
