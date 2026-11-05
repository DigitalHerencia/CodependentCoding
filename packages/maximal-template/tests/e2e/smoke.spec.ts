import { expect, test } from "@playwright/test";

test("landing page renders", async ({ request }) => {
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  expect(await response.text()).toMatch(/<h1[\s>]/);
});

test("dashboard redirects signed-out visitors to sign-in", async ({
  request,
}) => {
  const response = await request.get("/dashboard", { maxRedirects: 0 });
  expect(response.status()).toBeGreaterThanOrEqual(300);
  expect(response.status()).toBeLessThan(400);
  expect(response.headers()["location"]).toContain("/sign-in");
});
