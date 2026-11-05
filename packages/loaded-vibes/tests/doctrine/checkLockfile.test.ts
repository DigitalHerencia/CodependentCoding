import { readFileSync } from "node:fs";

import { describe, expect, test } from "vitest";

import { lockfileProblems } from "@/packages/generator/scripts/check-lockfile.mjs";

describe("check-lockfile", () => {
  test("both committed lockfiles are one document starting with lockfileVersion", () => {
    for (const file of [
      "pnpm-lock.yaml",
      "packages/maximal-template/pnpm-lock.yaml",
    ]) {
      expect(lockfileProblems(readFileSync(file, "utf8")), file).toEqual([]);
    }
  });

  test("accepts an explicit start marker and leading comments", () => {
    expect(lockfileProblems("---\nlockfileVersion: '9.0'\n")).toEqual([]);
    expect(lockfileProblems("# lock\n\nlockfileVersion: '9.0'\n")).toEqual([]);
  });

  test("rejects the pnpm 12 leading environment document", () => {
    const twoDocuments = [
      "---",
      "lockfileVersion: '9.0'",
      "importers:",
      "  .:",
      "    packageManagerDependencies: {}",
      "---",
      "lockfileVersion: '9.0'",
      "importers: {}",
      "",
    ].join("\n");
    expect(lockfileProblems(twoDocuments)).toEqual([
      "has 2 YAML documents; expected exactly 1",
    ]);
  });

  test("rejects a lockfile that does not start with lockfileVersion", () => {
    expect(lockfileProblems("importers: {}\n")).toEqual([
      'starts with "importers: {}"; expected lockfileVersion',
    ]);
  });
});
