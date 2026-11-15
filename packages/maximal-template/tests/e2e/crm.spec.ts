import { expect, test } from "@playwright/test";

/** CRM route access must remain protected by the existing tenant auth boundary. */
for (const pathname of ["/crm/accounts", "/crm/contacts", "/crm/leads", "/crm/pipeline", "/crm/analytics"]) {
  test(`signed-out visitor is redirected from ${pathname}`, async ({ request }) => {
    const response = await request.get(pathname, { maxRedirects: 0 });
    expect(response.status()).toBeGreaterThanOrEqual(300);
    expect(response.status()).toBeLessThan(400);
    expect(response.headers()["location"]).toContain("/sign-in");
  });
}
