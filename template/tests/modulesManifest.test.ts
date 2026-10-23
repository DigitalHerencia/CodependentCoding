import { readFileSync } from "node:fs";

import { expect, test } from "vitest";

import { RESERVED_IDS, validateManifest } from "@/scripts/modules-schema.mjs";

const manifest = JSON.parse(
  readFileSync(new URL("../hipster.modules.json", import.meta.url), "utf8"),
) as unknown;

type Entry = { id: string; kind: "domain" | "addon"; dependsOn?: string[] };

function withModules(modules: Entry[], presets = {}) {
  return {
    base: { owns: ["**"] },
    modules: modules.map((entry) => ({ label: entry.id, ...entry })),
    presets,
  };
}

function errorsOf(input: unknown) {
  const result = validateManifest(input);
  return result.ok ? [] : result.errors;
}

test("the template manifest validates", () => {
  expect(errorsOf(manifest)).toEqual([]);
});

test("a dependency cycle is rejected", () => {
  const errors = errorsOf(
    withModules([
      { id: "crm", kind: "domain", dependsOn: ["email"] },
      { id: "email", kind: "addon", dependsOn: ["billing"] },
      { id: "billing", kind: "addon", dependsOn: ["crm"] },
    ]),
  );
  expect(errors).toEqual(["dependency cycle: crm -> email -> billing -> crm"]);
});

test("a module depending on itself is rejected", () => {
  expect(
    errorsOf(withModules([{ id: "crm", kind: "domain", dependsOn: ["crm"] }])),
  ).toEqual(['"crm" depends on itself']);
});

test.each(RESERVED_IDS)("reserved id %s is rejected", (id) => {
  expect(errorsOf(withModules([{ id, kind: "domain" }]))).toEqual([
    `module id "${id}" is reserved for base`,
  ]);
});

test("duplicate ids, unknown dependencies and unknown preset members are rejected", () => {
  const errors = errorsOf(
    withModules(
      [
        { id: "crm", kind: "domain", dependsOn: ["email"] },
        { id: "crm", kind: "domain" },
      ],
      { sales: ["crm", "billing"] },
    ),
  );
  expect(errors).toEqual([
    'duplicate module id "crm"',
    '"crm" depends on unknown module "email"',
    'preset "sales" names unknown module "billing"',
  ]);
});

test("unknown fields and bad ids fail the schema", () => {
  const errors = errorsOf({
    base: { owns: ["**"] },
    modules: [{ id: "Crm", kind: "domain", label: "CRM", runtime: {} }],
    presets: {},
  });
  expect(errors.some((error) => error.startsWith("modules.0.id:"))).toBe(true);
  expect(errors.some((error) => error.includes("runtime"))).toBe(true);
});
