import { expect, test } from "@playwright/test";

test("site responses carry the shared security policy", async ({ request }) => {
  // Include not-yet-published representations: error responses also need headers.
  for (const path of ["/", "/doctrine.md", "/rules.json", "/sw.js"]) {
    const response = await request.get(path);
    const headers = response.headers();
    expect(headers["content-security-policy"], path).toContain(
      "object-src 'none'",
    );
    expect(headers["strict-transport-security"], path).toContain(
      "max-age=31536000",
    );
    expect(headers["cross-origin-opener-policy"], path).toBe("same-origin");
    expect(headers["x-content-type-options"], path).toBe("nosniff");
    expect(headers["referrer-policy"], path).toBe(
      "strict-origin-when-cross-origin",
    );
    expect(headers["x-frame-options"], path).toBe("DENY");
    expect(headers["permissions-policy"], path).toContain("camera=()");
    expect(headers["x-xss-protection"], path).toBeUndefined();
  }
});

test("security.txt publishes the private reporting channel", async ({
  request,
}) => {
  const response = await request.get("/.well-known/security.txt");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/plain");
  const body = await response.text();
  expect(body).toContain(
    "Contact: https://github.com/DigitalHerencia/CodependentCoding/security/advisories/new\n",
  );
  expect(body).toContain(
    "Canonical: https://codependentcoding.vercel.app/.well-known/security.txt\n",
  );
  const expires = /^Expires: (.+)$/m.exec(body)?.[1];
  expect(expires).toBeDefined();
  const expiry = Date.parse(expires!);
  expect(expiry).toBeGreaterThan(Date.now());
  expect(expiry).toBeLessThanOrEqual(Date.now() + 366 * 24 * 60 * 60 * 1000);
});
