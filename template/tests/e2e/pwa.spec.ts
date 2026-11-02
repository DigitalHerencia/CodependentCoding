import { expect, test } from "@playwright/test";

test("the service worker refuses HTML from an immutable-asset URL", async ({
  page,
  context,
}) => {
  let intercepted = false;
  await context.route("**/_next/static/pwa-html-probe.js", (route) => {
    intercepted = route.request().serviceWorker() !== null;
    return route.fulfill({
      contentType: "text/html",
      body: "<html><body>must not be cached</body></html>",
    });
  });
  await page.goto("/");
  await page.waitForFunction(async () => {
    await navigator.serviceWorker.ready;
    return navigator.serviceWorker.controller !== null;
  });

  await page.evaluate(() => fetch("/_next/static/pwa-html-probe.js"));
  expect(intercepted).toBe(true);

  const cachedUrls = await page.evaluate(async () => {
    const names = await caches.keys();
    const entries = await Promise.all(
      names.map(async (name) => (await caches.open(name)).keys()),
    );
    return entries.flat().map((request) => new URL(request.url).pathname);
  });

  expect(cachedUrls).not.toContain("/_next/static/pwa-html-probe.js");
  expect(cachedUrls).not.toContain("/");
  expect(cachedUrls).toEqual(
    expect.arrayContaining(["/offline", "/icons/192.png"]),
  );
});

test("the logout signal empties every cache", async ({ page }) => {
  await page.goto("/");
  await page.waitForFunction(async () => {
    await navigator.serviceWorker.ready;
    return navigator.serviceWorker.controller !== null;
  });

  const workerMessage = await page.evaluate(async () => {
    const cache = await caches.open("logout-probe");
    await cache.put("/logout-probe", new Response("temporary"));
    const registration = await navigator.serviceWorker.ready;
    return new Promise((resolve) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => resolve(event.data);
      registration.active?.postMessage("logout", [channel.port2]);
    });
  });

  expect(workerMessage).toBe("cleared");
  await expect.poll(async () => page.evaluate(() => caches.keys())).toEqual([]);
});
