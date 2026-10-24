import type { Command } from "commander";

/**
 * Registers subcommands. `new`, `add`, `slice`, `doctor` and `compose`
 * (Architecture.md §6) land here with their issues, starting at CC-029.
 */
export function registerCommands(program: Command): Command {
  return program;
}
