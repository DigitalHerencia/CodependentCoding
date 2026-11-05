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

test("signed-in-group pages carry a per-request nonce on every script", async ({
  request,
}) => {
  const first = await request.get("/sign-in");
  const second = await request.get("/sign-in");
  const nonceOf = (policy: string | undefined) =>
    /'nonce-([^']+)'/.exec(policy ?? "")?.[1];
  const nonce = nonceOf(first.headers()["content-security-policy"]);
  expect(nonce).toBeTruthy();
  expect(nonceOf(second.headers()["content-security-policy"])).not.toBe(nonce);
  expect(first.headers()["content-security-policy"]).toContain(
    "'strict-dynamic'",
  );

  const scripts = (await first.text()).match(/<script\b[^>]*>/g) ?? [];
  expect(scripts.length).toBeGreaterThan(0);
  for (const script of scripts) expect(script).toContain(`nonce="${nonce}"`);
});

test("public pages get the static policy", async ({ request }) => {
  const response = await request.get("/faq");
  const policy = response.headers()["content-security-policy"];
  expect(policy).toContain("script-src 'self' 'unsafe-inline'");
  expect(policy).not.toContain("nonce-");
  expect(policy).toContain("object-src 'none'");
  expect(policy).toContain("frame-ancestors 'none'");
});

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
