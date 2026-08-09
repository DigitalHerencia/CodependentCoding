import { execa } from 'execa';
import { LoadedVibesError, type LoadedVibesErrorCode } from '../errors.js';

export async function runCommand(
  cwd: string,
  command: string,
  args: readonly string[],
  code: LoadedVibesErrorCode,
): Promise<void> {
  try {
    await execa(command, args, { cwd, stdio: 'inherit', shell: false });
  } catch (error) {
    throw new LoadedVibesError(
      code,
      `${command} ${args.join(' ')} failed.`,
      error,
    );
  }
}
