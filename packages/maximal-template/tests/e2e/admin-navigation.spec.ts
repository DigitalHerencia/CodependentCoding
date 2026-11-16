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
    { width: 820, height: 1180 },
  ]) {
    test(`one fullscreen administration menu replaces the bottom bar at ${viewport.width}px`, async ({
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
        name: "Open navigation",
        exact: true,
      });
      await expect(trigger).toBeVisible();
      await trigger.click();
      const dialog = page.getByRole("dialog", {
        name: "Admin navigation",
        exact: true,
      });
      await expect(dialog).toBeVisible();
      const rect = await dialog.boundingBox();
      expect(rect).not.toBeNull();
      if (!rect) throw new Error("The fullscreen menu must have a layout box.");
      expect(rect.width).toBeGreaterThanOrEqual(viewport.width - 2);
      expect(rect.height).toBeGreaterThanOrEqual(viewport.height - 2);
      for (const name of ["Users", "Records", "Audit", "Workspace"])
        await expect(
          dialog.getByRole("link", { name, exact: true }),
        ).toBeVisible();
      await expect(
        dialog.getByRole("button", { name: "Manage account", exact: true }),
      ).toBeVisible();
      await expect(
        dialog.getByRole("button", { name: "Sign out", exact: true }),
      ).toBeVisible();
      await dialog.getByRole("button", { name: /close/i }).click();
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
      await trigger.click();
      await page.keyboard.press("Escape");
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
    });
  }

  test("desktop keeps header links and hides the hamburger", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/admin/users");
    await expect(
      page.getByRole("navigation", { name: "Admin navigation", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Open navigation", exact: true }),
    ).toBeHidden();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
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
