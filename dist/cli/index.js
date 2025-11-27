#!/usr/bin/env node
// @ts-nocheck
/**
 * Loaded Vibes CLI Entry Point
 *
 * Minimal command dispatcher for retro CLI commands.
 * Currently supports `doctor`, `preflight`, and `upgrade`.
 */

import { runDoctorCli } from './commands/doctor.js';
import { runPreflightChecks, formatResults } from './preflight/index.js';
import { runUpgradeCli } from './commands/upgrade.js';

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
    case 'upgrade':
      await runUpgradeCli();
      return;
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
      console.log('  upgrade    Upgrade .loaded-vibes assets (TECH §11, ADR-001)');
      console.log('');
      console.log('Options for doctor:');
      console.log('  --yes, -y     Auto-approve remediation prompts');
      console.log('  --verbose     Mirror NDJSON logs to console');
      console.log('');
      console.log('Options for upgrade:');
      console.log('  --analyze, -a   Analyze only, do not apply changes');
      console.log('  --strategy <s>  Strategy: mirror, merge (default), or sandbox');
      console.log('  --yes, -y       Auto-approve all prompts');
      console.log('  --force, -f     Force major version upgrades');
      console.log('  --verbose, -v   Verbose output');
      console.log('');
      process.exit(0);
  }
}

main().catch((err) => {
  console.error('CLI failed:', err);
  process.exit(1);
});
