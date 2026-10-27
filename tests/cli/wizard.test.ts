import path from "node:path";

import { expect, test } from "vitest";

import { readManifest } from "@/packages/cli/src/compose/composeApp";
import { paletteAt } from "@/packages/cli/src/wizard/banner";
import {
  checkClerk,
  envPlan,
  integrationVars,
  mask,
} from "@/packages/cli/src/wizard/keys";
import { summaryLines } from "@/packages/cli/src/wizard/prompts";

const manifest = readManifest(
  path.resolve(import.meta.dirname, "../../template"),
);

test("Clerk answers are checked by shape; blank skips", () => {
  expect(checkClerk("appId", "")).toBeUndefined();
  expect(checkClerk("appId", "app_2abc")).toBeUndefined();
  expect(checkClerk("appId", "2abc")).toMatch(/app_/);
  expect(checkClerk("publishableKey", "pk_live_abc=")).toBeUndefined();
  expect(checkClerk("secretKey", "pk_test_abc")).toMatch(/sk_/);
  expect(checkClerk("devWebhookSecret", "whsec_abc+/=")).toBeUndefined();
  expect(checkClerk("ngrokDomain", "https://x.ngrok.app")).toMatch(/bare/);
  expect(checkClerk("ngrokDomain", "my-app.ngrok-free.app")).toBeUndefined();
});

test("a domain asks for the keys of every integration it brings in", () => {
  const vars = integrationVars(manifest, manifest.presets.invoicing ?? []);
  expect(vars.map((v) => `${v.module}:${v.name}`)).toEqual([
    "billing:STRIPE_SECRET_KEY",
    "billing:STRIPE_WEBHOOK_SECRET",
    "uploads:BLOB_READ_WRITE_TOKEN",
  ]);
  expect(vars.every((v) => v.secret)).toBe(true);
  expect(integrationVars(manifest, manifest.presets.crm ?? [])).toEqual([]);
});

test("dev keys go to .env.local and the production webhook secret apart", () => {
  const plan = envPlan(
    {
      appId: "app_1",
      publishableKey: "pk_test_x",
      secretKey: "sk_test_y",
      devWebhookSecret: "whsec_dev",
      prodWebhookSecret: "whsec_prod",
      ngrokDomain: "a.ngrok.app",
    },
    { STRIPE_SECRET_KEY: "sk_test_z" },
  );
  expect(plan.local).toEqual({
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_x",
    CLERK_SECRET_KEY: "sk_test_y",
    CLERK_WEBHOOK_SIGNING_SECRET: "whsec_dev",
    STRIPE_SECRET_KEY: "sk_test_z",
  });
  expect(plan.production).toEqual({
    CLERK_WEBHOOK_SIGNING_SECRET: "whsec_prod",
  });
  expect(envPlan({}, {})).toEqual({ local: {}, production: {} });
});

test("the confirm screen never shows a whole secret", () => {
  const secret = "sk_test_supersecretvalue1234";
  const lines = summaryLines({
    dir: "/apps/demo",
    name: "demo",
    domain: "invoicing",
    modules: ["invoicing", "billing"],
    tenancy: "single",
    accessControl: "rbac",
    color: null,
    databaseUrl: "postgresql://owner:hunter2@ep-x.neon.tech/db",
    clerk: { secretKey: secret, devWebhookSecret: "whsec_abcdefgh1234" },
    integrations: { STRIPE_SECRET_KEY: secret },
    missing: ["STRIPE_WEBHOOK_SECRET"],
  }).join("\n");
  expect(lines).not.toContain(secret);
  expect(lines).not.toContain("hunter2");
  expect(lines).toContain(mask(secret));
  expect(mask(secret)).toBe("sk_test_…1234");
  expect(lines).toContain("single organization");
  expect(lines).toContain("RBAC only");
  expect(lines).toContain("Still needed  STRIPE_WEBHOOK_SECRET");
});

test("the banner sweeps its colors frame by frame", () => {
  expect(paletteAt(1)).not.toEqual(paletteAt(0));
  expect(paletteAt(1)[4]).toEqual(paletteAt(0)[0]);
  expect(paletteAt(5)).toEqual(paletteAt(0));
});
