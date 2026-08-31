import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const command = process.argv[2] ?? 'check';
const extra = process.argv.slice(3);

function run(script, args = []) {
  const result = spawnSync(process.execPath, [path.join(here, script), ...args], { stdio: 'inherit' });
  if (result.error) throw result.error;
  return result.status ?? 1;
}

if (command === 'check') {
  for (const script of ['validate-contracts.mjs', 'validate-structure.mjs', 'validate-architecture.mjs']) {
    const status = run(script, extra);
    if (status !== 0) process.exit(status);
  }
} else if (command === 'report') {
  process.exit(run('report.mjs', extra));
} else if (command === 'fix') {
  process.exit(run('fix-structure.mjs', extra));
} else {
  console.error(`Unknown governance command: ${command}. Expected check, report, or fix.`);
  process.exit(2);
}
