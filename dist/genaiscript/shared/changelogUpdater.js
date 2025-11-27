// @ts-nocheck
/**
 * CHANGELOG Updater Module
 *
 * Provides functions to read, parse, and update CHANGELOG.md entries.
 * Supports the action log format used by the Loaded Vibes framework.
 * Implements idempotency checks to prevent duplicate entries per TECH §9.
 *
 * @module changelogUpdater
 * @see TECH_REQUIREMENTS §7, TECH_REQUIREMENTS §9, SPEC-OBS §3, PRD §5.3, Issue #22
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  checkChangelogEntryExists,
  checkFileIdempotency,
  logIdempotencyWarning,
  normalizeText,
} from './idempotency.js';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const GENAI_ROOT = path.resolve(CURRENT_DIR, '..');
const REPO_ROOT = path.resolve(GENAI_ROOT, '..', '..');
const CHANGELOG_PATH = path.resolve(REPO_ROOT, 'CHANGELOG.md');

/**
 * @typedef {Object} ChangelogEntry
 * @property {'Decision'|'Update'|'Validation'|'Fix'|'Feature'} type - Entry type
 * @property {string} timestamp - ISO 8601 timestamp
 * @property {string} goal - Goal description
 * @property {string} action - Action taken
 * @property {string} result - Result of the action
 * @property {string} next - Next steps
 */

/**
 * Generates an ISO 8601 timestamp for the current time.
 *
 * @returns {string} ISO 8601 formatted timestamp (e.g., "2025-11-27T08:00Z")
 */
export function getTimestamp() {
  const now = new Date();
  // Format: YYYY-MM-DDTHH:MMZ (simplified ISO 8601)
  return now.toISOString().slice(0, 16) + 'Z';
}

/**
 * Formats a changelog entry into the standard action log format.
 *
 * @param {ChangelogEntry} entry - Entry to format
 * @returns {string} Formatted entry string
 */
export function formatEntry(entry) {
  const parts = [
    `[${entry.type}][${entry.timestamp}]`,
    `Goal: ${entry.goal}`,
    `→ Action: ${entry.action}`,
    `→ Result: ${entry.result}`,
    `→ Next: ${entry.next}`,
  ];

  return parts.join(' ');
}

/**
 * Parses a changelog entry line back into a structured object.
 *
 * @param {string} line - Entry line to parse
 * @returns {ChangelogEntry|null} Parsed entry or null if invalid
 */
export function parseEntry(line) {
  // Match pattern: [Type][Timestamp] Goal: ... → Action: ... → Result: ... → Next: ...
  const headerMatch = line.match(/^\[(\w+)\]\[([^\]]+)\]/);
  if (!headerMatch) {
    return null;
  }

  const type = headerMatch[1];
  const timestamp = headerMatch[2];

  // Extract sections
  const goalMatch = line.match(/Goal:\s*(.+?)\s*→\s*Action:/);
  const actionMatch = line.match(/→\s*Action:\s*(.+?)\s*→\s*Result:/);
  const resultMatch = line.match(/→\s*Result:\s*(.+?)\s*→\s*Next:/);
  const nextMatch = line.match(/→\s*Next:\s*(.+?)(?:\s*$)/);

  if (!goalMatch || !actionMatch || !resultMatch || !nextMatch) {
    // Try alternate format without all sections
    return {
      type: type,
      timestamp: timestamp,
      goal: goalMatch?.[1] || '',
      action: actionMatch?.[1] || line.substring(headerMatch[0].length).trim(),
      result: resultMatch?.[1] || '',
      next: nextMatch?.[1] || '',
    };
  }

  return {
    type: type,
    timestamp: timestamp,
    goal: goalMatch[1].trim(),
    action: actionMatch[1].trim(),
    result: resultMatch[1].trim(),
    next: nextMatch[1].trim(),
  };
}

/**
 * Reads and parses all CHANGELOG entries.
 *
 * @returns {ChangelogEntry[]} Array of parsed entries
 */
export function readChangelogEntries() {
  if (!existsSync(CHANGELOG_PATH)) {
    return [];
  }

  try {
    const content = readFileSync(CHANGELOG_PATH, 'utf8');
    const lines = content.split('\n');
    const entries = [];

    for (const line of lines) {
      if (line.startsWith('[')) {
        const entry = parseEntry(line);
        if (entry) {
          entries.push(entry);
        }
      }
    }

    return entries;
  } catch (error) {
    // Log read failures but return empty array to allow graceful degradation
    console.warn(`⚠️  changelogUpdater: Failed to read CHANGELOG.md: ${error.message}`);
    return [];
  }
}

/**
 * Adds a new entry to the top of the CHANGELOG.
 * Implements idempotency check to prevent duplicate entries per TECH §9.
 *
 * @param {ChangelogEntry} entry - Entry to add
 * @param {Object} [options={}] - Options for the add operation
 * @param {boolean} [options.skipIdempotencyCheck=false] - Skip duplicate checking
 * @param {boolean} [options.warnOnDuplicate=true] - Log warning when duplicate detected
 * @param {number} [options.toleranceMinutes=5] - Time tolerance for duplicate detection
 * @returns {{ added: boolean, skipped: boolean, reason: string|null }} Result object
 * @see TECH §9, Issue #22
 */
export function addChangelogEntry(entry, options = {}) {
  const { skipIdempotencyCheck = false, warnOnDuplicate = true, toleranceMinutes = 5 } = options;
  const formattedEntry = formatEntry(entry);

  if (!existsSync(CHANGELOG_PATH)) {
    // Create new CHANGELOG with header
    const initialContent = `# CHANGELOG

${formattedEntry}
`;
    writeFileSync(CHANGELOG_PATH, initialContent, 'utf8');
    return { added: true, skipped: false, reason: null };
  }

  try {
    const content = readFileSync(CHANGELOG_PATH, 'utf8');

    // Idempotency check: Ensure entry is absent before append (TECH §9, Issue #22)
    if (!skipIdempotencyCheck) {
      const idempotencyResult = checkChangelogEntryExists(
        content,
        entry.goal,
        entry.timestamp,
        toleranceMinutes
      );
      if (idempotencyResult.wouldDuplicate) {
        if (warnOnDuplicate) {
          logIdempotencyWarning(idempotencyResult, 'CHANGELOG update');
        }
        return {
          added: false,
          skipped: true,
          reason: idempotencyResult.warningMessage,
        };
      }
    }

    const lines = content.split('\n');

    // Find the first entry line (after header)
    let insertIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Skip header and empty lines
      if (line.startsWith('#') || line.trim() === '') {
        insertIndex = i + 1;
      } else if (line.startsWith('[')) {
        // Found first entry, insert before it
        insertIndex = i;
        break;
      }
    }

    // Insert new entry
    lines.splice(insertIndex, 0, formattedEntry, '');

    writeFileSync(CHANGELOG_PATH, lines.join('\n'), 'utf8');
    return { added: true, skipped: false, reason: null };
  } catch (error) {
    return { added: false, skipped: false, reason: error.message };
  }
}

/**
 * Gets the most recent entries from the CHANGELOG.
 *
 * @param {number} count - Number of entries to return
 * @returns {ChangelogEntry[]} Most recent entries
 */
export function getRecentEntries(count = 10) {
  const entries = readChangelogEntries();
  return entries.slice(0, count);
}

/**
 * Gets entries by type.
 *
 * @param {'Decision'|'Update'|'Validation'|'Fix'|'Feature'} type - Entry type to filter by
 * @returns {ChangelogEntry[]} Entries of the specified type
 */
export function getEntriesByType(type) {
  const entries = readChangelogEntries();
  return entries.filter((entry) => entry.type === type);
}

/**
 * Checks if a similar entry already exists (by goal and timestamp proximity).
 *
 * @param {string} goal - Goal to check
 * @param {string} timestamp - Timestamp to compare
 * @param {number} [toleranceMinutes=5] - Time tolerance in minutes
 * @returns {boolean} True if similar entry exists
 */
export function entryExists(goal, timestamp, toleranceMinutes = 5) {
  const entries = readChangelogEntries();
  const targetTime = new Date(timestamp).getTime();
  const toleranceMs = toleranceMinutes * 60 * 1000;
  const goalLower = goal.toLowerCase();

  for (const entry of entries) {
    const entryTime = new Date(entry.timestamp).getTime();
    const timeDiff = Math.abs(targetTime - entryTime);

    if (timeDiff < toleranceMs && entry.goal.toLowerCase().includes(goalLower)) {
      return true;
    }
  }

  return false;
}

/**
 * Creates a standard DevCycle completion entry.
 *
 * @param {string} devCycleId - DevCycle identifier
 * @param {string} description - What was done
 * @param {string} result - Result summary
 * @param {string} next - Next steps
 * @param {string[]} [citations=[]] - Requirement citations
 * @returns {ChangelogEntry} Formatted entry
 */
export function createDevCycleEntry(devCycleId, description, result, next, citations = []) {
  const citationStr = citations.length > 0
    ? ` per ${citations.join(', ')}`
    : '';

  return {
    type: 'Update',
    timestamp: getTimestamp(),
    goal: `Complete ${devCycleId} DevCycle`,
    action: `${description}${citationStr}`,
    result: result,
    next: next,
  };
}

/** Exported paths for external use */
export { CHANGELOG_PATH, REPO_ROOT };
