// @ts-nocheck
/**
 * CHANGELOG Updater Utility
 *
 * Provides helpers for reading and updating CHANGELOG.md with
 * new entries following the project's decision/update format.
 *
 * @module changelogUpdater
 * @see PRD §5.3, TECH_REQUIREMENTS §4.5, SPEC-ARCH §1.2
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const GENAI_ROOT = path.resolve(CURRENT_DIR, '..');
const REPO_ROOT = path.resolve(GENAI_ROOT, '..', '..');
const CHANGELOG_PATH = path.resolve(REPO_ROOT, 'CHANGELOG.md');

/**
 * @typedef {'Decision' | 'Update' | 'Validation' | 'Fix' | 'Feature'} EntryType
 */

/**
 * @typedef {Object} ChangelogEntry
 * @property {EntryType} type - Entry type
 * @property {string} timestamp - ISO 8601 timestamp
 * @property {string} goal - Goal description
 * @property {string} action - Action taken
 * @property {string} result - Result of the action
 * @property {string} [next] - Next steps (optional)
 * @property {string} [closes] - Issue reference (e.g., "Closes #7")
 */

/**
 * Loads CHANGELOG.md content synchronously.
 *
 * @returns {string} CHANGELOG content or empty string
 */
export function loadChangelogContent() {
  if (!existsSync(CHANGELOG_PATH)) {
    return '';
  }
  return readFileSync(CHANGELOG_PATH, 'utf8');
}

/**
 * Saves content to CHANGELOG.md synchronously.
 *
 * @param {string} content - Content to write
 * @returns {void}
 */
export function saveChangelogContent(content) {
  writeFileSync(CHANGELOG_PATH, content, 'utf8');
}

/**
 * Generates an ISO 8601 timestamp with milliseconds removed.
 *
 * @returns {string} Timestamp in format YYYY-MM-DDTHH:MM:SSZ
 */
export function getTimestamp() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

/**
 * Formats a changelog entry into the project's standard format.
 *
 * @param {ChangelogEntry} entry - Entry to format
 * @returns {string} Formatted entry string
 *
 * @example
 * formatEntry({
 *   type: 'Update',
 *   timestamp: '2025-11-27T04:00Z',
 *   goal: 'Create shared utilities',
 *   action: 'Created contextLoader.js, statePersistence.js, todoUpdater.js, changelogUpdater.js, validators.js',
 *   result: 'Shared utilities available in dist/genaiscript/shared/',
 *   next: 'Use in orchestrator and phase runners',
 *   closes: 'Closes #7'
 * })
 */
export function formatEntry(entry) {
  const parts = [
    `[${entry.type}][${entry.timestamp}]`,
    `Goal: ${entry.goal}`,
    `→ Action: ${entry.action}`,
    `→ Result: ${entry.result}`,
  ];

  if (entry.next) {
    parts.push(`→ Next: ${entry.next}`);
  }

  if (entry.closes) {
    parts.push(entry.closes);
  }

  return parts.join(' ');
}

/**
 * Adds a new entry to the CHANGELOG.md.
 * Entries are prepended after the header line.
 *
 * @param {ChangelogEntry} entry - Entry to add
 * @returns {boolean} True if entry was added successfully
 */
export function addChangelogEntry(entry) {
  let content = loadChangelogContent();

  if (!content) {
    // Create new CHANGELOG with header
    content = '# CHANGELOG\n\n';
  }

  const formattedEntry = formatEntry(entry);

  // Find the header line
  const headerEnd = content.indexOf('\n\n');
  if (headerEnd === -1) {
    // No double newline, append after first line
    const firstLineEnd = content.indexOf('\n');
    if (firstLineEnd === -1) {
      content = content + '\n\n' + formattedEntry + '\n';
    } else {
      content = content.slice(0, firstLineEnd + 1) + '\n' + formattedEntry + '\n' + content.slice(firstLineEnd + 1);
    }
  } else {
    // Insert after header
    content = content.slice(0, headerEnd + 2) + formattedEntry + '\n\n' + content.slice(headerEnd + 2);
  }

  saveChangelogContent(content);
  return true;
}

/**
 * Creates and adds a Decision entry.
 *
 * @param {string} goal - Goal description
 * @param {string} action - Action taken
 * @param {string} result - Result of the action
 * @param {string} [next] - Next steps (optional)
 * @param {string} [closes] - Issue reference (optional)
 * @returns {boolean} True if entry was added
 */
export function addDecision(goal, action, result, next, closes) {
  return addChangelogEntry({
    type: 'Decision',
    timestamp: getTimestamp(),
    goal,
    action,
    result,
    next,
    closes,
  });
}

/**
 * Creates and adds an Update entry.
 *
 * @param {string} goal - Goal description
 * @param {string} action - Action taken
 * @param {string} result - Result of the action
 * @param {string} [next] - Next steps (optional)
 * @param {string} [closes] - Issue reference (optional)
 * @returns {boolean} True if entry was added
 */
export function addUpdate(goal, action, result, next, closes) {
  return addChangelogEntry({
    type: 'Update',
    timestamp: getTimestamp(),
    goal,
    action,
    result,
    next,
    closes,
  });
}

/**
 * Creates and adds a Validation entry.
 *
 * @param {string} goal - Goal description
 * @param {string} action - Action taken
 * @param {string} result - Result of the action
 * @param {string} [next] - Next steps (optional)
 * @returns {boolean} True if entry was added
 */
export function addValidation(goal, action, result, next) {
  return addChangelogEntry({
    type: 'Validation',
    timestamp: getTimestamp(),
    goal,
    action,
    result,
    next,
  });
}

/**
 * Creates and adds a Fix entry.
 *
 * @param {string} goal - Goal description
 * @param {string} action - Action taken
 * @param {string} result - Result of the action
 * @param {string} [closes] - Issue reference (optional)
 * @returns {boolean} True if entry was added
 */
export function addFix(goal, action, result, closes) {
  return addChangelogEntry({
    type: 'Fix',
    timestamp: getTimestamp(),
    goal,
    action,
    result,
    closes,
  });
}

/**
 * Gets the most recent N changelog entries.
 *
 * @param {number} [count=5] - Number of entries to retrieve
 * @returns {string[]} Array of entry strings
 */
export function getRecentEntries(count = 5) {
  const content = loadChangelogContent();
  if (!content) {
    return [];
  }

  // Match entries that start with [Type][timestamp]
  const entries = [];
  const lines = content.split('\n');
  const entryPattern = /^\[(?:Decision|Update|Validation|Fix|Feature)\]\[\d{4}-\d{2}-\d{2}T[^\]]+\]/;

  for (let i = 0; i < lines.length && entries.length < count; i++) {
    if (entryPattern.test(lines[i])) {
      entries.push(lines[i]);
    }
  }

  return entries;
}

/** Exported paths for external use */
export { CHANGELOG_PATH, REPO_ROOT };
