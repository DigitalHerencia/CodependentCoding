// @ts-nocheck
/**
 * DevCycle CLI Command
 *
 * Implements `loaded-vibes devcycle <name>` command to manually trigger DevCycles
 * from CLI, streaming orchestrator events with requirement ID citations.
 *
 * @module dist/cli/commands/devcycle
 * @see docs/TECH_REQUIREMENTS.md §5.2 - Console UX & Modules
 * @see spec/cli.spec.md §1 - CLI Commands
 * @see spec/cli.spec.md §2 - Interaction & UX Model
 */

import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { createRunner } from '../services/devcycleRunner.js';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = path.resolve(CURRENT_DIR, '..', '..', 'genaiscript', 'devcycles.config.json');

/**
 * @typedef {Object} DevCycleConfig
 * @property {string} label - Human-readable label
 * @property {string} description - DevCycle description
 * @property {string} instructions - Path to instructions file
 * @property {string} toolset - Path to toolset file
 * @property {string} prompt - Path to prompt file
 * @property {string[]} contexts - Context files to load
 * @property {string[]} checkpoints - Checkpoint phases
 * @property {string} defaultMode - Default execution mode
 */

/**
 * @typedef {Object.<string, DevCycleConfig>} Manifest
 */

/**
 * @typedef {Object} CommandOptions
 * @property {string} [mode] - Execution mode (plan-only, plan-first, execute, validate)
 * @property {string} [task] - Task description
 * @property {boolean} [dryRun] - Preview without execution
 * @property {boolean} [autoApprove] - Auto-approve checkpoints
 * @property {boolean} [verbose] - Enable verbose output
 * @property {boolean} [skipBootstrap] - Skip bootstrap preflight
 */

/**
 * Loads the DevCycle manifest.
 *
 * @returns {Manifest|null}
 */
function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) {
    return null;
  }

  try {
    const content = readFileSync(MANIFEST_PATH, 'utf8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Gets valid DevCycle names from manifest.
 *
 * @param {Manifest} manifest
 * @returns {string[]}
 */
function getValidDevCycleNames(manifest) {
  return Object.keys(manifest);
}

/**
 * Calculates Levenshtein distance for fuzzy matching.
 *
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number}
 */
function levenshteinDistance(a, b) {
  const matrix = [];

  // Edge cases
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Finds similar DevCycle names for suggestions.
 *
 * @param {string} input - User input
 * @param {string[]} validNames - Valid DevCycle names
 * @param {number} [maxSuggestions=3] - Maximum suggestions to return
 * @returns {string[]}
 */
function findSimilarNames(input, validNames, maxSuggestions = 3) {
  const lowerInput = input.toLowerCase();

  // Score each name
  const scored = validNames.map((name) => {
    const lowerName = name.toLowerCase();
    const distance = levenshteinDistance(lowerInput, lowerName);
    const startsWith = lowerName.startsWith(lowerInput) ? 0 : 1;
    const contains = lowerName.includes(lowerInput) ? 0 : 1;
    // Combined score: prefer prefix matches, then contains, then edit distance
    const score = startsWith * 100 + contains * 50 + distance;
    return { name, score, distance };
  });

  // Sort by score and filter reasonable matches
  return scored
    .filter((s) => s.distance <= Math.max(3, input.length / 2))
    .sort((a, b) => a.score - b.score)
    .slice(0, maxSuggestions)
    .map((s) => s.name);
}

/**
 * Validates DevCycle name against manifest.
 *
 * @param {string} name - DevCycle name to validate
 * @param {Manifest} manifest - Loaded manifest
 * @returns {{valid: boolean, normalized: string|null, suggestions: string[]}}
 */
function validateDevCycleName(name, manifest) {
  const validNames = getValidDevCycleNames(manifest);

  // Case-insensitive match
  const normalizedInput = name.toLowerCase();
  const exactMatch = validNames.find((n) => n.toLowerCase() === normalizedInput);

  if (exactMatch) {
    return { valid: true, normalized: exactMatch, suggestions: [] };
  }

  // Find suggestions
  const suggestions = findSimilarNames(name, validNames);

  return { valid: false, normalized: null, suggestions };
}

/**
 * Formats DevCycle list for display.
 *
 * @param {Manifest} manifest
 * @returns {string}
 */
function formatDevCycleList(manifest) {
  const lines = [
    '',
    'Available DevCycles:',
    '─'.repeat(60),
  ];

  for (const config of Object.values(manifest)) {
    lines.push(`  ${config.label.padEnd(18)} │ ${config.description}`);
  }

  lines.push('─'.repeat(60));
  lines.push('');

  return lines.join('\n');
}

/**
 * Formats event for console output with requirement IDs.
 * Implements SPEC-CLI §2 - outputs cite originating requirement IDs.
 *
 * @param {Object} event - Runner event
 * @returns {string}
 */
function formatEvent(event) {
  const timestamp = new Date(event.timestamp).toLocaleTimeString();

  switch (event.type) {
    case 'start':
      return `\n╔══════════════════════════════════════════════════════════════╗
║  🚀 DEVCYCLE STARTING                                        ║
╚══════════════════════════════════════════════════════════════╝
  DevCycle: ${event.devCycleId}
  Mode: ${event.data?.mode || 'plan-first'}
  Time: ${timestamp}
  [TECH §4.2] Orchestrator invocation
`;

    case 'phase':
      return `\n┌─ Phase: ${event.phase} ────────────────────────────────────────────
│  [SPEC-ENGINE §4] ${event.message}
└─────────────────────────────────────────────────────────────────`;

    case 'checkpoint':
      return `\n⏸️  Checkpoint: ${event.checkpointId}
    Phase: ${event.phase}
    [PRD §5.2] Pause/resume checkpoint
    [TECH §4.5] State persistence enabled`;

    case 'firewall':
      return `\n🔥 Bad Vibes Firewall Warning
    ${event.message}
    [PRD §5.5] Destructive operation guard
    [SPEC-SECURITY §1] Approval required`;

    case 'complete':
      return `\n╔══════════════════════════════════════════════════════════════╗
║  ✅ DEVCYCLE COMPLETE                                        ║
╚══════════════════════════════════════════════════════════════╝
  ${event.message}
  Log: ${event.data?.logFile || 'N/A'}
  [TECH §4.2] Execution complete
`;

    case 'error':
      return `\n❌ Error: ${event.message}
    [SPEC-OBS §3] Error logged to NDJSON`;

    case 'output':
      return `  ${event.message}`;

    case 'log':
      return `  📝 ${event.message}`;

    default:
      return `  [${event.type}] ${event.message || ''}`;
  }
}

/**
 * Runs the devcycle command with dry-run preview.
 *
 * @param {string} devCycleName - DevCycle name
 * @param {DevCycleConfig} config - DevCycle configuration
 * @returns {void}
 */
function runDryRun(devCycleName, config) {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  🔍 DRY RUN - DevCycle Preview                               ║
╚══════════════════════════════════════════════════════════════╝

  DevCycle: ${config.label} (${devCycleName})
  Description: ${config.description}

  ┌─ Configuration ─────────────────────────────────────────────
  │  Instructions: ${config.instructions}
  │  Toolset: ${config.toolset}
  │  Prompt: ${config.prompt}
  │  Mode: ${config.defaultMode}
  └─────────────────────────────────────────────────────────────

  ┌─ Checkpoints ───────────────────────────────────────────────
${config.checkpoints.map((cp) => `  │  • ${cp}`).join('\n')}
  └─────────────────────────────────────────────────────────────

  ┌─ Context Files ─────────────────────────────────────────────
${config.contexts.map((ctx) => `  │  • ${ctx}`).join('\n')}
  └─────────────────────────────────────────────────────────────

  [SPEC-CLI §1] DevCycle command dry-run
  [TECH §5.2] Console UX preview mode

  Run without --dry-run to execute this DevCycle.
`);
}

/**
 * Runs the devcycle command.
 *
 * @param {string} name - DevCycle name
 * @param {CommandOptions} [options] - Command options
 * @returns {Promise<void>}
 */
async function runDevcycleCommand(name, options = {}) {
  // Load manifest
  const manifest = loadManifest();

  if (!manifest) {
    console.error(`
❌ Error: Could not load DevCycle manifest.
   Expected location: ${MANIFEST_PATH}

   [TECH §4.1] Manifest validation required
   [SPEC-ARTIFACTS §3] Manifest must be present for DevCycle execution

   Please ensure the manifest file exists and is valid JSON.
`);
    process.exit(1);
  }

  // Validate DevCycle name
  const validation = validateDevCycleName(name, manifest);

  if (!validation.valid) {
    console.error(`
❌ Error: Invalid DevCycle name "${name}"
`);

    if (validation.suggestions.length > 0) {
      console.error(`   Did you mean:`);
      for (const suggestion of validation.suggestions) {
        const config = manifest[suggestion];
        console.error(`     • ${suggestion} - ${config.description}`);
      }
      console.error('');
    }

    console.error(formatDevCycleList(manifest));

    console.error(`   [TECH §4.1] DevCycle name must match manifest entry
   [SPEC-CLI §1] Validation with suggestions
`);
    process.exit(1);
  }

  const devCycleName = validation.normalized;
  const config = manifest[devCycleName];

  // Handle dry-run mode
  if (options.dryRun) {
    runDryRun(devCycleName, config);
    return;
  }

  // Create and run the DevCycle
  const runner = createRunner({
    devCycleId: devCycleName,
    mode: options.mode || config.defaultMode || 'plan-first',
    task: options.task,
    skipBootstrap: options.skipBootstrap || false,
    autoApprove: options.autoApprove || false,
    verbose: options.verbose || false,
  });

  // Attach event handlers for streaming output
  runner.on('event', (event) => {
    const formatted = formatEvent(event);
    if (formatted) {
      console.log(formatted);
    }
  });

  // Handle errors
  runner.on('error', (event) => {
    // Error already formatted via formatEvent
  });

  try {
    await runner.run();
    process.exit(0);
  } catch (error) {
    console.error(`
❌ DevCycle execution failed: ${error.message}

   Log file: ${runner.getLogFilePath() || 'N/A'}

   [SPEC-OBS §3] Check NDJSON logs for details
   [TECH §5.3] Use 'loaded-vibes logs' to view execution history
`);
    process.exit(1);
  }
}

/**
 * Parses command-line arguments.
 *
 * @param {string[]} args - Process arguments
 * @returns {{name: string, options: CommandOptions}}
 */
function parseArgs(args) {
  const options = {};
  let name = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--dry-run' || arg === '-n') {
      options.dryRun = true;
    } else if (arg === '--auto-approve' || arg === '-y') {
      options.autoApprove = true;
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else if (arg === '--skip-bootstrap') {
      options.skipBootstrap = true;
    } else if (arg === '--mode' || arg === '-m') {
      options.mode = args[++i];
    } else if (arg === '--task' || arg === '-t') {
      options.task = args[++i];
    } else if (arg === '--help' || arg === '-h') {
      showHelp();
      process.exit(0);
    } else if (arg === '--list' || arg === '-l') {
      const manifest = loadManifest();
      if (manifest) {
        console.log(formatDevCycleList(manifest));
      } else {
        console.error('Could not load manifest.');
      }
      process.exit(0);
    } else if (!arg.startsWith('-')) {
      name = arg;
    }
  }

  return { name, options };
}

/**
 * Shows command help.
 */
function showHelp() {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  loaded-vibes devcycle - Manual DevCycle Triggering          ║
╚══════════════════════════════════════════════════════════════╝

USAGE:
  loaded-vibes devcycle <name> [options]

ARGUMENTS:
  <name>            DevCycle name from manifest (case-insensitive)

OPTIONS:
  -n, --dry-run       Preview DevCycle configuration without execution
  -m, --mode <mode>   Execution mode (plan-only, plan-first, execute, validate)
  -t, --task <desc>   Task description to pass to orchestrator
  -y, --auto-approve  Auto-approve all checkpoints (for automation)
  -v, --verbose       Enable verbose output
  --skip-bootstrap    Skip bootstrap preflight checks
  -l, --list          List all available DevCycles
  -h, --help          Show this help message

EXAMPLES:
  loaded-vibes devcycle initialization
  loaded-vibes devcycle Scaffolding --dry-run
  loaded-vibes devcycle features --mode execute --task "Add user profile"
  loaded-vibes devcycle testing --auto-approve --verbose

REFERENCES:
  [TECH §5.2]        Console UX & Modules
  [SPEC-CLI §1]      CLI Commands - devcycle
  [SPEC-ENGINE §4]   Orchestrator invocation
  [PRD §5.2]         Streaming events with checkpoints
`);
}

/**
 * Main entry point for CLI execution.
 *
 * @returns {Promise<void>}
 */
async function main() {
  // Skip first two args (node, script path)
  const args = process.argv.slice(2);

  // If invoked as subcommand, the first arg may be 'devcycle'
  const startIndex = args[0] === 'devcycle' ? 1 : 0;
  const commandArgs = args.slice(startIndex);

  const { name, options } = parseArgs(commandArgs);

  if (!name) {
    console.error('Error: DevCycle name is required.\n');
    showHelp();
    process.exit(1);
  }

  await runDevcycleCommand(name, options);
}

// Export API
export {
  runDevcycleCommand,
  validateDevCycleName,
  loadManifest,
  getValidDevCycleNames,
  findSimilarNames,
  formatEvent,
  formatDevCycleList,
  showHelp,
  parseArgs,
};

/**
 * Checks if this module is being run directly.
 * @returns {boolean}
 */
function isRunningDirectly() {
  if (!process.argv[1]) {
    return false;
  }

  const scriptPath = fileURLToPath(import.meta.url);
  const invokePath = path.resolve(process.argv[1]);

  return (
    scriptPath === invokePath ||
    (path.basename(invokePath) === 'devcycle.js' &&
      path.basename(path.dirname(invokePath)) === 'commands')
  );
}

// Run main if executed directly
if (isRunningDirectly()) {
  main().catch((error) => {
    console.error('DevCycle command failed:', error.message);
    process.exit(1);
  });
}
