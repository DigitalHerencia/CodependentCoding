import type { Command } from "commander";

import { registerNew } from "#cli/commands/new";
import { registerSlice } from "#cli/commands/slice";

/** Registers subcommands (Architecture.md §6); `add`, `doctor`, `compose` follow. */
export function registerCommands(
  program: Command,
  cliVersion: string,
): Command {
  registerNew(program, cliVersion);
  registerSlice(program);
  return program;
}
