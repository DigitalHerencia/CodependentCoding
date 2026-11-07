import path from "node:path";

import * as p from "@clack/prompts";
import type { Command } from "commander";

import { accessChoices, fromFlags } from "#cli/commands/new";
import { parseHex } from "@codependent/generator/compose/brand";
import {
  composeApp,
  readManifest,
  toAppName,
} from "@codependent/generator/compose/composeApp";
import { resolveTemplate } from "@codependent/generator/manifest/template";
import { spawnExec } from "@codependent/generator/setup/exec";
import { setupApp } from "@codependent/generator/setup/postCompose";

interface ComposeOptions {
  preset?: string;
  modules?: string;
  all?: boolean;
  color?: string;
  name?: string;
  tenancy?: string;
  access?: string;
}

/** `new` without prompts, install or git: the file steps plus prisma validate (CI). */
export function registerCompose(program: Command, cliVersion: string): void {
  program
    .command("compose")
    .description("Compose an app without prompts, install or git (CI)")
    .argument("<dir>", "directory to create (must be empty or missing)")
    .option("--preset <id>", "module preset from hipster.modules.json")
    .option("--modules <ids>", "comma-separated modules (dependsOn added)")
    .option("--all", "every module")
    .option("--color <hex>", "brand color, e.g. #2f7a8d")
    .option("--name <name>", "package name (default: directory name)")
    .option("--tenancy <mode>", "single (default) or multi organization")
    .option("--access <model>", "rbac (default) or abac (RBAC + ABAC)")
    .action(async (dir: string, options: ComposeOptions) => {
      const outDir = path.resolve(dir);
      const { dir: templateDir } = resolveTemplate();
      const modules = fromFlags(readManifest(templateDir), options);
      if (!modules) {
        throw new Error("compose needs --preset, --modules or --all.");
      }
      const color = options.color ? parseHex(options.color) : null;
      if (options.color && !color) {
        throw new Error(
          `--color must be a 6-digit hex, got "${options.color}".`,
        );
      }
      const result = await composeApp({
        templateDir,
        outDir,
        modules,
        name: options.name ?? toAppName(path.basename(outDir)),
        color,
        access: await accessChoices(options, false),
        cliVersion,
        now: new Date(),
      });
      setupApp({
        appDir: outDir,
        templateDir,
        install: false,
        git: false,
        exec: spawnExec,
        warn: (message) => p.log.warn(message),
      });
      p.log.success(
        `Composed base + [${result.modules.join(", ")}]: ${result.files} files, ${result.removed} module files left out.`,
      );
    });
}
