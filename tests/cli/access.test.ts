import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { expect, test } from "vitest";

import { accessChoices } from "@/packages/cli/src/commands/new";
import {
  ACCESS_FILE,
  applyAccessChoices,
} from "@/packages/cli/src/compose/access";
import { composeApp } from "@/packages/cli/src/compose/composeApp";

const templateDir = path.resolve(import.meta.dirname, "../../template");

test("flags pick the access choices; missing ones default without prompts", async () => {
  await expect(accessChoices({}, false)).resolves.toEqual({
    tenancy: "multi",
    accessControl: "abac",
  });
  await expect(
    accessChoices({ tenancy: "single", access: "rbac" }, false),
  ).resolves.toEqual({ tenancy: "single", accessControl: "rbac" });
  await expect(accessChoices({ access: "acl" }, false)).rejects.toThrow(
    /--access must be one of abac, rbac/,
  );
});

test("the template's access constants are the ones the CLI rewrites", () => {
  const source = readFileSync(path.join(templateDir, ACCESS_FILE), "utf8");
  const out = applyAccessChoices(source, {
    tenancy: "single",
    accessControl: "rbac",
  });
  expect(out).toContain('export const tenancy: Tenancy = "single";');
  expect(out).toContain('export const accessControl: AccessControl = "rbac";');
  expect(() =>
    applyAccessChoices("export const x = 1;", {
      tenancy: "multi",
      accessControl: "abac",
    }),
  ).toThrow(/no `tenancy` constant/);
});

test("compose writes the choices into the app and hipster.json", async () => {
  const outDir = mkdtempSync(path.join(tmpdir(), "hipster-access-"));
  await composeApp({
    templateDir,
    outDir,
    modules: [],
    name: "demo",
    color: null,
    access: { tenancy: "single", accessControl: "rbac" },
    cliVersion: "0.0.0-test",
    now: new Date("2026-10-26T00:00:00Z"),
  });
  const constants = readFileSync(path.join(outDir, ACCESS_FILE), "utf8");
  expect(constants).toContain('tenancy: Tenancy = "single"');
  expect(constants).toContain('accessControl: AccessControl = "rbac"');
  const hipster = JSON.parse(
    readFileSync(path.join(outDir, "hipster.json"), "utf8"),
  ) as Record<string, unknown>;
  expect(hipster).toMatchObject({ tenancy: "single", accessControl: "rbac" });
});
