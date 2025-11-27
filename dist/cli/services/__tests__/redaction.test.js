// @ts-nocheck
/**
 * Secret Redaction Module Tests
 *
 * Unit tests for the secret redaction module that implements
 * TECH §9 and SPEC-SECURITY §2 requirements.
 *
 * @module dist/cli/services/__tests__/redaction.test
 * @see docs/TECH_REQUIREMENTS.md §9 - Security, Quality, Compliance
 * @see spec/security.spec.md §2 - Component Controls
 * @see spec/observability.spec.md §4 - Validation Checklist
 */

import { strict as assert } from 'node:assert';
import test from 'node:test';

import {
  SecretRedactor,
  createRedactor,
  getRedactor,
  redactSensitive,
  redactString,
  redactStackTrace,
  redactLogEntry,
  redactTelemetry,
  REDACTED_PLACEHOLDER,
  DEFAULT_CONFIG,
} from '../redaction.js';

// ============================================================================
// SecretRedactor Class Tests
// ============================================================================

test('[SecretRedactor] constructor uses default config', () => {
  const redactor = new SecretRedactor();
  assert.ok(redactor.config);
  assert.ok(Array.isArray(redactor.config.sensitiveKeys));
  assert.ok(Array.isArray(redactor.config.patterns));
});

test('[SecretRedactor] isSensitiveKey detects sensitive keys', () => {
  const redactor = new SecretRedactor();

  // Should detect
  assert.equal(redactor.isSensitiveKey('password'), true);
  assert.equal(redactor.isSensitiveKey('api_key'), true);
  assert.equal(redactor.isSensitiveKey('apiKey'), true);
  assert.equal(redactor.isSensitiveKey('API_KEY'), true);
  assert.equal(redactor.isSensitiveKey('secret'), true);
  assert.equal(redactor.isSensitiveKey('token'), true);
  assert.equal(redactor.isSensitiveKey('authorization'), true);
  assert.equal(redactor.isSensitiveKey('private_key'), true);
  assert.equal(redactor.isSensitiveKey('access_token'), true);
  assert.equal(redactor.isSensitiveKey('client_secret'), true);

  // Should not detect
  assert.equal(redactor.isSensitiveKey('username'), false);
  assert.equal(redactor.isSensitiveKey('email'), false);
  assert.equal(redactor.isSensitiveKey('name'), false);
  assert.equal(redactor.isSensitiveKey('id'), false);
});

// ============================================================================
// String Redaction Tests
// ============================================================================

test('[redactString] redacts API keys in assignment format', () => {
  const input = 'api_key=sk_live_abc123def456ghi789';
  const result = redactString(input);
  assert.equal(result, REDACTED_PLACEHOLDER);
});

test('[redactString] redacts Bearer tokens', () => {
  const input = 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.token';
  const result = redactString(input);
  assert.ok(result.includes(REDACTED_PLACEHOLDER));
  assert.ok(!result.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'));
});

test('[redactString] redacts JWT tokens', () => {
  const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
  const input = `Token: ${jwt}`;
  const result = redactString(input);
  assert.ok(result.includes(REDACTED_PLACEHOLDER));
  assert.ok(!result.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'));
});

test('[redactString] redacts GitHub tokens', () => {
  const input = 'GITHUB_TOKEN=ghp_1234567890abcdefghijklmnopqrstuvwxyz';
  const result = redactString(input);
  assert.ok(result.includes(REDACTED_PLACEHOLDER));
  assert.ok(!result.includes('ghp_'));
});

test('[redactString] redacts npm tokens', () => {
  const input = 'NPM_TOKEN=npm_1234567890abcdefghijklmnopqrstuvwxyz';
  const result = redactString(input);
  assert.ok(result.includes(REDACTED_PLACEHOLDER));
  assert.ok(!result.includes('npm_'));
});

test('[redactString] redacts AWS access keys', () => {
  const input = 'AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE';
  const result = redactString(input);
  assert.ok(result.includes(REDACTED_PLACEHOLDER));
  assert.ok(!result.includes('AKIAIOSFODNN7EXAMPLE'));
});

test('[redactString] redacts connection strings with passwords', () => {
  const input = 'mongodb://user:supersecretpassword@localhost:27017/db';
  const result = redactString(input);
  assert.ok(result.includes(REDACTED_PLACEHOLDER));
  assert.ok(!result.includes('supersecretpassword'));
});

test('[redactString] redacts environment variable references', () => {
  const input = 'Using ${API_KEY_SECRET} and $GITHUB_TOKEN for auth';
  const result = redactString(input);
  assert.ok(result.includes(REDACTED_PLACEHOLDER));
  assert.ok(!result.includes('API_KEY_SECRET'));
  assert.ok(!result.includes('GITHUB_TOKEN'));
});

test('[redactString] redacts process.env references', () => {
  const input = 'const key = process.env.SECRET_API_KEY;';
  const result = redactString(input);
  assert.ok(result.includes(REDACTED_PLACEHOLDER));
  assert.ok(!result.includes('SECRET_API_KEY'));
});

test('[redactString] preserves non-sensitive content', () => {
  const input = 'Hello world, this is a normal message';
  const result = redactString(input);
  assert.equal(result, input);
});

test('[redactString] handles null and undefined', () => {
  assert.equal(redactString(null), null);
  assert.equal(redactString(undefined), undefined);
});

test('[redactString] handles non-strings', () => {
  assert.equal(redactString(123), 123);
  assert.equal(redactString(true), true);
});

// ============================================================================
// Object Redaction Tests
// ============================================================================

test('[redactSensitive] redacts sensitive keys in objects', () => {
  const input = {
    username: 'john',
    password: 'supersecret123',
    api_key: 'sk_live_abc123',
  };
  const result = redactSensitive(input);

  assert.equal(result.username, 'john');
  assert.equal(result.password, REDACTED_PLACEHOLDER);
  assert.equal(result.api_key, REDACTED_PLACEHOLDER);
});

test('[redactSensitive] redacts nested objects', () => {
  const input = {
    user: {
      name: 'john',
      config: {
        accessToken: 'secret_token',
        userPassword: 'secret_pass',
      },
    },
  };
  const result = redactSensitive(input);

  assert.equal(result.user.name, 'john');
  // config.accessToken is redacted because 'accessToken' contains 'token'
  assert.equal(result.user.config.accessToken, REDACTED_PLACEHOLDER);
  // config.userPassword is redacted because 'userPassword' contains 'password'
  assert.equal(result.user.config.userPassword, REDACTED_PLACEHOLDER);
});

test('[redactSensitive] redacts sensitive values in strings', () => {
  const input = {
    command: 'curl -H "Authorization: Bearer abc123" https://api.example.com',
  };
  const result = redactSensitive(input);

  assert.ok(result.command.includes(REDACTED_PLACEHOLDER));
  assert.ok(!result.command.includes('abc123'));
});

test('[redactSensitive] redacts arrays of objects', () => {
  const input = [
    { username: 'user1', token: 'token1' },
    { username: 'user2', token: 'token2' },
  ];
  const result = redactSensitive(input);

  assert.equal(result[0].username, 'user1');
  assert.equal(result[0].token, REDACTED_PLACEHOLDER);
  assert.equal(result[1].username, 'user2');
  assert.equal(result[1].token, REDACTED_PLACEHOLDER);
});

test('[redactSensitive] handles null and undefined', () => {
  assert.equal(redactSensitive(null), null);
  assert.equal(redactSensitive(undefined), undefined);
});

test('[redactSensitive] preserves non-sensitive data', () => {
  const input = {
    name: 'Test',
    count: 42,
    active: true,
    items: ['a', 'b', 'c'],
  };
  const result = redactSensitive(input);

  assert.deepEqual(result, input);
});

// ============================================================================
// Stack Trace Redaction Tests
// ============================================================================

test('[redactStackTrace] redacts secrets in error messages', () => {
  const stack = `Error: Failed to connect with password=supersecret123
    at connect (/home/user/project/db.js:10:5)
    at main (/home/user/project/index.js:5:3)`;

  const result = redactStackTrace(stack);

  assert.ok(result.includes(REDACTED_PLACEHOLDER));
  assert.ok(!result.includes('supersecret123'));
});

test('[redactStackTrace] redacts home directory paths', () => {
  const stack = `Error: File not found
    at readFile (/home/secretuser/project/file.js:10:5)
    at main (/Users/anotheruser/app/index.js:5:3)`;

  const result = redactStackTrace(stack);

  assert.ok(result.includes(REDACTED_PLACEHOLDER));
  // Should redact user paths
  assert.ok(!result.includes('/home/secretuser/'));
  assert.ok(!result.includes('/Users/anotheruser/'));
});

test('[redactStackTrace] preserves stack structure', () => {
  const stack = `Error: Something went wrong
    at function1 (/app/src/file.js:10:5)
    at function2 (/app/src/other.js:20:10)`;

  const result = redactStackTrace(stack);

  // Should still have stack trace structure
  assert.ok(result.includes('Error:'));
  assert.ok(result.includes('at function1'));
  assert.ok(result.includes('at function2'));
});

// ============================================================================
// Log Entry Redaction Tests
// ============================================================================

test('[redactLogEntry] redacts all fields of a log entry', () => {
  const entry = {
    devCycleId: 'test',
    phase: 'validate',
    severity: 'error',
    message: 'Failed with api_key=sk_test_1234567890abcdef',
    timestamp: '2025-01-01T00:00:00.000Z',
    data: {
      userPassword: 'secret',
      config: {
        accessToken: 'abc123',
      },
    },
  };

  const result = redactLogEntry(entry);

  assert.equal(result.devCycleId, 'test');
  assert.equal(result.phase, 'validate');
  assert.ok(result.message.includes(REDACTED_PLACEHOLDER));
  assert.equal(result.data.userPassword, REDACTED_PLACEHOLDER);
  assert.equal(result.data.config.accessToken, REDACTED_PLACEHOLDER);
});

test('[redactLogEntry] handles entries with stack traces', () => {
  const entry = {
    devCycleId: 'test',
    phase: 'implement',
    severity: 'error',
    message: 'Error occurred',
    stack: `Error: password=secret123
    at /home/user/project/file.js:10:5`,
  };

  const result = redactLogEntry(entry);

  assert.ok(result.stack.includes(REDACTED_PLACEHOLDER));
  assert.ok(!result.stack.includes('secret123'));
});

// ============================================================================
// Telemetry Redaction Tests
// ============================================================================

test('[redactTelemetry] redacts single telemetry object', () => {
  const telemetry = {
    event: 'api_call',
    data: {
      endpoint: '/api/users',
      headers: {
        authorization: 'Bearer secret_token',
      },
    },
  };

  const result = redactTelemetry(telemetry);

  assert.equal(result.data.headers.authorization, REDACTED_PLACEHOLDER);
});

test('[redactTelemetry] redacts array of telemetry objects', () => {
  const telemetry = [
    { event: 'login', data: { password: 'secret1' } },
    { event: 'api_call', data: { token: 'secret2' } },
  ];

  const result = redactTelemetry(telemetry);

  assert.equal(result[0].data.password, REDACTED_PLACEHOLDER);
  assert.equal(result[1].data.token, REDACTED_PLACEHOLDER);
});

// ============================================================================
// Factory Functions Tests
// ============================================================================

test('[createRedactor] creates new instance', () => {
  const redactor = createRedactor();
  assert.ok(redactor instanceof SecretRedactor);
});

test('[createRedactor] accepts custom config', () => {
  const customConfig = {
    sensitiveKeys: ['custom_key'],
    patterns: [],
    stackTracePatterns: [],
    envVarPrefixes: [],
    redactStackPaths: false,
  };

  const redactor = createRedactor(customConfig);
  assert.ok(redactor.isSensitiveKey('custom_key'));
});

test('[getRedactor] returns singleton instance', () => {
  const r1 = getRedactor();
  const r2 = getRedactor();
  assert.equal(r1, r2);
});

// ============================================================================
// Integration Tests
// ============================================================================

test('[Integration] full log entry with multiple secret types', () => {
  const entry = {
    devCycleId: 'features',
    phase: 'implement',
    severity: 'info',
    message: 'Calling API with token Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.token123',
    timestamp: '2025-01-01T00:00:00.000Z',
    data: {
      config: {
        database: 'mongodb://admin:supersecret@localhost/db',
        api_key: 'sk_live_abc123def456',
      },
      env: {
        cmd: 'Using ${GITHUB_TOKEN} for auth',
      },
    },
  };

  const result = redactLogEntry(entry);

  // Message should be redacted
  assert.ok(!result.message.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'));

  // Connection string password should be redacted
  assert.ok(!result.data.config.database.includes('supersecret'));

  // API key should be redacted
  assert.equal(result.data.config.api_key, REDACTED_PLACEHOLDER);

  // Env var reference should be redacted
  assert.ok(result.data.env.cmd.includes(REDACTED_PLACEHOLDER));
  assert.ok(!result.data.env.cmd.includes('GITHUB_TOKEN'));
});

test('[Integration] preserves structure while redacting', () => {
  const entry = {
    devCycleId: 'test',
    phase: 'analyze',
    severity: 'debug',
    message: 'Normal message',
    timestamp: '2025-01-01T00:00:00.000Z',
    requirementId: 'TECH §4.2',
    checkpointId: 'cp-1',
    data: {
      user: 'john',
      count: 5,
      active: true,
      tags: ['a', 'b'],
    },
  };

  const result = redactLogEntry(entry);

  // All non-sensitive fields should be preserved exactly
  assert.equal(result.devCycleId, 'test');
  assert.equal(result.phase, 'analyze');
  assert.equal(result.severity, 'debug');
  assert.equal(result.message, 'Normal message');
  assert.equal(result.requirementId, 'TECH §4.2');
  assert.equal(result.checkpointId, 'cp-1');
  assert.equal(result.data.user, 'john');
  assert.equal(result.data.count, 5);
  assert.equal(result.data.active, true);
  assert.deepEqual(result.data.tags, ['a', 'b']);
});

// ============================================================================
// Summary
// ============================================================================

console.log('Secret Redaction tests loaded.');
console.log('Run with: node --test dist/cli/services/__tests__/redaction.test.js');
