import { spawnSync } from "node:child_process";

export interface ExecOptions {
  cwd: string;
  /** Written to stdin; secrets go here, never in argv. */
  input?: string | undefined;
  /**
   * "stdout" pipes stdout and keeps stderr (prompts, progress) on the terminal;
   * "all" also silences stderr, for probes whose failure is an answer.
   */
  capture?: "stdout" | "all";
}

export interface ExecResult {
  /** null when the command could not be started (not installed). */
  status: number | null;
  stdout: string;
  stderr: string;
  missing: boolean;
}

/** Every external command `new` runs goes through one of these. */
export type Exec = (
  command: string,
  args: readonly string[],
  options: ExecOptions,
) => ExecResult;

const WINDOWS = process.platform === "win32";

/** With `shell`, Node joins argv unquoted; quote what cmd.exe would split. */
const shellArgs = (args: readonly string[]) =>
  WINDOWS
    ? args.map((arg) => (/[\s&|<>^()]/.test(arg) ? `"${arg}"` : arg))
    : [...args];

export const spawnExec: Exec = (command, args, { cwd, input, capture }) => {
  const result = spawnSync(command, shellArgs(args), {
    cwd,
    input,
    encoding: "utf8",
    stdio: [
      input === undefined ? "inherit" : "pipe",
      capture ? "pipe" : "inherit",
      capture === "all" ? "pipe" : "inherit",
    ],
    // gh, pnpm, neonctl and vercel are .cmd shims on many Windows installs.
    shell: WINDOWS,
  });
  const missing =
    (result.error as NodeJS.ErrnoException | undefined)?.code === "ENOENT" ||
    // Through a Windows shell a missing command is cmd's exit 9009.
    (WINDOWS && result.status === 9009);
  return {
    status: result.error ? null : result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    missing,
  };
};

/** Runs a required step; a failure stops `new` with the command's exit code. */
export function runOrThrow(
  exec: Exec,
  command: string,
  args: readonly string[],
  cwd: string,
): void {
  const { status, missing } = exec(command, args, { cwd });
  if (missing)
    throw new Error(`\`${command}\` is not installed or not on PATH.`);
  if (status !== 0) {
    throw new Error(
      `\`${command} ${args.join(" ")}\` failed in ${cwd} (exit ${status}).`,
    );
  }
}
