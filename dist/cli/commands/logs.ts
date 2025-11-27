// @ts-nocheck
/**
 * Loaded Vibes Logs CLI Command
 *
 * Surfaces NDJSON traces from `.loaded-vibes/logs/*.ndjson` with filters,
 * follow mode, and Markdown export for reviews.
 *
 * References: TECH_REQUIREMENTS §5.3, SPEC-CLI §4, SPEC-OBS §3, ADR-0001.
 */

import { createReadStream, existsSync, readdirSync, readFileSync, statSync, watch } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_LOGS_DIR } from '../services/ndjsonLogger.js';
import { generateSummary } from '../../genaiscript/logging/markdownSummaries.js';
import { createFileGuard } from '../security/fileGuard.js';

type LogFilters = {
  devCycleId?: string;
  severities?: Set<string>;
  since?: Date;
};

type LogEntry = {
  devCycleId: string;
  phase: string;
  severity: string;
  requirementId: string;
  checkpointId?: string;
  timestamp: string;
  message: string;
  file: string;
};

type CliOptions = {
  devCycleId?: string;
  severities?: Set<string>;
  since?: Date;
  follow: boolean;
  exportPath?: string;
  logsDir: string;
  help?: boolean;
};

const SEVERITY_ICONS: Record<string, string> = {
  debug: '..',
  info: '>>',
  warn: '!!',
  error: 'XX',
};

const fileGuard = createFileGuard();

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    follow: false,
    logsDir: DEFAULT_LOGS_DIR,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '--devcycle':
      case '-d':
        options.devCycleId = argv[i + 1];
        i++;
        break;
      case '--since':
        options.since = parseSince(argv[i + 1]);
        i++;
        break;
      case '--severity':
      case '--severities':
        options.severities = parseSeverityList(argv[i + 1]);
        i++;
        break;
      case '--follow':
      case '-f':
        options.follow = true;
        break;
      case '--export':
      case '-e':
        options.exportPath = argv[i + 1];
        i++;
        break;
      case '--logs-dir':
        options.logsDir = argv[i + 1] || DEFAULT_LOGS_DIR;
        i++;
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

function parseSince(value?: string): Date | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    console.error(
      `Invalid --since value "${value}". Use ISO timestamps, e.g., 2025-11-27T07:30:00Z.`
    );
    process.exit(1);
  }
  return parsed;
}

function parseSeverityList(value?: string): Set<string> | undefined {
  if (!value) return undefined;
  const items = value
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
  if (items.length === 0) {
    return undefined;
  }
  return new Set(items);
}

function printHelp(logsDir: string) {
  const lines = [
    '',
    'loaded-vibes logs -- view NDJSON traces',
    '',
    'Usage:',
    '  node dist/cli/commands/logs.ts [--devcycle <id>] [--since <timestamp>]',
    '                                [--severity <level[,level]>] [--follow]',
    '                                [--export <path>] [--logs-dir <path>]',
    '',
    'Options:',
    '  --devcycle, -d    Filter by DevCycle ID (exact match)',
    '  --since           Filter entries on/after timestamp (ISO 8601)',
    '  --severity        Comma-separated severities (debug,info,warn,error)',
    '  --follow, -f      Stream new log lines as they arrive',
    '  --export, -e      Write a Markdown snapshot to the target path',
    `  --logs-dir        Override logs directory (default: ${logsDir})`,
    '  --help, -h        Show this help',
    '',
  ];
  console.log(lines.join('\n'));
}

function ensureLogsDir(logsDir: string, guard = fileGuard) {
  if (!existsSync(logsDir)) {
    guard.mkdirSync(logsDir, { recursive: true });
    console.log(`Created log directory at ${logsDir}`);
  }
}

function getLogFiles(logsDir: string): string[] {
  if (!existsSync(logsDir)) {
    return [];
  }
  return readdirSync(logsDir)
    .filter((f) => f.endsWith('.ndjson'))
    .map((f) => path.join(logsDir, f))
    .sort((a, b) => {
      const aTime = statSafe(a);
      const bTime = statSafe(b);
      return aTime - bTime;
    });
}

function statSafe(filePath: string): number {
  try {
    return statSync(filePath).mtimeMs;
  } catch {
    return 0;
  }
}

function parseLogLine(line: string, filePath: string): LogEntry | null {
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
      severity: (parsed.severity || 'info').toLowerCase(),
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

function loadEntries(files: string[]): LogEntry[] {
  const entries: LogEntry[] = [];

  for (const filePath of files) {
    let content: string;
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

  return entries.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

function matchesFilters(entry: LogEntry, filters: LogFilters): boolean {
  if (filters.devCycleId && entry.devCycleId !== filters.devCycleId) {
    return false;
  }
  if (filters.severities && !filters.severities.has(entry.severity)) {
    return false;
  }
  if (filters.since) {
    const entryTime = new Date(entry.timestamp).getTime();
    if (Number.isNaN(entryTime) || entryTime < filters.since.getTime()) {
      return false;
    }
  }
  return true;
}

function formatEntry(entry: LogEntry): string {
  const icon = SEVERITY_ICONS[entry.severity] || '??';
  const req = entry.requirementId ? ` req:${entry.requirementId}` : '';
  const checkpoint = entry.checkpointId ? ` chk:${entry.checkpointId}` : '';
  return (
    `[${entry.timestamp}] ${icon} ${entry.severity.padEnd(5)} ` +
    `${entry.devCycleId} ${entry.phase.padEnd(9)} ${entry.message}${req}${checkpoint}`
  );
}

function printEntries(entries: LogEntry[], filters: LogFilters) {
  if (entries.length === 0) {
    console.log('No NDJSON log entries match the provided filters.');
    return;
  }

  const filterParts = [];
  if (filters.devCycleId) filterParts.push(`devCycle=${filters.devCycleId}`);
  if (filters.severities && filters.severities.size > 0) {
    filterParts.push(`severity=${Array.from(filters.severities).join(',')}`);
  }
  if (filters.since) filterParts.push(`since=${filters.since.toISOString()}`);

  console.log('');
  console.log('================ LOADED VIBES LOGS ================');
  if (filterParts.length > 0) {
    console.log(`Filters: ${filterParts.join(' | ')}`);
  } else {
    console.log('Filters: none (showing all parsed entries)');
  }
  console.log('---------------------------------------------------');

  for (const entry of entries) {
    console.log(formatEntry(entry));
  }

  console.log('===================================================');
  console.log(`Total entries: ${entries.length}`);
  console.log('');
}

function groupByDevCycle(entries: LogEntry[]): Map<string, LogEntry[]> {
  const map = new Map<string, LogEntry[]>();
  for (const entry of entries) {
    const key = entry.devCycleId || 'unknown';
    const existing = map.get(key) || [];
    existing.push(entry);
    map.set(key, existing);
  }
  return map;
}

function buildMarkdownExport(entries: LogEntry[], filters: LogFilters, logsDir: string): string {
  const now = new Date().toISOString();
  const grouped = groupByDevCycle(entries);
  const requirementIds = new Set<string>();

  entries.forEach((e) => {
    if (e.requirementId) {
      e.requirementId.split(',').forEach((id) => requirementIds.add(id.trim()));
    }
  });

  const lines: string[] = [];
  lines.push('# Loaded Vibes Log Export');
  lines.push('');
  lines.push(`Generated: ${now}`);
  lines.push(`Source logs: ${logsDir}`);
  lines.push('');
  lines.push('```yaml');
  lines.push(`devCycles: [${Array.from(grouped.keys()).join(', ')}]`);
  lines.push(`requirementIds: [${Array.from(requirementIds).filter(Boolean).join(', ')}]`);
  lines.push(
    `filters: ${JSON.stringify({
      devCycleId: filters.devCycleId || null,
      severities: filters.severities ? Array.from(filters.severities) : null,
      since: filters.since ? filters.since.toISOString() : null,
    })}`
  );
  lines.push('```');
  lines.push('');

  for (const [devCycleId, devEntries] of grouped) {
    // Summaries expect NDJSON-shaped records; keep the fields they consume.
    const summary = generateSummary(
      devCycleId,
      devEntries.map((e) => ({
        devCycleId: e.devCycleId,
        phase: e.phase,
        severity: e.severity,
        requirementId: e.requirementId,
        checkpointId: e.checkpointId,
        timestamp: e.timestamp,
        message: e.message,
      }))
    );

    const files = Array.from(new Set(devEntries.map((e) => path.basename(e.file))));

    lines.push(`## DevCycle ${devCycleId}`);
    lines.push(`- Entries: ${devEntries.length}`);
    lines.push(`- Requirement IDs: ${summary.requirementIds.join(', ') || 'none'}`);
    lines.push(`- Timeframe: ${summary.startTime || 'n/a'} -> ${summary.endTime || 'n/a'}`);
    lines.push(`- TODO row: ${summary.todoEntry}`);
    lines.push(`- CHANGELOG entry: ${summary.changelogEntry}`);
    lines.push(`- Log files: ${files.join(', ') || 'unknown'}`);
    lines.push('');
    lines.push('### Events');
    for (const entry of devEntries) {
      const req = entry.requirementId ? ` (req: ${entry.requirementId})` : '';
      lines.push(
        `- ${entry.timestamp} | ${entry.severity.toUpperCase()} | ${entry.phase} | ${
          entry.message
        }${req} (${path.basename(entry.file)})`
      );
    }
    lines.push('');
  }

  if (entries.length === 0) {
    lines.push('_No entries matched the provided filters._');
  }

  return lines.join('\n');
}

async function writeExport(markdown: string, exportPath: string, guard = fileGuard) {
  const targetDir = path.dirname(exportPath);
  if (!existsSync(targetDir)) {
    await guard.mkdir(targetDir, { recursive: true });
  }
  await guard.writeFile(exportPath, markdown, 'utf8');
  console.log(`Markdown export written to ${exportPath}`);
}

function startFollow(logsDir: string, filters: LogFilters, offsets: Map<string, number>) {
  console.log(`Watching ${logsDir} for new NDJSON entries... (Ctrl+C to stop)`);

  const handleNewContent = (filePath: string) => {
    let endSize = 0;
    try {
      endSize = statSync(filePath).size;
    } catch {
      return;
    }

    const lastSize = offsets.get(filePath) || 0;
    if (endSize < lastSize) {
      offsets.set(filePath, 0);
    }

    const start = offsets.get(filePath) || 0;
    if (endSize <= start) {
      offsets.set(filePath, endSize);
      return;
    }

    const stream = createReadStream(filePath, { encoding: 'utf8', start });
    let buffer = '';

    stream.on('data', (chunk) => {
      buffer += chunk;
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const entry = parseLogLine(line, filePath);
        if (entry && matchesFilters(entry, filters)) {
          console.log(formatEntry(entry));
        }
      }
    });

    stream.on('end', () => {
      offsets.set(filePath, endSize);
    });
  };

  const watcher = watch(logsDir, (eventType, filename) => {
    if (!filename || !filename.endsWith('.ndjson')) {
      return;
    }
    const fullPath = path.join(logsDir, filename);

    if (eventType === 'rename') {
      if (existsSync(fullPath)) {
        offsets.set(fullPath, 0);
        handleNewContent(fullPath);
      }
      return;
    }

    if (eventType === 'change') {
      handleNewContent(fullPath);
    }
  });

  watcher.on('error', (err) => {
    console.error(`Log watcher error: ${err.message}`);
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp(args.logsDir);
    return;
  }

  ensureLogsDir(args.logsDir);
  const filters: LogFilters = {
    devCycleId: args.devCycleId,
    severities: args.severities,
    since: args.since,
  };

  const files = getLogFiles(args.logsDir);
  const allEntries = loadEntries(files);
  const filtered = allEntries.filter((entry) => matchesFilters(entry, filters));

  printEntries(filtered, filters);

  if (args.exportPath) {
    const markdown = buildMarkdownExport(filtered, filters, args.logsDir);
    await writeExport(markdown, args.exportPath);
  }

  if (args.follow) {
    const offsets = new Map<string, number>();
    for (const file of files) {
      try {
        offsets.set(file, statSync(file).size);
      } catch {
        offsets.set(file, 0);
      }
    }
    startFollow(args.logsDir, filters, offsets);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((err) => {
    console.error(`Failed to run logs command: ${err.message}`);
    process.exit(1);
  });
}

export { main as runLogsCommand, parseArgs as parseLogsArgs, buildMarkdownExport };
