// @ts-nocheck
/**
 * Manifest Validator Script
 *
 * Validates that all entries in devcycles.config.json reference valid files
 * and that the manifest structure is coherent with TECH_REQUIREMENTS §6.
 *
 * Usage: node dist/scripts/validate-manifest.js
 *
 * @module validate-manifest
 * @see TECH_REQUIREMENTS §4.1, §4.4, §10, SPEC-ARTIFACTS §3-4
 */

import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const GENAI_ROOT = path.resolve(CURRENT_DIR, '..', 'genaiscript');
const MANIFEST_PATH = path.resolve(GENAI_ROOT, 'devcycles.config.json');

// Canonical DevCycle list from TECH_REQUIREMENTS §6
const CANONICAL_DEVCYCLES = [
  'initialization',
  'scaffolding',
  'configuration',
  'verification',
  'data',
  'auth',
  'testing',
  'validation',
  'features',
  'debug',
  'security',
  'performance',
  'observability',
  'code-review',
  'documentation',
  'ci-cd',
  'deploy',
  'updates',
];

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} success - Overall validation success
 * @property {string[]} errors - Array of error messages
 * @property {string[]} warnings - Array of warning messages
 * @property {Object} summary - Summary statistics
 */

/**
 * Validates a file path exists relative to the genaiscript directory.
 *
 * @param {string} relativePath - Path from manifest
 * @returns {{ exists: boolean, resolvedPath: string }}
 */
function validateFilePath(relativePath) {
  const resolvedPath = path.resolve(GENAI_ROOT, relativePath);
  return {
    exists: existsSync(resolvedPath),
    resolvedPath,
  };
}

/**
 * Validates the manifest structure and file references.
 *
 * @returns {ValidationResult}
 */
function validateManifest() {
  const errors = [];
  const warnings = [];
  const summary = {
    totalDevCycles: 0,
    validDevCycles: 0,
    missingFiles: 0,
    canonicalMatch: false,
  };

  // Check manifest exists
  if (!existsSync(MANIFEST_PATH)) {
    return {
      success: false,
      errors: [`Manifest not found at ${MANIFEST_PATH}`],
      warnings: [],
      summary,
    };
  }

  // Parse manifest
  let manifest;
  try {
    const content = readFileSync(MANIFEST_PATH, 'utf8');
    manifest = JSON.parse(content);
  } catch (err) {
    return {
      success: false,
      errors: [`Failed to parse manifest: ${err.message}`],
      warnings: [],
      summary,
    };
  }

  const manifestKeys = Object.keys(manifest);
  summary.totalDevCycles = manifestKeys.length;

  // Check all 18 canonical DevCycles are present
  const missingDevCycles = CANONICAL_DEVCYCLES.filter((dc) => !manifestKeys.includes(dc));
  const extraDevCycles = manifestKeys.filter((dc) => !CANONICAL_DEVCYCLES.includes(dc));

  if (missingDevCycles.length > 0) {
    errors.push(`Missing canonical DevCycles: ${missingDevCycles.join(', ')}`);
  }

  if (extraDevCycles.length > 0) {
    warnings.push(`Extra DevCycles not in canonical list: ${extraDevCycles.join(', ')}`);
  }

  summary.canonicalMatch = missingDevCycles.length === 0;

  // Validate each DevCycle entry
  for (const [key, entry] of Object.entries(manifest)) {
    const devCycleErrors = [];

    // Check required fields
    if (!entry.label) {
      devCycleErrors.push('Missing required field: label');
    }
    if (!entry.description) {
      devCycleErrors.push('Missing required field: description');
    }
    if (!entry.instructions) {
      devCycleErrors.push('Missing required field: instructions');
    }
    if (!entry.prompt) {
      devCycleErrors.push('Missing required field: prompt');
    }
    if (!entry.toolset) {
      devCycleErrors.push('Missing required field: toolset');
    }

    // Validate file references exist
    if (entry.instructions) {
      const result = validateFilePath(entry.instructions);
      if (!result.exists) {
        devCycleErrors.push(`Instruction file not found: ${entry.instructions}`);
        summary.missingFiles++;
      }
    }

    if (entry.prompt) {
      const result = validateFilePath(entry.prompt);
      if (!result.exists) {
        devCycleErrors.push(`Prompt file not found: ${entry.prompt}`);
        summary.missingFiles++;
      }
    }

    if (entry.toolset) {
      const result = validateFilePath(entry.toolset);
      if (!result.exists) {
        devCycleErrors.push(`Toolset file not found: ${entry.toolset}`);
        summary.missingFiles++;
      }
    }

    // Validate checkpoints
    if (!entry.checkpoints || !Array.isArray(entry.checkpoints)) {
      warnings.push(`${key}: Missing or invalid checkpoints array`);
    }

    // Validate contexts (optional but should be array if present)
    if (entry.contexts && !Array.isArray(entry.contexts)) {
      warnings.push(`${key}: contexts should be an array`);
    }

    // Add errors for this DevCycle
    if (devCycleErrors.length > 0) {
      errors.push(`${key}: ${devCycleErrors.join('; ')}`);
    } else {
      summary.validDevCycles++;
    }
  }

  return {
    success: errors.length === 0,
    errors,
    warnings,
    summary,
  };
}

/**
 * Main execution
 */
function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  Loaded Vibes Manifest Validator');
  console.log('  Reference: TECH_REQUIREMENTS §4.1, §4.4, §10, SPEC-ARTIFACTS §3-4');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const result = validateManifest();

  // Print summary
  console.log('📊 Summary:');
  console.log(`   Total DevCycles: ${result.summary.totalDevCycles}/18`);
  console.log(`   Valid DevCycles: ${result.summary.validDevCycles}`);
  console.log(`   Missing Files: ${result.summary.missingFiles}`);
  console.log(`   Canonical Match: ${result.summary.canonicalMatch ? '✅' : '❌'}`);
  console.log('');

  // Print warnings
  if (result.warnings.length > 0) {
    console.log('⚠️  Warnings:');
    for (const warning of result.warnings) {
      console.log(`   - ${warning}`);
    }
    console.log('');
  }

  // Print errors
  if (result.errors.length > 0) {
    console.log('❌ Errors:');
    for (const error of result.errors) {
      console.log(`   - ${error}`);
    }
    console.log('');
  }

  // Final status
  if (result.success) {
    console.log('✅ Manifest validation PASSED');
    console.log('   All 18 DevCycles present with valid file references.');
  } else {
    console.log('❌ Manifest validation FAILED');
    console.log('   Fix the errors above before proceeding.');
  }

  // Exit with appropriate code
  process.exit(result.success ? 0 : 1);
}

main();
