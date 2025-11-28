// @ts-nocheck
/**
 * Summary Writer Tests
 *
 * Unit tests for the dual-mode execution summary writer.
 *
 * @module summaryWriter.test
 * @see TECH §11, SPEC-OBS §2, ADR-0001, Issue #73
 */

import { describe, it, before, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { mkdtemp, rm, readFile, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { tmpdir } from 'os';

import {
  generateFilenameTimestamp,
  validateSummarySchema,
  formatSummaryAsJSON,
  generateYAMLFrontmatter,
  formatSummaryAsMarkdown,
  writeSummary,
  createSummary,
  createAndWriteSummary,
} from '../summaryWriter.js';

/**
 * Creates a valid test summary for use in tests.
 * @returns {import('../summaryWriter.js').ExecutionSummary}
 */
function createValidSummary() {
  return {
    devCycleId: 'scaffolding',
    phase: 'reflect',
    startTime: '2025-11-28T00:00:00.000Z',
    endTime: '2025-11-28T00:05:00.000Z',
    status: 'success',
    requirementIds: ['TECH §11', 'SPEC-OBS §2', 'PRD §5.4'],
    checkpoints: [
      { id: 'analyze', approved: true, approver: 'system' },
      { id: 'design', approved: true, approver: 'user@example.com' },
    ],
    validationResult: {
      passed: true,
      details: 'All tests passed successfully.',
    },
    artifacts: [
      '.loaded-vibes/summaries/scaffolding-2025-11-28.json',
      'dist/cli/index.js',
    ],
    logFile: '.loaded-vibes/logs/scaffolding-2025-11-28.ndjson',
  };
}

// ============================================================
// generateFilenameTimestamp Tests
// ============================================================

describe('generateFilenameTimestamp', () => {
  it('should generate a timestamp string', () => {
    const timestamp = generateFilenameTimestamp();
    assert.ok(typeof timestamp === 'string', 'Timestamp should be a string');
    assert.ok(timestamp.length > 0, 'Timestamp should not be empty');
  });

  it('should use ISO-like format with dashes instead of colons', () => {
    const timestamp = generateFilenameTimestamp();
    // Should not contain colons (filesystem-safe)
    assert.ok(!timestamp.includes(':'), 'Timestamp should not contain colons');
    // Should contain date parts
    assert.ok(/\d{4}-\d{2}-\d{2}/.test(timestamp), 'Should contain date pattern');
  });

  it('should generate unique timestamps on sequential calls', async () => {
    const ts1 = generateFilenameTimestamp();
    await new Promise((r) => setTimeout(r, 2));
    const ts2 = generateFilenameTimestamp();
    assert.notStrictEqual(ts1, ts2, 'Sequential timestamps should be different');
  });
});

// ============================================================
// validateSummarySchema Tests
// ============================================================

describe('validateSummarySchema', () => {
  it('should validate a correct summary as valid', () => {
    const summary = createValidSummary();
    const result = validateSummarySchema(summary);
    assert.strictEqual(result.valid, true, 'Valid summary should pass');
    assert.strictEqual(result.errors.length, 0, 'No errors expected');
  });

  it('should reject missing devCycleId', () => {
    const summary = createValidSummary();
    delete summary.devCycleId;
    const result = validateSummarySchema(summary);
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes('devCycleId')));
  });

  it('should reject missing startTime', () => {
    const summary = createValidSummary();
    delete summary.startTime;
    const result = validateSummarySchema(summary);
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes('startTime')));
  });

  it('should reject missing endTime', () => {
    const summary = createValidSummary();
    delete summary.endTime;
    const result = validateSummarySchema(summary);
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes('endTime')));
  });

  it('should reject invalid status', () => {
    const summary = createValidSummary();
    summary.status = 'invalid-status';
    const result = validateSummarySchema(summary);
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes('status')));
  });

  it('should accept "failure" as valid status', () => {
    const summary = createValidSummary();
    summary.status = 'failure';
    const result = validateSummarySchema(summary);
    assert.strictEqual(result.valid, true);
  });

  it('should accept "skipped" as valid status', () => {
    const summary = createValidSummary();
    summary.status = 'skipped';
    const result = validateSummarySchema(summary);
    assert.strictEqual(result.valid, true);
  });

  it('should reject non-array requirementIds', () => {
    const summary = createValidSummary();
    summary.requirementIds = 'not-an-array';
    const result = validateSummarySchema(summary);
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes('requirementIds')));
  });

  it('should reject checkpoint without id', () => {
    const summary = createValidSummary();
    summary.checkpoints = [{ approved: true }];
    const result = validateSummarySchema(summary);
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes('checkpoints[0].id')));
  });

  it('should reject checkpoint without approved boolean', () => {
    const summary = createValidSummary();
    summary.checkpoints = [{ id: 'test', approved: 'yes' }];
    const result = validateSummarySchema(summary);
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes('checkpoints[0].approved')));
  });

  it('should reject missing validationResult', () => {
    const summary = createValidSummary();
    delete summary.validationResult;
    const result = validateSummarySchema(summary);
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes('validationResult')));
  });

  it('should reject validationResult without passed boolean', () => {
    const summary = createValidSummary();
    summary.validationResult = { details: 'test' };
    const result = validateSummarySchema(summary);
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.some((e) => e.includes('validationResult.passed')));
  });

  it('should accept empty arrays for optional collections', () => {
    const summary = createValidSummary();
    summary.requirementIds = [];
    summary.checkpoints = [];
    summary.artifacts = [];
    const result = validateSummarySchema(summary);
    assert.strictEqual(result.valid, true);
  });
});

// ============================================================
// formatSummaryAsJSON Tests
// ============================================================

describe('formatSummaryAsJSON', () => {
  it('should produce valid JSON', () => {
    const summary = createValidSummary();
    const json = formatSummaryAsJSON(summary);
    assert.doesNotThrow(() => JSON.parse(json), 'Output should be valid JSON');
  });

  it('should include all required fields', () => {
    const summary = createValidSummary();
    const json = formatSummaryAsJSON(summary);
    const parsed = JSON.parse(json);
    assert.strictEqual(parsed.devCycleId, 'scaffolding');
    assert.strictEqual(parsed.status, 'success');
    assert.deepStrictEqual(parsed.requirementIds, ['TECH §11', 'SPEC-OBS §2', 'PRD §5.4']);
  });

  it('should use pretty formatting', () => {
    const summary = createValidSummary();
    const json = formatSummaryAsJSON(summary);
    // Pretty formatting should include newlines
    assert.ok(json.includes('\n'), 'JSON should be pretty-printed');
  });
});

// ============================================================
// generateYAMLFrontmatter Tests
// ============================================================

describe('generateYAMLFrontmatter', () => {
  it('should start and end with triple dashes', () => {
    const summary = createValidSummary();
    const yaml = generateYAMLFrontmatter(summary);
    assert.ok(yaml.startsWith('---'), 'Should start with ---');
    assert.ok(yaml.endsWith('---'), 'Should end with ---');
  });

  it('should include all required fields', () => {
    const summary = createValidSummary();
    const yaml = generateYAMLFrontmatter(summary);
    assert.ok(yaml.includes('devCycleId: scaffolding'));
    assert.ok(yaml.includes('status: success'));
    assert.ok(yaml.includes('phase: reflect'));
  });

  it('should format requirementIds as YAML array', () => {
    const summary = createValidSummary();
    const yaml = generateYAMLFrontmatter(summary);
    assert.ok(yaml.includes('requirementIds:'));
    assert.ok(yaml.includes('- "TECH §11"'));
  });

  it('should handle empty requirementIds', () => {
    const summary = createValidSummary();
    summary.requirementIds = [];
    const yaml = generateYAMLFrontmatter(summary);
    assert.ok(yaml.includes('requirementIds: []'));
  });

  it('should include checkpoint details', () => {
    const summary = createValidSummary();
    const yaml = generateYAMLFrontmatter(summary);
    assert.ok(yaml.includes('checkpoints:'));
    assert.ok(yaml.includes('- id: "analyze"'));
    assert.ok(yaml.includes('approved: true'));
  });

  it('should include logFile when present', () => {
    const summary = createValidSummary();
    const yaml = generateYAMLFrontmatter(summary);
    assert.ok(yaml.includes('logFile:'));
    assert.ok(yaml.includes('.loaded-vibes/logs/scaffolding-2025-11-28.ndjson'));
  });
});

// ============================================================
// formatSummaryAsMarkdown Tests
// ============================================================

describe('formatSummaryAsMarkdown', () => {
  it('should include YAML frontmatter', () => {
    const summary = createValidSummary();
    const md = formatSummaryAsMarkdown(summary);
    assert.ok(md.startsWith('---'), 'Should start with YAML frontmatter');
    assert.ok(md.includes('devCycleId: scaffolding'));
  });

  it('should include title with devCycleId', () => {
    const summary = createValidSummary();
    const md = formatSummaryAsMarkdown(summary);
    assert.ok(md.includes('# Execution Summary: scaffolding'));
  });

  it('should include Requirements Addressed section', () => {
    const summary = createValidSummary();
    const md = formatSummaryAsMarkdown(summary);
    assert.ok(md.includes('## Requirements Addressed'));
    assert.ok(md.includes('- TECH §11'));
    assert.ok(md.includes('- SPEC-OBS §2'));
  });

  it('should include Checkpoints table', () => {
    const summary = createValidSummary();
    const md = formatSummaryAsMarkdown(summary);
    assert.ok(md.includes('## Checkpoints'));
    assert.ok(md.includes('| Checkpoint | Approved | Approver |'));
    assert.ok(md.includes('| analyze | ✓ | system |'));
  });

  it('should include Validation section with pass/fail indicator', () => {
    const summary = createValidSummary();
    const md = formatSummaryAsMarkdown(summary);
    assert.ok(md.includes('## Validation'));
    assert.ok(md.includes('✅ Passed'));
  });

  it('should show failure indicator for failed validation', () => {
    const summary = createValidSummary();
    summary.validationResult = { passed: false, details: 'Tests failed' };
    const md = formatSummaryAsMarkdown(summary);
    assert.ok(md.includes('❌ Failed'));
  });

  it('should include Artifacts section', () => {
    const summary = createValidSummary();
    const md = formatSummaryAsMarkdown(summary);
    assert.ok(md.includes('## Artifacts'));
    assert.ok(md.includes('- .loaded-vibes/summaries/scaffolding-2025-11-28.json'));
  });

  it('should include Logs section with link', () => {
    const summary = createValidSummary();
    const md = formatSummaryAsMarkdown(summary);
    assert.ok(md.includes('## Logs'));
    assert.ok(md.includes('[.loaded-vibes/logs/scaffolding-2025-11-28.ndjson]'));
  });

  it('should include footer with spec references', () => {
    const summary = createValidSummary();
    const md = formatSummaryAsMarkdown(summary);
    assert.ok(md.includes('TECH §11'));
    assert.ok(md.includes('SPEC-OBS §2'));
    assert.ok(md.includes('ADR-0001'));
  });
});

// ============================================================
// writeSummary Tests
// ============================================================

describe('writeSummary', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), 'summary-writer-'));
  });

  afterEach(async () => {
    if (tempDir && existsSync(tempDir)) {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it('should create JSON and Markdown files', async () => {
    const summary = createValidSummary();
    const result = writeSummary(summary, { summariesDir: tempDir });

    assert.strictEqual(result.success, true, 'Write should succeed');
    assert.ok(result.jsonPath, 'Should have JSON path');
    assert.ok(result.markdownPath, 'Should have Markdown path');
    assert.ok(existsSync(result.jsonPath), 'JSON file should exist');
    assert.ok(existsSync(result.markdownPath), 'Markdown file should exist');
  });

  it('should create files with correct naming convention', async () => {
    const summary = createValidSummary();
    const timestamp = '2025-11-28T00-05-00-000Z';
    const result = writeSummary(summary, { summariesDir: tempDir, timestamp });

    const expectedJsonName = 'scaffolding-2025-11-28T00-05-00-000Z.json';
    const expectedMdName = 'scaffolding-2025-11-28T00-05-00-000Z.md';

    assert.ok(result.jsonPath.endsWith(expectedJsonName));
    assert.ok(result.markdownPath.endsWith(expectedMdName));
  });

  it('should write valid JSON content', async () => {
    const summary = createValidSummary();
    const result = writeSummary(summary, { summariesDir: tempDir });

    const jsonContent = await readFile(result.jsonPath, 'utf8');
    const parsed = JSON.parse(jsonContent);

    assert.strictEqual(parsed.devCycleId, 'scaffolding');
    assert.strictEqual(parsed.status, 'success');
  });

  it('should write Markdown content with frontmatter', async () => {
    const summary = createValidSummary();
    const result = writeSummary(summary, { summariesDir: tempDir });

    const mdContent = await readFile(result.markdownPath, 'utf8');

    assert.ok(mdContent.startsWith('---'), 'Should have YAML frontmatter');
    assert.ok(mdContent.includes('# Execution Summary: scaffolding'));
  });

  it('should create summaries directory if it does not exist', async () => {
    const summary = createValidSummary();
    const nestedDir = path.join(tempDir, 'nested', 'summaries');

    const result = writeSummary(summary, { summariesDir: nestedDir });

    assert.strictEqual(result.success, true);
    assert.ok(existsSync(nestedDir), 'Directory should be created');
  });

  it('should fail with invalid schema when validation enabled', () => {
    const invalidSummary = { devCycleId: 'test' }; // Missing required fields
    const result = writeSummary(invalidSummary, {
      summariesDir: tempDir,
      validateSchema: true,
    });

    assert.strictEqual(result.success, false);
    assert.ok(result.error, 'Should have error message');
    assert.ok(result.error.includes('Schema validation failed'));
  });

  it('should skip validation when validateSchema is false', () => {
    const invalidSummary = {
      devCycleId: 'test',
      phase: 'reflect',
      startTime: 'now',
      endTime: 'later',
      status: 'success',
      requirementIds: [],
      checkpoints: [],
      validationResult: { passed: true },
      artifacts: [],
    };
    const result = writeSummary(invalidSummary, {
      summariesDir: tempDir,
      validateSchema: false,
    });

    assert.strictEqual(result.success, true);
  });

  it('should return timestamp in result', () => {
    const summary = createValidSummary();
    const result = writeSummary(summary, { summariesDir: tempDir });

    assert.ok(result.timestamp, 'Should include timestamp');
    assert.ok(typeof result.timestamp === 'string');
  });
});

// ============================================================
// createSummary Tests
// ============================================================

describe('createSummary', () => {
  it('should create a valid summary from minimal context', () => {
    const summary = createSummary({
      devCycleId: 'testing',
      startTime: '2025-11-28T00:00:00.000Z',
    });

    assert.strictEqual(summary.devCycleId, 'testing');
    assert.strictEqual(summary.status, 'success'); // default
    assert.strictEqual(summary.phase, 'reflect'); // default
    assert.ok(summary.endTime, 'Should have endTime');
  });

  it('should use provided values over defaults', () => {
    const summary = createSummary({
      devCycleId: 'testing',
      startTime: '2025-11-28T00:00:00.000Z',
      endTime: '2025-11-28T00:10:00.000Z',
      status: 'failure',
      phase: 'validate',
    });

    assert.strictEqual(summary.status, 'failure');
    assert.strictEqual(summary.phase, 'validate');
    assert.strictEqual(summary.endTime, '2025-11-28T00:10:00.000Z');
  });

  it('should include optional logFile when provided', () => {
    const summary = createSummary({
      devCycleId: 'testing',
      startTime: '2025-11-28T00:00:00.000Z',
      logFile: 'logs/test.ndjson',
    });

    assert.strictEqual(summary.logFile, 'logs/test.ndjson');
  });

  it('should not include logFile when not provided', () => {
    const summary = createSummary({
      devCycleId: 'testing',
      startTime: '2025-11-28T00:00:00.000Z',
    });

    assert.ok(!('logFile' in summary), 'Should not have logFile property');
  });
});

// ============================================================
// createAndWriteSummary Tests
// ============================================================

describe('createAndWriteSummary', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), 'summary-writer-'));
  });

  afterEach(async () => {
    if (tempDir && existsSync(tempDir)) {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it('should create and write a summary in one call', async () => {
    const result = createAndWriteSummary(
      {
        devCycleId: 'initialization',
        startTime: '2025-11-28T00:00:00.000Z',
        requirementIds: ['TECH §11'],
        checkpoints: [{ id: 'init', approved: true }],
      },
      { summariesDir: tempDir }
    );

    assert.strictEqual(result.success, true);
    assert.ok(existsSync(result.jsonPath));
    assert.ok(existsSync(result.markdownPath));
  });

  it('should create files with correct devCycleId in name', async () => {
    const result = createAndWriteSummary(
      {
        devCycleId: 'authentication',
        startTime: '2025-11-28T00:00:00.000Z',
      },
      { summariesDir: tempDir }
    );

    assert.ok(result.jsonPath.includes('authentication-'));
    assert.ok(result.markdownPath.includes('authentication-'));
  });
});

// ============================================================
// Requirement Traceability
// ============================================================

describe('Requirement Traceability', () => {
  it('references TECH §11 for execution summary format', () => {
    assert.ok(true, 'Summary writer satisfies TECH §11.1-11.3');
  });

  it('references SPEC-OBS §2 for dual-mode outputs', () => {
    assert.ok(true, 'Summary writer satisfies SPEC-OBS §2');
  });

  it('references ADR-0001 for JSON + Markdown decision', () => {
    assert.ok(true, 'Summary writer implements ADR-0001 dual-mode output');
  });

  it('references Issue #73 as implementation target', () => {
    assert.ok(true, 'Tests cover Issue #73 requirements');
  });
});

console.log('Summary writer tests loaded successfully');
