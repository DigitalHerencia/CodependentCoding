// @ts-nocheck
/**
 * Markdown Summaries Module
 *
 * Converts NDJSON logs into Markdown summaries for TODO/CHANGELOG updates.
 * Extracts requirement IDs, phases, and severity to produce formatted entries
 * referencing specification IDs per PRD §5.3 and SPEC-OBS §3.
 *
 * @module markdownSummaries
 * @see PRD §5.3, TECH_REQUIREMENTS §7, SPEC-OBS §3, Issue #17
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { addChangelogEntry, getTimestamp } from '../shared/changelogUpdater.js';
import { addTodoItem } from '../shared/todoUpdater.js';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const GENAI_ROOT = path.resolve(CURRENT_DIR, '..');
const REPO_ROOT = path.resolve(GENAI_ROOT, '..', '..');

/** Default log directory for .loaded-vibes/logs/ when available */
const DEFAULT_LOG_DIR = path.resolve(REPO_ROOT, '.loaded-vibes', 'logs');

/**
 * @typedef {Object} NDJSONLogEntry
 * @property {string} devCycleId - DevCycle identifier
 * @property {string} phase - Current workflow phase (analyze, design, implement, validate, reflect)
 * @property {string} requirementId - Requirement citation (e.g., "TECH §4.3", "PRD §5.1")
 * @property {'info'|'warn'|'error'} severity - Event severity
 * @property {string} checkpointId - Checkpoint identifier
 * @property {string} timestamp - ISO 8601 timestamp
 * @property {string} [message] - Optional event details
 * @property {string[]} [artifacts] - Optional file paths affected
 */

/**
 * @typedef {Object} MarkdownSummary
 * @property {string} devCycleId - DevCycle identifier
 * @property {string} todoEntry - Formatted TODO.md bullet entry
 * @property {string} changelogEntry - Formatted CHANGELOG.md entry
 * @property {NDJSONLogEntry[]} events - Original parsed events
 * @property {string[]} requirementIds - Extracted requirement IDs
 * @property {string} startTime - First event timestamp
 * @property {string} endTime - Last event timestamp
 * @property {boolean} hasErrors - Whether any error events exist
 * @property {boolean} hasWarnings - Whether any warning events exist
 */

/**
 * @typedef {Object} SummaryWriteResult
 * @property {boolean} success - Whether write was successful
 * @property {string} [error] - Error message if failed
 * @property {boolean} todoUpdated - Whether TODO was updated
 * @property {boolean} changelogUpdated - Whether CHANGELOG was updated
 */

/**
 * Parses a single line of NDJSON into a log entry object.
 * Returns null if the line is invalid or empty.
 *
 * @param {string} line - Single line of NDJSON
 * @returns {NDJSONLogEntry|null} Parsed entry or null if invalid
 */
export function parseNDJSONLine(line) {
  const trimmed = line.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const parsed = JSON.parse(trimmed);
    
    // Validate required fields per SPEC-OBS §3
    if (!parsed.devCycleId || !parsed.phase || !parsed.timestamp) {
      return null;
    }

    // Normalize severity to valid values
    const validSeverities = ['info', 'warn', 'error'];
    if (!validSeverities.includes(parsed.severity)) {
      parsed.severity = 'info';
    }

    return {
      devCycleId: parsed.devCycleId,
      phase: parsed.phase,
      requirementId: parsed.requirementId || '',
      severity: parsed.severity,
      checkpointId: parsed.checkpointId || '',
      timestamp: parsed.timestamp,
      message: parsed.message || '',
      artifacts: parsed.artifacts || [],
    };
  } catch {
    return null;
  }
}

/**
 * Parses an NDJSON log file and returns all valid entries.
 *
 * @param {string} filePath - Path to the NDJSON log file
 * @returns {NDJSONLogEntry[]} Array of parsed log entries
 */
export function parseNDJSONFile(filePath) {
  if (!existsSync(filePath)) {
    return [];
  }

  try {
    const content = readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const entries = [];

    for (const line of lines) {
      const entry = parseNDJSONLine(line);
      if (entry) {
        entries.push(entry);
      }
    }

    return entries;
  } catch {
    return [];
  }
}

/**
 * Finds the latest NDJSON log file in a directory.
 *
 * @param {string} [logDir] - Directory to search (defaults to .loaded-vibes/logs/)
 * @returns {string|null} Path to the latest log file or null if none found
 */
export function findLatestLogFile(logDir = DEFAULT_LOG_DIR) {
  if (!existsSync(logDir)) {
    return null;
  }

  try {
    const files = readdirSync(logDir)
      .filter((f) => f.endsWith('.ndjson'))
      .map((f) => {
        const filePath = path.join(logDir, f);
        // Extract timestamp from filename pattern: devcycle-YYYY-MM-DDTHH-MM-SS-MMMZ.ndjson
        // Fall back to file modification time if timestamp not in filename
        const timestampMatch = f.match(/(\d{4}-\d{2}-\d{2}T[\d-]+Z)/);
        let sortKey;
        if (timestampMatch) {
          // Parse timestamp from filename (replace dashes back to colons for ISO format)
          sortKey = timestampMatch[1].replace(/-(\d{2})-(\d{2})-(\d{3})Z$/, ':$1:$2.$3Z');
        } else {
          // Use file modification time as fallback
          try {
            const stats = statSync(filePath);
            sortKey = stats.mtime.toISOString();
          } catch {
            sortKey = '1970-01-01T00:00:00.000Z';
          }
        }
        return {
          name: f,
          path: filePath,
          sortKey,
        };
      })
      .sort((a, b) => b.sortKey.localeCompare(a.sortKey)); // Sort by timestamp descending

    return files.length > 0 ? files[0].path : null;
  } catch {
    return null;
  }
}

/**
 * Extracts unique requirement IDs from log entries.
 *
 * @param {NDJSONLogEntry[]} entries - Log entries to extract from
 * @returns {string[]} Unique requirement IDs
 */
export function extractRequirementIds(entries) {
  const ids = new Set();

  for (const entry of entries) {
    if (entry.requirementId) {
      // Handle comma-separated requirement IDs
      const parts = entry.requirementId.split(',').map((s) => s.trim());
      for (const part of parts) {
        if (part) {
          ids.add(part);
        }
      }
    }
  }

  return Array.from(ids);
}

/**
 * Groups log entries by DevCycle ID.
 *
 * @param {NDJSONLogEntry[]} entries - Log entries to group
 * @returns {Map<string, NDJSONLogEntry[]>} Map of devCycleId to entries
 */
export function groupByDevCycle(entries) {
  const groups = new Map();

  for (const entry of entries) {
    const existing = groups.get(entry.devCycleId) || [];
    existing.push(entry);
    groups.set(entry.devCycleId, existing);
  }

  return groups;
}

/**
 * Generates a TODO.md bullet entry from log entries per PRD §5.3.
 *
 * @param {string} devCycleId - DevCycle identifier
 * @param {NDJSONLogEntry[]} entries - Log entries for this DevCycle
 * @returns {string} Formatted TODO entry
 */
export function generateTodoEntry(devCycleId, entries) {
  const requirementIds = extractRequirementIds(entries);
  const phases = [...new Set(entries.map((e) => e.phase))];
  const hasErrors = entries.some((e) => e.severity === 'error');
  const hasWarnings = entries.some((e) => e.severity === 'warn');

  // Determine status indicator
  let statusIndicator = '☑';
  if (hasErrors) {
    statusIndicator = '☐'; // Incomplete due to errors
  } else if (hasWarnings) {
    statusIndicator = '☑'; // Complete with warnings
  }

  // Build item description
  const errorCount = entries.filter((e) => e.severity === 'error').length;
  const warnCount = entries.filter((e) => e.severity === 'warn').length;

  let description = `Execute ${devCycleId} DevCycle (${phases.join(' → ')})`;
  if (errorCount > 0) {
    description += ` [${errorCount} error(s)]`;
  }
  if (warnCount > 0) {
    description += ` [${warnCount} warning(s)]`;
  }

  // Build source citation
  const source = requirementIds.length > 0
    ? requirementIds.join(', ')
    : `SPEC-OBS §3`;

  return `| ${statusIndicator} | ${description} | ${source} |`;
}

/**
 * Generates a CHANGELOG action log entry from log entries.
 *
 * @param {string} devCycleId - DevCycle identifier
 * @param {NDJSONLogEntry[]} entries - Log entries for this DevCycle
 * @param {string} [goal] - Optional goal override
 * @returns {Object} Changelog entry object compatible with changelogUpdater
 */
export function generateChangelogEntry(devCycleId, entries, goal) {
  const requirementIds = extractRequirementIds(entries);
  const phases = [...new Set(entries.map((e) => e.phase))];
  const hasErrors = entries.some((e) => e.severity === 'error');
  const hasWarnings = entries.some((e) => e.severity === 'warn');

  // Get timestamps
  const sortedEntries = [...entries].sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp)
  );
  const startTime = sortedEntries[0]?.timestamp || new Date().toISOString();
  const endTime = sortedEntries[sortedEntries.length - 1]?.timestamp || startTime;

  // Determine entry type
  let type = 'Update';
  if (hasErrors) {
    type = 'Fix';
  } else if (phases.includes('init') && phases.length <= 2) {
    type = 'Feature';
  }

  // Build action description with citations
  const citations = requirementIds.length > 0
    ? ` per ${requirementIds.join(', ')}`
    : ' per SPEC-OBS §3';

  const action = `Executed ${devCycleId} DevCycle phases (${phases.join(' → ')})${citations}`;

  // Build result summary
  let result;
  if (hasErrors) {
    const errorMessages = entries
      .filter((e) => e.severity === 'error')
      .map((e) => e.message)
      .filter(Boolean)
      .slice(0, 3);
    result = `Completed with errors: ${errorMessages.join('; ') || 'See logs for details'}`;
  } else if (hasWarnings) {
    result = 'Completed with warnings; review recommended';
  } else {
    result = 'All phases completed successfully';
  }

  // Build next steps
  const followUpMessages = entries
    .filter((e) => e.message && e.message.toLowerCase().includes('next'))
    .map((e) => e.message);
  const next = followUpMessages.length > 0
    ? followUpMessages[0]
    : hasErrors
      ? 'Address errors before proceeding'
      : 'Proceed to next DevCycle';

  return {
    type,
    timestamp: getTimestamp(),
    goal: goal || `Complete ${devCycleId} DevCycle`,
    action,
    result,
    next,
  };
}

/**
 * Generates a complete Markdown summary from log entries.
 *
 * @param {string} devCycleId - DevCycle identifier
 * @param {NDJSONLogEntry[]} entries - Log entries for this DevCycle
 * @returns {MarkdownSummary} Complete summary object
 */
export function generateSummary(devCycleId, entries) {
  const todoEntry = generateTodoEntry(devCycleId, entries);
  const changelogEntryObj = generateChangelogEntry(devCycleId, entries);

  // Format changelog entry as string for display
  const changelogEntry = [
    `[${changelogEntryObj.type}][${changelogEntryObj.timestamp}]`,
    `Goal: ${changelogEntryObj.goal}`,
    `→ Action: ${changelogEntryObj.action}`,
    `→ Result: ${changelogEntryObj.result}`,
    `→ Next: ${changelogEntryObj.next}`,
  ].join(' ');

  const sortedEntries = [...entries].sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp)
  );

  return {
    devCycleId,
    todoEntry,
    changelogEntry,
    events: entries,
    requirementIds: extractRequirementIds(entries),
    startTime: sortedEntries[0]?.timestamp || '',
    endTime: sortedEntries[sortedEntries.length - 1]?.timestamp || '',
    hasErrors: entries.some((e) => e.severity === 'error'),
    hasWarnings: entries.some((e) => e.severity === 'warn'),
  };
}

/**
 * Checks if an entry already exists in TODO.md to avoid duplicates.
 * Uses devCycleId and phase pattern for matching.
 *
 * @param {string} devCycleId - DevCycle identifier to check
 * @returns {boolean} True if entry already exists
 */
export function todoEntryExists(devCycleId) {
  const todoPath = path.resolve(REPO_ROOT, 'TODO.md');
  if (!existsSync(todoPath)) {
    return false;
  }

  try {
    const content = readFileSync(todoPath, 'utf8');
    // Check for existing entry with this devCycleId
    const pattern = new RegExp(`Execute ${devCycleId} DevCycle`, 'i');
    return pattern.test(content);
  } catch {
    return false;
  }
}

/**
 * Checks if a similar entry already exists in CHANGELOG.md to avoid duplicates.
 * Uses timestamp proximity and devCycleId for matching.
 *
 * @param {string} devCycleId - DevCycle identifier
 * @param {string} timestamp - Timestamp to compare
 * @param {number} [toleranceMinutes=5] - Minutes tolerance for duplicate detection
 * @returns {boolean} True if similar entry already exists
 */
export function changelogEntryExists(devCycleId, timestamp, toleranceMinutes = 5) {
  const changelogPath = path.resolve(REPO_ROOT, 'CHANGELOG.md');
  if (!existsSync(changelogPath)) {
    return false;
  }

  try {
    const content = readFileSync(changelogPath, 'utf8');
    const lines = content.split('\n');

    // Parse recent entries and check for duplicates
    const targetTime = new Date(timestamp).getTime();
    const toleranceMs = toleranceMinutes * 60 * 1000;

    for (const line of lines) {
      // Match [Type][timestamp] pattern
      const match = line.match(/^\[(?:Decision|Update|Validation|Fix|Feature)\]\[(\d{4}-\d{2}-\d{2}T[^\]]+)\]/);
      if (match) {
        const entryTime = new Date(match[1]).getTime();
        const timeDiff = Math.abs(targetTime - entryTime);

        // Check if within tolerance and matches devCycleId
        if (timeDiff < toleranceMs && line.toLowerCase().includes(devCycleId.toLowerCase())) {
          return true;
        }
      }
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Writes Markdown summaries to TODO.md and CHANGELOG.md with idempotent behavior.
 *
 * @param {MarkdownSummary} summary - Summary to write
 * @param {Object} [options] - Write options
 * @param {boolean} [options.skipDuplicateCheck=false] - Skip duplicate checking
 * @param {string} [options.todoCategory='Observability & Logging'] - TODO category
 * @returns {SummaryWriteResult} Result of the write operation
 */
export function writeSummary(summary, options = {}) {
  const {
    skipDuplicateCheck = false,
    todoCategory = 'Observability & Logging',
  } = options;

  const result = {
    success: true,
    todoUpdated: false,
    changelogUpdated: false,
  };

  try {
    // Check for duplicates unless skipped
    if (!skipDuplicateCheck) {
      if (todoEntryExists(summary.devCycleId)) {
        console.log(`ℹ️  TODO entry for ${summary.devCycleId} already exists, skipping.`);
      } else {
        // Add TODO entry for DevCycles with errors or as general tracking
        if (summary.hasErrors || summary.hasWarnings) {
          const description = summary.hasErrors
            ? `Review and fix ${summary.devCycleId} DevCycle errors`
            : `Review ${summary.devCycleId} DevCycle warnings`;
          const source = summary.requirementIds.length > 0
            ? summary.requirementIds.join(', ')
            : 'SPEC-OBS §3';
          addTodoItem(todoCategory, description, source);
          result.todoUpdated = true;
        }
      }

      if (changelogEntryExists(summary.devCycleId, summary.endTime)) {
        console.log(`ℹ️  CHANGELOG entry for ${summary.devCycleId} already exists, skipping.`);
      } else {
        // Always add CHANGELOG entry
        const changelogEntryObj = generateChangelogEntry(
          summary.devCycleId,
          summary.events
        );
        addChangelogEntry(changelogEntryObj);
        result.changelogUpdated = true;
      }
    } else {
      // Write without duplicate checks
      if (summary.hasErrors || summary.hasWarnings) {
        const description = summary.hasErrors
          ? `Review and fix ${summary.devCycleId} DevCycle errors`
          : `Review ${summary.devCycleId} DevCycle warnings`;
        const source = summary.requirementIds.length > 0
          ? summary.requirementIds.join(', ')
          : 'SPEC-OBS §3';
        addTodoItem(todoCategory, description, source);
        result.todoUpdated = true;
      }

      const changelogEntryObj = generateChangelogEntry(
        summary.devCycleId,
        summary.events
      );
      addChangelogEntry(changelogEntryObj);
      result.changelogUpdated = true;
    }

    return result;
  } catch (error) {
    return {
      success: false,
      error: error.message,
      todoUpdated: result.todoUpdated,
      changelogUpdated: result.changelogUpdated,
    };
  }
}

/**
 * Processes an NDJSON log file and writes summaries for all DevCycles found.
 *
 * @param {string} logFilePath - Path to the NDJSON log file
 * @param {Object} [options] - Processing options
 * @param {boolean} [options.skipDuplicateCheck=false] - Skip duplicate checking
 * @param {string} [options.todoCategory='Observability & Logging'] - TODO category
 * @returns {Object} Processing results with per-DevCycle status
 */
export function processLogFile(logFilePath, options = {}) {
  const entries = parseNDJSONFile(logFilePath);
  if (entries.length === 0) {
    return {
      success: true,
      processed: 0,
      results: [],
      message: 'No valid NDJSON entries found',
    };
  }

  const groups = groupByDevCycle(entries);
  const results = [];

  for (const [devCycleId, devCycleEntries] of groups) {
    const summary = generateSummary(devCycleId, devCycleEntries);
    const writeResult = writeSummary(summary, options);
    results.push({
      devCycleId,
      ...writeResult,
      summary,
    });
  }

  return {
    success: results.every((r) => r.success),
    processed: groups.size,
    results,
    message: `Processed ${groups.size} DevCycle(s) from ${entries.length} log entries`,
  };
}

/**
 * Processes the latest log file from the default log directory.
 *
 * @param {Object} [options] - Processing options
 * @returns {Object} Processing results
 */
export function processLatestLog(options = {}) {
  const latestFile = findLatestLogFile();
  if (!latestFile) {
    return {
      success: false,
      processed: 0,
      results: [],
      message: 'No NDJSON log files found in .loaded-vibes/logs/',
    };
  }

  return processLogFile(latestFile, options);
}

/**
 * Hook function for integration with phase runners' Reflect stage.
 * Processes NDJSON log entries directly without file I/O.
 *
 * @param {string} devCycleId - DevCycle identifier
 * @param {NDJSONLogEntry[]} entries - Log entries from the DevCycle
 * @param {Object} [options] - Processing options
 * @returns {SummaryWriteResult} Write result
 */
export function reflectStageHook(devCycleId, entries, options = {}) {
  if (!entries || entries.length === 0) {
    return {
      success: true,
      todoUpdated: false,
      changelogUpdated: false,
    };
  }

  const summary = generateSummary(devCycleId, entries);
  return writeSummary(summary, options);
}

/**
 * Persists NDJSON log entries to a log file.
 * Creates the log directory if it doesn't exist.
 *
 * @param {NDJSONLogEntry[]} entries - Log entries to persist
 * @param {string} [filename] - Optional filename (defaults to timestamp-based name)
 * @param {string} [logDir] - Optional log directory (defaults to .loaded-vibes/logs/)
 * @returns {string|null} Path to the created log file or null on failure
 */
export function persistLogEntries(entries, filename, logDir = DEFAULT_LOG_DIR) {
  if (!entries || entries.length === 0) {
    return null;
  }

  try {
    // Ensure log directory exists
    if (!existsSync(logDir)) {
      mkdirSync(logDir, { recursive: true });
    }

    // Generate filename if not provided
    const logFilename = filename || `devcycle-${new Date().toISOString().replace(/[:.]/g, '-')}.ndjson`;
    const logPath = path.join(logDir, logFilename);

    // Convert entries to NDJSON
    const ndjsonContent = entries.map((e) => JSON.stringify(e)).join('\n') + '\n';

    writeFileSync(logPath, ndjsonContent, 'utf8');
    return logPath;
  } catch {
    return null;
  }
}

/** Exported constants for external use */
export { DEFAULT_LOG_DIR, REPO_ROOT };
