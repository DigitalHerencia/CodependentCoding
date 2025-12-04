// @ts-nocheck
/**
 * TODO Updater Module
 *
 * Provides functions to read, parse, and update TODO.md entries.
 * Supports adding new items, marking items complete, and querying status.
 * Implements idempotency checks to prevent duplicate entries per TECH §9.
 *
 * @module todoUpdater
 * @see TECH_REQUIREMENTS §7, TECH_REQUIREMENTS §9, SPEC-OBS §3, PRD §5.3, Issue #22
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  checkTodoEntryExists,
  checkFileIdempotency,
  logIdempotencyWarning,
  normalizeText,
} from './idempotency.js';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const GENAI_ROOT = path.resolve(CURRENT_DIR, '..');
const REPO_ROOT = path.resolve(GENAI_ROOT, '..', '..');
const TODO_PATH = path.resolve(REPO_ROOT, 'TODO.md');

/** Maximum length for truncated duplicate item descriptions in reports */
const MAX_DUPLICATE_DISPLAY_LENGTH = 80;

/**
 * @typedef {Object} TodoItem
 * @property {string} status - '☑' for complete, '☐' for incomplete
 * @property {string} item - Item description
 * @property {string} source - Source reference (e.g., "TECH §4.3")
 * @property {string} category - Category heading the item belongs to
 * @property {number} lineNumber - Line number in the file
 */

/**
 * Parses TODO.md content into structured items.
 *
 * @param {string} content - TODO.md file content
 * @returns {TodoItem[]} Parsed TODO items
 */
export function parseTodo(content) {
  const lines = content.split('\n');
  const items = [];
  let currentCategory = 'Uncategorized';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect category headings (### Heading)
    const categoryMatch = line.match(/^### (.+)/);
    if (categoryMatch) {
      currentCategory = categoryMatch[1].trim();
      continue;
    }

    // Detect table row items (| Status | Item | Source |)
    const tableRowMatch = line.match(/^\|\s*(☑|☐)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|$/);
    if (tableRowMatch) {
      items.push({
        status: tableRowMatch[1],
        item: tableRowMatch[2].trim(),
        source: tableRowMatch[3].trim(),
        category: currentCategory,
        lineNumber: i + 1,
      });
    }
  }

  return items;
}

/**
 * Reads and parses TODO.md.
 *
 * @returns {TodoItem[]} Parsed TODO items
 */
export function readTodoItems() {
  if (!existsSync(TODO_PATH)) {
    return [];
  }

  try {
    const content = readFileSync(TODO_PATH, 'utf8');
    return parseTodo(content);
  } catch (error) {
    // Log read failures but return empty array to allow graceful degradation
    console.warn(`⚠️  todoUpdater: Failed to read TODO.md: ${error.message}`);
    return [];
  }
}

/**
 * Finds a TODO item by partial description match.
 *
 * @param {string} searchText - Text to search for in item descriptions
 * @returns {TodoItem|null} Matching item or null
 */
export function findTodoItem(searchText) {
  const items = readTodoItems();
  const searchLower = searchText.toLowerCase();

  for (const item of items) {
    if (item.item.toLowerCase().includes(searchLower)) {
      return item;
    }
  }

  return null;
}

/**
 * Marks a TODO item as complete by updating its status symbol.
 *
 * @param {string} searchText - Text to find the item to mark complete
 * @returns {boolean} True if item was found and updated
 */
export function markTodoComplete(searchText) {
  if (!existsSync(TODO_PATH)) {
    return false;
  }

  try {
    const content = readFileSync(TODO_PATH, 'utf8');
    const searchLower = searchText.toLowerCase();

    // Find and replace the matching line
    const lines = content.split('\n');
    let updated = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.toLowerCase().includes(searchLower) && line.includes('☐')) {
        lines[i] = line.replace('☐', '☑');
        updated = true;
        break;
      }
    }

    if (updated) {
      writeFileSync(TODO_PATH, lines.join('\n'), 'utf8');
    }

    return updated;
  } catch {
    return false;
  }
}

/**
 * Adds a new TODO item under the specified category.
 * Implements idempotency check to prevent duplicate entries per TECH §9.
 *
 * @param {string} category - Category heading to add under (e.g., "Engine & Orchestration")
 * @param {string} item - Item description
 * @param {string} source - Source reference (e.g., "TECH §4.3, SPEC-ENGINE §3")
 * @param {Object} [options={}] - Options for the add operation
 * @param {boolean} [options.skipIdempotencyCheck=false] - Skip duplicate checking
 * @param {boolean} [options.warnOnDuplicate=true] - Log warning when duplicate detected
 * @returns {{ added: boolean, skipped: boolean, reason: string|null }} Result object
 * @see TECH §9, Issue #22
 */
export function addTodoItem(category, item, source, options = {}) {
  const { skipIdempotencyCheck = false, warnOnDuplicate = true } = options;

  if (!existsSync(TODO_PATH)) {
    // Create basic TODO structure if file doesn't exist
    const initialContent = `# TODO

This backlog tracks Spec-Driven Workflow actions for the Loaded Vibes framework.

## Active Items

### ${category}

| Status | Item | Source |
| ------ | ---- | ------ |
| ☐      | ${item} | ${source} |
`;
    writeFileSync(TODO_PATH, initialContent, 'utf8');
    return { added: true, skipped: false, reason: null };
  }

  try {
    const content = readFileSync(TODO_PATH, 'utf8');

    // Idempotency check: Ensure entry is absent before append (TECH §9, Issue #22)
    if (!skipIdempotencyCheck) {
      const idempotencyResult = checkTodoEntryExists(content, item);
      if (idempotencyResult.wouldDuplicate) {
        if (warnOnDuplicate) {
          logIdempotencyWarning(idempotencyResult, 'TODO update');
        }
        return {
          added: false,
          skipped: true,
          reason: idempotencyResult.warningMessage,
        };
      }
    }

    const lines = content.split('\n');
    const newRow = `| ☐      | ${item} | ${source} |`;

    // Find the category heading
    let categoryLineIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(new RegExp(`^### ${category}`, 'i'))) {
        categoryLineIndex = i;
        break;
      }
    }

    if (categoryLineIndex === -1) {
      // Category not found, add at end of Active Items section
      let activeItemsEnd = lines.length;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/^## Recently Completed/i)) {
          activeItemsEnd = i;
          break;
        }
      }

      // Insert new category before Recently Completed
      lines.splice(
        activeItemsEnd,
        0,
        '',
        `### ${category}`,
        '',
        '| Status | Item | Source |',
        '| ------ | ---- | ------ |',
        newRow,
        ''
      );
    } else {
      // Find the end of the table for this category
      let tableEnd = categoryLineIndex + 1;
      for (let i = categoryLineIndex + 1; i < lines.length; i++) {
        const line = lines[i];
        // Skip empty lines and table formatting
        if (line.startsWith('|') || line.trim() === '') {
          tableEnd = i + 1;
        } else if (line.startsWith('#')) {
          // Hit next heading
          break;
        }
      }

      // Find the last table row (not header or separator)
      let insertIndex = tableEnd;
      for (let i = tableEnd - 1; i > categoryLineIndex; i--) {
        if (lines[i].match(/^\|\s*[☑☐]/)) {
          insertIndex = i + 1;
          break;
        }
      }

      // Insert the new row
      lines.splice(insertIndex, 0, newRow);
    }

    writeFileSync(TODO_PATH, lines.join('\n'), 'utf8');
    return { added: true, skipped: false, reason: null };
  } catch (error) {
    return { added: false, skipped: false, reason: error.message };
  }
}

/**
 * Gets all incomplete TODO items.
 *
 * @returns {TodoItem[]} Array of incomplete items
 */
export function getIncompleteTodos() {
  const items = readTodoItems();
  return items.filter((item) => item.status === '☐');
}

/**
 * Gets all complete TODO items.
 *
 * @returns {TodoItem[]} Array of complete items
 */
export function getCompleteTodos() {
  const items = readTodoItems();
  return items.filter((item) => item.status === '☑');
}

/**
 * Gets TODO items by category.
 *
 * @param {string} category - Category to filter by
 * @returns {TodoItem[]} Items in the specified category
 */
export function getTodosByCategory(category) {
  const items = readTodoItems();
  return items.filter((item) =>
    item.category.toLowerCase().includes(category.toLowerCase())
  );
}

/**
 * Finds duplicate TODO entries based on normalized item text.
 * Duplicates are items with the same normalized description text.
 *
 * @returns {{ duplicates: Array<{ item: string, entries: TodoItem[] }>, hasDuplicates: boolean }}
 * @see SPEC-DEV §4, SPEC-OBS §3, Issue #71
 */
export function findDuplicates() {
  const items = readTodoItems();
  const itemsByNormalizedText = new Map();

  for (const item of items) {
    const normalized = normalizeText(item.item);
    if (!itemsByNormalizedText.has(normalized)) {
      itemsByNormalizedText.set(normalized, []);
    }
    itemsByNormalizedText.get(normalized).push(item);
  }

  const duplicates = [];
  for (const [text, entries] of itemsByNormalizedText) {
    if (entries.length > 1) {
      duplicates.push({
        item: entries[0].item,
        entries,
      });
    }
  }

  return {
    duplicates,
    hasDuplicates: duplicates.length > 0,
  };
}

/**
 * Removes duplicate TODO entries, keeping the completed (☑) version when available.
 * When both are incomplete or both are complete, keeps the one with more detailed source reference.
 *
 * @param {Object} [options={}] - Options for the deduplication
 * @param {boolean} [options.dryRun=false] - If true, returns the result without modifying the file
 * @returns {{ removed: number, kept: Array<{ item: string, status: string }>, modified: boolean }}
 * @see SPEC-DEV §4, SPEC-OBS §3, PRD §5.3, Issue #71
 */
export function removeDuplicates(options = {}) {
  const { dryRun = false } = options;

  if (!existsSync(TODO_PATH)) {
    return { removed: 0, kept: [], modified: false };
  }

  try {
    const content = readFileSync(TODO_PATH, 'utf8');
    const lines = content.split('\n');
    const items = readTodoItems();

    // Group items by normalized text
    const itemsByNormalizedText = new Map();
    for (const item of items) {
      const normalized = normalizeText(item.item);
      if (!itemsByNormalizedText.has(normalized)) {
        itemsByNormalizedText.set(normalized, []);
      }
      itemsByNormalizedText.get(normalized).push(item);
    }

    // Identify lines to remove (duplicates)
    const linesToRemove = new Set();
    const kept = [];

    for (const [, entries] of itemsByNormalizedText) {
      if (entries.length > 1) {
        // Sort: completed items first, then by source reference length (longer = more detailed)
        entries.sort((a, b) => {
          // Completed items come first
          if (a.status === '☑' && b.status !== '☑') return -1;
          if (b.status === '☑' && a.status !== '☑') return 1;
          // Then by source reference length (longer = more detailed)
          return (b.source?.length || 0) - (a.source?.length || 0);
        });

        // Keep the first (best) entry, mark others for removal
        kept.push({ item: entries[0].item, status: entries[0].status });
        for (let i = 1; i < entries.length; i++) {
          linesToRemove.add(entries[i].lineNumber);
        }
      }
    }

    if (linesToRemove.size === 0) {
      return { removed: 0, kept: [], modified: false };
    }

    if (dryRun) {
      return { removed: linesToRemove.size, kept, modified: false };
    }

    // Remove duplicate lines (adjust for 0-based index)
    const newLines = lines.filter((_, index) => !linesToRemove.has(index + 1));
    writeFileSync(TODO_PATH, newLines.join('\n'), 'utf8');

    return { removed: linesToRemove.size, kept, modified: true };
  } catch (error) {
    console.error(`⚠️  todoUpdater: Failed to remove duplicates: ${error.message}`);
    return { removed: 0, kept: [], modified: false };
  }
}

/**
 * Validates TODO.md for duplicates and returns a report.
 * Useful for CI checks to prevent duplicate entries.
 *
 * @returns {{ valid: boolean, duplicateCount: number, duplicates: Array<{ item: string, count: number }>, message: string }}
 * @see SPEC-DEV §4, SPEC-OBS §3, Tech Requirements §7, Issue #71
 */
export function validateNoDuplicates() {
  const { duplicates, hasDuplicates } = findDuplicates();

  if (!hasDuplicates) {
    return {
      valid: true,
      duplicateCount: 0,
      duplicates: [],
      message: '✅ No duplicate TODO entries found.',
    };
  }

  const duplicateInfo = duplicates.map((d) => ({
    item: d.item.slice(0, MAX_DUPLICATE_DISPLAY_LENGTH) + (d.item.length > MAX_DUPLICATE_DISPLAY_LENGTH ? '...' : ''),
    count: d.entries.length,
  }));

  return {
    valid: false,
    duplicateCount: duplicates.length,
    duplicates: duplicateInfo,
    message: `❌ Found ${duplicates.length} duplicate TODO entries. Run deduplication to fix. [SPEC-DEV §4, SPEC-OBS §3]`,
  };
}

/** Exported paths for external use */
export { TODO_PATH, REPO_ROOT };
