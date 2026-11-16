import { expect, test } from "@playwright/test";

// Authored only; no server or browser is started during this delivery.
test("a signed-out invitation recipient is gated by authentication", async ({
  request,
}) => {
  const response = await request.get(`/invite/${"fixture".repeat(8)}`, {
    maxRedirects: 0,
  });
  expect(response.status()).toBeGreaterThanOrEqual(300);
  expect(response.status()).toBeLessThan(400);
  expect(response.headers()["location"]).toContain("/sign-in");
});

test("sign-up, onboarding and invitation URL ownership remain separate", async ({
  page,
}) => {
  await page.goto("/sign-up");
  await expect(page.getByRole("link", { name: "Return Home" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Accept invitation" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Create invitation" }),
  ).toHaveCount(0);
});
