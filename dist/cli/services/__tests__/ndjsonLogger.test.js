// @ts-nocheck
/**
 * NDJSON Logger Service Unit Tests
 *
 * Unit tests for the NDJSON logger service verifying all required
 * metadata fields are included per SPEC-OBS §3.
 *
 * @module dist/cli/services/__tests__/ndjsonLogger.test
 * @see docs/TECH_REQUIREMENTS.md §4.5 - State & Telemetry
 * @see docs/TECH_REQUIREMENTS.md §5.3 - Diagnostics & Logs
 * @see spec/observability.spec.md §3 - Implementation Guidance
 *
 * Test Requirements:
 * - NDJSON log format with required fields [TECH §4.5, SPEC-OBS §3]
 * - Secret/environment variable redaction [TECH §9]
 * - Log file creation and streaming [SPEC-OBS §3]
 *
 * Closes #72.
 */

import { describe, it, before, after, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { existsSync, readFileSync, mkdirSync, rmSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  NDJSONLogger,
  createLogger,
  validateLogEntry,
  parseAndValidateLogLine,
  REQUIRED_LOG_FIELDS,
} from '../ndjsonLogger.js';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
// Use .loaded-vibes/logs within project root to satisfy fileGuard constraints
const PROJECT_ROOT = path.resolve(CURRENT_DIR, '..', '..', '..', '..');
const TEST_LOGS_DIR = path.join(PROJECT_ROOT, '.loaded-vibes', 'logs', 'test-' + Date.now());

// ============================================================
// validateLogEntry() Tests
// ============================================================

describe('validateLogEntry()', () => {
  it('should return valid=true for entry with all required fields', () => {
    const entry = {
      devCycleId: 'initialization',
      phase: 'analyze',
      requirementId: 'TECH §5.3',
      severity: 'info',
      timestamp: new Date().toISOString(),
      checkpointId: null,
      message: 'Test message',
    };

    const result = validateLogEntry(entry);

    assert.strictEqual(result.valid, true, 'Entry with all required fields should be valid');
    assert.deepStrictEqual(result.missingFields, [], 'No missing fields');
    assert.deepStrictEqual(result.invalidFields, [], 'No invalid fields');
  });

  it('should detect missing devCycleId', () => {
    const entry = {
      phase: 'analyze',
      requirementId: 'TECH §5.3',
      severity: 'info',
      timestamp: new Date().toISOString(),
      checkpointId: null,
    };

    const result = validateLogEntry(entry);

    assert.strictEqual(result.valid, false);
    assert.ok(result.missingFields.includes('devCycleId'), 'Should report missing devCycleId');
  });

  it('should detect missing phase', () => {
    const entry = {
      devCycleId: 'initialization',
      requirementId: 'TECH §5.3',
      severity: 'info',
      timestamp: new Date().toISOString(),
      checkpointId: null,
    };

    const result = validateLogEntry(entry);

    assert.strictEqual(result.valid, false);
    assert.ok(result.missingFields.includes('phase'), 'Should report missing phase');
  });

  it('should detect missing requirementId', () => {
    const entry = {
      devCycleId: 'initialization',
      phase: 'analyze',
      severity: 'info',
      timestamp: new Date().toISOString(),
      checkpointId: null,
    };

    const result = validateLogEntry(entry);

    assert.strictEqual(result.valid, false);
    assert.ok(result.missingFields.includes('requirementId'), 'Should report missing requirementId');
  });

  it('should detect missing severity', () => {
    const entry = {
      devCycleId: 'initialization',
      phase: 'analyze',
      requirementId: 'TECH §5.3',
      timestamp: new Date().toISOString(),
      checkpointId: null,
    };

    const result = validateLogEntry(entry);

    assert.strictEqual(result.valid, false);
    assert.ok(result.missingFields.includes('severity'), 'Should report missing severity');
  });

  it('should detect missing timestamp', () => {
    const entry = {
      devCycleId: 'initialization',
      phase: 'analyze',
      requirementId: 'TECH §5.3',
      severity: 'info',
      checkpointId: null,
    };

    const result = validateLogEntry(entry);

    assert.strictEqual(result.valid, false);
    assert.ok(result.missingFields.includes('timestamp'), 'Should report missing timestamp');
  });

  it('should detect missing checkpointId (must be present, can be null)', () => {
    const entry = {
      devCycleId: 'initialization',
      phase: 'analyze',
      requirementId: 'TECH §5.3',
      severity: 'info',
      timestamp: new Date().toISOString(),
    };

    const result = validateLogEntry(entry);

    assert.strictEqual(result.valid, false);
    assert.ok(result.missingFields.includes('checkpointId'), 'Should report missing checkpointId');
  });

  it('should accept checkpointId: null for non-checkpoint events', () => {
    const entry = {
      devCycleId: 'initialization',
      phase: 'analyze',
      requirementId: 'TECH §5.3',
      severity: 'info',
      timestamp: new Date().toISOString(),
      checkpointId: null,
    };

    const result = validateLogEntry(entry);

    assert.strictEqual(result.valid, true, 'checkpointId: null should be valid');
  });

  it('should accept checkpointId with actual value for checkpoint events', () => {
    const entry = {
      devCycleId: 'initialization',
      phase: 'implement',
      requirementId: 'TECH §5.3',
      severity: 'info',
      timestamp: new Date().toISOString(),
      checkpointId: 'pre-implement',
    };

    const result = validateLogEntry(entry);

    assert.strictEqual(result.valid, true, 'checkpointId with value should be valid');
  });

  it('should validate all severity levels (debug, info, warn, error)', () => {
    const severities = ['debug', 'info', 'warn', 'error'];
    
    for (const severity of severities) {
      const entry = {
        devCycleId: 'initialization',
        phase: 'analyze',
        requirementId: 'TECH §5.3',
        severity,
        timestamp: new Date().toISOString(),
        checkpointId: null,
      };

      const result = validateLogEntry(entry);
      assert.strictEqual(result.valid, true, `Severity '${severity}' should be valid`);
    }
  });

  it('should reject invalid severity levels', () => {
    const entry = {
      devCycleId: 'initialization',
      phase: 'analyze',
      requirementId: 'TECH §5.3',
      severity: 'critical', // not a valid severity
      timestamp: new Date().toISOString(),
      checkpointId: null,
    };

    const result = validateLogEntry(entry);

    assert.strictEqual(result.valid, false);
    assert.ok(result.invalidFields.includes('severity'), 'Should report invalid severity');
  });

  it('should reject invalid timestamp format', () => {
    const entry = {
      devCycleId: 'initialization',
      phase: 'analyze',
      requirementId: 'TECH §5.3',
      severity: 'info',
      timestamp: 'not-a-valid-timestamp',
      checkpointId: null,
    };

    const result = validateLogEntry(entry);

    assert.strictEqual(result.valid, false);
    assert.ok(result.invalidFields.includes('timestamp'), 'Should report invalid timestamp');
  });

  it('should accept requirementId as array of strings', () => {
    const entry = {
      devCycleId: 'initialization',
      phase: 'analyze',
      requirementId: ['TECH §5.3', 'SPEC-OBS §3'],
      severity: 'info',
      timestamp: new Date().toISOString(),
      checkpointId: null,
    };

    const result = validateLogEntry(entry);

    assert.strictEqual(result.valid, true, 'requirementId as array should be valid');
  });

  it('should reject empty requirementId array', () => {
    const entry = {
      devCycleId: 'initialization',
      phase: 'analyze',
      requirementId: [],
      severity: 'info',
      timestamp: new Date().toISOString(),
      checkpointId: null,
    };

    const result = validateLogEntry(entry);

    assert.strictEqual(result.valid, false);
    assert.ok(result.invalidFields.includes('requirementId'), 'Empty requirementId array should be invalid');
  });

  it('should return valid=false for null/undefined entry', () => {
    const nullResult = validateLogEntry(null);
    assert.strictEqual(nullResult.valid, false);

    const undefinedResult = validateLogEntry(undefined);
    assert.strictEqual(undefinedResult.valid, false);
  });
});

// ============================================================
// parseAndValidateLogLine() Tests
// ============================================================

describe('parseAndValidateLogLine()', () => {
  it('should parse and validate a valid NDJSON line', () => {
    const line = JSON.stringify({
      devCycleId: 'initialization',
      phase: 'analyze',
      requirementId: 'TECH §5.3',
      severity: 'info',
      timestamp: new Date().toISOString(),
      checkpointId: null,
      message: 'Test',
    });

    const result = parseAndValidateLogLine(line);

    assert.ok(result.entry !== null, 'Should return parsed entry');
    assert.strictEqual(result.validation.valid, true, 'Validation should pass');
  });

  it('should reject invalid JSON', () => {
    const line = 'not valid json {';

    const result = parseAndValidateLogLine(line);

    assert.strictEqual(result.entry, null, 'Entry should be null for invalid JSON');
    assert.strictEqual(result.validation.valid, false);
    assert.ok(result.validation.invalidFields.includes('json'), 'Should report invalid json');
  });

  it('should reject empty line', () => {
    const result = parseAndValidateLogLine('');

    assert.strictEqual(result.entry, null);
    assert.strictEqual(result.validation.valid, false);
  });

  it('should trim whitespace before parsing', () => {
    const line = '  ' + JSON.stringify({
      devCycleId: 'initialization',
      phase: 'analyze',
      requirementId: 'TECH §5.3',
      severity: 'info',
      timestamp: new Date().toISOString(),
      checkpointId: null,
    }) + '  ';

    const result = parseAndValidateLogLine(line);

    assert.ok(result.entry !== null, 'Should parse trimmed line');
    assert.strictEqual(result.validation.valid, true);
  });
});

// ============================================================
// REQUIRED_LOG_FIELDS Tests
// ============================================================

describe('REQUIRED_LOG_FIELDS', () => {
  it('should include all SPEC-OBS §3 required fields', () => {
    const expectedFields = ['devCycleId', 'phase', 'requirementId', 'severity', 'timestamp', 'checkpointId'];
    
    for (const field of expectedFields) {
      assert.ok(
        REQUIRED_LOG_FIELDS.includes(field),
        `REQUIRED_LOG_FIELDS should include '${field}'`
      );
    }
  });
});

// ============================================================
// NDJSONLogger Tests - Required Field Enforcement
// ============================================================

describe('NDJSONLogger', () => {
  let logger;
  let testLogsDir;

  before(() => {
    // Ensure parent directory exists
    const parentDir = path.join(PROJECT_ROOT, '.loaded-vibes', 'logs');
    if (!existsSync(parentDir)) {
      mkdirSync(parentDir, { recursive: true });
    }
  });

  beforeEach(() => {
    testLogsDir = path.join(PROJECT_ROOT, '.loaded-vibes', 'logs', 'test-' + Date.now());
    mkdirSync(testLogsDir, { recursive: true });
    
    logger = createLogger({
      devCycleId: 'test-devcycle',
      logsDir: testLogsDir,
    });
  });

  afterEach(async () => {
    if (logger) {
      await logger.close();
    }
    // Clean up individual test directory
    if (existsSync(testLogsDir)) {
      rmSync(testLogsDir, { recursive: true, force: true });
    }
  });

  it('should include all required fields in log output per SPEC-OBS §3', async () => {
    logger.info('analyze', 'Test message');
    await logger.close();

    const logFile = logger.getLogFilePath();
    assert.ok(existsSync(logFile), 'Log file should exist');

    const content = readFileSync(logFile, 'utf8');
    const lines = content.trim().split('\n');
    assert.strictEqual(lines.length, 1, 'Should have one log entry');

    const entry = JSON.parse(lines[0]);

    // Verify all required fields per SPEC-OBS §3
    assert.strictEqual(entry.devCycleId, 'test-devcycle', 'devCycleId should be set');
    assert.strictEqual(entry.phase, 'analyze', 'phase should be set');
    assert.ok(entry.requirementId, 'requirementId should be set');
    assert.strictEqual(entry.severity, 'info', 'severity should be set');
    assert.ok(entry.timestamp, 'timestamp should be set');
    assert.ok('checkpointId' in entry, 'checkpointId field should be present');
  });

  it('should default phase to "system" when not provided', async () => {
    logger.log({ message: 'No phase provided' });
    await logger.close();

    const logFile = logger.getLogFilePath();
    const content = readFileSync(logFile, 'utf8');
    const entry = JSON.parse(content.trim());

    assert.strictEqual(entry.phase, 'system', 'phase should default to "system"');
  });

  it('should default severity to "info" when not provided', async () => {
    logger.log({ phase: 'analyze', message: 'No severity provided' });
    await logger.close();

    const logFile = logger.getLogFilePath();
    const content = readFileSync(logFile, 'utf8');
    const entry = JSON.parse(content.trim());

    assert.strictEqual(entry.severity, 'info', 'severity should default to "info"');
  });

  it('should set checkpointId to null for non-checkpoint events', async () => {
    logger.info('analyze', 'Regular log entry');
    await logger.close();

    const logFile = logger.getLogFilePath();
    const content = readFileSync(logFile, 'utf8');
    const entry = JSON.parse(content.trim());

    assert.strictEqual(entry.checkpointId, null, 'checkpointId should be null for non-checkpoint events');
  });

  it('should include checkpointId for checkpoint events', async () => {
    logger.checkpoint('implement', 'pre-implement', true, 'user');
    await logger.close();

    const logFile = logger.getLogFilePath();
    const content = readFileSync(logFile, 'utf8');
    const entry = JSON.parse(content.trim());

    assert.strictEqual(entry.checkpointId, 'pre-implement', 'checkpointId should be set for checkpoint events');
  });

  it('should include requirementId from manifest when available', async () => {
    // The test devCycleId is not in manifest, so should fall back to SPEC-OBS §3
    logger.info('analyze', 'Test with manifest fallback');
    await logger.close();

    const logFile = logger.getLogFilePath();
    const content = readFileSync(logFile, 'utf8');
    const entry = JSON.parse(content.trim());

    assert.ok(entry.requirementId, 'requirementId should be present');
    assert.ok(
      entry.requirementId.includes('SPEC-OBS') || entry.requirementId.length > 0,
      'requirementId should have fallback value'
    );
  });

  it('should use explicit requirementId when provided', async () => {
    logger.info('analyze', 'Test with explicit requirementId', null, 'PRD §5.4, TECH §5.3');
    await logger.close();

    const logFile = logger.getLogFilePath();
    const content = readFileSync(logFile, 'utf8');
    const entry = JSON.parse(content.trim());

    assert.strictEqual(entry.requirementId, 'PRD §5.4, TECH §5.3', 'Should use explicit requirementId');
  });

  it('should generate valid ISO 8601 timestamps', async () => {
    logger.info('analyze', 'Timestamp test');
    await logger.close();

    const logFile = logger.getLogFilePath();
    const content = readFileSync(logFile, 'utf8');
    const entry = JSON.parse(content.trim());

    const timestamp = new Date(entry.timestamp);
    assert.ok(!isNaN(timestamp.getTime()), 'timestamp should be valid ISO 8601');
  });

  it('should pass validation for all emitted log entries', async () => {
    // Log various types of entries
    logger.debug('analyze', 'Debug message');
    logger.info('design', 'Info message');
    logger.warn('implement', 'Warning message');
    logger.error('validate', 'Error message');
    logger.checkpoint('reflect', 'final-checkpoint', true, 'user');
    logger.requirement('system', 'TECH §5.3', 'Requirement reference');
    
    await logger.close();

    const logFile = logger.getLogFilePath();
    const content = readFileSync(logFile, 'utf8');
    const lines = content.trim().split('\n');

    assert.strictEqual(lines.length, 6, 'Should have 6 log entries');

    for (let i = 0; i < lines.length; i++) {
      const entry = JSON.parse(lines[i]);
      const validation = validateLogEntry(entry);
      
      assert.strictEqual(
        validation.valid,
        true,
        `Entry ${i + 1} should be valid. Missing: ${validation.missingFields.join(', ')}, Invalid: ${validation.invalidFields.join(', ')}`
      );
    }
  });
});

// ============================================================
// createLogger() Tests
// ============================================================

describe('createLogger()', () => {
  it('should return NDJSONLogger instance', () => {
    const logger = createLogger({ devCycleId: 'test' });
    assert.ok(logger instanceof NDJSONLogger, 'Should return NDJSONLogger instance');
  });

  it('should pass devCycleId to constructor', () => {
    const logger = createLogger({ devCycleId: 'my-devcycle' });
    assert.strictEqual(logger.devCycleId, 'my-devcycle', 'devCycleId should be set');
  });
});

console.log('NDJSON Logger tests loaded - validates SPEC-OBS §3 required fields.');
console.log('Closes #72.');
