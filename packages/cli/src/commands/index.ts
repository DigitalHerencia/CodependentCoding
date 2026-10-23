import type { Command } from "commander";

import { registerNew } from "#cli/commands/new";

/** Registers subcommands (Architecture.md §6); `add`, `slice`, `doctor`, `compose` follow. */
export function registerCommands(
  program: Command,
  cliVersion: string,
): Command {
  registerNew(program, cliVersion);
  return program;
}
