import { createHash } from "node:crypto";
import { mkdtempSync, readdirSync, readFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, test } from "vitest";

import {
  applyBrandColor,
  contrast,
  hexToHslTriplet,
  parseHex,
} from "@/packages/cli/src/compose/brand";
import {
  composeApp,
  EXCLUDED,
  readManifest,
} from "@/packages/cli/src/compose/composeApp";
import { governanceFiles } from "@/packages/cli/src/compose/governance";
import { prunePackageJson } from "@/packages/cli/src/compose/packageJson";
import { closure } from "@/template/scripts/compose.mjs";
import { ownerOf } from "@/template/scripts/ownership.mjs";

const templateDir = path.resolve(import.meta.dirname, "../../template");
const manifest = readManifest(templateDir);
const allIds = manifest.modules.map(({ id }) => id);
const now = new Date("2026-10-23T00:00:00Z");

function walk(dir: string, base = dir): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory()
      ? walk(full, base)
      : [path.relative(base, full).split(path.sep).join("/")];
  });
}

/** path -> sha256 of every file in the tree. */
function tree(dir: string): Record<string, string> {
  return Object.fromEntries(
    walk(dir)
      .sort()
      .map((file) => [
        file,
        createHash("sha256")
          .update(readFileSync(path.join(dir, file)))
          .digest("hex"),
      ]),
  );
}

async function compose(modules: string[], color: string | null = null) {
  const outDir = mkdtempSync(path.join(tmpdir(), "hipster-compose-"));
  const result = await composeApp({
    templateDir,
    outDir,
    modules,
    name: "demo",
    color,
    cliVersion: "0.0.0-test",
    now,
  });
  return { outDir, result };
}

const read = (dir: string, file: string) =>
  readFileSync(path.join(dir, file), "utf8");

describe.each([
  ["blank", manifest.presets.blank ?? []],
  ["crm", manifest.presets.crm ?? []],
  ["all", allIds],
])("compose %s", (_label, selected) => {
  test("keeps only base and the closure's files, with matching records", async () => {
    const { outDir, result } = await compose(selected);
    const kept = closure(manifest, selected);
    expect(result.modules).toEqual(kept);

    const files = walk(outDir);
    const governance = new Set(governanceFiles());
    expect(result.governance).toEqual([...governance]);
    for (const file of files) {
      const { owner } = ownerOf(file, manifest);
      expect(owner === "base" || kept.includes(owner ?? ""), file).toBe(true);
      if (governance.has(file)) continue;
      for (const prefix of EXCLUDED)
        expect(file.startsWith(prefix)).toBe(false);
    }
    for (const file of governance) expect(files).toContain(file);

    const hipster = JSON.parse(read(outDir, "hipster.json"));
    expect(hipster).toMatchObject({
      cli: "0.0.0-test",
      createdAt: now.toISOString(),
      modules: kept,
      color: null,
    });
    const composed = JSON.parse(read(outDir, "hipster.modules.json"));
    expect(composed.modules.map(({ id }: { id: string }) => id)).toEqual(kept);
    expect(composed.presets).toEqual({});

    const registry = read(outDir, "lib/modules/registry.ts");
    for (const id of allIds) {
      expect(registry.includes(`@/lib/modules/${id}.module`)).toBe(
        kept.includes(id),
      );
    }

    const removed = allIds.filter((id) => !kept.includes(id));
    for (const file of files.filter((f) => f.endsWith(".prisma"))) {
      for (const id of removed) {
        expect(read(outDir, file), `${file} still tags ${id}`).not.toMatch(
          new RegExp(`// @module ${id}\\s*$`, "m"),
        );
      }
    }

    const pkg = JSON.parse(read(outDir, "package.json"));
    expect(pkg.name).toBe("demo");
    const keptPackages = manifest.modules
      .filter(({ id }) => kept.includes(id))
      .flatMap(({ packages = [] }) => packages);
    for (const { id, packages = [] } of manifest.modules) {
      for (const dep of packages) {
        expect(dep in pkg.dependencies, `${id}: ${dep}`).toBe(
          kept.includes(id) || keptPackages.includes(dep),
        );
      }
    }
  });
});

test("composing twice yields identical trees", async () => {
  const first = await compose(["crm", "billing"], "#2f7a8d");
  const second = await compose(["crm", "billing"], "#2f7a8d");
  expect(tree(second.outDir)).toEqual(tree(first.outDir));
});

test("a non-empty target is refused", async () => {
  const { outDir } = await compose([]);
  await expect(
    composeApp({
      templateDir,
      outDir,
      modules: [],
      name: "demo",
      color: null,
      cliVersion: "0",
      now,
    }),
  ).rejects.toThrow(/not empty/);
});

describe("closure", () => {
  const fake = {
    modules: [
      { id: "a", dependsOn: ["b"] },
      { id: "b", dependsOn: ["c"] },
      { id: "c", dependsOn: [] },
      { id: "x", dependsOn: ["y"] },
      { id: "y", dependsOn: ["x"] },
    ],
  };

  test("adds dependencies in manifest order", () => {
    expect(closure(fake, ["a"])).toEqual(["a", "b", "c"]);
  });

  test("names a dependency cycle", () => {
    expect(() => closure(fake, ["x"])).toThrow("dependency cycle: x -> y -> x");
  });

  test("rejects unknown modules", () => {
    expect(() => closure(fake, ["nope"])).toThrow('unknown module "nope"');
  });
});

describe("brand color", () => {
  const css = [
    ":root {",
    "  --background: 248 50% 3%;",
    "  --foreground: 42 74% 94%;",
    "  --primary: 193 50% 32%;",
    "  --primary-foreground: var(--foreground);",
    "}",
  ].join("\n");

  test("parses hex and converts to the globals.css triplet", () => {
    expect(parseHex("2F7A8D")).toBe("#2f7a8d");
    expect(parseHex("#fff")).toBeNull();
    expect(hexToHslTriplet("#2f7a8d")).toBe("192 50% 37%");
  });

  test("a dark brand keeps the light foreground; a light brand flips it", () => {
    const dark = applyBrandColor(css, "#1d4f5c");
    expect(dark.css).toContain("--primary: 192 52% 24%;");
    expect(dark.foreground).toBe("foreground");
    expect(dark.ratio).toBeGreaterThan(4.5);

    const light = applyBrandColor(css, "#f2c94c");
    expect(light.css).toContain("--primary-foreground: var(--background);");
    expect(light.foreground).toBe("background");
  });

  test("contrast is symmetric and 21:1 for black on white", () => {
    expect(contrast([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 5);
    expect(contrast([255, 255, 255], [0, 0, 0])).toBeCloseTo(21, 5);
  });
});

test("prune keeps a package another kept module still declares", () => {
  const { pkg, removed } = prunePackageJson(
    { name: "maximal-template", dependencies: { a: "1", b: "1", c: "1" } },
    {
      modules: [
        { id: "one", packages: ["a", "b"] },
        { id: "two", packages: ["b"] },
        { id: "three", packages: ["c"] },
      ],
    },
    ["two"],
    "demo",
  );
  expect(pkg).toEqual({ name: "demo", dependencies: { b: "1" } });
  expect(removed).toEqual(["a", "c"]);
});
