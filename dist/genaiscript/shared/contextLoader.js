// @ts-nocheck
/**
 * Context Loader Module
 *
 * Provides memoized loading of core project documents for DevCycle execution.
 * Caches PRD, TECH_REQUIREMENTS, TODO, and CHANGELOG content to minimize I/O.
 *
 * @module contextLoader
 * @see TECH_REQUIREMENTS §4.2, SPEC-ENGINE §4
 */

import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const GENAI_ROOT = path.resolve(CURRENT_DIR, '..');
const ARTIFACTS_ROOT = path.resolve(GENAI_ROOT, '..');
const REPO_ROOT = path.resolve(ARTIFACTS_ROOT, '..');

// Document paths
const PRD_PATH = path.resolve(REPO_ROOT, 'docs', 'PRD.md');
const TECH_PATH = path.resolve(REPO_ROOT, 'docs', 'TECH_REQUIREMENTS.md');
const TODO_PATH = path.resolve(REPO_ROOT, 'TODO.md');
const CHANGELOG_PATH = path.resolve(REPO_ROOT, 'CHANGELOG.md');
const SPECS_STATE_PATH = path.resolve(GENAI_ROOT, 'state', 'specs.json');

/**
 * Memoization cache for loaded documents.
 * @type {Map<string, string>}
 */
const documentCache = new Map();

/**
 * Reads a file synchronously with fallback to empty string.
 *
 * @param {string} filePath - Path to file
 * @returns {string} File content or empty string if not found
 */
function readOptionalSync(filePath) {
  try {
    if (existsSync(filePath)) {
      return readFileSync(filePath, 'utf8');
    }
  } catch (error) {
    // Log file read failures for debugging, but don't throw
    // These are optional files that may not exist or be accessible
    console.warn(`⚠️  contextLoader: Failed to read ${filePath}: ${error.message}`);
  }
  return '';
}

/**
 * Loads and caches a document.
 *
 * @param {string} key - Cache key
 * @param {string} filePath - Path to document
 * @returns {string} Document content
 */
function loadCachedDocument(key, filePath) {
  if (!documentCache.has(key)) {
    documentCache.set(key, readOptionalSync(filePath));
  }
  return documentCache.get(key) || '';
}

/**
 * Loads the PRD.md document with memoization.
 *
 * @returns {string} PRD content
 * @see TECH_REQUIREMENTS §4.2
 */
export function loadPRD() {
  return loadCachedDocument('prd', PRD_PATH);
}

/**
 * Loads the TECH_REQUIREMENTS.md document with memoization.
 *
 * @returns {string} Technical requirements content
 * @see TECH_REQUIREMENTS §4.2
 */
export function loadTechRequirements() {
  return loadCachedDocument('tech', TECH_PATH);
}

/**
 * Loads the TODO.md document with memoization.
 *
 * @returns {string} TODO content
 * @see TECH_REQUIREMENTS §4.2
 */
export function loadTODO() {
  return loadCachedDocument('todo', TODO_PATH);
}

/**
 * Loads the CHANGELOG.md document with memoization.
 *
 * @returns {string} CHANGELOG content
 * @see TECH_REQUIREMENTS §4.2
 */
export function loadChangelog() {
  return loadCachedDocument('changelog', CHANGELOG_PATH);
}

/**
 * Loads the parsed project specs (PRD + Tech) from state.
 *
 * @returns {object|null} Parsed specs or null if not found
 */
export function loadSpecs() {
  const content = loadCachedDocument('specs', SPECS_STATE_PATH);
  if (!content) return null;
  try {
    return JSON.parse(content);
  } catch (e) {
    console.error('Failed to parse specs.json', e);
    return null;
  }
}

/**
 * Clears the document cache to force fresh reads.
 * Call this at the start of each DevCycle to ensure fresh context.
 *
 * @see SPEC-ENGINE §4
 */
export function clearContextCache() {
  documentCache.clear();
}

/**
 * Loads all core documents at once.
 *
 * @returns {Object} Object containing all core documents
 */
export function loadAllDocuments() {
  return {
    prd: loadPRD(),
    tech: loadTechRequirements(),
    todo: loadTODO(),
    changelog: loadChangelog(),
    specs: loadSpecs(),
  };
}

/**
 * Gets the path to a core document.
 *
 * @param {'prd'|'tech'|'todo'|'changelog'} docType - Document type
 * @returns {string} Absolute path to the document
 */
export function getDocumentPath(docType) {
  switch (docType) {
    case 'prd':
      return PRD_PATH;
    case 'tech':
      return TECH_PATH;
    case 'todo':
      return TODO_PATH;
    case 'changelog':
      return CHANGELOG_PATH;
    default:
      throw new Error(`Unknown document type: ${docType}`);
  }
}

/** Exported paths for external use */
export { REPO_ROOT, GENAI_ROOT, ARTIFACTS_ROOT };
