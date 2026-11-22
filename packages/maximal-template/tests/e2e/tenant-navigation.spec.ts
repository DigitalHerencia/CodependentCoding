/** Existing browser contracts aligned with modal onboarding and live tenant destinations. */
import { expect, test } from "@playwright/test";

// Authored only; these fixtures must be disposable Clerk sessions for the indicated role/state.
const tenantState = process.env.E2E_NAV_MEMBER_STORAGE_STATE;
const multipleOrganizationsState = process.env.E2E_NAV_MULTI_ORG_STORAGE_STATE;
const signoutState = process.env.E2E_NAV_SIGNOUT_STORAGE_STATE;

test.describe("authenticated workspace navigation", () => {
  test.skip(!tenantState, "Requires a disposable ACTIVE MEMBER session.");
  test.use({ storageState: tenantState ?? { cookies: [], origins: [] } });
  /** Each social route renders in the same authenticated desktop shell. */
  test("social routes use the workspace sidebar and render their own page heading", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const [path, heading] of [
      ["/social/calendar", "Social calendar"],
      ["/social/compose", "Compose post"],
      ["/social/media", "Media library"],
    ] as const) {
      await page.goto(path);
      await expect(
        page.getByRole("heading", { name: heading, level: 1 }),
      ).toBeVisible();
      await expect(
        page.getByRole("complementary", { name: "Workspace sidebar" }),
      ).toHaveCount(1);
    }
  });

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 820, height: 1180 },
  ]) {
    test(`one fullscreen workspace menu at ${viewport.width}px supports focus, escape, close and route changes`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/dashboard");
      await expect(
        page.getByRole("navigation", {
          name: "Tenant mobile navigation",
          exact: true,
        }),
      ).toHaveCount(0);
      const trigger = page.getByRole("button", {
        name: "Open navigation",
        exact: true,
      });
      const overflowBefore = await page.evaluate(
        () => getComputedStyle(document.body).overflow,
      );
      await trigger.click();
      const dialog = page.getByRole("dialog", {
        name: "Workspace navigation",
        exact: true,
      });
      await expect(dialog).toBeVisible();
      const rect = await dialog.boundingBox();
      if (!rect) throw new Error("The menu must have a viewport layout box.");
      expect(rect.width).toBeGreaterThanOrEqual(viewport.width - 2);
      expect(rect.height).toBeGreaterThanOrEqual(viewport.height - 2);
      await expect
        .poll(() =>
          page.evaluate(() => getComputedStyle(document.body).overflow),
        )
        .toBe("hidden");
      for (const key of ["Tab", "Shift+Tab"]) {
        for (let index = 0; index < 18; index++) {
          await page.keyboard.press(key);
          expect(
            await dialog.evaluate((element) =>
              element.contains(document.activeElement),
            ),
          ).toBe(true);
        }
      }
      await page.keyboard.press("Escape");
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
      await expect
        .poll(() =>
          page.evaluate(() => getComputedStyle(document.body).overflow),
        )
        .toBe(overflowBefore);
      await trigger.click();
      await dialog
        .getByRole("button", { name: "Close navigation", exact: true })
        .click();
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
      await trigger.click();
      await dialog.getByRole("link", { name: "Members", exact: true }).click();
      await expect(page).toHaveURL(/\/settings\/members$/);
      await expect(
        page.getByRole("heading", { name: "Workspace directory", level: 1 }),
      ).toBeVisible();
      await expect(
        page.getByRole("columnheader", { name: "Access" }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Pending invitations" }),
      ).toHaveCount(0);
      await expect(page.getByRole("dialog")).toHaveCount(0);
    });
  }

  test("desktop sidebar stays visible and resizing an open modal releases the scroll lock", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 820, height: 1180 });
    await page.goto("/dashboard");
    await page
      .getByRole("button", { name: "Open navigation", exact: true })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Open navigation", exact: true }),
    ).toBeHidden();
    await expect(
      page.getByRole("complementary", {
        name: "Workspace sidebar",
        exact: true,
      }),
    ).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.body).overflow))
      .not.toBe("hidden");
  });

  test("an outside-pointer event on the backdrop dismisses the modal", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/dashboard");
    const trigger = page.getByRole("button", {
      name: "Open navigation",
      exact: true,
    });
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page
      .locator("[data-authenticated-navigation-backdrop]")
      .dispatchEvent("pointerdown", {
        button: 0,
        isPrimary: true,
        pointerType: "mouse",
      });
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("personal account management closes navigation before opening Clerk's modal", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/dashboard");
    await page
      .getByRole("button", { name: "Open navigation", exact: true })
      .click();
    const navigation = page.getByRole("dialog", {
      name: "Workspace navigation",
      exact: true,
    });
    await expect(
      navigation.getByRole("button", { name: "Manage account", exact: true }),
    ).toBeEnabled();
    await navigation
      .getByRole("button", { name: "Manage account", exact: true })
      .click();
    await expect(navigation).toHaveCount(0);
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});

test.describe("active organization membership switching", () => {
  test.skip(
    !multipleOrganizationsState,
    "Requires a disposable user with two ACTIVE memberships.",
  );
  test.use({
    storageState: multipleOrganizationsState ?? { cookies: [], origins: [] },
  });
  test("switches only between server-projected active organizations", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/dashboard");
    await page
      .getByRole("button", { name: "Open navigation", exact: true })
      .click();
    const select = page
      .getByRole("dialog")
      .getByLabel("Organization", { exact: true });
    const previous = await select.inputValue();
    const ids = await select
      .locator("option")
      .evaluateAll((options) =>
        options.map((option) => (option as HTMLOptionElement).value),
      );
    const target = ids.find((id) => id !== previous);
    if (!target)
      throw new Error("The fixture must have a second ACTIVE organization.");
    await select.selectOption(target);
    await expect
      .poll(
        async () =>
          (await page.context().cookies()).find(
            (cookie) => cookie.name === "active-org",
          )?.value,
      )
      .toBe(target);
  });
});

test.describe("disposable sign-out session", () => {
  // Use a separate session so this test cannot invalidate other navigation fixtures.
  test.skip(!signoutState, "Requires a separate expendable Clerk session.");
  test.use({ storageState: signoutState ?? { cookies: [], origins: [] } });
  test("signs out through the existing cache-purge workflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/dashboard");
    await page
      .getByRole("button", { name: "Open navigation", exact: true })
      .click();
    const button = page
      .getByRole("dialog")
      .getByRole("button", { name: "Sign out", exact: true });
    await expect(button).toBeEnabled();
    await button.click();
    await expect(page).toHaveURL(/\/sign-in/);
  });
});

test.describe("marketing uses the existing tenant shell for ordinary members", () => {
  test.skip(
    !tenantState,
    "Requires a disposable ACTIVE MEMBER session with marketing permissions.",
  );
  test.use({ storageState: tenantState ?? { cookies: [], origins: [] } });
  for (const width of [390, 1280]) {
    test(`planning, audience and analytics routes at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/marketing/campaigns");
      await expect(
        page.getByRole("heading", { name: "Campaign planner", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("textbox", { name: "Search", exact: true }),
      ).toBeVisible();
      await page
        .getByRole("link", { name: "Plan campaign", exact: true })
        .click();
      await expect(
        page.getByLabel("Planned start (UTC)", { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText("Enter UTC, not your device's local time.", {
          exact: false,
        }),
      ).toBeVisible();
      await page.goto("/marketing/audiences");
      await expect(
        page.getByRole("heading", { name: "Audience segments", exact: true }),
      ).toBeVisible();
      await page
        .getByRole("link", { name: "Define audience", exact: true })
        .click();
      await expect(
        page.getByLabel("Contact relationship equals", { exact: true }),
      ).toBeVisible();
      await page.goto("/marketing/analytics");
      await expect(
        page.getByRole("heading", { name: "Marketing analytics", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByLabel("Created from (UTC)", { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", {
          name: "Measurement availability",
          exact: true,
        }),
      ).toBeVisible();
      await expect(
        page.getByRole("navigation", {
          name: "Tenant mobile navigation",
          exact: true,
        }),
      ).toHaveCount(0);
    });
  }
});
