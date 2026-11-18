/** Auth.spec contracts for the owning application slice. */
import { expect, test } from "@playwright/test";

// Authored only. The owner must configure a Clerk development instance before running.
for (const route of ["/sign-in", "/sign-up"] as const) {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 820, height: 1180 },
    { width: 1440, height: 1000 },
  ]) {
    test(`${route} preserves auth-only navigation and layout at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(route);
      await expect(
        page.getByRole("link", { name: "Return Home" }),
      ).toHaveAttribute("href", "/");
      await expect(page.locator(".auth-footer")).toContainText(
        "All rights reserved.",
      );
      await expect(
        page.locator(".auth-footer a, .auth-footer button, nav"),
      ).toHaveCount(0);
      const brand = await page.locator(".auth-brand-panel").boundingBox();
      const form = await page.locator(".auth-form-column").boundingBox();
      expect(brand).not.toBeNull();
      expect(form).not.toBeNull();
      if (!brand || !form)
        throw new Error("Auth shell panels must be visible.");
      if (viewport.width >= 1024) {
        expect(Math.abs(brand.width - form.width)).toBeLessThan(2);
        expect(Math.abs(brand.y - form.y)).toBeLessThan(2);
        if (route === "/sign-up") expect(form.x).toBeLessThan(brand.x);
      } else {
        expect(Math.abs(brand.x - form.x)).toBeLessThan(2);
        expect(form.y).toBeGreaterThanOrEqual(brand.y + brand.height - 1);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    });
  }
}

test("recovery switches fields and can return to password sign-in", async ({
  page,
}) => {
  await page.goto("/sign-in");
  await expect(page.getByLabel("Username", { exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Forgot password?" }).click();
  await expect(
    page.getByRole("heading", { name: "Reset your password" }),
  ).toBeVisible();
  await expect(page.getByLabel("Password", { exact: true })).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Send recovery code" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Back to sign in" }).click();
  await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
});

test("sign-up validation and password visibility retain accessible controls", async ({
  page,
}) => {
  await page.goto("/sign-up");
  const password = page.getByLabel("Password", { exact: true });
  await expect(password).toBeEnabled();
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(password).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "Hide password" }).click();
  await expect(password).toHaveAttribute("type", "password");
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await expect(page.getByLabel("Username", { exact: true })).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await expect(page.locator("#clerk-captcha")).toHaveCount(1);
});

test("the signed-out invitation entry retains its sign-in gate", async ({
  request,
}) => {
  const response = await request.get("/invitations/fixture-untrusted-token", {
    maxRedirects: 0,
  });
  expect(response.status()).toBeGreaterThanOrEqual(300);
  expect(response.status()).toBeLessThan(400);
  expect(response.headers()["location"]).toContain("/sign-in");
});
