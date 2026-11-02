import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import { getCliManifest } from "@/lib/content/cli";
import { getPluginManifest } from "@/lib/content/plugin";

export async function getLandingStats() {
  const [cli, plugin, validation] = await Promise.all([
    getCliManifest(),
    getPluginManifest(),
    readFile(
      path.join(
        /* turbopackIgnore: true */ process.cwd(),
        ".claude/contracts/validation.yaml",
      ),
      "utf8",
    ),
  ]);
  const contract = parse(validation) as { rules: { id: string }[] };
  return {
    rules: contract.rules.length,
    modules: cli.modules.length,
    commands: cli.commands.length,
    skills: plugin.skills.length,
  };
}
