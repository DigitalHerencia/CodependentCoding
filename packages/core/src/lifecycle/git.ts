import { runCommand } from './run.js';

export async function initializeGit(cwd: string): Promise<void> {
  await runCommand(
    cwd,
    'git',
    ['init', '--initial-branch=main'],
    'GIT_INIT_FAILED',
  );
}
