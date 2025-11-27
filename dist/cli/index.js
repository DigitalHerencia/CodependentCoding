#!/usr/bin/env node
// @ts-nocheck
/**
 * Loaded Vibes CLI Entry Point
 *
 * Minimal command dispatcher for retro CLI commands.
 * Currently supports `doctor` and `preflight`.
 */

import { runDoctorCli } from './commands/doctor.js';
import { runPreflightChecks, formatResults } from './preflight/index.js';

async function main() {
  const [command, ...rest] = process.argv.slice(2);

  switch (command) {
    case 'doctor':
      await runDoctorCli();
      return;
    case 'preflight': {
      const result = await runPreflightChecks();
      console.log(formatResults(result));
      process.exit(result.success ? 0 : 1);
      return;
    }
    case '-h':
    case '--help':
    default:
      console.log('');
      console.log('Loaded Vibes CLI');
      console.log('');
      console.log('Usage: node dist/cli/index.js <command> [options]');
      console.log('');
      console.log('Commands:');
      console.log('  doctor     Run diagnostics (PRD §5.4, TECH §5.3)');
      console.log('  preflight  Run prerequisite checks (PRD §5.1, TECH §5.1)');
      console.log('');
      console.log('Options for doctor:');
      console.log('  --yes, -y     Auto-approve remediation prompts');
      console.log('  --verbose     Mirror NDJSON logs to console');
      console.log('');
      process.exit(0);
  }
}

main().catch((err) => {
  console.error('CLI failed:', err);
  process.exit(1);
});
