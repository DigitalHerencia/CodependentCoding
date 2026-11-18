import { expect, test } from "@playwright/test";

// Authored only. The owner supplies disposable Clerk sessions with the indicated roles.
const adminState = process.env.E2E_NAV_ADMIN_STORAGE_STATE;
const viewerState = process.env.E2E_NAV_VIEWER_STORAGE_STATE;

test("signed-out administration remains behind the authentication gate", async ({
  request,
}) => {
  const response = await request.get("/admin/users", { maxRedirects: 0 });
  expect(response.status()).toBeGreaterThanOrEqual(300);
  expect(response.status()).toBeLessThan(400);
  expect(response.headers()["location"]).toContain("/sign-in");
});

test.describe("administrator navigation", () => {
  test.skip(!adminState, "Requires a disposable ACTIVE ADMIN session.");
  test.use({ storageState: adminState ?? { cookies: [], origins: [] } });

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 600, height: 900 },
  ]) {
    test(`the shared responsive sidebar opens and closes at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/admin/users");
      await expect(
        page.getByRole("navigation", {
          name: "Admin mobile navigation",
          exact: true,
        }),
      ).toHaveCount(0);
      const trigger = page.getByRole("button", {
        name: "Admin navigation",
        exact: true,
      });
      await trigger.click();
      const dialog = page.getByRole("dialog", {
        name: "Navigation",
        exact: true,
      });
      await expect(dialog).toBeVisible();
      const navigation = dialog.getByRole("navigation", {
        name: "Admin navigation",
        exact: true,
      });
      for (const name of ["Users", "Records", "Audit", "Workspace"])
        await expect(
          navigation.getByRole("link", { name, exact: true }),
        ).toBeVisible();
      await expect(
        dialog.locator('[aria-haspopup="dialog"]').first(),
      ).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
      await trigger.click();
      await navigation
        .getByRole("link", { name: "Audit", exact: true })
        .click();
      await expect(page).toHaveURL(/\/admin\/audit/);
      await expect(dialog).toHaveCount(0);
    });
  }

  for (const width of [820, 1440]) {
    test(`desktop uses the same collapsible sidebar at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/admin/users");
      await expect(
        page.getByRole("navigation", { name: "Admin navigation", exact: true }),
      ).toBeVisible();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await page
        .getByRole("button", { name: "Admin navigation", exact: true })
        .click();
      await expect(
        page.locator('[data-state="collapsed"][data-collapsible="hidden"]'),
      ).toHaveCount(1);
    });
  }
});

test.describe("non-administrator server authorization", () => {
  test.skip(!viewerState, "Requires a disposable ACTIVE VIEWER session.");
  test.use({ storageState: viewerState ?? { cookies: [], origins: [] } });
  test("direct administration URLs remain denied even without navigation", async ({
    page,
  }) => {
    const response = await page.goto("/admin/users");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("navigation", { name: "Admin navigation", exact: true }),
    ).toHaveCount(0);
  });
});
