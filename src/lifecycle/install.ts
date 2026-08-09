import { runCommand } from './run.js';

export async function installProject(cwd: string): Promise<void> {
  await runCommand(
    cwd,
    'corepack',
    ['pnpm', 'install', '--frozen-lockfile'],
    'INSTALL_FAILED',
  );
  await runCommand(cwd, 'corepack', ['pnpm', 'db:generate'], 'INSTALL_FAILED');
}
