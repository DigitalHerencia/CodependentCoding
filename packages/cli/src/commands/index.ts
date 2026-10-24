import type { Command } from "commander";

import { registerAdd } from "#cli/commands/add";
import { registerDoctor } from "#cli/commands/doctor";
import { registerNew } from "#cli/commands/new";
import { registerSlice } from "#cli/commands/slice";

/** Registers subcommands (Architecture.md §6); `compose` follows. */
export function registerCommands(
  program: Command,
  cliVersion: string,
): Command {
  registerNew(program, cliVersion);
  registerAdd(program);
  registerSlice(program);
  registerDoctor(program);
  return program;
}
