import path from "node:path";

import * as p from "@clack/prompts";
import type { Command } from "commander";

import { spawnExec } from "#cli/setup/exec";
import { parseFields } from "#cli/slice/fields";
import { formatPlan, ICONS, planSlice, writePlan } from "#cli/slice/sliceApp";

interface SliceCommandOptions {
  module: string;
  fields: string;
  plural?: string;
  label?: string;
  icon?: string;
  dir: string;
  dryRun?: boolean;
}

export function registerSlice(program: Command): void {
  program
    .command("slice")
    .description(
      "Generate a vertical slice for an entity from the golden templates",
    )
    .argument("<entity>", "entity name, singular (e.g. invoice, lineItem)")
    .requiredOption(
      "--module <id>",
      "module that owns the slice; created when missing",
    )
    .requiredOption(
      "--fields <dsl>",
      'e.g. "number:string, amount:decimal?, status:enum(draft|sent), ownerId:ref(User)"',
    )
    .option("--plural <word>", "plural, when -s/-es is wrong (also the route)")
    .option("--label <text>", "new module only: nav group label")
    .option("--icon <name>", `new module only: ${ICONS.join(", ")}`)
    .option("--dir <path>", "app directory", ".")
    .option("--dry-run", "list the files without writing")
    .action(async (entity: string, options: SliceCommandOptions) => {
      if (
        options.icon &&
        !(ICONS as readonly string[]).includes(options.icon)
      ) {
        throw new Error(`--icon must be one of ${ICONS.join(", ")}.`);
      }
      const appDir = path.resolve(options.dir);
      const plan = await planSlice({
        appDir,
        entity,
        moduleId: options.module,
        fields: parseFields(options.fields),
        plural: options.plural,
        moduleLabel: options.label,
        icon: options.icon,
      });
      const summary = [
        ...plan.created.map((file) => `+ ${file}`),
        ...plan.updated.map((file) => `~ ${file}`),
      ].join("\n");
      p.note(
        summary,
        `${plan.names.Entity} in ${plan.newModule ? "new module " : ""}${options.module}`,
      );
      if (options.dryRun) return;

      writePlan(appDir, plan);
      const failures = formatPlan(appDir, plan, spawnExec);
      for (const entry of plan.skipped) {
        p.log.warn(
          `Add by hand in lib/modules/${options.module}.module.ts: ${entry}`,
        );
      }
      if (failures.length > 0) {
        p.log.warn(`These steps reported problems: ${failures.join(", ")}.`);
        process.exitCode = 1;
      }
      p.note(
        [
          "pnpm db:init   # migrate + RLS for the new table",
          "pnpm validate",
          `pnpm dev       # then open /${plan.names.route}`,
        ].join("\n"),
        "Next steps",
      );
    });
}
