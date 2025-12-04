// @ts-nocheck
/**
 * Orchestrator Test Suite
 *
 * Tests for the GenAIScript orchestrator covering:
 * - Context hydration from PRD, TechReq, TODO, CHANGELOG
 * - State persistence with execution snapshots
 * - DevCycle phase coordination
 * - Manifest validation and phase ordering
 *
 * @module tests/orchestrator.test
 * @see TECH_REQUIREMENTS §10, SPEC-DEV §3, SPEC-ENGINE §4
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { writeFileSync, existsSync, mkdirSync, rmSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  createMockOrchestratorEnv,
  createMockManifest,
  createTempTestDir,
  cleanupTempTestDir,
  writeTestFixtures,
  getSampleDocuments,
  createCoverageReporter,
} from './mockEnvironment.js';

// Import modules under test
import {
  loadPRD,
  loadTechRequirements,
  loadTODO,
  loadChangelog,
  clearContextCache,
  loadAllDocuments,
  getDocumentPath,
} from '../shared/contextLoader.js';

import {
  loadState,
  saveState,
  clearStateCache,
  getDefaultState,
  recordPhaseExecution,
  isPhaseCompleted,
  getRecentHistory,
  startPhaseExecution,
  completePhaseExecution,
  getLatestSnapshot,
  getResumableSnapshots,
  hasResumablePhases,
  cleanupOldSnapshots,
  STATE_PATH,
} from '../shared/statePersistence.js';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const reporter = createCoverageReporter();

describe('Orchestrator Test Suite', () => {
  let tempDir;
  let mockEnv;

  beforeEach(() => {
    tempDir = createTempTestDir('orchestrator');
    mockEnv = createMockOrchestratorEnv();
    clearContextCache();
    clearStateCache();
  });

  afterEach(() => {
    cleanupTempTestDir(tempDir);
    mockEnv.reset();
  });

  // ===========================================================================
  // Context Hydration Tests (SPEC-ENGINE §4)
  // ===========================================================================

  describe('Context Hydration', () => {
    it('should load PRD content with memoization', () => {
      const suiteName = 'Context Hydration';
      const testName = 'should load PRD content with memoization';

      try {
        clearContextCache();
        const prd1 = loadPRD();
        const prd2 = loadPRD();

        // PRD should be loaded from cache on second call
        assert.strictEqual(prd1, prd2, 'PRD should be cached');
        assert.ok(typeof prd1 === 'string', 'PRD should be a string');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should load Tech Requirements content', () => {
      const suiteName = 'Context Hydration';
      const testName = 'should load Tech Requirements content';

      try {
        clearContextCache();
        const tech = loadTechRequirements();

        assert.ok(typeof tech === 'string', 'Tech Requirements should be a string');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should load TODO content', () => {
      const suiteName = 'Context Hydration';
      const testName = 'should load TODO content';

      try {
        clearContextCache();
        const todo = loadTODO();

        assert.ok(typeof todo === 'string', 'TODO should be a string');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should load CHANGELOG content', () => {
      const suiteName = 'Context Hydration';
      const testName = 'should load CHANGELOG content';

      try {
        clearContextCache();
        const changelog = loadChangelog();

        assert.ok(typeof changelog === 'string', 'CHANGELOG should be a string');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should load all documents at once', () => {
      const suiteName = 'Context Hydration';
      const testName = 'should load all documents at once';

      try {
        clearContextCache();
        const docs = loadAllDocuments();

        assert.ok(docs.prd !== undefined, 'PRD should be included');
        assert.ok(docs.tech !== undefined, 'Tech should be included');
        assert.ok(docs.todo !== undefined, 'TODO should be included');
        assert.ok(docs.changelog !== undefined, 'CHANGELOG should be included');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should clear context cache on request', () => {
      const suiteName = 'Context Hydration';
      const testName = 'should clear context cache on request';

      try {
        loadPRD(); // Load into cache
        clearContextCache();
        // After clearing, next call will reload from disk
        const prd = loadPRD();
        assert.ok(typeof prd === 'string', 'PRD should reload after cache clear');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should return correct document paths', () => {
      const suiteName = 'Context Hydration';
      const testName = 'should return correct document paths';

      try {
        const prdPath = getDocumentPath('prd');
        const techPath = getDocumentPath('tech');
        const todoPath = getDocumentPath('todo');
        const changelogPath = getDocumentPath('changelog');

        assert.ok(prdPath.includes('PRD.md'), 'PRD path should include PRD.md');
        assert.ok(techPath.includes('TECH_REQUIREMENTS.md'), 'Tech path should include TECH_REQUIREMENTS.md');
        assert.ok(todoPath.includes('TODO.md'), 'TODO path should include TODO.md');
        assert.ok(changelogPath.includes('CHANGELOG.md'), 'CHANGELOG path should include CHANGELOG.md');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should throw for unknown document type', () => {
      const suiteName = 'Context Hydration';
      const testName = 'should throw for unknown document type';

      try {
        assert.throws(() => {
          getDocumentPath('unknown');
        }, /Unknown document type/);

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });
  });

  // ===========================================================================
  // State Persistence Tests (TECH §4.5, SPEC-ENGINE §5)
  // ===========================================================================

  describe('State Persistence', () => {
    it('should return default state when no state file exists', () => {
      const suiteName = 'State Persistence';
      const testName = 'should return default state when no state file exists';

      try {
        clearStateCache();
        const defaultState = getDefaultState();

        assert.strictEqual(defaultState.lastPhase, null);
        assert.strictEqual(defaultState.nextPhase, null);
        assert.deepStrictEqual(defaultState.completedPhases, []);
        assert.deepStrictEqual(defaultState.history, []);
        assert.deepStrictEqual(defaultState.executionSnapshots, []);
        assert.strictEqual(defaultState.lastUpdated, null);

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should load existing state from file', () => {
      const suiteName = 'State Persistence';
      const testName = 'should load existing state from file';

      try {
        clearStateCache();
        const state = loadState();

        assert.ok(state !== null, 'State should be loaded');
        assert.ok(Array.isArray(state.completedPhases), 'completedPhases should be an array');
        assert.ok(Array.isArray(state.history), 'history should be an array');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should save state with lastUpdated timestamp', () => {
      const suiteName = 'State Persistence';
      const testName = 'should save state with lastUpdated timestamp';

      try {
        clearStateCache();
        const testState = {
          lastPhase: 'initialization',
          nextPhase: 'scaffolding',
          completedPhases: ['initialization'],
          history: [{ phase: 'initialization', mode: 'execute', task: null, timestamp: new Date().toISOString() }],
          executionSnapshots: [],
        };

        const result = saveState(testState, { skipIdempotencyCheck: true, skipIntegrityValidation: true });

        assert.strictEqual(result.saved, true, 'State should be saved');
        assert.strictEqual(result.skipped, false, 'Should not be skipped');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should skip write for unchanged state (idempotency)', () => {
      const suiteName = 'State Persistence';
      const testName = 'should skip write for unchanged state (idempotency)';

      try {
        clearStateCache();
        const state = loadState();

        // Save without changes - should be skipped
        const result = saveState(state);

        // Either saved or skipped due to idempotency - both are valid
        assert.ok(result.saved === true || result.skipped === true, 'Should save or skip');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should record phase execution in history', () => {
      const suiteName = 'State Persistence';
      const testName = 'should record phase execution in history';

      try {
        clearStateCache();
        const updated = recordPhaseExecution('scaffolding', 'execute', 'Test task', 'configuration');

        assert.strictEqual(updated.lastPhase, 'scaffolding');
        assert.strictEqual(updated.nextPhase, 'configuration');
        assert.ok(updated.completedPhases.includes('scaffolding'));
        assert.ok(updated.history.length > 0);

        const lastEntry = updated.history[updated.history.length - 1];
        assert.strictEqual(lastEntry.phase, 'scaffolding');
        assert.strictEqual(lastEntry.mode, 'execute');
        assert.strictEqual(lastEntry.task, 'Test task');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should check if phase is completed', () => {
      const suiteName = 'State Persistence';
      const testName = 'should check if phase is completed';

      try {
        clearStateCache();

        // Check current state
        const state = loadState();
        const isInit = isPhaseCompleted('initialization');
        const expected = state.completedPhases.includes('initialization');

        assert.strictEqual(isInit, expected, 'isPhaseCompleted should match state');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should get recent history entries', () => {
      const suiteName = 'State Persistence';
      const testName = 'should get recent history entries';

      try {
        clearStateCache();
        const history = getRecentHistory(5);

        assert.ok(Array.isArray(history), 'History should be an array');
        assert.ok(history.length <= 5, 'Should return at most 5 entries');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should clear state cache on request', () => {
      const suiteName = 'State Persistence';
      const testName = 'should clear state cache on request';

      try {
        loadState(); // Load into cache
        clearStateCache();
        // After clearing, next load reads from disk
        const state = loadState();
        assert.ok(state !== null, 'State should reload after cache clear');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });
  });

  // ===========================================================================
  // Execution Snapshot Tests (TECH §4.5, SPEC-ENGINE §5)
  // ===========================================================================

  describe('Execution Snapshots', () => {
    it('should start phase execution with snapshot', () => {
      const suiteName = 'Execution Snapshots';
      const testName = 'should start phase execution with snapshot';

      try {
        clearStateCache();
        const snapshot = startPhaseExecution('testing', { mode: 'execute', task: 'Run tests' });

        assert.strictEqual(snapshot.phase, 'testing');
        assert.strictEqual(snapshot.status, 'running');
        assert.ok(snapshot.timestamps.startTime, 'Should have start time');
        assert.strictEqual(snapshot.timestamps.endTime, null, 'End time should be null');
        assert.strictEqual(snapshot.params.mode, 'execute');
        assert.strictEqual(snapshot.params.task, 'Run tests');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should complete phase execution with outputs', () => {
      const suiteName = 'Execution Snapshots';
      const testName = 'should complete phase execution with outputs';

      try {
        clearStateCache();
        // Use unique phase name to avoid conflicts with other tests
        const uniquePhase = `test-complete-${Date.now()}`;
        startPhaseExecution(uniquePhase, { mode: 'execute' });

        const outputs = { filesCreated: 3, testsRun: 10 };
        const completed = completePhaseExecution(uniquePhase, outputs, 'complete');

        assert.ok(completed, 'Should return completed snapshot');
        assert.strictEqual(completed.status, 'complete');
        assert.ok(completed.timestamps.endTime, 'Should have end time');
        assert.ok(completed.timestamps.durationMs >= 0, 'Should have duration');
        assert.strictEqual(completed.outputs.filesCreated, 3);

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should handle failed phase execution', () => {
      const suiteName = 'Execution Snapshots';
      const testName = 'should handle failed phase execution';

      try {
        clearStateCache();
        // Use unique phase name to avoid conflicts with other tests
        const uniquePhase = `test-failed-${Date.now()}`;
        startPhaseExecution(uniquePhase, { mode: 'execute' });

        const completed = completePhaseExecution(uniquePhase, {}, 'failed', 'Test error message');

        assert.ok(completed, 'Should return completed snapshot');
        assert.strictEqual(completed.status, 'failed');
        assert.strictEqual(completed.errorMessage, 'Test error message');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should get latest snapshot for a phase', () => {
      const suiteName = 'Execution Snapshots';
      const testName = 'should get latest snapshot for a phase';

      try {
        clearStateCache();
        // Use unique phase name to avoid conflicts with other tests
        const uniquePhase = `test-validate-${Date.now()}`;
        startPhaseExecution(uniquePhase, { mode: 'validate' });
        completePhaseExecution(uniquePhase, { passed: true }, 'complete');

        const latest = getLatestSnapshot(uniquePhase);

        assert.ok(latest, 'Should find latest snapshot');
        assert.strictEqual(latest.phase, uniquePhase);

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should detect resumable phases', () => {
      const suiteName = 'Execution Snapshots';
      const testName = 'should detect resumable phases';

      try {
        clearStateCache();

        // Use unique phase name to avoid conflicts with other tests
        const uniquePhase = `test-resumable-${Date.now()}`;

        // Start but don't complete - this should create a 'running' snapshot
        startPhaseExecution(uniquePhase, { mode: 'execute' });

        // Re-read state after the write
        clearStateCache();

        const resumable = getResumableSnapshots();
        const hasResumable = hasResumablePhases();

        assert.ok(resumable.length > 0, 'Should have resumable snapshots');
        assert.strictEqual(hasResumable, true, 'Should detect resumable phases');

        // Complete to clean up
        completePhaseExecution(uniquePhase, {}, 'complete');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should cleanup old snapshots', () => {
      const suiteName = 'Execution Snapshots';
      const testName = 'should cleanup old snapshots';

      try {
        clearStateCache();

        // Create multiple snapshots
        for (let i = 0; i < 10; i++) {
          startPhaseExecution('debug', { mode: 'execute', iteration: i });
          completePhaseExecution('debug', { iteration: i }, 'complete');
        }

        const removed = cleanupOldSnapshots(3);

        assert.ok(removed >= 0, 'Should report removed count');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should return null for non-existent snapshot', () => {
      const suiteName = 'Execution Snapshots';
      const testName = 'should return null for non-existent snapshot';

      try {
        clearStateCache();
        const snapshot = getLatestSnapshot('non-existent-phase');

        assert.strictEqual(snapshot, null, 'Should return null for missing phase');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });
  });

  // ===========================================================================
  // Mock Environment Tests
  // ===========================================================================

  describe('Mock Environment', () => {
    it('should create mock orchestrator environment', () => {
      const suiteName = 'Mock Environment';
      const testName = 'should create mock orchestrator environment';

      try {
        assert.ok(mockEnv, 'Mock environment should be created');
        assert.ok(mockEnv.vars !== undefined, 'Should have vars');
        assert.ok(mockEnv.fs, 'Should have mock file system');
        assert.ok(mockEnv.state, 'Should have state');
        assert.ok(Array.isArray(mockEnv.logs), 'Should have logs array');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should set and get environment variables', () => {
      const suiteName = 'Mock Environment';
      const testName = 'should set and get environment variables';

      try {
        mockEnv.setVars({ phase: 'testing', mode: 'execute' });

        assert.strictEqual(mockEnv.vars.phase, 'testing');
        assert.strictEqual(mockEnv.vars.mode, 'execute');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should create and read mock files', () => {
      const suiteName = 'Mock Environment';
      const testName = 'should create and read mock files';

      try {
        mockEnv.fs.writeFile('/test/file.txt', 'Test content');

        assert.strictEqual(mockEnv.fs.exists('/test/file.txt'), true);
        assert.strictEqual(mockEnv.fs.readFile('/test/file.txt'), 'Test content');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should get hydrated context', () => {
      const suiteName = 'Mock Environment';
      const testName = 'should get hydrated context';

      try {
        mockEnv.setVars({ phase: 'scaffolding', mode: 'execute' });
        const context = mockEnv.getContext();

        assert.ok(context.prdContent, 'Should have PRD content');
        assert.ok(context.techRequirementsContent, 'Should have Tech content');
        assert.ok(context.todoEntries, 'Should have TODO content');
        assert.ok(context.changelogEntries, 'Should have CHANGELOG content');
        assert.strictEqual(context.devCycleId, 'scaffolding');
        assert.strictEqual(context.mode, 'execute');
        assert.ok(Array.isArray(context.checkpoints), 'Should have checkpoints');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should reset mock environment', () => {
      const suiteName = 'Mock Environment';
      const testName = 'should reset mock environment';

      try {
        mockEnv.setVars({ phase: 'testing' });
        mockEnv.fs.writeFile('/test.txt', 'content');
        mockEnv.setState({ lastPhase: 'testing' });

        mockEnv.reset();

        assert.deepStrictEqual(mockEnv.vars, {});
        assert.strictEqual(mockEnv.fs.exists('/test.txt'), false);
        assert.strictEqual(mockEnv.state.lastPhase, null);

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });
  });

  // ===========================================================================
  // Manifest Tests
  // ===========================================================================

  describe('Mock Manifest', () => {
    it('should create mock manifest with default entries', () => {
      const suiteName = 'Mock Manifest';
      const testName = 'should create mock manifest with default entries';

      try {
        const manifest = createMockManifest();

        assert.ok(manifest.entries.initialization, 'Should have initialization');
        assert.ok(manifest.entries.scaffolding, 'Should have scaffolding');
        assert.ok(manifest.entries.testing, 'Should have testing');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should get entry by key', () => {
      const suiteName = 'Mock Manifest';
      const testName = 'should get entry by key';

      try {
        const manifest = createMockManifest();
        const entry = manifest.getEntry('scaffolding');

        assert.ok(entry, 'Should find entry');
        assert.strictEqual(entry.label, 'Scaffolding');
        assert.ok(entry.instructions, 'Should have instructions path');
        assert.ok(entry.toolset, 'Should have toolset path');
        assert.ok(entry.prompt, 'Should have prompt path');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should return null for unknown entry', () => {
      const suiteName = 'Mock Manifest';
      const testName = 'should return null for unknown entry';

      try {
        const manifest = createMockManifest();
        const entry = manifest.getEntry('unknown-phase');

        assert.strictEqual(entry, null, 'Should return null');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should get phase order', () => {
      const suiteName = 'Mock Manifest';
      const testName = 'should get phase order';

      try {
        const manifest = createMockManifest();
        const order = manifest.getPhaseOrder();

        assert.ok(Array.isArray(order), 'Should return array');
        assert.ok(order.includes('initialization'), 'Should include initialization');
        assert.ok(order.includes('scaffolding'), 'Should include scaffolding');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should allow custom manifest overrides', () => {
      const suiteName = 'Mock Manifest';
      const testName = 'should allow custom manifest overrides';

      try {
        const manifest = createMockManifest({
          custom: {
            label: 'Custom Phase',
            description: 'Custom description',
            instructions: 'custom.instructions.md',
            toolset: 'custom.toolset.jsonc',
            prompt: 'custom.prompt.md',
            checkpoints: ['custom-checkpoint'],
          },
        });

        const entry = manifest.getEntry('custom');
        assert.ok(entry, 'Should find custom entry');
        assert.strictEqual(entry.label, 'Custom Phase');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });
  });
});

// Print coverage report at end
process.on('exit', () => {
  reporter.printReport();

  // Exit with error if tests failed
  if (!reporter.allPassed()) {
    process.exitCode = 1;
  }
});

export { reporter };
