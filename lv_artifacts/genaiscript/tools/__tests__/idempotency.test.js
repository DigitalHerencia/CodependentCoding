// @ts-nocheck
/**
 * Idempotency Module Unit Tests
 *
 * Tests for idempotency checks and hash comparison utilities
 * per TECH §9 and Issue #22.
 *
 * @see TECH_REQUIREMENTS §9, Issue #22
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { writeFileSync, existsSync, mkdirSync, rmSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import functions under test
import {
  computeHash,
  compareHashes,
  checkFileIdempotency,
  checkTodoEntryExists,
  checkChangelogEntryExists,
  checkStateIntegrity,
  normalizeText,
  logIdempotencyWarning,
  createIdempotencyReport,
  validateStateUpdate,
} from '../idempotency.js';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const TEST_DIR = path.resolve(CURRENT_DIR, '__test_artifacts__');

describe('Idempotency Module', () => {
  beforeEach(() => {
    // Create test directory
    if (!existsSync(TEST_DIR)) {
      mkdirSync(TEST_DIR, { recursive: true });
    }
  });

  afterEach(() => {
    // Cleanup test artifacts
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true, force: true });
    }
  });

  describe('computeHash', () => {
    it('should compute consistent SHA256 hashes', () => {
      const content = 'Hello, World!';
      const hash1 = computeHash(content);
      const hash2 = computeHash(content);

      assert.strictEqual(hash1, hash2, 'Same content should produce same hash');
      assert.strictEqual(hash1.length, 64, 'SHA256 hash should be 64 hex characters');
    });

    it('should produce different hashes for different content', () => {
      const hash1 = computeHash('Content A');
      const hash2 = computeHash('Content B');

      assert.notStrictEqual(hash1, hash2, 'Different content should produce different hashes');
    });

    it('should handle empty string', () => {
      const hash = computeHash('');
      assert.ok(hash, 'Should compute hash for empty string');
      assert.strictEqual(hash.length, 64);
    });
  });

  describe('compareHashes', () => {
    it('should detect identical content as unchanged', () => {
      const content = 'Same content';
      const result = compareHashes(content, content);

      assert.strictEqual(result.unchanged, true);
      assert.strictEqual(result.existingHash, result.newHash);
    });

    it('should detect different content as changed', () => {
      const result = compareHashes('Old content', 'New content');

      assert.strictEqual(result.unchanged, false);
      assert.notStrictEqual(result.existingHash, result.newHash);
    });
  });

  describe('checkFileIdempotency', () => {
    it('should detect unchanged file content', () => {
      const testFile = path.join(TEST_DIR, 'test-unchanged.txt');
      const content = 'Test content';
      writeFileSync(testFile, content, 'utf8');

      const result = checkFileIdempotency(testFile, content);

      assert.strictEqual(result.unchanged, true);
      assert.strictEqual(result.exists, true);
    });

    it('should detect changed file content', () => {
      const testFile = path.join(TEST_DIR, 'test-changed.txt');
      writeFileSync(testFile, 'Old content', 'utf8');

      const result = checkFileIdempotency(testFile, 'New content');

      assert.strictEqual(result.unchanged, false);
      assert.strictEqual(result.exists, true);
    });

    it('should handle non-existent file', () => {
      const testFile = path.join(TEST_DIR, 'non-existent.txt');

      const result = checkFileIdempotency(testFile, 'New content');

      assert.strictEqual(result.unchanged, false);
      assert.strictEqual(result.exists, false);
    });
  });

  describe('checkTodoEntryExists', () => {
    const sampleTodo = `# TODO

## Active Items

### Engine & Orchestration

| Status | Item | Source |
| ------ | ---- | ------ |
| ☐      | Implement orchestrator context hydration | TECH §4.2 |
| ☑      | Build phase runner template | TECH §4.3 |
`;

    it('should detect existing TODO entry', () => {
      const result = checkTodoEntryExists(sampleTodo, 'Implement orchestrator context hydration');

      assert.strictEqual(result.isIdempotent, true);
      assert.strictEqual(result.wouldDuplicate, true);
      assert.ok(result.warningMessage);
      assert.ok(result.remediation);
    });

    it('should detect completed TODO entry as existing', () => {
      const result = checkTodoEntryExists(sampleTodo, 'Build phase runner template');

      assert.strictEqual(result.isIdempotent, true);
      assert.strictEqual(result.wouldDuplicate, true);
    });

    it('should allow new TODO entry', () => {
      const result = checkTodoEntryExists(sampleTodo, 'Completely new item that does not exist');

      assert.strictEqual(result.isIdempotent, false);
      assert.strictEqual(result.wouldDuplicate, false);
      assert.strictEqual(result.warningMessage, null);
    });

    it('should handle partial matches', () => {
      const result = checkTodoEntryExists(sampleTodo, 'orchestrator context');

      assert.strictEqual(result.isIdempotent, true);
      assert.strictEqual(result.wouldDuplicate, true);
    });

    it('should handle empty TODO content', () => {
      const result = checkTodoEntryExists('', 'Any item');

      assert.strictEqual(result.wouldDuplicate, false);
    });
  });

  describe('checkChangelogEntryExists', () => {
    const sampleChangelog = `# CHANGELOG

[Feature][2025-11-27T19:45Z] Goal: Implement idempotency checks -> Action: Created module

[Update][2025-11-27T19:40Z] Goal: Complete bootstrap validation -> Action: Enhanced bootstrapper
`;

    it('should detect existing CHANGELOG entry within tolerance', () => {
      const result = checkChangelogEntryExists(
        sampleChangelog,
        'Implement idempotency checks',
        '2025-11-27T19:46Z',
        5 // 5 minute tolerance
      );

      assert.strictEqual(result.isIdempotent, true);
      assert.strictEqual(result.wouldDuplicate, true);
      assert.ok(result.warningMessage);
    });

    it('should allow entry outside time tolerance', () => {
      const result = checkChangelogEntryExists(
        sampleChangelog,
        'Implement idempotency checks',
        '2025-11-27T20:00Z', // 15 minutes later
        5
      );

      assert.strictEqual(result.wouldDuplicate, false);
    });

    it('should allow different goal even at same time', () => {
      const result = checkChangelogEntryExists(
        sampleChangelog,
        'Completely different goal',
        '2025-11-27T19:45Z',
        5
      );

      assert.strictEqual(result.wouldDuplicate, false);
    });

    it('should handle various entry types', () => {
      const changelog = '[Security][2025-11-27T10:00Z] Goal: Add firewall -> Action: Done';
      const result = checkChangelogEntryExists(changelog, 'Add firewall', '2025-11-27T10:01Z', 5);

      assert.strictEqual(result.wouldDuplicate, true);
    });
  });

  describe('checkStateIntegrity', () => {
    it('should detect duplicate history entries', () => {
      const existingState = {
        completedPhases: ['init'],
        history: [
          { phase: 'init', mode: 'execute', task: null, timestamp: '2025-11-27T19:00:00Z' }
        ],
        executionSnapshots: [],
      };

      const proposedUpdate = {
        completedPhases: ['init'],
        history: [
          { phase: 'init', mode: 'execute', task: null, timestamp: '2025-11-27T19:00:00Z' },
          { phase: 'init', mode: 'execute', task: null, timestamp: '2025-11-27T19:00:30Z' } // Same phase within 1 min
        ],
        executionSnapshots: [],
      };

      const result = checkStateIntegrity(existingState, proposedUpdate);

      assert.strictEqual(result.wouldDuplicate, true);
      assert.ok(result.warningMessage?.includes('init'));
    });

    it('should allow distinct history entries', () => {
      const existingState = {
        completedPhases: ['init'],
        history: [
          { phase: 'init', mode: 'execute', task: null, timestamp: '2025-11-27T19:00:00Z' }
        ],
        executionSnapshots: [],
      };

      const proposedUpdate = {
        completedPhases: ['init', 'scaffolding'],
        history: [
          { phase: 'init', mode: 'execute', task: null, timestamp: '2025-11-27T19:00:00Z' },
          { phase: 'scaffolding', mode: 'execute', task: null, timestamp: '2025-11-27T19:05:00Z' }
        ],
        executionSnapshots: [],
      };

      const result = checkStateIntegrity(existingState, proposedUpdate);

      assert.strictEqual(result.wouldDuplicate, false);
    });

    it('should detect duplicate execution snapshots', () => {
      const existingState = {
        executionSnapshots: [
          { phase: 'init', status: 'complete', timestamps: { startTime: '2025-11-27T19:00:00Z' } }
        ],
      };

      const proposedUpdate = {
        executionSnapshots: [
          { phase: 'init', status: 'complete', timestamps: { startTime: '2025-11-27T19:00:00Z' } },
          { phase: 'init', status: 'complete', timestamps: { startTime: '2025-11-27T19:00:00Z' } } // Duplicate
        ],
      };

      const result = checkStateIntegrity(existingState, proposedUpdate);

      assert.strictEqual(result.wouldDuplicate, true);
    });
  });

  describe('normalizeText', () => {
    it('should normalize whitespace', () => {
      const result = normalizeText('  Multiple   spaces   here  ');
      assert.strictEqual(result, 'multiple spaces here');
    });

    it('should convert to lowercase', () => {
      const result = normalizeText('MiXeD CaSe');
      assert.strictEqual(result, 'mixed case');
    });

    it('should remove special characters', () => {
      const result = normalizeText('Hello! World? @#$%');
      assert.strictEqual(result, 'hello world');
    });

    it('should handle empty string', () => {
      const result = normalizeText('');
      assert.strictEqual(result, '');
    });

    it('should handle null/undefined', () => {
      const result = normalizeText(null);
      assert.strictEqual(result, '');
    });
  });

  describe('validateStateUpdate', () => {
    it('should validate correct state update', () => {
      const existingState = {
        completedPhases: ['init'],
        history: [],
      };

      const proposedUpdate = {
        completedPhases: ['init', 'scaffolding'],
        history: [{ phase: 'scaffolding', timestamp: '2025-11-27T19:00:00Z' }],
        lastUpdated: '2025-11-27T19:00:00Z',
      };

      const result = validateStateUpdate(existingState, proposedUpdate);

      assert.strictEqual(result.valid, true);
      assert.strictEqual(result.errors.length, 0);
    });

    it('should reject invalid completedPhases type', () => {
      const result = validateStateUpdate({}, { completedPhases: 'not-an-array' });

      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some((e) => e.includes('completedPhases')));
    });

    it('should reject invalid history type', () => {
      const result = validateStateUpdate({}, { history: 'not-an-array' });

      assert.strictEqual(result.valid, false);
      assert.ok(result.errors.some((e) => e.includes('history')));
    });

    it('should warn on removed completed phases', () => {
      const existingState = {
        completedPhases: ['init', 'scaffolding'],
      };

      const proposedUpdate = {
        completedPhases: ['init'], // Removed 'scaffolding'
      };

      const result = validateStateUpdate(existingState, proposedUpdate);

      assert.strictEqual(result.valid, true);
      assert.ok(result.warnings.some((w) => w.includes('scaffolding')));
    });
  });

  describe('createIdempotencyReport', () => {
    it('should create detailed report', () => {
      const result = {
        isIdempotent: true,
        wouldDuplicate: true,
        warningMessage: 'Duplicate detected',
        remediation: 'Skip operation',
      };

      const report = createIdempotencyReport('TODO update', result, { devCycleId: 'init' });

      assert.strictEqual(report.type, 'idempotency-check');
      assert.strictEqual(report.operation, 'TODO update');
      assert.strictEqual(report.isIdempotent, true);
      assert.strictEqual(report.wouldDuplicate, true);
      assert.strictEqual(report.devCycleId, 'init');
      assert.ok(report.timestamp);
      assert.ok(report.references.includes('TECH §9'));
    });
  });

  describe('Consecutive runs yield identical outputs', () => {
    it('should produce idempotent results for TODO checks', () => {
      const todoContent = '| ☐ | Test item | TECH §9 |';

      const result1 = checkTodoEntryExists(todoContent, 'Test item');
      const result2 = checkTodoEntryExists(todoContent, 'Test item');

      assert.deepStrictEqual(result1, result2, 'Two consecutive runs should yield identical results');
    });

    it('should produce idempotent results for CHANGELOG checks', () => {
      const changelogContent = '[Feature][2025-11-27T10:00Z] Goal: Test goal';
      const timestamp = '2025-11-27T10:01Z';

      const result1 = checkChangelogEntryExists(changelogContent, 'Test goal', timestamp, 5);
      const result2 = checkChangelogEntryExists(changelogContent, 'Test goal', timestamp, 5);

      assert.deepStrictEqual(result1, result2, 'Two consecutive runs should yield identical results');
    });

    it('should produce idempotent results for state integrity checks', () => {
      const existingState = { history: [], executionSnapshots: [] };
      const proposedUpdate = { history: [{ phase: 'init', timestamp: '2025-11-27T10:00Z' }], executionSnapshots: [] };

      const result1 = checkStateIntegrity(existingState, proposedUpdate);
      const result2 = checkStateIntegrity(existingState, proposedUpdate);

      assert.deepStrictEqual(result1, result2, 'Two consecutive runs should yield identical results');
    });
  });
});
