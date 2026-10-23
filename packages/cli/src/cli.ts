#!/usr/bin/env node
import { readFileSync } from "node:fs";

import { Command } from "commander";

import { registerCommands } from "./commands/index";
import { resolveTemplate } from "./manifest/template";

// src/ (tsx) and dist/ (bundle) both sit one level below package.json.
const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { version: string };

export function buildProgram(): Command {
  const program = new Command("hipster-stack")
    .description(
      "Compose Next.js apps from the Codependent Coding Maximal Template.",
    )
    .version(pkg.version, "-v, --version")
    .showHelpAfterError()
    .addHelpText("after", () => {
      try {
        const { dir, source } = resolveTemplate();
        return `\nTemplate: ${dir} (${source === "repo" ? "repo checkout" : "HIPSTER_TEMPLATE"})`;
      } catch (error) {
        return `\nTemplate: not found. ${(error as Error).message}`;
      }
    });
  return registerCommands(program);
}

await buildProgram().parseAsync(process.argv);
