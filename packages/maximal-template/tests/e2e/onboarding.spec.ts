/** Existing onboarding flows follow the mandatory local profile modal contract. */
import { expect, test } from "@playwright/test";

// Authored only. Fixture storage state must belong to a disposable Clerk development user.
const newProfileState = process.env.E2E_ONBOARDING_NEW_STORAGE_STATE;

test("the workspace entry keeps the sign-in gate for signed-out requests", async ({
  request,
}) => {
  const response = await request.get("/dashboard", {
    maxRedirects: 0,
  });
  expect(response.status()).toBeGreaterThanOrEqual(300);
  expect(response.status()).toBeLessThan(400);
  expect(response.headers()["location"]).toContain("/sign-in");
});

test.describe("new profile modal", () => {
  test.skip(
    !newProfileState,
    "Requires a dedicated incomplete-profile development session.",
  );
  test.use({ storageState: newProfileState ?? { cookies: [], origins: [] } });
  test("the profile modal saves local optional fields before workspace entry", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(
      page.getByRole("dialog", { name: "Complete your profile", exact: true }),
    ).toBeVisible();
    await page.getByLabel("First name", { exact: true }).fill("Fixture");
    await expect(page.getByLabel("First name", { exact: true })).toHaveValue(
      "Fixture",
    );
    await page
      .getByRole("button", { name: "Save profile", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Complete your profile", exact: true }),
    ).toHaveCount(0);
    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
