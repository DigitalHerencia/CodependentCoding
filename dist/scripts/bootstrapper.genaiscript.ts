// @ts-nocheck
/**
 * Loaded Vibes Bootstrapper - Hardened Validation
 *
 * Validates DevCycle manifest, VS Code profiles, MCP endpoints, and tool wiring
 * before running the orchestrator. Emits machine-readable JSON status for CI consumption.
 *
 * @module bootstrapper.genaiscript
 * @see TECH_REQUIREMENTS §4.4, SPEC-SECURITY §2, PRD §5.1
 */

import path from 'path';
import { access, copyFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { loadManifest, resolveFromGenai, ARTIFACTS_ROOT, REPO_ROOT } from '../genaiscript/shared/context.js';

script({
  title: 'Loaded Vibes Bootstrapper',
  description:
    'Validates DevCycle manifest, VS Code profile alignment, MCP endpoints, and tool wiring before running the orchestrator. Emits machine-readable JSON status for CI/CLI consumption.',
  parameters: {
    phase: {
      type: 'string',
      description: 'Optional DevCycle key to validate specifically.',
    },
    profilePath: {
      type: 'string',
      description:
        'Path to the VS Code profile that should mirror dist/.vscode/profile.jsonc',
    },
    preflightOnly: {
      type: 'boolean',
      description: 'Run validations without emitting user guidance messages.',
      default: false,
    },
    fixProfile: {
      type: 'boolean',
      description: 'Create/update the profile file if it is missing.',
      default: false,
    },
    jsonOutput: {
      type: 'boolean',
      description: 'Emit machine-readable JSON status output for CI consumption.',
      default: false,
    },
    skipMcpCheck: {
      type: 'boolean',
      description: 'Skip MCP endpoint verification (useful for offline environments).',
      default: false,
    },
  },
  tools: ['filesystem/*', 'sequentialthinking/*'],
});

// =============================================================================
// Types and Constants
// =============================================================================

/**
 * @typedef {Object} ValidationCheck
 * @property {string} name - Check name
 * @property {'pass'|'fail'|'warn'|'skip'} status - Check status
 * @property {string} message - Human-readable message
 * @property {string[]} [errors] - Error details
 * @property {string[]} [remediation] - Remediation steps
 */

/**
 * @typedef {Object} BootstrapStatus
 * @property {'success'|'failure'|'partial'} overall - Overall status
 * @property {string} timestamp - ISO timestamp
 * @property {ValidationCheck[]} checks - Individual check results
 * @property {Object} summary - Summary statistics
 * @property {string[]} [remediationHints] - Aggregated remediation hints
 */

const CANONICAL_DEVCYCLES = [
  'initialization', 'scaffolding', 'configuration', 'verification',
  'data', 'auth', 'testing', 'validation', 'features', 'debug',
  'security', 'performance', 'observability', 'code-review',
  'documentation', 'ci-cd', 'deploy', 'updates',
];

const REQUIRED_EXTENSIONS = [
  'github.copilot',
  'github.copilot-chat',
  'esbenp.prettier-vscode',
  'dbaeumer.vscode-eslint',
];

const REQUIRED_SETTINGS = [
  'genaiscript.localTypeDefinitions',
  'chat.instructionsFilesLocations',
];

const MCP_SERVERS = [
  'filesystem', 'git', 'memory', 'sequentialthinking',
];

// =============================================================================
// Utility Functions
// =============================================================================

async function fileExists(candidate) {
  try {
    await access(candidate);
    return true;
  } catch (error) {
    return false;
  }
}

async function readJsonFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    // Strip single-line comments (but not URLs containing //)
    // Match // only at the start of a line or preceded by whitespace
    const stripped = content
      .replace(/^\s*\/\/.*$/gm, '')  // Remove lines that start with //
      .replace(/,\s*\/\/[^"\n]*$/gm, ',')  // Remove trailing // comments after values
      .replace(/\/\*[\s\S]*?\*\//g, '');  // Remove block comments
    return JSON.parse(stripped);
  } catch (error) {
    return null;
  }
}

async function ensureProfile(targetPath) {
  const resolvedTarget = path.resolve(targetPath);
  if (await fileExists(resolvedTarget)) {
    return { created: false, path: resolvedTarget, exists: true };
  }

  const templatePath = path.resolve(ARTIFACTS_ROOT, '.vscode', 'profile.jsonc');
  if (!(await fileExists(templatePath))) {
    throw new Error('Profile template missing at dist/.vscode/profile.jsonc');
  }

  await copyFile(templatePath, resolvedTarget);
  return { created: true, path: resolvedTarget, exists: true };
}

// =============================================================================
// Validation Functions
// =============================================================================

/**
 * Validates VS Code profile alignment per SPEC-SECURITY §2.
 *
 * @returns {Promise<ValidationCheck>}
 */
async function validateVsCodeProfile() {
  const check = {
    name: 'vscode-profile',
    status: 'pass',
    message: '',
    errors: [],
    remediation: [],
  };

  // Check shipped settings exist
  const shippedSettingsPath = path.resolve(ARTIFACTS_ROOT, '.vscode', 'settings.json');
  const shippedExtensionsPath = path.resolve(ARTIFACTS_ROOT, '.vscode', 'extensions.json');

  if (!(await fileExists(shippedSettingsPath))) {
    check.status = 'fail';
    check.errors.push('Shipped settings.json not found at dist/.vscode/settings.json');
    check.remediation.push('Ensure dist/.vscode/settings.json exists and contains required VS Code settings.');
  }

  if (!(await fileExists(shippedExtensionsPath))) {
    check.status = 'fail';
    check.errors.push('Shipped extensions.json not found at dist/.vscode/extensions.json');
    check.remediation.push('Ensure dist/.vscode/extensions.json exists with recommended extensions.');
  }

  // Read and validate shipped settings
  const shippedSettings = await readJsonFile(shippedSettingsPath);
  if (shippedSettings) {
    for (const setting of REQUIRED_SETTINGS) {
      if (!(setting in shippedSettings)) {
        check.status = check.status === 'fail' ? 'fail' : 'warn';
        check.errors.push(`Required setting '${setting}' missing in shipped settings`);
        check.remediation.push(`Add '${setting}' to dist/.vscode/settings.json per TECH_REQUIREMENTS §8`);
      }
    }

    // Ensure genaiscript.localTypeDefinitions is true (TECH §8)
    if (shippedSettings['genaiscript.localTypeDefinitions'] !== true) {
      check.status = check.status === 'fail' ? 'fail' : 'warn';
      check.errors.push('genaiscript.localTypeDefinitions should be true');
      check.remediation.push('Set "genaiscript.localTypeDefinitions": true in settings.json per TECH §8');
    }

    // Ensure instructionsFilesLocations does NOT reference dist/** (SPEC-ARCH §3)
    const instrLocs = shippedSettings['chat.instructionsFilesLocations'];
    if (instrLocs && typeof instrLocs === 'object') {
      for (const loc of Object.keys(instrLocs)) {
        // Check if path starts with dist/ or is exactly 'dist'
        if (loc === 'dist' || loc.startsWith('dist/') || loc.startsWith('./dist/') || loc.startsWith('/dist/')) {
          check.status = 'fail';
          check.errors.push(`instructionsFilesLocations references shipped path: ${loc}`);
          check.remediation.push('Remove dist/** references from chat.instructionsFilesLocations per SPEC-ARCH §3');
        }
      }
    }
  }

  // Validate recommended extensions
  const shippedExtensions = await readJsonFile(shippedExtensionsPath);
  if (shippedExtensions && shippedExtensions.recommendations) {
    for (const ext of REQUIRED_EXTENSIONS) {
      if (!shippedExtensions.recommendations.includes(ext)) {
        check.status = check.status === 'fail' ? 'fail' : 'warn';
        check.errors.push(`Required extension '${ext}' not in recommendations`);
        check.remediation.push(`Add '${ext}' to dist/.vscode/extensions.json recommendations`);
      }
    }
  }

  check.message = check.status === 'pass'
    ? 'VS Code profile validation passed'
    : `VS Code profile validation ${check.status}: ${check.errors.length} issue(s) found`;

  return check;
}

/**
 * Validates MCP endpoint availability.
 *
 * @param {boolean} skip - Skip MCP verification
 * @returns {Promise<ValidationCheck>}
 */
async function validateMcpEndpoints(skip = false) {
  const check = {
    name: 'mcp-endpoints',
    status: 'pass',
    message: '',
    errors: [],
    remediation: [],
  };

  if (skip) {
    check.status = 'skip';
    check.message = 'MCP endpoint verification skipped';
    return check;
  }

  // Check MCP config file exists
  const mcpConfigPath = path.resolve(ARTIFACTS_ROOT, '.vscode', 'mcp.json');
  if (!(await fileExists(mcpConfigPath))) {
    check.status = 'fail';
    check.errors.push('MCP configuration not found at dist/.vscode/mcp.json');
    check.remediation.push('Create dist/.vscode/mcp.json with required MCP server configurations.');
    check.message = 'MCP configuration file missing';
    return check;
  }

  const mcpConfig = await readJsonFile(mcpConfigPath);
  if (!mcpConfig || !mcpConfig.mcpServers) {
    check.status = 'fail';
    check.errors.push('MCP configuration is invalid or missing mcpServers');
    check.remediation.push('Ensure mcp.json contains valid mcpServers object.');
    check.message = 'MCP configuration invalid';
    return check;
  }

  // Verify required MCP servers are configured
  const configuredServers = Object.keys(mcpConfig.mcpServers);
  for (const server of MCP_SERVERS) {
    if (!configuredServers.includes(server)) {
      check.status = check.status === 'fail' ? 'fail' : 'warn';
      check.errors.push(`Required MCP server '${server}' not configured`);
      check.remediation.push(`Add '${server}' configuration to mcp.json per TECH_REQUIREMENTS §2`);
    }
  }

  // Validate MCP server command accessibility
  for (const [serverName, serverConfig] of Object.entries(mcpConfig.mcpServers)) {
    if (!serverConfig.command) {
      check.status = check.status === 'fail' ? 'fail' : 'warn';
      check.errors.push(`MCP server '${serverName}' missing command`);
      check.remediation.push(`Add 'command' field to ${serverName} configuration in mcp.json`);
    }
    if (!serverConfig.args || !Array.isArray(serverConfig.args)) {
      check.status = check.status === 'fail' ? 'fail' : 'warn';
      check.errors.push(`MCP server '${serverName}' missing or invalid args`);
      check.remediation.push(`Add valid 'args' array to ${serverName} configuration in mcp.json`);
    }
  }

  check.message = check.status === 'pass'
    ? `MCP endpoints verified: ${configuredServers.length} server(s) configured`
    : `MCP endpoint validation ${check.status}: ${check.errors.length} issue(s) found`;

  return check;
}

/**
 * Validates manifest coherence per TECH_REQUIREMENTS §4.4 and SPEC-ARTIFACTS §3-4.
 *
 * @param {Object} manifest - Loaded manifest
 * @param {string|null} requestedPhase - Specific phase to validate
 * @returns {Promise<ValidationCheck>}
 */
async function validateManifestCoherence(manifest, requestedPhase = null) {
  const check = {
    name: 'manifest-coherence',
    status: 'pass',
    message: '',
    errors: [],
    remediation: [],
  };

  const phaseEntries = requestedPhase
    ? { [requestedPhase]: manifest[requestedPhase] }
    : manifest;

  // Check canonical DevCycle coverage
  if (!requestedPhase) {
    const manifestKeys = Object.keys(manifest);
    const missingDevCycles = CANONICAL_DEVCYCLES.filter((dc) => !manifestKeys.includes(dc));
    const extraDevCycles = manifestKeys.filter((dc) => !CANONICAL_DEVCYCLES.includes(dc));

    if (missingDevCycles.length > 0) {
      check.status = 'fail';
      check.errors.push(`Missing canonical DevCycles: ${missingDevCycles.join(', ')}`);
      check.remediation.push(`Add entries for missing DevCycles to devcycles.config.json per TECH §6`);
    }

    if (extraDevCycles.length > 0) {
      check.errors.push(`Extra DevCycles not in canonical list: ${extraDevCycles.join(', ')}`);
      // This is just informational, not a failure
    }
  }

  // Validate each phase entry
  const missingArtifacts = [];
  for (const [phaseKey, entry] of Object.entries(phaseEntries)) {
    if (!entry) {
      check.status = 'fail';
      check.errors.push(`Phase '${phaseKey}' has no configuration entry`);
      check.remediation.push(`Add configuration for '${phaseKey}' in devcycles.config.json`);
      continue;
    }

    // Check required fields
    const requiredFields = ['label', 'description', 'instructions', 'toolset', 'prompt'];
    for (const field of requiredFields) {
      if (!entry[field]) {
        check.status = 'fail';
        check.errors.push(`Phase '${phaseKey}' missing required field: ${field}`);
        check.remediation.push(`Add '${field}' to ${phaseKey} entry in devcycles.config.json`);
      }
    }

    // Validate file references exist
    for (const artifactKey of ['instructions', 'toolset', 'prompt']) {
      if (entry[artifactKey]) {
        const absolutePath = resolveFromGenai(entry[artifactKey]);
        if (!(await fileExists(absolutePath))) {
          check.status = 'fail';
          missingArtifacts.push({
            phase: phaseKey,
            artifactKey,
            relativePath: entry[artifactKey],
            absolutePath,
          });
          check.errors.push(`Phase '${phaseKey}': ${artifactKey} file not found at ${entry[artifactKey]}`);
          check.remediation.push(`Create ${entry[artifactKey]} or fix reference in devcycles.config.json`);
        }
      }
    }

    // Validate checkpoints array
    if (!entry.checkpoints || !Array.isArray(entry.checkpoints)) {
      check.status = check.status === 'fail' ? 'fail' : 'warn';
      check.errors.push(`Phase '${phaseKey}' missing or invalid checkpoints array`);
      check.remediation.push(`Add 'checkpoints' array to ${phaseKey} entry per TECH §4.1`);
    }
  }

  const validPhases = Object.keys(phaseEntries).length - missingArtifacts.length;
  check.message = check.status === 'pass'
    ? `Manifest coherence verified: ${validPhases}/${Object.keys(phaseEntries).length} phases valid`
    : `Manifest coherence ${check.status}: ${check.errors.length} issue(s) found`;

  return check;
}

/**
 * Validates core project files exist.
 *
 * @returns {Promise<ValidationCheck>}
 */
async function validateCoreFiles() {
  const check = {
    name: 'core-files',
    status: 'pass',
    message: '',
    errors: [],
    remediation: [],
  };

  const coreFiles = [
    { path: path.resolve(REPO_ROOT, 'docs', 'PRD.md'), name: 'PRD.md' },
    { path: path.resolve(REPO_ROOT, 'docs', 'TECH_REQUIREMENTS.md'), name: 'TECH_REQUIREMENTS.md' },
    { path: path.resolve(REPO_ROOT, 'TODO.md'), name: 'TODO.md' },
    { path: path.resolve(REPO_ROOT, 'CHANGELOG.md'), name: 'CHANGELOG.md' },
    { path: path.resolve(REPO_ROOT, 'README.md'), name: 'README.md' },
  ];

  for (const file of coreFiles) {
    if (!(await fileExists(file.path))) {
      check.status = 'fail';
      check.errors.push(`Core file missing: ${file.name}`);
      check.remediation.push(`Create ${file.name} in the repository root or docs/ directory`);
    }
  }

  check.message = check.status === 'pass'
    ? 'All core project files present'
    : `Core files validation ${check.status}: ${check.errors.length} file(s) missing`;

  return check;
}

/**
 * Validates profile file status.
 *
 * @param {string} profilePath - Path to profile file
 * @param {boolean} fixProfile - Whether to auto-fix missing profile
 * @returns {Promise<ValidationCheck>}
 */
async function validateProfileFile(profilePath, fixProfile = false) {
  const check = {
    name: 'profile-file',
    status: 'pass',
    message: '',
    errors: [],
    remediation: [],
  };

  const defaultProfilePath = path.resolve(ARTIFACTS_ROOT, '.vscode', 'profile.jsonc');
  const resolvedProfilePath = path.resolve(profilePath || defaultProfilePath);

  const exists = await fileExists(resolvedProfilePath);

  if (!exists && fixProfile) {
    try {
      const status = await ensureProfile(resolvedProfilePath);
      check.message = status.created
        ? `Profile file created at ${resolvedProfilePath}`
        : `Profile file exists at ${resolvedProfilePath}`;
    } catch (error) {
      check.status = 'fail';
      check.errors.push(`Failed to create profile: ${error.message}`);
      check.remediation.push('Manually create profile.jsonc from dist/.vscode/profile.jsonc template');
    }
  } else if (!exists) {
    check.status = 'warn';
    check.errors.push(`Profile file not found at ${resolvedProfilePath}`);
    check.remediation.push('Run with --fixProfile to auto-create, or manually copy dist/.vscode/profile.jsonc');
    check.message = 'Profile file missing (optional)';
  } else {
    check.message = `Profile file exists at ${resolvedProfilePath}`;
  }

  return check;
}

// =============================================================================
// Main Execution
// =============================================================================

async function runBootstrapValidation() {
  const startTime = new Date();
  const checks = [];
  const remediationHints = [];

  // Load manifest
  let manifest;
  try {
    manifest = await loadManifest();
  } catch (error) {
    const status = {
      overall: 'failure',
      timestamp: startTime.toISOString(),
      checks: [{
        name: 'manifest-load',
        status: 'fail',
        message: `Failed to load manifest: ${error.message}`,
        errors: [error.message],
        remediation: ['Ensure devcycles.config.json exists and is valid JSON'],
      }],
      summary: { total: 1, passed: 0, failed: 1, warnings: 0, skipped: 0 },
      remediationHints: ['Fix devcycles.config.json before proceeding'],
      exitCode: 1,
    };

    if (env.vars.jsonOutput === 'true' || env.vars.jsonOutput === true) {
      console.log(JSON.stringify(status, null, 2));
    } else {
      console.error('❌ Bootstrap failed: Unable to load manifest');
      console.error(error.message);
    }
    throw new Error('Bootstrap validation failed: manifest load error');
  }

  const requestedPhase = env.vars.phase ? env.vars.phase.toLowerCase() : null;

  // Validate requested phase exists
  if (requestedPhase && !manifest[requestedPhase]) {
    const status = {
      overall: 'failure',
      timestamp: startTime.toISOString(),
      checks: [{
        name: 'phase-validation',
        status: 'fail',
        message: `Phase '${requestedPhase}' not found in manifest`,
        errors: [`Invalid phase: ${requestedPhase}`],
        remediation: [`Use one of: ${Object.keys(manifest).join(', ')}`],
      }],
      summary: { total: 1, passed: 0, failed: 1, warnings: 0, skipped: 0 },
      remediationHints: [`Valid phases: ${Object.keys(manifest).join(', ')}`],
      exitCode: 1,
    };

    if (env.vars.jsonOutput === 'true' || env.vars.jsonOutput === true) {
      console.log(JSON.stringify(status, null, 2));
    } else {
      console.error(`❌ Phase '${requestedPhase}' not found`);
      console.error(`Allowed values: ${Object.keys(manifest).join(', ')}`);
    }
    throw new Error(`Phase '${requestedPhase}' not found`);
  }

  // Run all validation checks
  const [vsCodeCheck, mcpCheck, manifestCheck, coreFilesCheck, profileCheck] = await Promise.all([
    validateVsCodeProfile(),
    validateMcpEndpoints(env.vars.skipMcpCheck === 'true' || env.vars.skipMcpCheck === true),
    validateManifestCoherence(manifest, requestedPhase),
    validateCoreFiles(),
    validateProfileFile(
      env.vars.profilePath,
      env.vars.fixProfile === 'true' || env.vars.fixProfile === true
    ),
  ]);

  checks.push(vsCodeCheck, mcpCheck, manifestCheck, coreFilesCheck, profileCheck);

  // Aggregate remediation hints
  for (const check of checks) {
    if (check.remediation && check.remediation.length > 0) {
      remediationHints.push(...check.remediation);
    }
  }

  // Calculate summary
  const summary = {
    total: checks.length,
    passed: checks.filter((c) => c.status === 'pass').length,
    failed: checks.filter((c) => c.status === 'fail').length,
    warnings: checks.filter((c) => c.status === 'warn').length,
    skipped: checks.filter((c) => c.status === 'skip').length,
  };

  // Determine overall status
  let overall = 'success';
  let exitCode = 0;
  if (summary.failed > 0) {
    overall = 'failure';
    exitCode = 1;
  } else if (summary.warnings > 0) {
    overall = 'partial';
    exitCode = 0; // Warnings don't fail the build
  }

  const status = {
    overall,
    timestamp: startTime.toISOString(),
    duration: Date.now() - startTime.getTime(),
    phase: requestedPhase || 'all',
    checks,
    summary,
    remediationHints: remediationHints.length > 0 ? [...new Set(remediationHints)] : undefined,
    exitCode,
    references: {
      spec: 'SPEC-SECURITY §2, TECH_REQUIREMENTS §4.4',
      issue: '#13',
    },
  };

  // Output results
  if (env.vars.jsonOutput === 'true' || env.vars.jsonOutput === true) {
    console.log(JSON.stringify(status, null, 2));
  } else if (!env.vars.preflightOnly || env.vars.preflightOnly === 'false') {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  🧭 Loaded Vibes Bootstrap Validation Report');
    console.log('  Reference: TECH_REQUIREMENTS §4.4, SPEC-SECURITY §2');
    console.log('═══════════════════════════════════════════════════════════════\n');

    for (const check of checks) {
      const statusEmoji = {
        pass: '✅',
        fail: '❌',
        warn: '⚠️ ',
        skip: '⏭️ ',
      }[check.status];

      console.log(`${statusEmoji} ${check.name}: ${check.message}`);

      if (check.errors && check.errors.length > 0 && check.status !== 'pass') {
        for (const error of check.errors) {
          console.log(`   └─ ${error}`);
        }
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   Total checks: ${summary.total}`);
    console.log(`   Passed: ${summary.passed}`);
    console.log(`   Failed: ${summary.failed}`);
    console.log(`   Warnings: ${summary.warnings}`);
    console.log(`   Skipped: ${summary.skipped}`);

    if (remediationHints.length > 0 && overall !== 'success') {
      console.log('\n💡 Remediation Hints:');
      const uniqueHints = [...new Set(remediationHints)];
      for (let i = 0; i < Math.min(uniqueHints.length, 5); i++) {
        console.log(`   ${i + 1}. ${uniqueHints[i]}`);
      }
      if (uniqueHints.length > 5) {
        console.log(`   ... and ${uniqueHints.length - 5} more (use --jsonOutput for full list)`);
      }
    }

    console.log('');
    if (overall === 'success') {
      console.log('✅ Bootstrap validation PASSED');
    } else if (overall === 'partial') {
      console.log('⚠️  Bootstrap validation PASSED with warnings');
    } else {
      console.log('❌ Bootstrap validation FAILED');
    }
  }

  if (exitCode !== 0) {
    throw new Error(`Bootstrap validation failed with ${summary.failed} error(s)`);
  }

  return status;
}

// Execute validation
await runBootstrapValidation();

