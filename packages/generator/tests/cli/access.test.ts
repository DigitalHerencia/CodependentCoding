import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { expect, test } from "vitest";

import { accessChoices } from "@/packages/cli/src/commands/new";
import {
  type AccessChoices,
  applyTenancy,
  AUTHZ_TEMPLATES,
  defaultAccess,
  MODE_FILE,
  POLICIES_FILE,
  POLICIES_TEST_FILE,
} from "@/packages/generator/src/compose/access";
import { composeApp } from "@/packages/generator/src/compose/composeApp";

const templateDir = path.resolve(
  import.meta.dirname,
  "../../../maximal-template",
);
const readTemplate = (file: string) =>
  readFileSync(path.join(templateDir, file), "utf8");
const readAuthzTemplate = (file: string) =>
  readFileSync(path.join(AUTHZ_TEMPLATES, file), "utf8");

test("flags pick the access choices; missing ones default without prompts", async () => {
  await expect(accessChoices({}, false)).resolves.toEqual({
    tenancy: "single",
    accessControl: "rbac",
  });
  await expect(
    accessChoices({ tenancy: "multi", access: "abac" }, false),
  ).resolves.toEqual({ tenancy: "multi", accessControl: "abac" });
  await expect(accessChoices({ access: "acl" }, false)).rejects.toThrow(
    /--access must be one of abac, rbac/,
  );
});

test("the template's mode file is the one the CLI rewrites", () => {
  expect(applyTenancy(readTemplate(MODE_FILE), "multi")).toContain(
    'const configuredTenancy: Tenancy = "multi";',
  );
  expect(() => applyTenancy("export const x = 1;", "multi")).toThrow(
    /no `configuredTenancy`/,
  );
});

const exportsOf = (source: string): string[] =>
  [...source.matchAll(/^export (?:function|class|const) (\w+)/gm)]
    .map((match) => match[1] ?? "")
    .sort();

test("the ABAC policies keep the RBAC exports and branch on no runtime flag", () => {
  const rbac = readTemplate(POLICIES_FILE);
  const abac = readAuthzTemplate("policies.abac.ts.tpl");
  expect(exportsOf(rbac).length).toBeGreaterThan(0);
  expect(exportsOf(rbac)).toEqual(exportsOf(abac));
  for (const source of [abac, rbac]) {
    expect(source).not.toMatch(/accessControl|recordRules/);
  }
  expect(rbac).not.toMatch(/isOutsideRole|isPrivilegedRole/);
});

async function compose(access: AccessChoices) {
  const outDir = mkdtempSync(path.join(tmpdir(), "hipster-access-"));
  await composeApp({
    templateDir,
    outDir,
    modules: [],
    name: "demo",
    color: null,
    access,
    cliVersion: "0.0.0-test",
    now: new Date("2026-10-26T00:00:00Z"),
  });
  return {
    exists: (file: string) => existsSync(path.join(outDir, file)),
    read: (file: string) => readFileSync(path.join(outDir, file), "utf8"),
  };
}

test("compose bakes ABAC and multi tenancy into the app and hipster.json", async () => {
  const app = await compose({ tenancy: "multi", accessControl: "abac" });
  expect(app.read(MODE_FILE)).toContain('configuredTenancy: Tenancy = "multi"');
  expect(app.read(POLICIES_FILE)).toBe(
    readAuthzTemplate("policies.abac.ts.tpl"),
  );
  expect(app.read(POLICIES_TEST_FILE)).toBe(
    readAuthzTemplate("authzPolicies.abac.test.ts.tpl"),
  );
  expect(app.exists("lib/constants/access.ts")).toBe(false);
  expect(JSON.parse(app.read("hipster.json"))).toMatchObject({
    tenancy: "multi",
    accessControl: "abac",
  });
}, 60_000);

test("compose keeps the template's RBAC policies by default", async () => {
  const app = await compose(defaultAccess);
  expect(app.read(MODE_FILE)).toContain(
    'configuredTenancy: Tenancy = "single"',
  );
  expect(app.read(POLICIES_FILE)).toBe(readTemplate(POLICIES_FILE));
  expect(app.read(POLICIES_TEST_FILE)).toBe(readTemplate(POLICIES_TEST_FILE));
}, 60_000);
