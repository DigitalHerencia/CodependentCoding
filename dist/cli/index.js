#!/usr/bin/env node
// @ts-nocheck
/**
 * Loaded Vibes CLI Entry Point
 *
 * Minimal command dispatcher for retro CLI commands.
 * Supports doctor, preflight, dashboard, devcycle, and logs commands.
 *
 * @see docs/PRD.md §5.1-5.4 - CLI Experience
 * @see docs/TECH_REQUIREMENTS.md §5 - Retro CLI Platform Requirements
 */

import { runDoctorCli } from './commands/doctor.js';
import { runPreflightChecks, formatResults } from './preflight/index.js';
import { runDashboard } from './commands/dashboard.js';
import { runDevcycleCommand } from './devcycle.js';

async function main() {
  const [command, ...rest] = process.argv.slice(2);

  switch (command) {
    case 'dashboard':
      await runDashboard();
      return;
    case 'doctor':
      await runDoctorCli();
      return;
    case 'preflight': {
      const result = await runPreflightChecks();
      console.log(formatResults(result));
      process.exit(result.success ? 0 : 1);
      return;
    }
    case 'devcycle':
      await runDevcycleCommand(rest);
      return;
    case '-h':
    case '--help':
    default:
      console.log('');
      console.log('╔════════════════════════════════════════════════════════════╗');
      console.log('║                    LOADED VIBES CLI                        ║');
      console.log('╚════════════════════════════════════════════════════════════╝');
      console.log('');
      console.log('Usage: loaded-vibes <command> [options]');
      console.log('');
      console.log('Commands:');
      console.log('  dashboard  Launch synthwave retro dashboard (PRD §5.2)');
      console.log('  doctor     Run diagnostics (PRD §5.4, TECH §5.3)');
      console.log('  preflight  Run prerequisite checks (PRD §5.1, TECH §5.1)');
      console.log('  devcycle   Trigger a DevCycle (TECH §4.1, SPEC-CLI §1)');
      console.log('');
      console.log('Dashboard Controls:');
      console.log('  Ctrl+P     Open command palette');
      console.log('  r          Refresh dashboard data');
      console.log('  l          Toggle live log streaming');
      console.log('  h / ?      Show keyboard shortcuts');
      console.log('  q          Quit dashboard');
      console.log('');
      console.log('Options for doctor:');
      console.log('  --yes, -y     Auto-approve remediation prompts');
      console.log('  --verbose     Mirror NDJSON logs to console');
      console.log('');
      console.log('Options for devcycle:');
      console.log('  --mode        plan-only|plan-first|execute|validate');
      console.log('  --dry-run     Alias for --mode plan-only');
      console.log('  --list        Show all available DevCycles');
      console.log('');
      process.exit(0);
  }
}

main().catch((err) => {
  console.error('CLI failed:', err);
  process.exit(1);
});
