#!/usr/bin/env node
// @ts-nocheck
/**
 * Loaded Vibes DevCycle CLI Command
 *
 * Implements `loaded-vibes devcycle <name>` to trigger DevCycles manually,
 * validate manifest coverage, and stream orchestrator events with
 * requirement ID citations.
 *
 * @see SPEC-CLI §1, TECH_REQUIREMENTS §5.2, §4.1
 */

import process from 'process';
import { pathToFileURL } from 'url';

import {
  DevCycleRunner,
} from './services/devcycleRunner.js';
import {
  loadManifest,
  validateManifest,
  validateDevCycleEntry,
} from '../genaiscript/shared/validators.js';

const REQUIREMENT_BY_EVENT = {
  start: 'SPEC-CLI §1',
  phase: 'TECH §4.3',
  output: 'TECH §5.2',
  log: 'TECH §5.3',
  checkpoint: 'PRD §5.2',
  firewall: 'PRD §5.5',
  complete: 'TECH §4.2',
  error: 'TECH §4.2',
};
const REQUIREMENT_BY_STAGE = {
  analyze: 'TECH §4.3',
  design: 'TECH §4.3',
  implement: 'TECH §4.3',
  validate: 'TECH §4.3',
  reflect: 'TECH §4.3',
  complete: 'TECH §4.3',
};
const ALLOWED_MODES = ['plan-only', 'plan-first', 'execute', 'validate'];

function normalizeDevCycleName(value = '') {
  return value.trim().toLowerCase().replace(/[\s_]+/g, '-');
}

function levenshtein(a, b) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp = Array.from({ length: rows }, (_, i) => {
    const row = Array(cols).fill(0);
    row[0] = i;
    return row;
  });

  for (let j = 0; j < cols; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[a.length][b.length];
}

function findDevCycleKey(manifest, input) {
  const normalized = normalizeDevCycleName(input);
  for (const key of Object.keys(manifest)) {
    if (normalizeDevCycleName(key) === normalized) {
      return key;
    }
    const label = manifest[key]?.label;
    if (label && normalizeDevCycleName(label) === normalized) {
      return key;
    }
  }
  return null;
}

function suggestDevCycles(manifest, input) {
  const normalizedInput = normalizeDevCycleName(input);
  const scored = Object.entries(manifest).map(([key, entry]) => {
    const label = entry?.label || key;
    const distance = levenshtein(normalizedInput, normalizeDevCycleName(label));
    return { key, label, distance };
  });

  return scored
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map((s) => `${s.label} (${s.key})`);
}

function printUsage(manifest) {
  console.log('\nUsage: loaded-vibes devcycle <name> [options]');
  console.log('\nOptions:');
  console.log('  --mode <plan-only|plan-first|execute|validate>   Set orchestrator mode');
  console.log('  --task "<description>"                           Optional task context');
  console.log('  --dry-run                                        Alias for --mode plan-only');
  console.log('  --skip-bootstrap                                Skip bootstrap preflight');
  console.log('  --auto-approve                                  Auto-approve checkpoints');
  console.log('  --verbose                                       Stream orchestrator stdout');
  console.log('  --list                                          Show manifest entries and exit');
  console.log('  -h, --help                                      Show this help text');

  if (manifest) {
    console.log('\nAvailable DevCycles (TECH §4.1):');
    for (const [key, entry] of Object.entries(manifest)) {
      console.log(`  - ${entry.label || key} (${key}): ${entry.description || ''}`);
    }
  }
}

function parseArgs(argv) {
  const parsed = {
    devCycleInput: null,
    mode: null,
    task: null,
    skipBootstrap: false,
    autoApprove: false,
    verbose: false,
    dryRun: false,
    list: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--mode') {
      parsed.mode = (argv[i + 1] || '').toLowerCase();
      i++;
      continue;
    }
    if (arg === '--task') {
      parsed.task = argv[i + 1] || null;
      i++;
      continue;
    }
    if (arg === '--skip-bootstrap') {
      parsed.skipBootstrap = true;
      continue;
    }
    if (arg === '--auto-approve') {
      parsed.autoApprove = true;
      continue;
    }
    if (arg === '--verbose') {
      parsed.verbose = true;
      continue;
    }
    if (arg === '--dry-run') {
      parsed.mode = 'plan-only';
      parsed.dryRun = true;
      continue;
    }
    if (arg === '--list') {
      parsed.list = true;
      continue;
    }
    if (arg === '-h' || arg === '--help') {
      parsed.help = true;
      continue;
    }
    if (!parsed.devCycleInput && !arg.startsWith('-')) {
      parsed.devCycleInput = arg;
    }
  }

  return parsed;
}

function requirementForEvent(event, parsedNdjson) {
  if (parsedNdjson?.requirementId) {
    return parsedNdjson.requirementId;
  }
  if (parsedNdjson?.phase && REQUIREMENT_BY_STAGE[parsedNdjson.phase]) {
    return REQUIREMENT_BY_STAGE[parsedNdjson.phase];
  }
  if (event.phase && REQUIREMENT_BY_STAGE[event.phase]) {
    return REQUIREMENT_BY_STAGE[event.phase];
  }
  return REQUIREMENT_BY_EVENT[event.type] || 'SPEC-CLI §2';
}

function titleCase(value = '') {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function parseNdjsonLine(message) {
  if (!message || typeof message !== 'string') return null;
  const idx = message.indexOf('NDJSON:');
  if (idx === -1) return null;

  const jsonPart = message.slice(idx + 'NDJSON:'.length).trim();
  try {
    return JSON.parse(jsonPart);
  } catch {
    return null;
  }
}

function renderNdjsonEvent(ndjsonEvent) {
  const req = ndjsonEvent.requirementId || REQUIREMENT_BY_STAGE[ndjsonEvent.phase] || 'SPEC-OBS §3';
  const stage = ndjsonEvent.phase ? titleCase(ndjsonEvent.phase) : 'Stage';
  const checkpoint = ndjsonEvent.checkpointId ? ` (${ndjsonEvent.checkpointId})` : '';
  const detail = ndjsonEvent.message ? ` - ${ndjsonEvent.message}` : '';
  console.log(`[${req}] ${stage}${checkpoint}${detail}`);
}

function attachEventStreaming(runner) {
  runner.on('event', (event) => {
    if (event.type === 'output') {
      const parsed = parseNdjsonLine(event.message);
      if (parsed) {
        renderNdjsonEvent(parsed);
        return;
      }
    }

    const requirementId = requirementForEvent(event, null);

    switch (event.type) {
      case 'start': {
        console.log(`[${requirementId}] ${event.message}`);
        break;
      }
      case 'phase': {
        console.log(`[${requirementId}] Entered phase: ${event.phase}`);
        break;
      }
      case 'checkpoint': {
        const checkpointMsg = event.checkpointId
          ? `Checkpoint ${event.checkpointId} awaiting approval`
          : 'Checkpoint reached';
        console.log(`[${requirementId}] ${checkpointMsg}`);
        break;
      }
      case 'firewall': {
        const details = event?.data
          ? ` Details: ${JSON.stringify(event.data)}`
          : '';
        console.log(`[${requirementId}] ${event.message}${details}`);
        break;
      }
      case 'log':
      case 'output': {
        console.log(`[${requirementId}] ${event.message}`);
        break;
      }
      case 'complete': {
        const logFile = event?.data?.logFile ? ` (log: ${event.data.logFile})` : '';
        console.log(`[${requirementId}] ${event.message}${logFile}`);
        break;
      }
      case 'error': {
        console.error(`[${requirementId}] ${event.message}`);
        break;
      }
      default: {
        console.log(`[${requirementId}] ${event.message}`);
      }
    }
  });
}

async function run(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const { manifest, error } = loadManifest();

  if (args.help) {
    printUsage(manifest);
    return;
  }

  if (error) {
    console.error(`[TECH §4.1] ${error}`);
    process.exitCode = 1;
    return;
  }

  const manifestValidation = validateManifest();
  if (!manifestValidation.valid) {
    console.error('[TECH §4.1] Manifest validation failed:');
    manifestValidation.errors.forEach((e) => console.error(`  - ${e}`));
    if (manifestValidation.warnings.length > 0) {
      console.warn('Warnings:');
      manifestValidation.warnings.forEach((w) => console.warn(`  - ${w}`));
    }
    process.exitCode = 1;
    return;
  }

  if (args.list || !args.devCycleInput) {
    printUsage(manifest);
    return;
  }

  const devCycleKey = findDevCycleKey(manifest, args.devCycleInput);
  if (!devCycleKey) {
    console.error(`[TECH §4.1] DevCycle '${args.devCycleInput}' is not defined in the manifest.`);
    const suggestions = suggestDevCycles(manifest, args.devCycleInput);
    if (suggestions.length > 0) {
      console.error('Did you mean: ' + suggestions.join(', ') + '?');
    }
    process.exitCode = 1;
    return;
  }

  const entry = manifest[devCycleKey];
  const entryValidation = validateDevCycleEntry(devCycleKey, entry);
  if (!entryValidation.valid) {
    console.error(`[SPEC-ARTIFACTS §3] DevCycle '${devCycleKey}' is missing required files:`);
    entryValidation.errors.forEach((e) => console.error(`  - ${e}`));
    process.exitCode = 1;
    return;
  }
  if (entryValidation.warnings.length > 0) {
    console.warn('Warnings:');
    entryValidation.warnings.forEach((w) => console.warn(`  - ${w}`));
  }

  if (args.mode && !ALLOWED_MODES.includes(args.mode)) {
    console.error(`[SPEC-CLI §1] Invalid mode '${args.mode}'. Allowed: ${ALLOWED_MODES.join(', ')}`);
    process.exitCode = 1;
    return;
  }

  const mode = args.mode || entry.defaultMode || 'plan-first';
  const task = args.task || entry.description || `Run ${entry.label}`;

  console.log(`[SPEC-CLI §1] Running DevCycle '${entry.label}' (${devCycleKey})`);
  console.log(`[TECH §4.1] instructions: ${entry.instructions}`);
  console.log(`[TECH §4.1] prompt: ${entry.prompt}`);
  console.log(`[TECH §4.1] toolset: ${entry.toolset}`);
  console.log(`[TECH §5.2] mode=${mode}, task="${task}", skipBootstrap=${args.skipBootstrap ? 'yes' : 'no'}`);

  if (args.dryRun) {
    console.log('[SPEC-CLI §1] Dry-run enabled (plan-only).');
  }

  const runner = new DevCycleRunner({
    devCycleId: devCycleKey,
    mode,
    task,
    skipBootstrap: args.skipBootstrap,
    autoApprove: args.autoApprove,
    verbose: args.verbose,
  });

  attachEventStreaming(runner);

  try {
    await runner.run();
  } catch (err) {
    console.error(`[TECH §5.2] DevCycle failed: ${err.message}`);
    process.exitCode = 1;
  }
}

if (pathToFileURL(process.argv[1]).href === import.meta.url) {
  run();
}

export { run as runDevcycleCommand };
