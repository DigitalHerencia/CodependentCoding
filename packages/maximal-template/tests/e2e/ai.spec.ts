import { expect, test } from "@playwright/test";

/** These sources are authored only; no generation submission or provider request is necessary. */
for (const pathname of ["/ai", "/ai/playground", "/ai/usage"]) {
  test(`AI tenant route ${pathname} redirects signed-out visitors`, async ({
    request,
  }) => {
    const response = await request.get(pathname, { maxRedirects: 0 });
    expect(response.status()).toBeGreaterThanOrEqual(300);
    expect(response.status()).toBeLessThan(400);
    expect(response.headers()["location"]).toContain("/sign-in");
  });
}

const memberState = process.env.E2E_AI_MEMBER_STORAGE_STATE;
test.describe("ordinary authorized AI member", () => {
  test.skip(
    !memberState,
    "Requires a disposable ACTIVE MEMBER with ai.generation:read permission.",
  );
  test.use({ storageState: memberState ?? { cookies: [], origins: [] } });

  test("reads overview, playground and usage inside the existing tenant shell", async ({
    page,
  }) => {
    await page.goto("/ai");
    await expect(
      page.getByRole("heading", { name: "AI overview", exact: true }),
    ).toBeVisible();
    const aiNavigation = page.getByRole("navigation", {
      name: "AI overview",
      exact: true,
    });
    await aiNavigation
      .getByRole("link", { name: "AI playground", exact: true })
      .click();
    await expect(page).toHaveURL(/\/ai\/playground$/);
    await expect(page.getByLabel("Your prompt", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Generated response", exact: true }),
    ).toBeVisible();
    await page
      .getByRole("navigation", { name: "AI overview", exact: true })
      .getByRole("link", { name: "AI usage", exact: true })
      .click();
    await expect(page).toHaveURL(/\/ai\/usage$/);
    await expect(
      page.getByRole("heading", { name: "AI usage", exact: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByText("Date range (UTC)", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("navigation", {
        name: "Tenant mobile navigation",
        exact: true,
      }),
    ).toHaveCount(0);
  });
});
