#!/usr/bin/env node
// @ts-nocheck
/**
 * Loaded Vibes CLI Entry Point
 *
 * Command dispatcher for retro CLI commands.
 * Supports create, init, dashboard, doctor, preflight, upgrade, and telemetry.
 *
 * @module dist/cli/index
 * @see docs/PRD.md §5.1-5.4 - Distribution, console experience, observability
 * @see docs/TECH_REQUIREMENTS.md §5 - CLI platform requirements
 * @see spec/cli.spec.md - CLI behavior specification
 */

import { runDoctorCli } from './commands/doctor.js';
import { runPreflightChecks, formatResults } from './preflight/index.js';
import { runUpgradeCli } from './commands/upgrade.js';
import { runTelemetryCli } from './commands/telemetry.js';
import { runInitCli } from './commands/init.js';
import { runCreateCli } from './commands/create.js';

async function main() {
  const [command, ...rest] = process.argv.slice(2);

  switch (command) {
    case 'create':
      await runCreateCli(rest);
      return;
    case 'init':
      await runInitCli(rest);
      return;
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
    case 'upgrade':
      await runUpgradeCli();
      return;
    case 'telemetry':
      await runTelemetryCli(rest);
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
      console.log('  create     Create a new project with .loaded-vibes/ (PRD §5.1)');
      console.log('  init       Initialize .loaded-vibes/ in current directory (PRD §5.1)');
      console.log('  dashboard  Launch synthwave retro dashboard (PRD §5.2)');
      console.log('  doctor     Run diagnostics (PRD §5.4, TECH §5.3)');
      console.log('  preflight  Run prerequisite checks (PRD §5.1, TECH §5.1)');
      console.log('  upgrade    Upgrade .loaded-vibes assets (TECH §11, ADR-001)');
      console.log('  telemetry  Export sanitized telemetry snapshots (TECH §11, SPEC-OBS §2)');
      console.log('');
      console.log('Options for create:');
      console.log('  --attach [path]   Attach to existing repository');
      console.log('  --strategy <s>    Strategy: mirror, merge (default), or sandbox');
      console.log('  --yes, -y         Auto-approve all prompts');
      console.log('');
      console.log('Options for init:');
      console.log('  --strategy <s>    Strategy: mirror, merge (default), or sandbox');
      console.log('  --yes, -y         Auto-approve all prompts');
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
