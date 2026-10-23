import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { execa } from "execa";
import { describe, expect, test } from "vitest";

import {
  resolveTemplate,
  TemplateNotFoundError,
} from "@/packages/cli/src/manifest/template";

const repo = path.resolve(import.meta.dirname, "../..");

describe("resolveTemplate", () => {
  test("defaults to <repo>/template from source and from the bundle", () => {
    for (const file of [
      "packages/cli/src/manifest/template.ts",
      "packages/cli/dist/cli.mjs",
    ]) {
      const url = pathToFileURL(path.join(repo, file)).href;
      expect(resolveTemplate({}, url)).toEqual({
        dir: path.join(repo, "template"),
        source: "repo",
      });
    }
  });

  test("HIPSTER_TEMPLATE wins when it holds a manifest", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "hipster-template-"));
    writeFileSync(path.join(dir, "hipster.modules.json"), "{}");
    expect(resolveTemplate({ HIPSTER_TEMPLATE: ` ${dir} ` })).toEqual({
      dir,
      source: "HIPSTER_TEMPLATE",
    });
  });

  test("a directory without hipster.modules.json is rejected", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "hipster-empty-"));
    expect(() => resolveTemplate({ HIPSTER_TEMPLATE: dir })).toThrow(
      TemplateNotFoundError,
    );
  });
});

describe("hipster-stack", () => {
  const run = (...args: string[]) =>
    execa("pnpm", ["exec", "tsx", "packages/cli/src/cli.ts", ...args], {
      cwd: repo,
      reject: false,
    });

  test("--version prints the package version", async () => {
    const { stdout, exitCode } = await run("--version");
    expect(exitCode).toBe(0);
    expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  test("--help names the resolved template", async () => {
    const { stdout, exitCode } = await run("--help");
    expect(exitCode).toBe(0);
    expect(stdout).toContain("Usage: hipster-stack");
    expect(stdout).toContain(`Template: ${path.join(repo, "template")}`);
  });
});
