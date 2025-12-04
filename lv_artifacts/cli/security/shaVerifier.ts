// @ts-nocheck
/**
 * SHA256 Verifier for downloaded releases.
 * Implements PRD §5.5, TECH_REQUIREMENTS §5.4, and SPEC-SECURITY §1-2
 * by validating checksums and blocking unsigned payloads with remediation guidance.
 *
 * @module dist/cli/security/shaVerifier
 * @see docs/PRD.md §5.5 - Security & Risk Controls
 * @see docs/TECH_REQUIREMENTS.md §5.4 - Security & Performance
 * @see spec/security.spec.md §1-2 - Policies & Component Controls
 */

import { createHash } from 'crypto';
import { createReadStream, existsSync } from 'fs';
import { rm, unlink } from 'fs/promises';
import path from 'path';

const REQUIREMENT_ID = 'PRD §5.5 / SPEC-SECURITY §1-2';
const ALGORITHM = 'sha256';

/**
 * @typedef {Object} VerificationResult
 * @property {boolean} valid - Whether the file hash matches the expected hash
 * @property {string} computedHash - The computed SHA256 hash of the file
 * @property {string} expectedHash - The expected SHA256 hash
 * @property {string} [error] - Error message if verification failed
 */

/**
 * @typedef {Object} VerifierOptions
 * @property {boolean} [deleteOnMismatch=true] - Delete the file if hash doesn't match
 * @property {Object} [logger] - Optional NDJSON logger instance
 */

/**
 * Computes SHA256 hash of a file.
 *
 * @param {string} filePath - Path to the file to hash
 * @returns {Promise<string>} The computed SHA256 hash in lowercase hex
 * @throws {Error} If file cannot be read
 */
export async function computeSHA256(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash(ALGORITHM);
    const stream = createReadStream(filePath);

    stream.on('data', (chunk: Buffer) => {
      hash.update(chunk);
    });

    stream.on('end', () => {
      resolve(hash.digest('hex').toLowerCase());
    });

    stream.on('error', (err: Error) => {
      reject(new Error(`Failed to read file for hashing: ${err.message}`));
    });
  });
}

/**
 * Normalizes a hash string for comparison.
 * Removes any whitespace and converts to lowercase.
 *
 * @param {string} hash - Hash string to normalize
 * @returns {string} Normalized hash
 */
export function normalizeHash(hash: string): string {
  return hash.trim().toLowerCase();
}

/**
 * Builds remediation guidance for hash mismatch.
 *
 * @param {string} filePath - Path to the file that failed verification
 * @param {string} computedHash - The computed hash
 * @param {string} expectedHash - The expected hash
 * @returns {string} Human-readable remediation guidance
 */
export function buildRemediationGuidance(
  filePath: string,
  computedHash: string,
  expectedHash: string
): string {
  const lines = [
    '',
    '============================================================',
    'SHA256 VERIFICATION FAILED - UNSIGNED PAYLOAD BLOCKED',
    '============================================================',
    '',
    `File: ${path.basename(filePath)}`,
    `Path: ${filePath}`,
    '',
    'Hash Comparison:',
    `  Expected: ${expectedHash}`,
    `  Computed: ${computedHash}`,
    '',
    'REMEDIATION STEPS:',
    '  1. Verify you are downloading from the official source.',
    '  2. Check that the checksums.txt file is authentic.',
    '  3. Re-download the release from https://github.com/DigitalHerencia/LoadedVibes/releases',
    '  4. Verify the checksums.txt file signature (if GPG signed).',
    '  5. If the issue persists, report it at https://github.com/DigitalHerencia/LoadedVibes/issues',
    '',
    `Requirement: ${REQUIREMENT_ID}`,
    '============================================================',
    '',
  ];
  return lines.join('\n');
}

/**
 * Verifies a file's SHA256 hash against an expected value.
 *
 * @param {string} filePath - Path to the file to verify
 * @param {string} expectedHash - Expected SHA256 hash (hex string)
 * @param {VerifierOptions} [options] - Verification options
 * @returns {Promise<VerificationResult>} Verification result
 */
export async function verifySHA256(
  filePath: string,
  expectedHash: string,
  options: VerifierOptions = {}
): Promise<VerificationResult> {
  const { deleteOnMismatch = true, logger } = options;
  const normalizedExpected = normalizeHash(expectedHash);

  // Check if file exists
  if (!existsSync(filePath)) {
    const error = `File not found: ${filePath}`;
    if (logger) {
      logger.log({
        phase: 'security',
        severity: 'error',
        requirementId: REQUIREMENT_ID,
        message: error,
        data: { filePath, operation: 'sha256-verify' },
      });
    }
    return {
      valid: false,
      computedHash: '',
      expectedHash: normalizedExpected,
      error,
    };
  }

  let computedHash: string;
  try {
    computedHash = await computeSHA256(filePath);
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    if (logger) {
      logger.log({
        phase: 'security',
        severity: 'error',
        requirementId: REQUIREMENT_ID,
        message: `SHA256 computation failed: ${error}`,
        data: { filePath, operation: 'sha256-compute' },
      });
    }
    return {
      valid: false,
      computedHash: '',
      expectedHash: normalizedExpected,
      error,
    };
  }

  const valid = computedHash === normalizedExpected;

  if (valid) {
    if (logger) {
      logger.log({
        phase: 'security',
        severity: 'info',
        requirementId: REQUIREMENT_ID,
        message: `SHA256 verification passed for ${path.basename(filePath)}`,
        data: { filePath, computedHash, operation: 'sha256-verify' },
      });
    }
    return {
      valid: true,
      computedHash,
      expectedHash: normalizedExpected,
    };
  }

  // Hash mismatch - generate remediation guidance
  const guidance = buildRemediationGuidance(filePath, computedHash, normalizedExpected);

  if (logger) {
    logger.log({
      phase: 'security',
      severity: 'error',
      requirementId: REQUIREMENT_ID,
      message: `SHA256 verification FAILED for ${path.basename(filePath)}`,
      data: {
        filePath,
        computedHash,
        expectedHash: normalizedExpected,
        operation: 'sha256-verify',
        guidance,
      },
    });
  }

  // Delete the file on mismatch to prevent use of unsigned payload
  if (deleteOnMismatch) {
    try {
      await unlink(filePath);
      if (logger) {
        logger.log({
          phase: 'security',
          severity: 'warn',
          requirementId: REQUIREMENT_ID,
          message: `Deleted unsigned payload: ${path.basename(filePath)}`,
          data: { filePath, operation: 'sha256-cleanup' },
        });
      }
    } catch (cleanupErr) {
      // Best-effort cleanup; log but don't throw
      if (logger) {
        logger.log({
          phase: 'security',
          severity: 'warn',
          requirementId: REQUIREMENT_ID,
          message: `Failed to delete unsigned payload: ${cleanupErr instanceof Error ? cleanupErr.message : String(cleanupErr)}`,
          data: { filePath, operation: 'sha256-cleanup' },
        });
      }
    }
  }

  return {
    valid: false,
    computedHash,
    expectedHash: normalizedExpected,
    error: `SHA256 mismatch. ${guidance}`,
  };
}

/**
 * Deletes temp/download files recursively.
 * Used for cleanup when verification fails.
 *
 * @param {string[]} paths - Array of file/directory paths to delete
 * @param {Object} [logger] - Optional NDJSON logger instance
 * @returns {Promise<void>}
 */
export async function cleanupTempFiles(
  paths: string[],
  logger?: { log: (event: object) => void }
): Promise<void> {
  for (const targetPath of paths) {
    if (!existsSync(targetPath)) {
      continue;
    }
    try {
      await rm(targetPath, { recursive: true, force: true });
      if (logger) {
        logger.log({
          phase: 'security',
          severity: 'info',
          requirementId: REQUIREMENT_ID,
          message: `Cleaned up temp file: ${path.basename(targetPath)}`,
          data: { path: targetPath, operation: 'cleanup' },
        });
      }
    } catch (err) {
      if (logger) {
        logger.log({
          phase: 'security',
          severity: 'warn',
          requirementId: REQUIREMENT_ID,
          message: `Failed to cleanup: ${err instanceof Error ? err.message : String(err)}`,
          data: { path: targetPath, operation: 'cleanup' },
        });
      }
    }
  }
}

/**
 * Parses a checksums.txt file to extract hash mappings.
 * Expected format: "<hash>  <filename>" or "<hash> <filename>" per line.
 *
 * @param {string} content - Content of checksums.txt file
 * @returns {Map<string, string>} Map of filename to expected hash
 */
export function parseChecksumsFile(content: string): Map<string, string> {
  const checksums = new Map<string, string>();

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // Format: "<hash>  <filename>" (two spaces) or "<hash> <filename>" (one space)
    const match = trimmed.match(/^([a-fA-F0-9]{64})\s+(.+)$/);
    if (match) {
      const hash = normalizeHash(match[1]);
      const filename = match[2].trim();
      checksums.set(filename, hash);
    }
  }

  return checksums;
}

/**
 * Verifies multiple files against a checksums map.
 *
 * @param {string} basePath - Base directory containing files to verify
 * @param {Map<string, string>} checksums - Map of filename to expected hash
 * @param {VerifierOptions} [options] - Verification options
 * @returns {Promise<Map<string, VerificationResult>>} Map of filename to verification result
 */
export async function verifyMultipleFiles(
  basePath: string,
  checksums: Map<string, string>,
  options: VerifierOptions = {}
): Promise<Map<string, VerificationResult>> {
  const results = new Map<string, VerificationResult>();

  for (const [filename, expectedHash] of checksums) {
    const filePath = path.join(basePath, filename);
    const result = await verifySHA256(filePath, expectedHash, options);
    results.set(filename, result);
  }

  return results;
}

export { REQUIREMENT_ID, ALGORITHM };
