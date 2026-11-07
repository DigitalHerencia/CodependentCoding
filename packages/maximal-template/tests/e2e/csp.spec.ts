import { expect, test, type Page } from "@playwright/test";

/** Every CSP violation the page reports, from the console and the DOM event. */
async function collectViolations(page: Page) {
  const violations: string[] = [];
  page.on("console", (message) => {
    if (/content security policy/i.test(message.text()))
      violations.push(message.text());
  });
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (event) => {
      console.error(
        `Content Security Policy violation: ${event.violatedDirective} ${event.blockedURI}`,
      );
    });
  });
  return violations;
}

for (const path of ["/faq", "/sign-in"]) {
  test(`${path} gets the static policy`, async ({ request }) => {
    const response = await request.get(path);
    const policy = response.headers()["content-security-policy"];
    expect(policy).toContain("script-src 'self' 'unsafe-inline'");
    expect(policy).not.toContain("nonce-");
    expect(policy).toContain("object-src 'none'");
    expect(policy).toContain("frame-ancestors 'none'");
  });
}

for (const path of ["/", "/faq", "/sign-in"]) {
  test(`no CSP violations in the browser on ${path}`, async ({ page }) => {
    const violations = await collectViolations(page);
    const response = await page.goto(path, { waitUntil: "load" });
    // Our page, not Clerk's development handshake (see playwright.config.ts).
    expect(new URL(page.url()).pathname).toBe(path);
    expect(response?.headers()["content-security-policy"]).toBeTruthy();
    await page.waitForTimeout(500);
    expect(violations).toEqual([]);

    // The detector itself works: a third-party image is reported.
    await page.evaluate(() => {
      const image = document.createElement("img");
      image.src = "https://blocked.invalid/pixel.png";
      document.body.append(image);
    });
    await expect.poll(() => violations.length).toBeGreaterThan(0);
  });
}
