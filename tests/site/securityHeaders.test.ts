import { expect, test } from "vitest";
import config from "@/next.config";

test("the catch-all response policy includes CSP, HSTS and opener isolation", async () => {
  const routes = await config.headers!();
  const route = routes.find((entry) => entry.source === "/:path*");
  expect(route).toBeDefined();
  const headers = Object.fromEntries(
    route!.headers.map(({ key, value }) => [key.toLowerCase(), value]),
  );

  expect(headers).toMatchObject({
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
    "x-frame-options": "DENY",
    "permissions-policy":
      "camera=(), microphone=(), geolocation=(), browsing-topics=()",
    "strict-transport-security": "max-age=31536000; includeSubDomains",
    "cross-origin-opener-policy": "same-origin",
  });
  expect(headers).not.toHaveProperty("x-xss-protection");
  const policy = headers["content-security-policy"];
  expect(policy).toBeDefined();
  expect(policy!.split("; ")).toEqual([
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
    "manifest-src 'self'",
    "worker-src 'self'",
    "upgrade-insecure-requests",
  ]);
});
