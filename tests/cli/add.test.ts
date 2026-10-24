import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, test } from "vitest";

import {
  planAdd,
  restoreTagged,
  writeAdd,
} from "@/packages/cli/src/compose/addModules";
import { composeApp } from "@/packages/cli/src/compose/composeApp";
import { parseFields } from "@/packages/cli/src/slice/fields";
import { planSlice, writePlan } from "@/packages/cli/src/slice/sliceApp";

const templateDir = path.resolve(import.meta.dirname, "../../template");

async function app(modules: string[]): Promise<string> {
  const outDir = path.join(
    mkdtempSync(path.join(tmpdir(), "hipster-add-")),
    "app",
  );
  await composeApp({
    templateDir,
    outDir,
    modules,
    name: "demo",
    color: null,
    cliVersion: "0.0.0-test",
    now: new Date("2026-10-24T00:00:00Z"),
  });
  // slice loads the app's TypeScript; borrow the template's install.
  symlinkSync(
    path.join(templateDir, "node_modules"),
    path.join(outDir, "node_modules"),
    "junction",
  );
  return outDir;
}

const readApp = (dir: string, file: string) =>
  readFileSync(path.join(dir, file), "utf8");

describe("restoreTagged", () => {
  const template = [
    "model Organization {",
    "  id String @id",
    "",
    "  memberships Membership[]",
    "",
    "  crmAccounts CrmAccount[] // @module crm",
    "  crmDeals    CrmDeal[] // @module crm",
    "",
    "  createdAt DateTime",
    "}",
  ].join("\n");

  test("restores the group after its anchor, keeps app lines, is idempotent", () => {
    const app = [
      "model Organization {",
      "  id String @id",
      "",
      "  memberships Membership[]",
      "",
      "  invoices Invoice[] // @module invoicing",
      "",
      "  createdAt DateTime",
      "}",
    ].join("\n");
    const merged = restoreTagged(app, template, new Set(["crm"]));
    expect(merged).toBe(
      [
        "model Organization {",
        "  id String @id",
        "",
        "  memberships Membership[]",
        "",
        "  crmAccounts CrmAccount[] // @module crm",
        "  crmDeals    CrmDeal[] // @module crm",
        "",
        "  invoices Invoice[] // @module invoicing",
        "",
        "  createdAt DateTime",
        "}",
      ].join("\n"),
    );
    expect(restoreTagged(merged as string, template, new Set(["crm"]))).toBe(
      merged,
    );
  });

  test("null when the model the line extends is gone", () => {
    expect(restoreTagged("", template, new Set(["crm"]))).toBeNull();
  });
});

describe("planAdd", () => {
  test("crm into a blank app matches composing crm from the start", async () => {
    const dir = await app([]);
    const reference = await app(["crm"]);
    const plan = await planAdd({ appDir: dir, templateDir, modules: ["crm"] });
    expect(plan.added).toEqual(["crm"]);
    expect(plan.created).toEqual(
      expect.arrayContaining([
        "lib/modules/crm.module.ts",
        "prisma/schema/crm.prisma",
        "prisma/rls/crm.sql",
        "tests/crm/crmWorkflows.test.ts",
      ]),
    );
    expect(plan.updated).toEqual(
      expect.arrayContaining([
        "prisma/schema/identity.prisma",
        "hipster.modules.json",
        "lib/modules/registry.ts",
        "hipster.json",
      ]),
    );
    writeAdd(dir, plan);
    for (const file of [
      "lib/modules/registry.ts",
      "hipster.modules.json",
      ".env.example",
      ...plan.created,
    ]) {
      expect(readApp(dir, file), file).toBe(readApp(reference, file));
    }
    const tagged = (text: string) =>
      text.split("\n").filter((line) => line.endsWith("// @module crm"));
    expect(tagged(readApp(dir, "prisma/schema/identity.prisma"))).toEqual(
      tagged(readApp(reference, "prisma/schema/identity.prisma")),
    );
    expect(JSON.parse(readApp(dir, "hipster.json")).modules).toEqual(["crm"]);

    const again = await planAdd({ appDir: dir, templateDir, modules: ["crm"] });
    expect(again.added).toEqual([]);
  });

  test("adds the dependsOn closure, its packages and env", async () => {
    const dir = await app([]);
    const plan = await planAdd({
      appDir: dir,
      templateDir,
      modules: ["support"],
    });
    expect(plan.added).toEqual(["support", "email"]);
    expect(plan.packages).toEqual(["@sendgrid/eventwebhook", "@sendgrid/mail"]);
    expect(plan.env.length).toBeGreaterThan(0);
    const pkg = JSON.parse(plan.writes.get("package.json") ?? "{}") as {
      dependencies: Record<string, string>;
    };
    expect(Object.keys(pkg.dependencies)).toEqual(
      [...Object.keys(pkg.dependencies)].sort((a, b) => a.localeCompare(b)),
    );
    expect(plan.writes.get(".env.example")).toContain(plan.env[0]);
  });

  test("refuses, listing conflicts, before writing anything", async () => {
    const dir = await app([]);
    const owned = path.join(dir, "lib/modules/crm.module.ts");
    writeFileSync(owned, "export const mine = 1;\n");
    const registry = readApp(dir, "lib/modules/registry.ts");
    await expect(
      planAdd({ appDir: dir, templateDir, modules: ["crm"] }),
    ).rejects.toThrow(/lib\/modules\/crm\.module\.ts \(exists in the app\)/);
    expect(readApp(dir, "lib/modules/registry.ts")).toBe(registry);
    await expect(
      planAdd({ appDir: dir, templateDir, modules: ["nope"] }),
    ).rejects.toThrow(/unknown module "nope"/);
    mkdirSync(path.join(dir, "elsewhere"));
    await expect(
      planAdd({
        appDir: path.join(dir, "elsewhere"),
        templateDir,
        modules: ["crm"],
      }),
    ).rejects.toThrow(/not a generated app/);
  });

  test("keeps the app's own slice modules", async () => {
    const dir = await app([]);
    writePlan(
      dir,
      await planSlice({
        appDir: dir,
        entity: "invoice",
        moduleId: "billingdesk",
        fields: parseFields("number:string"),
      }),
    );
    const plan = await planAdd({ appDir: dir, templateDir, modules: ["crm"] });
    writeAdd(dir, plan);
    const manifest = JSON.parse(readApp(dir, "hipster.modules.json")) as {
      modules: { id: string }[];
    };
    expect(manifest.modules.map(({ id }) => id)).toEqual([
      "crm",
      "billingdesk",
    ]);
    expect(readApp(dir, "lib/modules/registry.ts")).toContain(
      "billingdeskModule",
    );
    const identity = readApp(dir, "prisma/schema/identity.prisma");
    expect(identity).toContain("// @module billingdesk");
    expect(identity).toContain("// @module crm");
  });
});
