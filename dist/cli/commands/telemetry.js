// @ts-nocheck
/**
 * Telemetry Export Command
 *
 * Aggregates NDJSON log data and emits sanitized telemetry exports
 * in JSON or Markdown format per TECH §11 and SPEC-OBS §2.
 * Implements Issue #16 requirements and references ADR-0001 for
 * dual-mode output decisions.
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createFileGuard } from '../security/fileGuard.js';
import { generateSummary } from '../../genaiscript/logging/markdownSummaries.js';
import { redactTelemetry, redactString } from '../services/redaction.js';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = path.resolve(CURRENT_DIR, '..');
const REQUIREMENT_REF = 'TECH §11 / SPEC-OBS §2 / ADR-0001';
const VALID_FORMATS = new Set(['json', 'markdown', 'md']);
const DEFAULT_FORMAT = 'json';
const REPORT_VERSION = '1.0.0';

/**
 * Entry point for `loaded-vibes telemetry` command.
 * @param {string[]} argv
 */
export async function runTelemetryCli(argv = []) {
  const [subcommand, ...rest] = argv;

  if (!subcommand || subcommand === '--help' || subcommand === '-h') {
    printTelemetryHelp();
    return;
  }

  switch (subcommand) {
    case 'export':
      await runTelemetryExport(rest);
      return;
    default:
      console.error(`Unknown telemetry subcommand: ${subcommand}`);
      printTelemetryHelp();
      process.exitCode = 1;
  }
}

/**
 * Prints telemetry command help text.
 */
function printTelemetryHelp() {
  console.log('');
  console.log('loaded-vibes telemetry <subcommand>');
  console.log('');
  console.log('Subcommands:');
  console.log('  export   Aggregate NDJSON logs and emit JSON/Markdown telemetry report');
  console.log('');
  console.log('Example:');
  console.log('  loaded-vibes telemetry export --format json');
  console.log('  loaded-vibes telemetry export --format markdown --devcycle initialization');
  console.log('');
}

/**
 * Runs the telemetry export workflow.
 * @param {string[]} argv
 */
async function runTelemetryExport(argv = []) {
  const options = parseExportArgs(argv);
  if (options.help) {
    printExportHelp(options.defaultLogsDir);
    return;
  }

  validateFormat(options.format);

  const logEntries = loadLogEntries(options.logsDir);
  const filteredEntries = applyFilters(logEntries, options);

  if (filteredEntries.length === 0) {
    console.log('No NDJSON telemetry entries match the provided filters.');
    return;
  }

  const report = buildTelemetryReport(filteredEntries, options);
  await writeTelemetryReport(report, options);
}

function parseExportArgs(argv) {
  const cwd = process.cwd();
  const loadedVibesRoot = path.resolve(cwd, '.loaded-vibes');
  const defaultLogsDir = path.join(loadedVibesRoot, 'logs');
  const defaultSummariesDir = path.join(loadedVibesRoot, 'summaries');
  const defaultExportsDir = path.join(loadedVibesRoot, 'telemetry', 'exports');

  const options = {
    format: DEFAULT_FORMAT,
    devCycleId: undefined,
    since: undefined,
    logsDir: defaultLogsDir,
    summariesDir: defaultSummariesDir,
    exportsDir: defaultExportsDir,
    outputPath: undefined,
    pretty: true,
    help: false,
    defaultLogsDir,
    loadedVibesRoot,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case '--format':
      case '-f':
        options.format = (argv[i + 1] || DEFAULT_FORMAT).toLowerCase();
        i += 1;
        break;
      case '--devcycle':
      case '-d':
        options.devCycleId = argv[i + 1];
        i += 1;
        break;
      case '--since':
        options.since = parseSince(argv[i + 1]);
        i += 1;
        break;
      case '--logs-dir':
        options.logsDir = path.resolve(cwd, argv[i + 1]);
        i += 1;
        break;
      case '--summaries-dir':
        options.summariesDir = path.resolve(cwd, argv[i + 1]);
        i += 1;
        break;
      case '--out':
      case '--output':
        options.outputPath = path.resolve(cwd, argv[i + 1]);
        i += 1;
        break;
      case '--pretty':
        options.pretty = true;
        break;
      case '--compact':
        options.pretty = false;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default:
        break;
    }
  }

  return options;
}

function parseSince(value) {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    console.error(`Invalid --since value: ${value}`);
    process.exit(1);
  }
  return parsed;
}

function printExportHelp(defaultLogsDir) {
  console.log('');
  console.log('loaded-vibes telemetry export --format <json|markdown>');
  console.log('');
  console.log('Options:');
  console.log('  --format, -f        Output format (json, markdown)');
  console.log('  --devcycle, -d      Filter by DevCycle ID');
  console.log('  --since             Filter entries on/after ISO timestamp');
  console.log('  --logs-dir          Override NDJSON logs directory');
  console.log('  --summaries-dir     Override summaries directory');
  console.log(
    '  --out, --output     Target file path (defaults to .loaded-vibes/telemetry/exports)'
  );
  console.log('  --pretty            Pretty-print JSON output');
  console.log('  --compact           Minified JSON output');
  console.log('  --help, -h          Show this help');
  console.log('');
  console.log(`Default logs directory: ${defaultLogsDir}`);
}

function validateFormat(format) {
  if (!VALID_FORMATS.has(format)) {
    console.error(`Unsupported format: ${format}. Use json or markdown.`);
    process.exit(1);
  }
}

function loadLogEntries(logsDir) {
  if (!existsSync(logsDir)) {
    return [];
  }

  const files = readdirSync(logsDir)
    .filter((name) => name.endsWith('.ndjson'))
    .map((name) => path.join(logsDir, name))
    .sort((a, b) => fileMtime(a) - fileMtime(b));

  const entries = [];

  for (const filePath of files) {
    let content = '';
    try {
      content = readFileSync(filePath, 'utf8');
    } catch {
      continue;
    }

    for (const line of content.split('\n')) {
      const entry = parseLogLine(line, filePath);
      if (entry) {
        entries.push(entry);
      }
    }
  }

  return entries;
}

function fileMtime(filePath) {
  try {
    return statSync(filePath).mtimeMs;
  } catch {
    return 0;
  }
}

function parseLogLine(line, filePath) {
  const trimmed = line.trim();
  if (!trimmed) return null;

  try {
    const parsed = JSON.parse(trimmed);
    if (!parsed.timestamp || !parsed.devCycleId) {
      return null;
    }

    return {
      devCycleId: parsed.devCycleId,
      phase: parsed.phase || 'system',
      severity: normalizeSeverity(parsed.severity),
      requirementId: parsed.requirementId || '',
      checkpointId: parsed.checkpointId || '',
      timestamp: parsed.timestamp,
      message: parsed.message || '',
      file: filePath,
    };
  } catch {
    return null;
  }
}

function normalizeSeverity(value) {
  const normalized = (value || 'info').toLowerCase();
  if (['info', 'warn', 'error'].includes(normalized)) {
    return normalized;
  }
  return 'info';
}

function applyFilters(entries, options) {
  return entries.filter((entry) => {
    if (options.devCycleId && entry.devCycleId !== options.devCycleId) {
      return false;
    }
    if (options.since) {
      const entryDate = new Date(entry.timestamp);
      if (Number.isNaN(entryDate.getTime()) || entryDate < options.since) {
        return false;
      }
    }
    return true;
  });
}

function buildTelemetryReport(entries, options) {
  const grouped = groupByDevCycle(entries);
  const devCycles = [];

  for (const [devCycleId, devEntries] of grouped) {
    const summary = generateSummary(
      devCycleId,
      devEntries.map((entry) => ({
        devCycleId: entry.devCycleId,
        phase: entry.phase,
        severity: entry.severity,
        requirementId: entry.requirementId,
        checkpointId: entry.checkpointId,
        timestamp: entry.timestamp,
        message: entry.message,
      }))
    );

    const severityCounts = countSeverities(devEntries);
    const logFiles = Array.from(new Set(devEntries.map((entry) => path.basename(entry.file))));
    const status = summary.hasErrors ? 'error' : summary.hasWarnings ? 'warning' : 'success';

    devCycles.push({
      devCycleId,
      status,
      eventCount: devEntries.length,
      severityCounts,
      requirementIds: summary.requirementIds,
      timeframe: {
        start: summary.startTime,
        end: summary.endTime,
      },
      todoEntry: summary.todoEntry,
      changelogEntry: summary.changelogEntry,
      checkpointCount: devEntries.filter((entry) => Boolean(entry.checkpointId)).length,
      logFiles,
    });
  }

  devCycles.sort((a, b) => a.devCycleId.localeCompare(b.devCycleId));

  return {
    formatVersion: REPORT_VERSION,
    exportedAt: new Date().toISOString(),
    source: {
      logsDir: options.logsDir,
      summariesDir: options.summariesDir,
      filters: {
        devCycleId: options.devCycleId || null,
        since: options.since ? options.since.toISOString() : null,
      },
    },
    devCycleCount: devCycles.length,
    devCycles,
    requirement: REQUIREMENT_REF,
  };
}

function groupByDevCycle(entries) {
  const map = new Map();
  for (const entry of entries) {
    const existing = map.get(entry.devCycleId) || [];
    existing.push(entry);
    map.set(entry.devCycleId, existing);
  }
  return map;
}

function countSeverities(entries) {
  const counts = { info: 0, warn: 0, error: 0 };
  for (const entry of entries) {
    if (counts[entry.severity] !== undefined) {
      counts[entry.severity] += 1;
    }
  }
  return counts;
}

async function writeTelemetryReport(report, options) {
  const guard = createFileGuard({ allowedRoot: options.loadedVibesRoot });
  const format = normalizeFormat(options.format);
  const ext = format === 'json' ? 'json' : 'md';
  const targetPath = options.outputPath || buildDefaultOutputPath(options.exportsDir, format);

  await guard.mkdir(path.dirname(targetPath), { recursive: true });

  if (format === 'json') {
    const redacted = redactTelemetry(report);
    const data = JSON.stringify(redacted, null, options.pretty ? 2 : undefined);
    await guard.writeFile(targetPath, `${data}\n`, 'utf8');
  } else {
    const markdown = buildMarkdownReport(report);
    const sanitized = redactString(markdown);
    await guard.writeFile(targetPath, `${sanitized}\n`, 'utf8');
  }

  console.log(`Telemetry export written to ${targetPath} (${REQUIREMENT_REF}).`);
}

function normalizeFormat(format) {
  if (format === 'md') return 'markdown';
  return format;
}

function buildDefaultOutputPath(exportsDir, format) {
  const now = new Date();
  const timestamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    '-',
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join('');
  const ext = format === 'markdown' ? 'md' : 'json';
  return path.join(exportsDir, `telemetry-${timestamp}.${ext}`);
}

function buildMarkdownReport(report) {
  const lines = [];
  lines.push('# Loaded Vibes Telemetry Export');
  lines.push('');
  lines.push(`Generated: ${report.exportedAt}`);
  lines.push(`Requirement: ${REQUIREMENT_REF}`);
  lines.push('');
  lines.push('```json');
  lines.push(
    JSON.stringify(
      {
        formatVersion: report.formatVersion,
        filters: report.source.filters,
        sourceLogs: report.source.logsDir,
      },
      null,
      2
    )
  );
  lines.push('```');
  lines.push('');

  if (report.devCycles.length === 0) {
    lines.push('_No DevCycle entries matched the provided filters._');
    return lines.join('\n');
  }

  for (const devCycle of report.devCycles) {
    lines.push(`## DevCycle ${devCycle.devCycleId}`);
    lines.push(`- Status: ${devCycle.status}`);
    lines.push(`- Events: ${devCycle.eventCount}`);
    lines.push(
      `- Severities: info=${devCycle.severityCounts.info}, warn=${devCycle.severityCounts.warn}, error=${devCycle.severityCounts.error}`
    );
    lines.push(
      `- Timeframe: ${devCycle.timeframe.start || 'n/a'} → ${devCycle.timeframe.end || 'n/a'}`
    );
    lines.push(
      `- Requirements: ${
        devCycle.requirementIds.length > 0 ? devCycle.requirementIds.join(', ') : 'SPEC-OBS §3'
      }`
    );
    lines.push(`- Checkpoints logged: ${devCycle.checkpointCount}`);
    lines.push(`- Log files: ${devCycle.logFiles.join(', ') || 'unknown'}`);
    lines.push('');
    lines.push('### TODO Entry');
    lines.push(devCycle.todoEntry || '_n/a_');
    lines.push('');
    lines.push('### CHANGELOG Entry');
    lines.push(devCycle.changelogEntry || '_n/a_');
    lines.push('');
  }

  return lines.join('\n');
}
