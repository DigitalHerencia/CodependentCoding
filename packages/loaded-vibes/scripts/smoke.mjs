#!/usr/bin/env node
/**
 * Smoke test for a deployed (or locally started) generated app: the landing
 * page renders and a tenant route sends signed-out visitors to sign-in, the
 * same two checks as tests/e2e/smoke.spec.ts.
 *
 *   node scripts/smoke.mjs <url>   prints one line per check, exit 1 on any failure
 */
import { pathToFileURL } from "node:url";

export async function smoke(baseUrl) {
  const url = (route) => new URL(route, baseUrl).href;
  const checks = [];

  const landing = await fetch(url("/"), { redirect: "follow" });
  const html = await landing.text();
  checks.push({
    check: "GET / renders",
    ok: landing.status === 200 && /<h1[\s>]/.test(html),
    detail: `${landing.status}${/<h1[\s>]/.test(html) ? ", has <h1>" : ", no <h1>"}`,
  });

  const tenant = await fetch(url("/dashboard"), { redirect: "manual" });
  const location = tenant.headers.get("location") ?? "";
  checks.push({
    check: "GET /dashboard redirects to sign-in",
    ok:
      tenant.status >= 300 &&
      tenant.status < 400 &&
      location.includes("/sign-in"),
    detail: `${tenant.status}${location ? ` -> ${location}` : ""}`,
  });
  return checks;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const baseUrl = process.argv[2];
  if (!baseUrl) {
    process.stderr.write("usage: node scripts/smoke.mjs <url>\n");
    process.exit(1);
  }
  const checks = await smoke(baseUrl);
  for (const { check, ok, detail } of checks) {
    process.stdout.write(`${ok ? "PASS" : "FAIL"} ${check} (${detail})\n`);
  }
  process.exit(checks.every(({ ok }) => ok) ? 0 : 1);
}
