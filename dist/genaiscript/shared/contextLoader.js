// @ts-nocheck
/**
 * Context Loader Utility
 *
 * Provides memoized, synchronous access to core project documents
 * (PRD.md, TECH_REQUIREMENTS.md, TODO.md, CHANGELOG.md) for use
 * in GenAIScript orchestrator and phase runners.
 *
 * @module contextLoader
 * @see PRD §5, TECH_REQUIREMENTS §2, SPEC-ARCH §1.2
 */

import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const GENAI_ROOT = path.resolve(CURRENT_DIR, '..');
const REPO_ROOT = path.resolve(GENAI_ROOT, '..', '..');

/** @type {Map<string, string>} */
const fileCache = new Map();

/**
 * Clears the memoization cache. Call this when files may have changed
 * and you need fresh reads.
 *
 * @returns {void}
 */
export function clearContextCache() {
  fileCache.clear();
}

/**
 * Reads a file synchronously with memoization.
 * Returns empty string if file does not exist.
 *
 * @param {string} filePath - Absolute path to the file
 * @returns {string} File contents or empty string
 */
export function readFileMemoized(filePath) {
  if (fileCache.has(filePath)) {
    return fileCache.get(filePath);
  }

  let content = '';
  if (existsSync(filePath)) {
    try {
      content = readFileSync(filePath, 'utf8');
    } catch (error) {
      content = '';
    }
  }

  fileCache.set(filePath, content);
  return content;
}

/**
 * Loads the PRD.md document.
 *
 * @returns {string} PRD contents or empty string
 */
export function loadPRD() {
  return readFileMemoized(path.resolve(REPO_ROOT, 'docs', 'PRD.md'));
}

/**
 * Loads the TECH_REQUIREMENTS.md document.
 *
 * @returns {string} Tech Requirements contents or empty string
 */
export function loadTechRequirements() {
  return readFileMemoized(path.resolve(REPO_ROOT, 'docs', 'TECH_REQUIREMENTS.md'));
}

/**
 * Loads the TODO.md document. Checks both cases (TODO.md and todo.md).
 *
 * @returns {string} TODO contents or empty string
 */
export function loadTODO() {
  return readFileMemoized(resolveTodoPath());
}

/**
 * Resolves the path to TODO.md, checking both cases.
 *
 * @returns {string} Resolved path to TODO.md
 */
export function resolveTodoPath() {
  const todoUpper = path.resolve(REPO_ROOT, 'TODO.md');
  const todoLower = path.resolve(REPO_ROOT, 'todo.md');

  if (existsSync(todoUpper)) {
    return todoUpper;
  }
  return todoLower;
}

/**
 * Loads the CHANGELOG.md document.
 *
 * @returns {string} CHANGELOG contents or empty string
 */
export function loadChangelog() {
  return readFileMemoized(path.resolve(REPO_ROOT, 'CHANGELOG.md'));
}

/**
 * Loads the README.md document.
 *
 * @returns {string} README contents or empty string
 */
export function loadReadme() {
  return readFileMemoized(path.resolve(REPO_ROOT, 'README.md'));
}

/**
 * Loads a spec document from the spec/ directory.
 *
 * @param {string} specName - Name of the spec file (e.g., 'architecture.spec.md')
 * @returns {string} Spec contents or empty string
 */
export function loadSpec(specName) {
  return readFileMemoized(path.resolve(REPO_ROOT, 'spec', specName));
}

/**
 * Loads all core context documents at once.
 *
 * @returns {{prd: string, tech: string, todo: string, changelog: string, readme: string}}
 */
export function loadAllContext() {
  return {
    prd: loadPRD(),
    tech: loadTechRequirements(),
    todo: loadTODO(),
    changelog: loadChangelog(),
    readme: loadReadme(),
  };
}

/**
 * Extracts a section from a markdown document by heading.
 *
 * @param {string} content - Markdown content
 * @param {string} heading - Heading text to find (without # prefix)
 * @param {number} [level=2] - Heading level (number of # characters)
 * @returns {string} Section content or empty string if not found
 */
export function extractSection(content, heading, level = 2) {
  const prefix = '#'.repeat(level) + ' ';
  const regex = new RegExp(
    `^${prefix}${escapeRegExp(heading)}\\s*$`,
    'm'
  );
  const match = content.match(regex);
  if (!match) {
    return '';
  }

  const startIdx = match.index + match[0].length;
  const nextHeadingRegex = new RegExp(`^#{1,${level}} `, 'm');
  const remaining = content.slice(startIdx);
  const nextMatch = remaining.match(nextHeadingRegex);

  if (nextMatch) {
    return remaining.slice(0, nextMatch.index).trim();
  }
  return remaining.trim();
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

/** Exported constants for external use */
export { REPO_ROOT, GENAI_ROOT };
