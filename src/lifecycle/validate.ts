import { runCommand } from './run.js';

export async function validateProject(cwd: string): Promise<void> {
  await runCommand(
    cwd,
    'corepack',
    ['pnpm', 'validate:ci'],
    'VALIDATION_FAILED',
  );
}
