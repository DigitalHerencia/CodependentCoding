import { expect, test } from "@playwright/test";

// Authored only. Fixture storage state must belong to a disposable Clerk development user.
const newProfileState = process.env.E2E_ONBOARDING_NEW_STORAGE_STATE;
const activeProfileState = process.env.E2E_ONBOARDING_ACTIVE_STORAGE_STATE;

test("own-profile edit entry keeps the sign-in gate for signed-out requests", async ({
  request,
}) => {
  const response = await request.get("/onboarding/profile", {
    maxRedirects: 0,
  });
  expect(response.status()).toBeGreaterThanOrEqual(300);
  expect(response.status()).toBeLessThan(400);
  expect(response.headers()["location"]).toContain("/sign-in");
});

test.describe("new profile review", () => {
  test.skip(
    !newProfileState,
    "Requires a dedicated incomplete-profile development session.",
  );
  test.use({ storageState: newProfileState ?? { cookies: [], origins: [] } });
  test("review preserves editable input and saves only after confirmation", async ({
    page,
  }) => {
    await page.goto("/onboarding");
    await page
      .getByLabel("Display name", { exact: true })
      .fill("Reviewed fixture name");
    await page
      .getByRole("button", { name: "Review profile", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Review your profile" }),
    ).toBeVisible();
    await expect(
      page.getByText("Reviewed fixture name", { exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Edit profile", exact: true })
      .click();
    await expect(page.getByLabel("Display name", { exact: true })).toHaveValue(
      "Reviewed fixture name",
    );
    await page
      .getByRole("button", { name: "Review profile", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Save profile", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Complete your profile", exact: true }),
    ).toHaveCount(0);
  });
});

test.describe("existing active member profile", () => {
  test.skip(
    !activeProfileState,
    "Requires a dedicated ACTIVE development membership.",
  );
  test.use({
    storageState: activeProfileState ?? { cookies: [], origins: [] },
  });
  test("edits the personal profile through review without organization settings", async ({
    page,
  }) => {
    await page.goto("/onboarding/profile");
    await expect(
      page.getByRole("heading", { name: "Edit your profile" }),
    ).toBeVisible();
    await page
      .getByLabel("Display name", { exact: true })
      .fill("Edited fixture name");
    await page
      .getByRole("button", { name: "Review profile", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Save profile", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText("Profile saved.");
    await page.reload();
    await expect(page.getByLabel("Display name", { exact: true })).toHaveValue(
      "Edited fixture name",
    );
    await expect(page.getByLabel("Timezone", { exact: true })).toHaveCount(0);
  });
});
