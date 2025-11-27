// @ts-nocheck
/**
 * Mock Environment for GenAIScript Tests
 *
 * Provides mocked file operations and environment variables
 * to avoid real writes during testing. Enables isolated testing
 * of orchestrator and phase scripts.
 *
 * @module tests/mockEnvironment
 * @see TECH_REQUIREMENTS §10, SPEC-DEV §3
 */

import { describe, it, beforeEach, afterEach, mock } from 'node:test';
import { existsSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));

/**
 * @typedef {Object} MockFileSystem
 * @property {Map<string, string>} files - In-memory file storage
 * @property {Set<string>} directories - In-memory directory storage
 * @property {function(string, string): void} writeFile - Mock writeFile
 * @property {function(string): string} readFile - Mock readFile
 * @property {function(string): boolean} exists - Mock exists
 * @property {function(string): void} mkdir - Mock mkdir
 * @property {function(string): void} unlink - Mock unlink
 * @property {function(): void} reset - Reset all mock state
 * @property {function(): Object} getSnapshot - Get current file system state
 */

/**
 * Creates a mock file system for isolated testing.
 *
 * @returns {MockFileSystem}
 * @see TECH_REQUIREMENTS §10
 */
export function createMockFileSystem() {
  const files = new Map();
  const directories = new Set();

  return {
    files,
    directories,

    /**
     * Mock writeFile operation.
     * @param {string} filePath - Path to write
     * @param {string} content - Content to write
     */
    writeFile(filePath, content) {
      const dir = path.dirname(filePath);
      if (!directories.has(dir)) {
        directories.add(dir);
      }
      files.set(filePath, content);
    },

    /**
     * Mock readFile operation.
     * @param {string} filePath - Path to read
     * @returns {string} File content or empty string
     */
    readFile(filePath) {
      return files.get(filePath) || '';
    },

    /**
     * Mock exists check.
     * @param {string} filePath - Path to check
     * @returns {boolean}
     */
    exists(filePath) {
      return files.has(filePath) || directories.has(filePath);
    },

    /**
     * Mock mkdir operation.
     * @param {string} dirPath - Directory to create
     */
    mkdir(dirPath) {
      directories.add(dirPath);
    },

    /**
     * Mock unlink operation.
     * @param {string} filePath - Path to remove
     */
    unlink(filePath) {
      files.delete(filePath);
    },

    /**
     * Resets all mock state.
     */
    reset() {
      files.clear();
      directories.clear();
    },

    /**
     * Gets a snapshot of current mock state.
     * @returns {Object} Current state
     */
    getSnapshot() {
      return {
        files: Object.fromEntries(files),
        directories: Array.from(directories),
      };
    },
  };
}

/**
 * @typedef {Object} MockOrchestratorEnv
 * @property {Object} vars - Environment variables mock
 * @property {MockFileSystem} fs - Mock file system
 * @property {Object} state - Mock orchestrator state
 * @property {Array} logs - Captured log output
 * @property {function(): void} reset - Reset environment
 * @property {function(Object): void} setVars - Set env.vars
 * @property {function(Object): void} setState - Set orchestrator state
 * @property {function(): Object} getContext - Get hydrated context
 */

/**
 * Creates a mock orchestrator environment.
 *
 * @param {Object} [initialState={}] - Initial orchestrator state
 * @returns {MockOrchestratorEnv}
 * @see TECH_REQUIREMENTS §4.2, SPEC-ENGINE §4
 */
export function createMockOrchestratorEnv(initialState = {}) {
  const fs = createMockFileSystem();
  const logs = [];
  let vars = {};
  let state = {
    lastPhase: null,
    nextPhase: null,
    completedPhases: [],
    history: [],
    executionSnapshots: [],
    lastUpdated: null,
    ...initialState,
  };

  // Mock console.log to capture output
  const originalConsoleLog = console.log;
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;

  return {
    get vars() {
      return vars;
    },

    get fs() {
      return fs;
    },

    get state() {
      return state;
    },

    get logs() {
      return logs;
    },

    /**
     * Resets the mock environment.
     */
    reset() {
      vars = {};
      state = {
        lastPhase: null,
        nextPhase: null,
        completedPhases: [],
        history: [],
        executionSnapshots: [],
        lastUpdated: null,
      };
      fs.reset();
      logs.length = 0;
    },

    /**
     * Sets environment variables.
     * @param {Object} newVars - Variables to set
     */
    setVars(newVars) {
      vars = { ...vars, ...newVars };
    },

    /**
     * Sets orchestrator state.
     * @param {Object} newState - State to set
     */
    setState(newState) {
      state = { ...state, ...newState };
    },

    /**
     * Gets hydrated context for phase runners.
     * @returns {Object}
     * @see SPEC-ENGINE §4
     */
    getContext() {
      return {
        prdContent: fs.readFile('docs/PRD.md') || 'Mock PRD content',
        techRequirementsContent: fs.readFile('docs/TECH_REQUIREMENTS.md') || 'Mock TECH content',
        todoEntries: fs.readFile('TODO.md') || 'Mock TODO content',
        changelogEntries: fs.readFile('CHANGELOG.md') || 'Mock CHANGELOG content',
        stateSnapshot: { ...state },
        devCycleId: vars.phase || 'test-phase',
        devCycleLabel: 'Test Phase',
        checkpoints: ['analyze', 'design', 'implement', 'validate', 'handoff'],
        mode: vars.mode || 'plan-first',
        timestamp: new Date().toISOString(),
      };
    },

    /**
     * Captures console output for testing.
     */
    captureConsole() {
      console.log = (...args) => {
        logs.push({ level: 'log', message: args.join(' ') });
      };
      console.warn = (...args) => {
        logs.push({ level: 'warn', message: args.join(' ') });
      };
      console.error = (...args) => {
        logs.push({ level: 'error', message: args.join(' ') });
      };
    },

    /**
     * Restores console output.
     */
    restoreConsole() {
      console.log = originalConsoleLog;
      console.warn = originalConsoleWarn;
      console.error = originalConsoleError;
    },
  };
}

/**
 * @typedef {Object} MockManifest
 * @property {Object} entries - DevCycle entries
 * @property {function(string): Object|null} getEntry - Get entry by key
 * @property {function(): string[]} getPhaseOrder - Get phase order
 */

/**
 * Creates a mock DevCycle manifest for testing.
 *
 * @param {Object} [overrides={}] - Override default entries
 * @returns {MockManifest}
 * @see TECH_REQUIREMENTS §4.1
 */
export function createMockManifest(overrides = {}) {
  const defaultEntries = {
    initialization: {
      label: 'Initialization',
      description: 'Bootstrap environment, audit extensions/MCP/settings.',
      instructions: '../.github/instructions/initialization.instructions.md',
      toolset: '../.github/toolsets/initialization.toolset.jsonc',
      prompt: '../.github/prompts/initialization.prompt.md',
      contexts: [],
      checkpoints: ['analyze', 'design', 'implement', 'validate', 'handoff'],
      defaultMode: 'plan-first',
    },
    scaffolding: {
      label: 'Scaffolding',
      description: 'Convert PRD/TechReq into project structure.',
      instructions: '../.github/instructions/scaffolding.instructions.md',
      toolset: '../.github/toolsets/scaffolding.toolset.jsonc',
      prompt: '../.github/prompts/scaffolding.prompt.md',
      contexts: [],
      checkpoints: ['analyze', 'design', 'implement', 'validate', 'handoff'],
      defaultMode: 'plan-first',
    },
    testing: {
      label: 'Testing',
      description: 'Configure test infra, generate plans.',
      instructions: '../.github/instructions/testing.instructions.md',
      toolset: '../.github/toolsets/testing.toolset.jsonc',
      prompt: '../.github/prompts/testing.prompt.md',
      contexts: [],
      checkpoints: ['analyze', 'design', 'implement', 'validate', 'handoff'],
      defaultMode: 'plan-first',
    },
  };

  const entries = { ...defaultEntries, ...overrides };

  return {
    entries,

    /**
     * Gets an entry by key.
     * @param {string} key - Phase key
     * @returns {Object|null}
     */
    getEntry(key) {
      return entries[key] || null;
    },

    /**
     * Gets the phase order.
     * @returns {string[]}
     */
    getPhaseOrder() {
      return Object.keys(entries);
    },
  };
}

/**
 * @typedef {Object} MockPhaseRunner
 * @property {Array} events - Collected NDJSON events
 * @property {Object} analysis - Analysis stage results
 * @property {Object} plan - Design stage results
 * @property {Object} implementation - Implementation stage results
 * @property {Object} validation - Validation stage results
 * @property {Object} reflect - Reflect stage results
 * @property {function(string, string, string, string, string, string): void} logNDJSON - Log NDJSON event
 * @property {function(): Object} getSummary - Get execution summary
 */

/**
 * Creates a mock phase runner for testing stage execution.
 *
 * @param {string} devCycleId - DevCycle identifier
 * @returns {MockPhaseRunner}
 * @see TECH_REQUIREMENTS §4.3, SPEC-ENGINE §4
 */
export function createMockPhaseRunner(devCycleId) {
  const events = [];

  return {
    events,

    analysis: {
      earsRequirements: [],
      prdCitations: [],
      techCitations: [],
      blockers: [],
      summary: '',
    },

    plan: {
      requirements: [],
      plan: [],
      risks: [],
      approvals: [],
      citations: [],
      estimatedDuration: '',
    },

    implementation: {
      status: 'complete',
      guidance: '',
      plan: {},
    },

    validation: {
      automatedTests: { passed: true, details: '' },
      manualChecks: [],
      acceptanceCriteria: [],
      followUps: [],
    },

    reflect: {
      devCycleId,
      label: '',
      status: 'complete',
      changelogEntry: {},
      todoUpdates: 0,
      nextRecommendation: '',
      timestamp: new Date().toISOString(),
      ndjsonEventsCount: 0,
    },

    /**
     * Logs an NDJSON event.
     * @param {string} phase - Phase name
     * @param {string} checkpointId - Checkpoint ID
     * @param {string} requirementId - Requirement citation
     * @param {'info'|'warn'|'error'} severity - Severity
     * @param {string} message - Message
     */
    logNDJSON(phase, checkpointId, requirementId, severity = 'info', message = '') {
      events.push({
        devCycleId,
        phase,
        requirementId,
        severity,
        checkpointId,
        timestamp: new Date().toISOString(),
        message,
      });
    },

    /**
     * Gets execution summary.
     * @returns {Object}
     */
    getSummary() {
      return {
        devCycleId,
        eventsCount: events.length,
        analysis: this.analysis,
        plan: this.plan,
        implementation: this.implementation,
        validation: this.validation,
        reflect: this.reflect,
      };
    },
  };
}

/**
 * Creates a temporary test directory.
 *
 * @param {string} suffix - Directory suffix
 * @returns {string} Path to temp directory
 */
export function createTempTestDir(suffix = '') {
  const tempDir = path.resolve(CURRENT_DIR, `__test_temp_${suffix}_${Date.now()}__`);
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
  }
  return tempDir;
}

/**
 * Cleans up a temporary test directory.
 *
 * @param {string} tempDir - Path to temp directory
 */
export function cleanupTempTestDir(tempDir) {
  if (existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

/**
 * Writes test fixture files to a directory.
 *
 * @param {string} baseDir - Base directory
 * @param {Object} fixtures - Fixture files { path: content }
 */
export function writeTestFixtures(baseDir, fixtures) {
  for (const [filePath, content] of Object.entries(fixtures)) {
    const fullPath = path.resolve(baseDir, filePath);
    const dir = path.dirname(fullPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(fullPath, content, 'utf8');
  }
}

/**
 * Reads a test fixture file.
 *
 * @param {string} baseDir - Base directory
 * @param {string} filePath - Relative file path
 * @returns {string} File content
 */
export function readTestFixture(baseDir, filePath) {
  const fullPath = path.resolve(baseDir, filePath);
  if (existsSync(fullPath)) {
    return readFileSync(fullPath, 'utf8');
  }
  return '';
}

/**
 * Mock sample core documents for testing.
 *
 * @returns {Object} Mock documents
 * @see TECH_REQUIREMENTS §4.2
 */
export function getSampleDocuments() {
  return {
    prd: `# Loaded Vibes Product Requirements Document (PRD)

## 1. Introduction
Mock PRD content for testing.

## 5. CLI Requirements
- Dashboard with synthwave UI
- DevCycle orchestration
`,
    tech: `# Loaded Vibes Technical Requirements

## 1. System Context
Mock TECH content for testing.

## 10. Validation & Traceability
- genaiscript test covers orchestrator + phase scripts with mocked env.
`,
    todo: `# TODO

## Active Items

| Status | Item | Source |
| ------ | ---- | ------ |
| ☐      | Test item 1 | TECH §10 |
`,
    changelog: `# CHANGELOG

[Feature][2025-11-27T20:00Z] Goal: Test entry -> Action: Added test
`,
  };
}

/**
 * Creates a coverage reporter for test results.
 *
 * @returns {Object} Coverage reporter
 * @see TECH_REQUIREMENTS §10
 */
export function createCoverageReporter() {
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    suites: {},
  };

  return {
    /**
     * Records a test result.
     * @param {string} suite - Test suite name
     * @param {string} test - Test name
     * @param {'passed'|'failed'|'skipped'} status - Result status
     * @param {string} [error] - Error message if failed
     */
    recordResult(suite, test, status, error = null) {
      results.total++;
      results[status]++;

      if (!results.suites[suite]) {
        results.suites[suite] = { tests: [], passed: 0, failed: 0, skipped: 0 };
      }

      results.suites[suite].tests.push({ test, status, error });
      results.suites[suite][status]++;
    },

    /**
     * Gets coverage summary.
     * @returns {Object}
     */
    getSummary() {
      const passRate = results.total > 0 ? ((results.passed / results.total) * 100).toFixed(2) : 0;

      return {
        ...results,
        passRate: `${passRate}%`,
        timestamp: new Date().toISOString(),
      };
    },

    /**
     * Prints coverage report to console.
     */
    printReport() {
      const summary = this.getSummary();
      console.log('\n════════════════════════════════════════════════════════════════');
      console.log('📊 GENAISCRIPT TEST COVERAGE REPORT');
      console.log('════════════════════════════════════════════════════════════════\n');
      console.log(`Total Tests: ${summary.total}`);
      console.log(`Passed: ${summary.passed} ✅`);
      console.log(`Failed: ${summary.failed} ❌`);
      console.log(`Skipped: ${summary.skipped} ⏭️`);
      console.log(`Pass Rate: ${summary.passRate}`);
      console.log('\nSuites:');
      for (const [name, suite] of Object.entries(summary.suites)) {
        console.log(`  ${name}: ${suite.passed}/${suite.tests.length} passed`);
        for (const test of suite.tests) {
          const icon = test.status === 'passed' ? '✅' : test.status === 'failed' ? '❌' : '⏭️';
          console.log(`    ${icon} ${test.test}`);
          if (test.error) {
            console.log(`       Error: ${test.error}`);
          }
        }
      }
      console.log('\n════════════════════════════════════════════════════════════════\n');
    },

    /**
     * Returns whether all tests passed.
     * @returns {boolean}
     */
    allPassed() {
      return results.failed === 0;
    },
  };
}

export default {
  createMockFileSystem,
  createMockOrchestratorEnv,
  createMockManifest,
  createMockPhaseRunner,
  createTempTestDir,
  cleanupTempTestDir,
  writeTestFixtures,
  readTestFixture,
  getSampleDocuments,
  createCoverageReporter,
};
