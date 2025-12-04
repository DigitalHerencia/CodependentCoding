// @ts-nocheck
import { strict as assert } from 'node:assert';
import test from 'node:test';
import { mkdtemp, rm, writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import { createHash } from 'crypto';

import {
  computeSHA256,
  normalizeHash,
  verifySHA256,
  parseChecksumsFile,
  verifyMultipleFiles,
  cleanupTempFiles,
  buildRemediationGuidance,
  REQUIREMENT_ID,
  ALGORITHM,
} from '../shaVerifier.js';

/**
 * Helper to create a temp directory for tests.
 */
async function withTempDir(fn) {
  const tempDir = await mkdtemp(path.join(tmpdir(), 'sha-verifier-test-'));
  try {
    await fn(tempDir);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

/**
 * Helper to compute expected hash for test files.
 */
function computeExpectedHash(content) {
  return createHash('sha256').update(content).digest('hex').toLowerCase();
}

// ============================================================
// computeSHA256 tests
// ============================================================

test('[shaVerifier] computeSHA256 returns correct hash for known content', async () => {
  await withTempDir(async (tempDir) => {
    const testContent = 'Hello, Loaded Vibes!';
    const testFile = path.join(tempDir, 'test.txt');
    await writeFile(testFile, testContent, 'utf8');

    const expectedHash = computeExpectedHash(testContent);
    const computedHash = await computeSHA256(testFile);

    assert.equal(computedHash, expectedHash);
    assert.equal(computedHash.length, 64); // SHA256 produces 64 hex chars
  });
});

test('[shaVerifier] computeSHA256 handles empty file', async () => {
  await withTempDir(async (tempDir) => {
    const testFile = path.join(tempDir, 'empty.txt');
    await writeFile(testFile, '', 'utf8');

    const expectedHash = computeExpectedHash('');
    const computedHash = await computeSHA256(testFile);

    assert.equal(computedHash, expectedHash);
    // SHA256 of empty string is well-known
    assert.equal(computedHash, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });
});

test('[shaVerifier] computeSHA256 handles binary content', async () => {
  await withTempDir(async (tempDir) => {
    const testFile = path.join(tempDir, 'binary.bin');
    const binaryContent = Buffer.from([0x00, 0x01, 0x02, 0xff, 0xfe, 0xfd]);
    await writeFile(testFile, binaryContent);

    const expectedHash = createHash('sha256').update(binaryContent).digest('hex').toLowerCase();
    const computedHash = await computeSHA256(testFile);

    assert.equal(computedHash, expectedHash);
  });
});

test('[shaVerifier] computeSHA256 throws for non-existent file', async () => {
  await withTempDir(async (tempDir) => {
    const nonExistent = path.join(tempDir, 'does-not-exist.txt');

    await assert.rejects(
      () => computeSHA256(nonExistent),
      /Failed to read file for hashing/
    );
  });
});

// ============================================================
// normalizeHash tests
// ============================================================

test('[shaVerifier] normalizeHash converts to lowercase', () => {
  const upper = 'ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789';
  const normalized = normalizeHash(upper);
  assert.equal(normalized, upper.toLowerCase());
});

test('[shaVerifier] normalizeHash trims whitespace', () => {
  const withSpaces = '  abc123  ';
  const normalized = normalizeHash(withSpaces);
  assert.equal(normalized, 'abc123');
});

// ============================================================
// verifySHA256 tests
// ============================================================

test('[shaVerifier] verifySHA256 returns valid=true for matching hash', async () => {
  await withTempDir(async (tempDir) => {
    const testContent = 'Release artifact content';
    const testFile = path.join(tempDir, 'release.tar.gz');
    await writeFile(testFile, testContent, 'utf8');

    const expectedHash = computeExpectedHash(testContent);
    const result = await verifySHA256(testFile, expectedHash, { deleteOnMismatch: false });

    assert.equal(result.valid, true);
    assert.equal(result.computedHash, expectedHash);
    assert.equal(result.expectedHash, expectedHash);
    assert.equal(result.error, undefined);
    // File should still exist
    assert.equal(existsSync(testFile), true);
  });
});

test('[shaVerifier] verifySHA256 returns valid=false for mismatched hash', async () => {
  await withTempDir(async (tempDir) => {
    const testContent = 'Tampered content';
    const testFile = path.join(tempDir, 'tampered.tar.gz');
    await writeFile(testFile, testContent, 'utf8');

    const wrongHash = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
    const result = await verifySHA256(testFile, wrongHash, { deleteOnMismatch: false });

    assert.equal(result.valid, false);
    assert.equal(result.expectedHash, wrongHash);
    assert.notEqual(result.computedHash, wrongHash);
    assert.ok(result.error?.includes('SHA256 mismatch'));
    assert.ok(result.error?.includes('REMEDIATION STEPS'));
  });
});

test('[shaVerifier] verifySHA256 deletes file on mismatch by default', async () => {
  await withTempDir(async (tempDir) => {
    const testContent = 'Malicious payload';
    const testFile = path.join(tempDir, 'malicious.tar.gz');
    await writeFile(testFile, testContent, 'utf8');

    assert.equal(existsSync(testFile), true);

    const wrongHash = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
    const result = await verifySHA256(testFile, wrongHash, { deleteOnMismatch: true });

    assert.equal(result.valid, false);
    // File should be deleted
    assert.equal(existsSync(testFile), false);
  });
});

test('[shaVerifier] verifySHA256 returns error for non-existent file', async () => {
  await withTempDir(async (tempDir) => {
    const nonExistent = path.join(tempDir, 'ghost.tar.gz');
    const hash = 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc';

    const result = await verifySHA256(nonExistent, hash);

    assert.equal(result.valid, false);
    assert.ok(result.error?.includes('File not found'));
    assert.equal(result.computedHash, '');
  });
});

test('[shaVerifier] verifySHA256 logs events when logger provided', async () => {
  await withTempDir(async (tempDir) => {
    const testContent = 'Loggable content';
    const testFile = path.join(tempDir, 'loggable.txt');
    await writeFile(testFile, testContent, 'utf8');

    const logs = [];
    const mockLogger = {
      log: (event) => logs.push(event),
    };

    const expectedHash = computeExpectedHash(testContent);
    await verifySHA256(testFile, expectedHash, { logger: mockLogger });

    assert.equal(logs.length, 1);
    assert.equal(logs[0].phase, 'security');
    assert.equal(logs[0].severity, 'info');
    assert.ok(logs[0].message.includes('verification passed'));
    assert.ok(logs[0].requirementId.includes('PRD §5.5'));
  });
});

test('[shaVerifier] verifySHA256 logs error and cleanup on mismatch', async () => {
  await withTempDir(async (tempDir) => {
    const testContent = 'Content to delete';
    const testFile = path.join(tempDir, 'delete-me.txt');
    await writeFile(testFile, testContent, 'utf8');

    const logs = [];
    const mockLogger = {
      log: (event) => logs.push(event),
    };

    const wrongHash = 'dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd';
    await verifySHA256(testFile, wrongHash, { logger: mockLogger, deleteOnMismatch: true });

    // Should have error log and cleanup log
    assert.ok(logs.length >= 2);
    const errorLog = logs.find((l) => l.severity === 'error');
    const warnLog = logs.find((l) => l.message?.includes('Deleted unsigned payload'));

    assert.ok(errorLog);
    assert.ok(errorLog.message.includes('FAILED'));
    assert.ok(warnLog);
  });
});

// ============================================================
// parseChecksumsFile tests
// ============================================================

test('[shaVerifier] parseChecksumsFile parses standard format', () => {
  const content = `# SHA256 checksums
abc123def456abc123def456abc123def456abc123def456abc123def456abc1  release-1.0.0.tar.gz
def789aef012def789aef012def789aef012def789aef012def789aef012def7  README.md
`;

  const checksums = parseChecksumsFile(content);

  assert.equal(checksums.size, 2);
  assert.equal(checksums.get('release-1.0.0.tar.gz'), 'abc123def456abc123def456abc123def456abc123def456abc123def456abc1');
  assert.equal(checksums.get('README.md'), 'def789aef012def789aef012def789aef012def789aef012def789aef012def7');
});

test('[shaVerifier] parseChecksumsFile handles single space format', () => {
  const content = `1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef file.txt`;

  const checksums = parseChecksumsFile(content);

  assert.equal(checksums.size, 1);
  assert.equal(checksums.get('file.txt'), '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
});

test('[shaVerifier] parseChecksumsFile ignores comments and empty lines', () => {
  const content = `
# This is a comment
  
abc123def456abc123def456abc123def456abc123def456abc123def456abc1  valid.txt

# Another comment
`;

  const checksums = parseChecksumsFile(content);

  assert.equal(checksums.size, 1);
  assert.ok(checksums.has('valid.txt'));
});

test('[shaVerifier] parseChecksumsFile normalizes hashes to lowercase', () => {
  const content = `ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789  uppercase.txt`;

  const checksums = parseChecksumsFile(content);

  assert.equal(checksums.get('uppercase.txt'), 'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789');
});

// ============================================================
// verifyMultipleFiles tests
// ============================================================

test('[shaVerifier] verifyMultipleFiles verifies all files in map', async () => {
  await withTempDir(async (tempDir) => {
    const content1 = 'File 1 content';
    const content2 = 'File 2 content';

    await writeFile(path.join(tempDir, 'file1.txt'), content1, 'utf8');
    await writeFile(path.join(tempDir, 'file2.txt'), content2, 'utf8');

    const checksums = new Map([
      ['file1.txt', computeExpectedHash(content1)],
      ['file2.txt', computeExpectedHash(content2)],
    ]);

    const results = await verifyMultipleFiles(tempDir, checksums, { deleteOnMismatch: false });

    assert.equal(results.size, 2);
    assert.equal(results.get('file1.txt').valid, true);
    assert.equal(results.get('file2.txt').valid, true);
  });
});

test('[shaVerifier] verifyMultipleFiles reports failures for missing files', async () => {
  await withTempDir(async (tempDir) => {
    const checksums = new Map([
      ['missing.txt', 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'],
    ]);

    const results = await verifyMultipleFiles(tempDir, checksums, { deleteOnMismatch: false });

    assert.equal(results.size, 1);
    assert.equal(results.get('missing.txt').valid, false);
    assert.ok(results.get('missing.txt').error?.includes('File not found'));
  });
});

// ============================================================
// cleanupTempFiles tests
// ============================================================

test('[shaVerifier] cleanupTempFiles removes files and directories', async () => {
  await withTempDir(async (tempDir) => {
    const file1 = path.join(tempDir, 'cleanup1.txt');
    const file2 = path.join(tempDir, 'cleanup2.txt');
    const subDir = path.join(tempDir, 'subdir');

    await writeFile(file1, 'temp', 'utf8');
    await writeFile(file2, 'temp', 'utf8');
    await mkdir(subDir, { recursive: true });
    await writeFile(path.join(subDir, 'nested.txt'), 'nested', 'utf8');

    assert.equal(existsSync(file1), true);
    assert.equal(existsSync(file2), true);
    assert.equal(existsSync(subDir), true);

    await cleanupTempFiles([file1, file2, subDir]);

    assert.equal(existsSync(file1), false);
    assert.equal(existsSync(file2), false);
    assert.equal(existsSync(subDir), false);
  });
});

test('[shaVerifier] cleanupTempFiles handles non-existent paths gracefully', async () => {
  await withTempDir(async (tempDir) => {
    const nonExistent = path.join(tempDir, 'does-not-exist.txt');

    // Should not throw
    await cleanupTempFiles([nonExistent]);
  });
});

test('[shaVerifier] cleanupTempFiles logs cleanup events', async () => {
  await withTempDir(async (tempDir) => {
    const file = path.join(tempDir, 'logged-cleanup.txt');
    await writeFile(file, 'temp', 'utf8');

    const logs = [];
    const mockLogger = {
      log: (event) => logs.push(event),
    };

    await cleanupTempFiles([file], mockLogger);

    assert.equal(logs.length, 1);
    assert.equal(logs[0].phase, 'security');
    assert.ok(logs[0].message.includes('Cleaned up'));
  });
});

// ============================================================
// buildRemediationGuidance tests
// ============================================================

test('[shaVerifier] buildRemediationGuidance includes all required info', () => {
  const guidance = buildRemediationGuidance(
    '/path/to/release.tar.gz',
    'computedhash123',
    'expectedhash456'
  );

  assert.ok(guidance.includes('SHA256 VERIFICATION FAILED'));
  assert.ok(guidance.includes('UNSIGNED PAYLOAD BLOCKED'));
  assert.ok(guidance.includes('release.tar.gz'));
  assert.ok(guidance.includes('/path/to/release.tar.gz'));
  assert.ok(guidance.includes('computedhash123'));
  assert.ok(guidance.includes('expectedhash456'));
  assert.ok(guidance.includes('REMEDIATION STEPS'));
  assert.ok(guidance.includes('official source'));
  assert.ok(guidance.includes('checksums.txt'));
  assert.ok(guidance.includes(REQUIREMENT_ID));
});

// ============================================================
// Constants tests
// ============================================================

test('[shaVerifier] exports correct constants', () => {
  assert.ok(REQUIREMENT_ID.includes('PRD'));
  assert.ok(REQUIREMENT_ID.includes('SPEC-SECURITY'));
  assert.equal(ALGORITHM, 'sha256');
});
