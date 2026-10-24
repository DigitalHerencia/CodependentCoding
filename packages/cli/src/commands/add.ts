import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import * as p from "@clack/prompts";
import type { Command } from "commander";

import { planAdd, writeAdd } from "#cli/compose/addModules";
import { resolveTemplate } from "#cli/manifest/template";
import { runOrThrow, spawnExec } from "#cli/setup/exec";

interface AddCommandOptions {
  dir: string;
  install: boolean;
  dryRun?: boolean;
}

export function registerAdd(program: Command): void {
  program
    .command("add")
    .description("Add template modules to a generated app")
    .argument("<modules...>", "module ids (dependsOn added)")
    .option("--dir <path>", "app directory", ".")
    .option("--no-install", "skip pnpm install")
    .option("--dry-run", "list the changes without writing")
    .action(async (modules: string[], options: AddCommandOptions) => {
      const appDir = path.resolve(options.dir);
      const { dir: templateDir } = resolveTemplate();
      const plan = await planAdd({ appDir, templateDir, modules });
      if (plan.added.length === 0) {
        p.log.info(`Already installed: ${modules.join(", ")}.`);
        return;
      }
      if (plan.drift) {
        p.log.warn(
          `The template moved since this app was generated (${plan.drift.from.slice(0, 7)} → ${plan.drift.to.slice(0, 7)}); the added modules come from the current template.`,
        );
      }
      p.log.info(
        [
          `Adding ${plan.added.join(", ")}:`,
          ...plan.created.map((file) => `+ ${file}`),
          ...plan.updated.map((file) => `~ ${file}`),
        ].join("\n"),
      );
      if (options.dryRun) return;

      writeAdd(appDir, plan);
      // The template's own Prisma, as in `new` (the app may not be installed).
      const prisma = path.join(
        templateDir,
        "node_modules",
        "prisma",
        "build",
        "index.js",
      );
      const schema = path.join(appDir, "prisma", "schema");
      for (const command of ["format", "validate"]) {
        runOrThrow(
          spawnExec,
          process.execPath,
          [prisma, command, "--schema", schema],
          tmpdir(),
        );
      }
      // package.json may have new dependencies. An up-to-date install skips
      // postinstall, so the Prisma client is regenerated explicitly.
      if (options.install) {
        runOrThrow(
          spawnExec,
          "pnpm",
          ["install", "--no-frozen-lockfile"],
          appDir,
        );
      }
      if (existsSync(path.join(appDir, "node_modules"))) {
        runOrThrow(spawnExec, "pnpm", ["exec", "prisma", "generate"], appDir);
      }
      if (plan.packages.length > 0) {
        p.log.info(`Added packages: ${plan.packages.join(", ")}`);
      }
      p.note(
        [
          ...(options.install ? [] : ["pnpm install"]),
          ...(plan.env.length > 0
            ? [`# .env.local: ${plan.env.join(", ")} (see .env.example)`]
            : []),
          "pnpm db:init",
          "pnpm validate",
        ].join("\n"),
        "Next steps",
      );
    });
}
