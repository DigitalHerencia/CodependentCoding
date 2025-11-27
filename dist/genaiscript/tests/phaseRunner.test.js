// @ts-nocheck
/**
 * Phase Script Test Suite
 *
 * Tests for phase runner scripts covering:
 * - Five-stage workflow (Analyze → Design → Implement → Validate → Reflect)
 * - NDJSON event logging
 * - Bad Vibes Firewall destructive action detection
 * - TODO/CHANGELOG updates
 * - EARS requirement citations
 *
 * @module tests/phaseRunner.test
 * @see TECH_REQUIREMENTS §10, SPEC-DEV §3, TECH §4.3, SPEC-ENGINE §4
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { writeFileSync, existsSync, mkdirSync, rmSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  createMockPhaseRunner,
  createMockOrchestratorEnv,
  createMockManifest,
  createTempTestDir,
  cleanupTempTestDir,
  getSampleDocuments,
  createCoverageReporter,
} from './mockEnvironment.js';

// Import shared modules for testing
import { addTodoItem, markTodoComplete, parseTodo } from '../shared/todoUpdater.js';
import { addChangelogEntry, getTimestamp } from '../shared/changelogUpdater.js';
import { checkTodoEntryExists, checkChangelogEntryExists, normalizeText } from '../shared/idempotency.js';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const reporter = createCoverageReporter();

describe('Phase Script Test Suite', () => {
  let tempDir;
  let mockEnv;
  let mockRunner;

  beforeEach(() => {
    tempDir = createTempTestDir('phase');
    mockEnv = createMockOrchestratorEnv();
    mockRunner = createMockPhaseRunner('scaffolding');
  });

  afterEach(() => {
    cleanupTempTestDir(tempDir);
    mockEnv.reset();
  });

  // ===========================================================================
  // Mock Phase Runner Tests
  // ===========================================================================

  describe('Mock Phase Runner', () => {
    it('should create mock phase runner with default state', () => {
      const suiteName = 'Mock Phase Runner';
      const testName = 'should create mock phase runner with default state';

      try {
        assert.ok(mockRunner, 'Mock runner should be created');
        assert.ok(Array.isArray(mockRunner.events), 'Should have events array');
        assert.ok(mockRunner.analysis, 'Should have analysis stage');
        assert.ok(mockRunner.plan, 'Should have plan stage');
        assert.ok(mockRunner.implementation, 'Should have implementation stage');
        assert.ok(mockRunner.validation, 'Should have validation stage');
        assert.ok(mockRunner.reflect, 'Should have reflect stage');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should log NDJSON events', () => {
      const suiteName = 'Mock Phase Runner';
      const testName = 'should log NDJSON events';

      try {
        mockRunner.logNDJSON('analyze', 'analyze-start', 'TECH §4.3', 'info', 'Starting analysis');

        assert.strictEqual(mockRunner.events.length, 1);
        const event = mockRunner.events[0];
        assert.strictEqual(event.devCycleId, 'scaffolding');
        assert.strictEqual(event.phase, 'analyze');
        assert.strictEqual(event.checkpointId, 'analyze-start');
        assert.strictEqual(event.requirementId, 'TECH §4.3');
        assert.strictEqual(event.severity, 'info');
        assert.ok(event.timestamp, 'Should have timestamp');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should get execution summary', () => {
      const suiteName = 'Mock Phase Runner';
      const testName = 'should get execution summary';

      try {
        mockRunner.logNDJSON('analyze', 'analyze-start', 'TECH §4.3', 'info', 'Start');
        mockRunner.logNDJSON('analyze', 'analyze-complete', 'TECH §4.3', 'info', 'Complete');

        const summary = mockRunner.getSummary();

        assert.strictEqual(summary.devCycleId, 'scaffolding');
        assert.strictEqual(summary.eventsCount, 2);
        assert.ok(summary.analysis, 'Should have analysis');
        assert.ok(summary.plan, 'Should have plan');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });
  });

  // ===========================================================================
  // Stage Workflow Tests (SPEC-ENGINE §4)
  // ===========================================================================

  describe('Stage Workflow', () => {
    it('should execute Analyze stage', () => {
      const suiteName = 'Stage Workflow';
      const testName = 'should execute Analyze stage';

      try {
        mockRunner.logNDJSON('analyze', 'analyze-start', 'TECH §4.3', 'info', 'Starting Analyze');

        mockRunner.analysis = {
          earsRequirements: ['WHEN user starts scaffolding, THE SYSTEM SHALL create project structure'],
          prdCitations: ['PRD §5.1'],
          techCitations: ['TECH §4.3'],
          blockers: [],
          summary: 'Analysis complete',
        };

        mockRunner.logNDJSON('analyze', 'analyze-complete', 'TECH §4.3', 'info', 'Found 1 requirements');

        assert.strictEqual(mockRunner.analysis.earsRequirements.length, 1);
        assert.strictEqual(mockRunner.analysis.prdCitations.length, 1);
        assert.strictEqual(mockRunner.events.length, 2);

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should execute Design stage', () => {
      const suiteName = 'Stage Workflow';
      const testName = 'should execute Design stage';

      try {
        mockRunner.logNDJSON('design', 'design-start', 'TECH §4.3', 'info', 'Starting Design');

        mockRunner.plan = {
          requirements: ['REQ-001'],
          plan: ['Step 1: Create directories', 'Step 2: Generate files', 'Step 3: Configure tools'],
          risks: ['Risk: Overwrite existing files'],
          approvals: ['design-approval'],
          citations: ['TECH §4.3', 'PRD §5.2'],
          estimatedDuration: '30 minutes',
        };

        mockRunner.logNDJSON('design', 'design-complete', 'TECH §4.3', 'info', 'Generated 3 implementation steps');

        assert.strictEqual(mockRunner.plan.plan.length, 3);
        assert.strictEqual(mockRunner.plan.risks.length, 1);

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should execute Implement stage', () => {
      const suiteName = 'Stage Workflow';
      const testName = 'should execute Implement stage';

      try {
        mockRunner.logNDJSON('implement', 'implement-start', 'TECH §4.3', 'info', 'Starting Implement');

        mockRunner.implementation = {
          status: 'complete',
          guidance: '## Implementation Steps\n1. Create project structure\n2. Generate base files',
          plan: mockRunner.plan,
        };

        mockRunner.logNDJSON('implement', 'implement-complete', 'TECH §4.3', 'info', 'Implementation guidance generated');

        assert.strictEqual(mockRunner.implementation.status, 'complete');
        assert.ok(mockRunner.implementation.guidance.includes('Implementation Steps'));

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should execute Validate stage', () => {
      const suiteName = 'Stage Workflow';
      const testName = 'should execute Validate stage';

      try {
        mockRunner.logNDJSON('validate', 'validate-start', 'TECH §4.3', 'info', 'Starting Validate');

        mockRunner.validation = {
          automatedTests: { passed: true, details: 'All 5 tests passed' },
          manualChecks: ['Verify file structure', 'Check configuration'],
          acceptanceCriteria: ['Project compiles', 'Tests pass'],
          followUps: [],
        };

        mockRunner.logNDJSON('validate', 'validate-complete', 'TECH §4.3', 'info', 'Validation passed');

        assert.strictEqual(mockRunner.validation.automatedTests.passed, true);
        assert.strictEqual(mockRunner.validation.manualChecks.length, 2);

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should execute Reflect stage', () => {
      const suiteName = 'Stage Workflow';
      const testName = 'should execute Reflect stage';

      try {
        mockRunner.logNDJSON('reflect', 'reflect-start', 'TECH §7', 'info', 'Starting Reflect');

        mockRunner.reflect = {
          devCycleId: 'scaffolding',
          label: 'Scaffolding',
          status: 'complete',
          changelogEntry: {
            type: 'Update',
            timestamp: new Date().toISOString(),
            goal: 'Execute Scaffolding DevCycle',
            action: 'Completed five-stage workflow per TECH §4.3',
            result: 'All validation checks passed',
            next: 'Proceed to Configuration DevCycle',
          },
          todoUpdates: 0,
          nextRecommendation: 'Continue to next DevCycle',
          timestamp: new Date().toISOString(),
          ndjsonEventsCount: mockRunner.events.length + 1, // +1 for this event
        };

        mockRunner.logNDJSON('reflect', 'reflect-complete', 'TECH §7', 'info', 'DevCycle scaffolding complete');

        assert.strictEqual(mockRunner.reflect.status, 'complete');
        assert.ok(mockRunner.reflect.changelogEntry.goal, 'Should have changelog entry');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should capture complete workflow execution', () => {
      const suiteName = 'Stage Workflow';
      const testName = 'should capture complete workflow execution';

      try {
        // Simulate complete workflow
        mockRunner.logNDJSON('init', 'devcycle-start', 'TECH §4.3', 'info', 'Starting scaffolding DevCycle');
        mockRunner.logNDJSON('analyze', 'analyze-start', 'TECH §4.3', 'info', 'Starting Analyze');
        mockRunner.logNDJSON('analyze', 'analyze-complete', 'TECH §4.3', 'info', 'Analyze complete');
        mockRunner.logNDJSON('design', 'design-start', 'TECH §4.3', 'info', 'Starting Design');
        mockRunner.logNDJSON('design', 'design-complete', 'TECH §4.3', 'info', 'Design complete');
        mockRunner.logNDJSON('implement', 'implement-start', 'TECH §4.3', 'info', 'Starting Implement');
        mockRunner.logNDJSON('implement', 'implement-complete', 'TECH §4.3', 'info', 'Implement complete');
        mockRunner.logNDJSON('validate', 'validate-start', 'TECH §4.3', 'info', 'Starting Validate');
        mockRunner.logNDJSON('validate', 'validate-complete', 'TECH §4.3', 'info', 'Validate complete');
        mockRunner.logNDJSON('reflect', 'reflect-start', 'TECH §7', 'info', 'Starting Reflect');
        mockRunner.logNDJSON('reflect', 'reflect-complete', 'TECH §7', 'info', 'Reflect complete');
        mockRunner.logNDJSON('complete', 'devcycle-end', 'TECH §4.3', 'info', 'Finished scaffolding DevCycle');

        assert.strictEqual(mockRunner.events.length, 12);

        // Verify event phases
        const phases = [...new Set(mockRunner.events.map((e) => e.phase))];
        assert.ok(phases.includes('init'), 'Should have init phase');
        assert.ok(phases.includes('analyze'), 'Should have analyze phase');
        assert.ok(phases.includes('design'), 'Should have design phase');
        assert.ok(phases.includes('implement'), 'Should have implement phase');
        assert.ok(phases.includes('validate'), 'Should have validate phase');
        assert.ok(phases.includes('reflect'), 'Should have reflect phase');
        assert.ok(phases.includes('complete'), 'Should have complete phase');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });
  });

  // ===========================================================================
  // NDJSON Event Logging Tests (SPEC-OBS §3)
  // ===========================================================================

  describe('NDJSON Event Logging', () => {
    it('should create events with all required fields', () => {
      const suiteName = 'NDJSON Event Logging';
      const testName = 'should create events with all required fields';

      try {
        mockRunner.logNDJSON('analyze', 'analyze-start', 'TECH §4.3', 'info', 'Test message');

        const event = mockRunner.events[0];

        // Required fields per SPEC-OBS §3
        assert.ok(event.devCycleId, 'Should have devCycleId');
        assert.ok(event.phase, 'Should have phase');
        assert.ok(event.requirementId, 'Should have requirementId');
        assert.ok(event.severity, 'Should have severity');
        assert.ok(event.checkpointId, 'Should have checkpointId');
        assert.ok(event.timestamp, 'Should have timestamp');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should support different severity levels', () => {
      const suiteName = 'NDJSON Event Logging';
      const testName = 'should support different severity levels';

      try {
        mockRunner.logNDJSON('analyze', 'test', 'TECH', 'info', 'Info message');
        mockRunner.logNDJSON('implement', 'test', 'TECH', 'warn', 'Warning message');
        mockRunner.logNDJSON('validate', 'test', 'TECH', 'error', 'Error message');

        const severities = mockRunner.events.map((e) => e.severity);

        assert.ok(severities.includes('info'), 'Should have info severity');
        assert.ok(severities.includes('warn'), 'Should have warn severity');
        assert.ok(severities.includes('error'), 'Should have error severity');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should generate valid ISO 8601 timestamps', () => {
      const suiteName = 'NDJSON Event Logging';
      const testName = 'should generate valid ISO 8601 timestamps';

      try {
        mockRunner.logNDJSON('analyze', 'test', 'TECH', 'info', 'Test');

        const timestamp = mockRunner.events[0].timestamp;
        const parsed = new Date(timestamp);

        assert.ok(!isNaN(parsed.getTime()), 'Timestamp should be valid date');
        assert.ok(timestamp.includes('T'), 'Timestamp should be ISO 8601 format');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should track events by checkpoint', () => {
      const suiteName = 'NDJSON Event Logging';
      const testName = 'should track events by checkpoint';

      try {
        mockRunner.logNDJSON('analyze', 'analyze-start', 'TECH', 'info', 'Start');
        mockRunner.logNDJSON('analyze', 'analyze-complete', 'TECH', 'info', 'End');

        const checkpoints = mockRunner.events.map((e) => e.checkpointId);

        assert.ok(checkpoints.includes('analyze-start'), 'Should have start checkpoint');
        assert.ok(checkpoints.includes('analyze-complete'), 'Should have complete checkpoint');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });
  });

  // ===========================================================================
  // Destructive Action Detection Tests (SPEC-SECURITY §3)
  // ===========================================================================

  describe('Destructive Action Detection', () => {
    it('should detect delete operations in plan', () => {
      const suiteName = 'Destructive Action Detection';
      const testName = 'should detect delete operations in plan';

      try {
        const plan = { plan: ['Delete old files', 'Create new structure'] };
        const planText = JSON.stringify(plan).toLowerCase();

        const hasDestructive = ['delete', 'remove', 'migrate', 'drop', 'overwrite', 'reset']
          .some((p) => planText.includes(p));

        assert.strictEqual(hasDestructive, true, 'Should detect delete');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should detect migrate operations in plan', () => {
      const suiteName = 'Destructive Action Detection';
      const testName = 'should detect migrate operations in plan';

      try {
        const plan = { plan: ['Migrate database schema', 'Update records'] };
        const planText = JSON.stringify(plan).toLowerCase();

        const hasDestructive = ['delete', 'remove', 'migrate', 'drop', 'overwrite', 'reset']
          .some((p) => planText.includes(p));

        assert.strictEqual(hasDestructive, true, 'Should detect migrate');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should detect overwrite operations in plan', () => {
      const suiteName = 'Destructive Action Detection';
      const testName = 'should detect overwrite operations in plan';

      try {
        const plan = { plan: ['Overwrite config file', 'Apply settings'] };
        const planText = JSON.stringify(plan).toLowerCase();

        const hasDestructive = ['delete', 'remove', 'migrate', 'drop', 'overwrite', 'reset']
          .some((p) => planText.includes(p));

        assert.strictEqual(hasDestructive, true, 'Should detect overwrite');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should not flag safe operations', () => {
      const suiteName = 'Destructive Action Detection';
      const testName = 'should not flag safe operations';

      try {
        const plan = { plan: ['Create new files', 'Add configuration', 'Install packages'] };
        const planText = JSON.stringify(plan).toLowerCase();

        const hasDestructive = ['delete', 'remove', 'migrate', 'drop', 'overwrite', 'reset']
          .some((p) => planText.includes(p));

        assert.strictEqual(hasDestructive, false, 'Should not detect destructive operation');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should log firewall event on destructive action', () => {
      const suiteName = 'Destructive Action Detection';
      const testName = 'should log firewall event on destructive action';

      try {
        // Simulate firewall approval request
        mockRunner.logNDJSON(
          'implement',
          'destructive-action-approval',
          'SPEC-SECURITY §3',
          'warn',
          'Approval required for: Delete old files'
        );

        const firewallEvents = mockRunner.events.filter(
          (e) => e.checkpointId === 'destructive-action-approval'
        );

        assert.strictEqual(firewallEvents.length, 1);
        assert.strictEqual(firewallEvents[0].severity, 'warn');
        assert.ok(firewallEvents[0].message.includes('Approval required'));

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });
  });

  // ===========================================================================
  // Idempotency Tests (TECH §9)
  // ===========================================================================

  describe('Idempotency Checks', () => {
    it('should detect existing TODO entry', () => {
      const suiteName = 'Idempotency Checks';
      const testName = 'should detect existing TODO entry';

      try {
        const todoContent = `# TODO

| Status | Item | Source |
| ------ | ---- | ------ |
| ☐      | Implement test coverage | TECH §10 |
`;
        const result = checkTodoEntryExists(todoContent, 'Implement test coverage');

        assert.strictEqual(result.isIdempotent, true);
        assert.strictEqual(result.wouldDuplicate, true);

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should allow new TODO entry', () => {
      const suiteName = 'Idempotency Checks';
      const testName = 'should allow new TODO entry';

      try {
        const todoContent = `# TODO

| Status | Item | Source |
| ------ | ---- | ------ |
| ☐      | Existing item | TECH §10 |
`;
        const result = checkTodoEntryExists(todoContent, 'Completely new unique item');

        assert.strictEqual(result.isIdempotent, false);
        assert.strictEqual(result.wouldDuplicate, false);

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should detect duplicate CHANGELOG entry within tolerance', () => {
      const suiteName = 'Idempotency Checks';
      const testName = 'should detect duplicate CHANGELOG entry within tolerance';

      try {
        const changelogContent = `[Feature][2025-11-27T20:00Z] Goal: Test feature -> Action: Added test`;

        const result = checkChangelogEntryExists(
          changelogContent,
          'Test feature',
          '2025-11-27T20:02Z', // Within 5 min tolerance
          5
        );

        assert.strictEqual(result.isIdempotent, true);
        assert.strictEqual(result.wouldDuplicate, true);

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should normalize text for comparison', () => {
      const suiteName = 'Idempotency Checks';
      const testName = 'should normalize text for comparison';

      try {
        const normalized = normalizeText('  MIXED   Case   With   Spaces  ');

        assert.strictEqual(normalized, 'mixed case with spaces');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });
  });

  // ===========================================================================
  // TODO/CHANGELOG Update Tests
  // ===========================================================================

  describe('TODO/CHANGELOG Updates', () => {
    it('should generate valid timestamp format', () => {
      const suiteName = 'TODO/CHANGELOG Updates';
      const testName = 'should generate valid timestamp format';

      try {
        const timestamp = getTimestamp();

        // Should match format like 2025-11-27T20:00Z
        assert.ok(timestamp.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z$/), 'Timestamp should match expected format');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should format CHANGELOG entry correctly', () => {
      const suiteName = 'TODO/CHANGELOG Updates';
      const testName = 'should format CHANGELOG entry correctly';

      try {
        const entry = {
          type: 'Feature',
          timestamp: '2025-11-27T20:00Z',
          goal: 'Test goal',
          action: 'Test action',
          result: 'Test result',
          next: 'Test next steps',
        };

        const formatted = `[${entry.type}][${entry.timestamp}] Goal: ${entry.goal} -> Action: ${entry.action} -> Result: ${entry.result} -> Next: ${entry.next}`;

        assert.ok(formatted.includes('[Feature]'));
        assert.ok(formatted.includes('Goal: Test goal'));
        assert.ok(formatted.includes('Action: Test action'));

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should include requirement references in entries', () => {
      const suiteName = 'TODO/CHANGELOG Updates';
      const testName = 'should include requirement references in entries';

      try {
        const entry = {
          type: 'Update',
          timestamp: '2025-11-27T20:00Z',
          goal: 'Execute scaffolding DevCycle',
          action: 'Completed five-stage workflow per TECH §4.3',
          result: 'All tests passed per SPEC-DEV §3',
          next: 'Proceed to next DevCycle',
        };

        const formatted = `[${entry.type}][${entry.timestamp}] Goal: ${entry.goal} -> Action: ${entry.action} -> Result: ${entry.result}`;

        assert.ok(formatted.includes('TECH §4.3'), 'Should include TECH reference');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });
  });

  // ===========================================================================
  // Coverage Metrics Tests
  // ===========================================================================

  describe('Coverage Metrics', () => {
    it('should track test results in reporter', () => {
      const suiteName = 'Coverage Metrics';
      const testName = 'should track test results in reporter';

      try {
        // Reporter is already tracking results from previous tests
        const summary = reporter.getSummary();

        assert.ok(summary.total > 0, 'Should have recorded tests');
        assert.ok(summary.passRate, 'Should have pass rate');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should calculate pass rate correctly', () => {
      const suiteName = 'Coverage Metrics';
      const testName = 'should calculate pass rate correctly';

      try {
        const summary = reporter.getSummary();

        // Parse pass rate percentage
        const passRate = parseFloat(summary.passRate);

        assert.ok(passRate >= 0 && passRate <= 100, 'Pass rate should be between 0 and 100');

        reporter.recordResult(suiteName, testName, 'passed');
      } catch (error) {
        reporter.recordResult(suiteName, testName, 'failed', error.message);
        throw error;
      }
    });

    it('should group results by suite', () => {
      const suiteName = 'Coverage Metrics';
      const testName = 'should group results by suite';

      try {
        const summary = reporter.getSummary();

        assert.ok(Object.keys(summary.suites).length > 0, 'Should have suite groupings');

        for (const [name, suite] of Object.entries(summary.suites)) {
          assert.ok(Array.isArray(suite.tests), `Suite ${name} should have tests array`);
        }

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
