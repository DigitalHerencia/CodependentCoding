import path from "node:path";

import * as p from "@clack/prompts";
import type { Command } from "commander";

import { formatResults, runDoctor } from "#cli/doctor/checks";
import { resolveTemplate } from "#cli/manifest/template";
import { templateSqlQuery } from "#cli/setup/database";
import { spawnExec } from "#cli/setup/exec";

interface DoctorCommandOptions {
  dir: string;
  tools: boolean;
}

export function registerDoctor(program: Command): void {
  program
    .command("doctor")
    .description(
      "Check a generated app's env, database, RLS, lint and ownership",
    )
    .option("--dir <path>", "app directory", ".")
    .option("--no-tools", "skip lint and ownership (faster)")
    .action(async (options: DoctorCommandOptions) => {
      const appDir = path.resolve(options.dir);
      const { dir: templateDir } = resolveTemplate();
      const results = await runDoctor({
        appDir,
        exec: spawnExec,
        query: templateSqlQuery(templateDir),
        processEnv: process.env,
        tools: options.tools,
      });
      process.stdout.write(`${formatResults(results)}\n`);
      const failed = results.filter(({ status }) => status === "fail").length;
      const warned = results.filter(({ status }) => status === "warn").length;
      if (failed > 0) {
        process.exitCode = 1;
        p.log.error(`${failed} failed, ${warned} warnings.`);
      } else if (warned > 0) {
        p.log.warn(`${warned} warnings.`);
      } else {
        p.log.success("Ready.");
      }
    });
}
