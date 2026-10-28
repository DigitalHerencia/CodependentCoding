// Why: the CLI runs tools with the terminal inherited; here their output would draw over the screen, so it is captured.
import { type Exec, spawnExec } from "hipster-stack/exec";

export const quietExec: Exec = (command, args, options) =>
  spawnExec(command, args, { ...options, capture: "all" });
