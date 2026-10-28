// Why: the one place the terminal app starts another program and collects its output.
import { spawn } from "node:child_process";

export interface CommandResult {
  code: number;
  output: string;
  durationMs: number;
}

export function runCommand(
  command: string,
  args: string[],
  cwd: string,
): Promise<CommandResult> {
  const started = Date.now();
  return new Promise((resolve) => {
    // pnpm is a .cmd shim on Windows, which only starts through a shell.
    const child = spawn(command, args, {
      cwd,
      shell: process.platform === "win32",
      env: { ...process.env, FORCE_COLOR: "0" },
    });
    let output = "";
    child.stdout.on("data", (chunk: Buffer) => (output += chunk.toString()));
    child.stderr.on("data", (chunk: Buffer) => (output += chunk.toString()));
    child.on("error", (error) =>
      resolve({
        code: 1,
        output: error.message,
        durationMs: Date.now() - started,
      }),
    );
    child.on("close", (code) =>
      resolve({ code: code ?? 1, output, durationMs: Date.now() - started }),
    );
  });
}
