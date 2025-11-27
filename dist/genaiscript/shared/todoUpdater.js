// @ts-nocheck
/**
 * TODO Updater Utility
 *
 * Provides helpers for reading, parsing, and updating TODO.md
 * with new items, completions, and category-based insertions.
 *
 * @module todoUpdater
 * @see PRD §5.3, TECH_REQUIREMENTS §7, SPEC-ARCH §1.2
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const GENAI_ROOT = path.resolve(CURRENT_DIR, '..');
const REPO_ROOT = path.resolve(GENAI_ROOT, '..', '..');
const TODO_PATH = path.resolve(REPO_ROOT, 'TODO.md');

/**
 * @typedef {Object} TodoItem
 * @property {string} status - Status indicator (☐, ☑, etc.)
 * @property {string} item - Item description
 * @property {string} source - Source reference (PRD, TECH, SPEC)
 */

/**
 * Loads TODO.md content synchronously.
 *
 * @returns {string} TODO content or empty string
 */
export function loadTodoContent() {
  if (!existsSync(TODO_PATH)) {
    const altPath = path.resolve(REPO_ROOT, 'todo.md');
    if (existsSync(altPath)) {
      return readFileSync(altPath, 'utf8');
    }
    return '';
  }
  return readFileSync(TODO_PATH, 'utf8');
}

/**
 * Saves content to TODO.md synchronously.
 *
 * @param {string} content - Content to write
 * @returns {void}
 */
export function saveTodoContent(content) {
  writeFileSync(TODO_PATH, content, 'utf8');
}

/**
 * Parses a TODO table row into a TodoItem object.
 *
 * @param {string} row - Table row string
 * @returns {TodoItem|null} Parsed item or null if invalid
 */
export function parseTodoRow(row) {
  const match = row.match(/^\|\s*([☐☑])\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|$/);
  if (!match) {
    return null;
  }
  return {
    status: match[1],
    item: match[2].trim(),
    source: match[3].trim(),
  };
}

/**
 * Formats a TodoItem into a markdown table row.
 *
 * @param {TodoItem} item - Item to format
 * @returns {string} Formatted table row
 */
export function formatTodoRow(item) {
  return `| ${item.status} | ${item.item} | ${item.source} |`;
}

/**
 * Adds a new TODO item to a specific category section.
 *
 * @param {string} category - Category heading (e.g., "Engine & Orchestration")
 * @param {string} itemDescription - Description of the TODO item
 * @param {string} source - Source reference (e.g., "TECH §4.2, SPEC-ARCH §1.2")
 * @returns {boolean} True if item was added successfully
 */
export function addTodoItem(category, itemDescription, source) {
  const content = loadTodoContent();
  if (!content) {
    return false;
  }

  // Find the category section
  const categoryRegex = new RegExp(`^### ${escapeRegExp(category)}\\s*$`, 'm');
  const categoryMatch = content.match(categoryRegex);

  if (!categoryMatch) {
    // Category not found, cannot add
    return false;
  }

  // Find the table in this section
  const sectionStart = categoryMatch.index + categoryMatch[0].length;
  const remaining = content.slice(sectionStart);

  // Find the table header
  const tableHeaderIdx = remaining.indexOf('| Status |');
  if (tableHeaderIdx === -1) {
    return false;
  }

  // Find the end of the table (next empty line or section)
  const tableStart = sectionStart + tableHeaderIdx;
  const afterTable = content.slice(tableStart);
  const lines = afterTable.split('\n');

  // Find last table row
  let lastRowIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('|')) {
      lastRowIdx = i;
    } else if (lines[i].trim() === '' && lastRowIdx > 0) {
      break;
    } else if (lines[i].startsWith('#') && lastRowIdx > 0) {
      break;
    }
  }

  if (lastRowIdx === -1) {
    return false;
  }

  // Insert new row after the last table row
  const newRow = formatTodoRow({
    status: '☐',
    item: itemDescription,
    source: source,
  });

  lines.splice(lastRowIdx + 1, 0, newRow);

  const updatedSection = lines.join('\n');
  const updatedContent = content.slice(0, tableStart) + updatedSection;

  saveTodoContent(updatedContent);
  return true;
}

/**
 * Marks a TODO item as completed by matching description.
 *
 * @param {string} itemDescription - Description to match (partial match allowed)
 * @returns {boolean} True if item was found and marked
 */
export function markTodoComplete(itemDescription) {
  const content = loadTodoContent();
  if (!content) {
    return false;
  }

  const searchPattern = escapeRegExp(itemDescription);
  const regex = new RegExp(`^\\|\\s*☐\\s*\\|\\s*([^|]*${searchPattern}[^|]*)\\s*\\|`, 'm');
  const match = content.match(regex);

  if (!match) {
    return false;
  }

  const updatedContent = content.replace(
    match[0],
    match[0].replace('☐', '☑')
  );

  saveTodoContent(updatedContent);
  return true;
}

/**
 * Finds all TODO items matching a search pattern.
 *
 * @param {string} pattern - Search pattern (partial match)
 * @returns {TodoItem[]} Matching items
 */
export function findTodoItems(pattern) {
  const content = loadTodoContent();
  if (!content) {
    return [];
  }

  const results = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const item = parseTodoRow(line);
    if (item && item.item.toLowerCase().includes(pattern.toLowerCase())) {
      results.push(item);
    }
  }

  return results;
}

/**
 * Gets all incomplete (☐) TODO items.
 *
 * @returns {TodoItem[]} Incomplete items
 */
export function getIncompleteTodos() {
  const content = loadTodoContent();
  if (!content) {
    return [];
  }

  const results = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const item = parseTodoRow(line);
    if (item && item.status === '☐') {
      results.push(item);
    }
  }

  return results;
}

/**
 * Escapes special regex characters in a string.
 *
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Exported paths for external use */
export { TODO_PATH, REPO_ROOT };
