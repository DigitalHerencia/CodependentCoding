import { mkdtempSync, readFileSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, test } from "vitest";

import { composeApp } from "@/packages/cli/src/compose/composeApp";
import { parseFields, toNames } from "@/packages/cli/src/slice/fields";
import {
  extendModule,
  loadTypeScript,
  mergeTs,
} from "@/packages/cli/src/slice/merge";
import { planSlice, writePlan } from "@/packages/cli/src/slice/sliceApp";

const templateDir = path.resolve(import.meta.dirname, "../../template");
const ts = loadTypeScript(templateDir);

/** A composed app that borrows the template's install (no pnpm install). */
async function app(modules: string[]): Promise<string> {
  const outDir = path.join(
    mkdtempSync(path.join(tmpdir(), "hipster-slice-")),
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
  symlinkSync(
    path.join(templateDir, "node_modules"),
    path.join(outDir, "node_modules"),
    "junction",
  );
  return outDir;
}

const INVOICE = "number:string,amount:decimal,status:enum(draft|sent|paid)";

describe("field DSL", () => {
  test("parses every type, optional markers and enum values", () => {
    expect(
      parseFields(
        "name:string, notes:text?, seats:int, amount:decimal?, done:boolean, dueAt:datetime?, status:enum(open|in-review|won), ownerId:ref(User)?",
      ),
    ).toEqual([
      {
        name: "name",
        type: "string",
        optional: false,
        values: [],
        model: null,
      },
      { name: "notes", type: "text", optional: true, values: [], model: null },
      { name: "seats", type: "int", optional: false, values: [], model: null },
      {
        name: "amount",
        type: "decimal",
        optional: true,
        values: [],
        model: null,
      },
      {
        name: "done",
        type: "boolean",
        optional: false,
        values: [],
        model: null,
      },
      {
        name: "dueAt",
        type: "datetime",
        optional: true,
        values: [],
        model: null,
      },
      {
        name: "status",
        type: "enum",
        optional: false,
        values: ["OPEN", "IN_REVIEW", "WON"],
        model: null,
      },
      {
        name: "ownerId",
        type: "ref",
        optional: true,
        values: [],
        model: "User",
      },
    ]);
  });

  test.each([
    ["name:strin", /Unknown type "strin"/],
    ["Name:string", /camelCase/],
    ["id:string", /reserved/],
    ["a:string,a:int", /twice/],
    ["owner:ref(User)", /<relation>Id/],
    ["status:enum()", /enum\(\.\.\.\) needs values/],
    ["name", /Cannot read field/],
  ])("rejects %s", (dsl, message) => {
    expect(() => parseFields(dsl)).toThrow(message);
  });

  test("names: plural, route and param", () => {
    expect(toNames("line-item", "invoicing")).toMatchObject({
      entity: "lineItem",
      Entity: "LineItem",
      entities: "lineItems",
      route: "line-items",
      param: "lineItemId",
      labelPlural: "Line items",
      Module: "Invoicing",
    });
    expect(toNames("category", "crm").entities).toBe("categories");
    expect(toNames("box", "crm").entities).toBe("boxes");
    expect(toNames("person", "crm", "people").route).toBe("people");
  });
});

describe("merging into module files", () => {
  const existing = [
    '"use server";',
    "",
    "// Why: crm writes.",
    'import { z } from "zod";',
    'import type { Contact } from "@/types/crmTypes";',
    "",
    "export const contactSchema = z.object({});",
    "",
  ].join("\n");

  test("joins named imports, adds new import lines, appends the body", () => {
    const fragment = [
      '"use server";',
      "",
      "// Why: header dropped on merge.",
      'import { z } from "zod";',
      'import type { Quote } from "@/types/crmTypes";',
      'import { toActionResult } from "@/lib/utils/actionResult";',
      "",
      "export const quoteSchema = z.object({});",
    ].join("\n");
    const merged = mergeTs(ts, existing, fragment, "x.ts");
    expect(merged.startsWith('"use server";')).toBe(true);
    expect(merged).toContain(
      'import type { Contact, Quote } from "@/types/crmTypes";',
    );
    expect(merged).toContain(
      'import { toActionResult } from "@/lib/utils/actionResult";',
    );
    expect(merged.match(/from "zod"/g)).toHaveLength(1);
    expect(merged).not.toContain("header dropped");
    expect(
      merged.trimEnd().endsWith("export const quoteSchema = z.object({});"),
    ).toBe(true);
  });

  test("refuses a declaration the file already has", () => {
    expect(() =>
      mergeTs(ts, existing, "export const contactSchema = 1;", "crmSchemas.ts"),
    ).toThrow(/already declares contactSchema/);
  });

  test("module definitions gain the nav link and resource once", () => {
    const definition = [
      "export const crmModule = {",
      '  id: "crm",',
      '  nav: { label: "CRM", icon: "users", links: [{ label: "Contacts", href: "/crm/contacts" }] },',
      '  permissions: { resources: ["crm"], catalog: [], grants: {} },',
      "} satisfies ModuleDefinition;",
    ].join("\n");
    const once = extendModule(
      ts,
      definition,
      { label: "Quotes", href: "/quotes" },
      "quote",
    );
    expect(once.skipped).toEqual([]);
    expect(once.text).toContain('{ label: "Quotes", href: "/quotes" }');
    expect(once.text).toContain('resources: ["crm", "quote"]');
    const twice = extendModule(
      ts,
      once.text,
      { label: "Quotes", href: "/quotes" },
      "quote",
    );
    expect(twice.text).toBe(once.text);
  });
});

describe("planSlice", () => {
  test("a new module in a blank app: files, tagged relation, manifest, registry", async () => {
    const dir = await app([]);
    const plan = await planSlice({
      appDir: dir,
      entity: "invoice",
      moduleId: "invoicing",
      fields: parseFields(INVOICE),
    });
    expect(plan.newModule).toBe(true);
    expect(plan.created).toEqual(
      expect.arrayContaining([
        "schemas/invoicingSchemas.ts",
        "lib/actions/invoicingActions.ts",
        "features/invoicing/invoicesFeature.client.tsx",
        "app/(tenant)/invoices/[invoiceId]/edit/page.tsx",
        "prisma/schema/invoicing.prisma",
        "prisma/rls/invoicing.sql",
        "lib/modules/invoicing.module.ts",
        "tests/invoicing/invoicesActions.test.ts",
      ]),
    );
    const writes = plan.writes;
    expect(writes.get("prisma/schema/identity.prisma")).toContain(
      "invoices Invoice[] // @module invoicing",
    );
    expect(writes.get("prisma/schema/invoicing.prisma")).toMatch(
      /enum InvoiceStatus \{\n {2}DRAFT\n {2}SENT\n {2}PAID\n\}/,
    );
    expect(writes.get("prisma/rls/invoicing.sql")).toContain(
      'ALTER TABLE "Invoice" FORCE ROW LEVEL SECURITY;',
    );
    expect(writes.get("lib/actions/invoicingActions.ts")).toMatch(
      /^"use server";/,
    );
    const manifest = JSON.parse(writes.get("hipster.modules.json") ?? "{}") as {
      modules: { id: string; owns: string[] }[];
    };
    expect(manifest.modules.at(-1)).toMatchObject({
      id: "invoicing",
      kind: "domain",
      owns: ["app/(tenant)/invoices/**"],
    });
    expect(writes.get("lib/modules/registry.ts")).toContain(
      'import { invoicingModule } from "@/lib/modules/invoicing.module";',
    );
    for (const [file, text] of writes) {
      expect(text, file).not.toMatch(/\{\{\w+\}\}/);
    }
  });

  test("an existing module: merges, refs check tenancy, depends on the ref's owner", async () => {
    const dir = await app(["crm"]);
    const plan = await planSlice({
      appDir: dir,
      entity: "quote",
      moduleId: "crm",
      fields: parseFields(
        "title:string, accountId:ref(CrmAccount), ownerId:ref(User)?",
      ),
    });
    expect(plan.newModule).toBe(false);
    expect(plan.updated).toEqual(
      expect.arrayContaining([
        "lib/actions/crmActions.ts",
        "prisma/schema/crm.prisma",
        "lib/modules/crm.module.ts",
      ]),
    );
    const actions = plan.writes.get("lib/actions/crmActions.ts") ?? "";
    expect(actions).toContain(
      "tx.crmAccount.findFirst({ where: { id: input.accountId, organizationId }",
    );
    expect(actions).toContain(
      "tx.membership.findFirst({ where: { userId: input.ownerId, organizationId }",
    );
    expect(plan.writes.get("prisma/schema/identity.prisma")).toContain(
      'quotesAsOwner Quote[] @relation("QuoteOwner") // @module crm',
    );
    expect(plan.writes.has("lib/modules/registry.ts")).toBe(false);
    expect(plan.dependsOn).toEqual([]);
  });

  test("conflicts throw before anything is written", async () => {
    const dir = await app(["crm"]);
    const fields = parseFields("title:string");
    await expect(
      planSlice({ appDir: dir, entity: "crmAccount", moduleId: "crm", fields }),
    ).rejects.toThrow(/already declares CrmAccount/);
    await expect(
      planSlice({
        appDir: dir,
        entity: "quote",
        moduleId: "crm",
        fields: parseFields("ref1Id:ref(Nope)"),
      }),
    ).rejects.toThrow(/no model Nope/);
    await expect(
      planSlice({ appDir: dir, entity: "quote", moduleId: "auth", fields }),
    ).rejects.toThrow(/reserved for base/);
    await expect(
      planSlice({
        appDir: templateDir + "/app",
        entity: "quote",
        moduleId: "crm",
        fields,
      }),
    ).rejects.toThrow(/not a generated app/);

    const plan = await planSlice({
      appDir: dir,
      entity: "quote",
      moduleId: "crm",
      fields,
    });
    writePlan(dir, plan);
    await expect(
      planSlice({ appDir: dir, entity: "quote", moduleId: "crm", fields }),
    ).rejects.toThrow(/already declares Quote|already exists/);
    expect(
      readFileSync(path.join(dir, "prisma/schema/crm.prisma"), "utf8").match(
        /^model Quote /gm,
      ),
    ).toHaveLength(1);
  });
});
