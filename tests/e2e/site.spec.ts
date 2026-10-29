import { expect, test } from "@playwright/test";

// Crawls every same-site link reachable from the home page and the pages it
// links to, so a renamed route or a typo in the nav fails here, not in prod.
test("every internal link on the site resolves", async ({ request }) => {
  test.setTimeout(180_000);
  const seen = new Set<string>();
  const queue = ["/"];
  const broken: string[] = [];

  while (queue.length > 0) {
    const path = queue.shift()!;
    if (seen.has(path)) continue;
    seen.add(path);

    const response = await request.get(path);
    if (response.status() !== 200) {
      broken.push(`${path} -> ${response.status()}`);
      continue;
    }
    if (!response.headers()["content-type"]?.includes("text/html")) continue;

    const html = await response.text();
    for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
      if (href && !href.startsWith("/_next/") && !seen.has(href)) {
        queue.push(href);
      }
    }
  }

  expect(broken).toEqual([]);
  expect(seen.size).toBeGreaterThan(5);
});
