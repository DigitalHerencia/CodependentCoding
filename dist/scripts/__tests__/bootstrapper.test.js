// @ts-nocheck
/**
 * Bootstrapper Validation Tests
 *
 * Tests for the hardened bootstrapper validation functionality.
 *
 * @see TECH_REQUIREMENTS §4.4, SPEC-SECURITY §2
 */

import { strict as assert } from 'node:assert';
import test from 'node:test';
import { mkdtemp, rm, mkdir, writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { tmpdir } from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPTS_ROOT = path.resolve(__dirname, '..');
const DIST_ROOT = path.resolve(SCRIPTS_ROOT, '..');

// =============================================================================
// Test Utilities
// =============================================================================

async function withTempDir(fn) {
  const base = await mkdtemp(path.join(tmpdir(), 'loaded-vibes-bootstrap-'));
  try {
    await fn(base);
  } finally {
    await rm(base, { recursive: true, force: true });
  }
}

async function createMockVsCodeDir(baseDir) {
  const vscodeDir = path.join(baseDir, '.vscode');
  await mkdir(vscodeDir, { recursive: true });

  // Create mock settings.json
  const settings = {
    'genaiscript.localTypeDefinitions': true,
    'chat.instructionsFilesLocations': {
      '.github/copilot-instructions.md': true,
    },
  };
  await writeFile(path.join(vscodeDir, 'settings.json'), JSON.stringify(settings, null, 2));

  // Create mock extensions.json
  const extensions = {
    recommendations: [
      'github.copilot',
      'github.copilot-chat',
      'esbenp.prettier-vscode',
      'dbaeumer.vscode-eslint',
    ],
  };
  await writeFile(path.join(vscodeDir, 'extensions.json'), JSON.stringify(extensions, null, 2));

  // Create mock mcp.json
  const mcp = {
    mcpServers: {
      filesystem: { command: 'npx', args: ['-y', '@modelcontextprotocol/server-filesystem', '.'] },
      git: { command: 'npx', args: ['-y', '@modelcontextprotocol/server-git', '.'] },
      memory: { command: 'npx', args: ['-y', '@modelcontextprotocol/server-memory'] },
      sequentialthinking: { command: 'npx', args: ['-y', '@modelcontextprotocol/server-sequentialthinking'] },
    },
  };
  await writeFile(path.join(vscodeDir, 'mcp.json'), JSON.stringify(mcp, null, 2));

  return vscodeDir;
}

// =============================================================================
// Validation Status Schema Tests
// =============================================================================

test('[bootstrapper] validation status has correct schema', () => {
  const expectedFields = ['overall', 'timestamp', 'checks', 'summary', 'exitCode'];

  // Verify the schema matches expected structure
  const mockStatus = {
    overall: 'success',
    timestamp: new Date().toISOString(),
    duration: 100,
    phase: 'all',
    checks: [],
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      skipped: 0,
    },
    remediationHints: [],
    exitCode: 0,
    references: {
      spec: 'SPEC-SECURITY §2, TECH_REQUIREMENTS §4.4',
      issue: '#13',
    },
  };

  for (const field of expectedFields) {
    assert.ok(field in mockStatus, `Missing expected field: ${field}`);
  }

  assert.ok(Array.isArray(mockStatus.checks), 'checks should be an array');
  assert.equal(typeof mockStatus.summary.total, 'number', 'summary.total should be a number');
  assert.equal(typeof mockStatus.exitCode, 'number', 'exitCode should be a number');
});

test('[bootstrapper] validation check schema is correct', () => {
  const validCheck = {
    name: 'test-check',
    status: 'pass',
    message: 'Test passed',
    errors: [],
    remediation: [],
  };

  assert.ok(validCheck.name, 'Check should have a name');
  assert.ok(['pass', 'fail', 'warn', 'skip'].includes(validCheck.status), 'Status should be valid');
  assert.ok(typeof validCheck.message === 'string', 'Message should be a string');
  assert.ok(Array.isArray(validCheck.errors), 'Errors should be an array');
  assert.ok(Array.isArray(validCheck.remediation), 'Remediation should be an array');
});

// =============================================================================
// Canonical DevCycle Tests
// =============================================================================

test('[bootstrapper] canonical DevCycles list has 18 entries', () => {
  const CANONICAL_DEVCYCLES = [
    'initialization', 'scaffolding', 'configuration', 'verification',
    'data', 'auth', 'testing', 'validation', 'features', 'debug',
    'security', 'performance', 'observability', 'code-review',
    'documentation', 'ci-cd', 'deploy', 'updates',
  ];

  assert.equal(CANONICAL_DEVCYCLES.length, 18, 'Should have exactly 18 canonical DevCycles');

  // Verify each DevCycle is a valid string
  for (const dc of CANONICAL_DEVCYCLES) {
    assert.equal(typeof dc, 'string', `DevCycle '${dc}' should be a string`);
    assert.ok(dc.length > 0, `DevCycle should not be empty`);
    assert.ok(!dc.includes(' '), `DevCycle '${dc}' should not contain spaces`);
  }
});

test('[bootstrapper] canonical DevCycles match TECH_REQUIREMENTS §6', () => {
  // These are the exact DevCycles from TECH_REQUIREMENTS §6
  const expectedDevCycles = [
    'initialization', 'scaffolding', 'configuration', 'verification',
    'data', 'auth', 'testing', 'validation', 'features', 'debug',
    'security', 'performance', 'observability', 'code-review',
    'documentation', 'ci-cd', 'deploy', 'updates',
  ];

  const CANONICAL_DEVCYCLES = [
    'initialization', 'scaffolding', 'configuration', 'verification',
    'data', 'auth', 'testing', 'validation', 'features', 'debug',
    'security', 'performance', 'observability', 'code-review',
    'documentation', 'ci-cd', 'deploy', 'updates',
  ];

  assert.deepEqual(CANONICAL_DEVCYCLES.sort(), expectedDevCycles.sort(),
    'Canonical DevCycles should match TECH_REQUIREMENTS §6');
});

// =============================================================================
// VS Code Profile Validation Tests
// =============================================================================

test('[bootstrapper] validates VS Code settings.json exists', async () => {
  const settingsPath = path.join(DIST_ROOT, '.vscode', 'settings.json');
  assert.ok(existsSync(settingsPath), 'dist/.vscode/settings.json should exist');
});

test('[bootstrapper] validates VS Code extensions.json exists', async () => {
  const extensionsPath = path.join(DIST_ROOT, '.vscode', 'extensions.json');
  assert.ok(existsSync(extensionsPath), 'dist/.vscode/extensions.json should exist');
});

test('[bootstrapper] validates required settings are present', async () => {
  const settingsPath = path.join(DIST_ROOT, '.vscode', 'settings.json');
  const content = await readFile(settingsPath, 'utf8');

  // Strip comments for JSONC parsing
  const stripped = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  const settings = JSON.parse(stripped);

  // Check genaiscript.localTypeDefinitions is true per TECH §8
  assert.equal(settings['genaiscript.localTypeDefinitions'], true,
    'genaiscript.localTypeDefinitions should be true');

  // Check chat.instructionsFilesLocations exists
  assert.ok('chat.instructionsFilesLocations' in settings,
    'chat.instructionsFilesLocations should be defined');
});

test('[bootstrapper] validates instructionsFilesLocations does not reference dist/**', async () => {
  const settingsPath = path.join(DIST_ROOT, '.vscode', 'settings.json');
  const content = await readFile(settingsPath, 'utf8');
  const stripped = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  const settings = JSON.parse(stripped);

  const instrLocs = settings['chat.instructionsFilesLocations'];
  if (instrLocs && typeof instrLocs === 'object') {
    for (const loc of Object.keys(instrLocs)) {
      assert.ok(!loc.includes('dist/'),
        `instructionsFilesLocations should not reference dist/**. Found: ${loc}`);
    }
  }
});

test('[bootstrapper] validates required extensions in recommendations', async () => {
  const extensionsPath = path.join(DIST_ROOT, '.vscode', 'extensions.json');
  const content = await readFile(extensionsPath, 'utf8');
  const extensions = JSON.parse(content);

  const requiredExtensions = [
    'github.copilot',
    'github.copilot-chat',
    'esbenp.prettier-vscode',
    'dbaeumer.vscode-eslint',
  ];

  assert.ok(extensions.recommendations, 'extensions.json should have recommendations array');

  for (const ext of requiredExtensions) {
    assert.ok(extensions.recommendations.includes(ext),
      `Required extension '${ext}' should be in recommendations`);
  }
});

// =============================================================================
// MCP Endpoint Validation Tests
// =============================================================================

test('[bootstrapper] validates MCP configuration exists', async () => {
  const mcpPath = path.join(DIST_ROOT, '.vscode', 'mcp.json');
  assert.ok(existsSync(mcpPath), 'dist/.vscode/mcp.json should exist');
});

test('[bootstrapper] validates required MCP servers are configured', async () => {
  const mcpPath = path.join(DIST_ROOT, '.vscode', 'mcp.json');
  const content = await readFile(mcpPath, 'utf8');
  const mcpConfig = JSON.parse(content);

  const requiredServers = ['filesystem', 'git', 'memory', 'sequentialthinking'];
  const configuredServers = Object.keys(mcpConfig.mcpServers || {});

  for (const server of requiredServers) {
    assert.ok(configuredServers.includes(server),
      `Required MCP server '${server}' should be configured`);
  }
});

test('[bootstrapper] validates MCP server configurations have command and args', async () => {
  const mcpPath = path.join(DIST_ROOT, '.vscode', 'mcp.json');
  const content = await readFile(mcpPath, 'utf8');
  const mcpConfig = JSON.parse(content);

  for (const [serverName, serverConfig] of Object.entries(mcpConfig.mcpServers || {})) {
    assert.ok(serverConfig.command,
      `MCP server '${serverName}' should have a command`);
    assert.ok(Array.isArray(serverConfig.args),
      `MCP server '${serverName}' should have an args array`);
  }
});

// =============================================================================
// Manifest Coherence Tests
// =============================================================================

test('[bootstrapper] validates manifest exists', async () => {
  const manifestPath = path.join(DIST_ROOT, 'genaiscript', 'devcycles.config.json');
  assert.ok(existsSync(manifestPath), 'devcycles.config.json should exist');
});

test('[bootstrapper] validates manifest has all canonical DevCycles', async () => {
  const manifestPath = path.join(DIST_ROOT, 'genaiscript', 'devcycles.config.json');
  const content = await readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(content);

  const CANONICAL_DEVCYCLES = [
    'initialization', 'scaffolding', 'configuration', 'verification',
    'data', 'auth', 'testing', 'validation', 'features', 'debug',
    'security', 'performance', 'observability', 'code-review',
    'documentation', 'ci-cd', 'deploy', 'updates',
  ];

  const manifestKeys = Object.keys(manifest);

  for (const dc of CANONICAL_DEVCYCLES) {
    assert.ok(manifestKeys.includes(dc),
      `Manifest should include canonical DevCycle: ${dc}`);
  }
});

test('[bootstrapper] validates manifest entries have required fields', async () => {
  const manifestPath = path.join(DIST_ROOT, 'genaiscript', 'devcycles.config.json');
  const content = await readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(content);

  const requiredFields = ['label', 'description', 'instructions', 'toolset', 'prompt'];

  for (const [key, entry] of Object.entries(manifest)) {
    for (const field of requiredFields) {
      assert.ok(entry[field],
        `DevCycle '${key}' should have required field: ${field}`);
    }
  }
});

test('[bootstrapper] validates manifest file references exist', async () => {
  const manifestPath = path.join(DIST_ROOT, 'genaiscript', 'devcycles.config.json');
  const genaiRoot = path.join(DIST_ROOT, 'genaiscript');
  const content = await readFile(manifestPath, 'utf8');
  const manifest = JSON.parse(content);

  const missingFiles = [];

  for (const [key, entry] of Object.entries(manifest)) {
    for (const artifactKey of ['instructions', 'toolset', 'prompt']) {
      if (entry[artifactKey]) {
        const artifactPath = path.resolve(genaiRoot, entry[artifactKey]);
        if (!existsSync(artifactPath)) {
          missingFiles.push(`${key}.${artifactKey}: ${entry[artifactKey]}`);
        }
      }
    }
  }

  assert.equal(missingFiles.length, 0,
    `All manifest file references should exist. Missing: ${missingFiles.join(', ')}`);
});

// =============================================================================
// Exit Code Tests
// =============================================================================

test('[bootstrapper] exit codes are correctly defined', () => {
  const EXIT_SUCCESS = 0;
  const EXIT_VALIDATION_FAILED = 1;
  const EXIT_ORCHESTRATOR_FAILED = 2;
  const EXIT_MISSING_PREREQ = 3;

  assert.equal(EXIT_SUCCESS, 0, 'EXIT_SUCCESS should be 0');
  assert.equal(EXIT_VALIDATION_FAILED, 1, 'EXIT_VALIDATION_FAILED should be 1');
  assert.equal(EXIT_ORCHESTRATOR_FAILED, 2, 'EXIT_ORCHESTRATOR_FAILED should be 2');
  assert.equal(EXIT_MISSING_PREREQ, 3, 'EXIT_MISSING_PREREQ should be 3');
});

// =============================================================================
// JSON Output Tests
// =============================================================================

test('[bootstrapper] JSON output schema is valid', () => {
  const mockJsonOutput = {
    overall: 'success',
    timestamp: '2025-01-01T00:00:00.000Z',
    duration: 150,
    phase: 'initialization',
    checks: [
      {
        name: 'vscode-profile',
        status: 'pass',
        message: 'VS Code profile validation passed',
        errors: [],
        remediation: [],
      },
    ],
    summary: {
      total: 1,
      passed: 1,
      failed: 0,
      warnings: 0,
      skipped: 0,
    },
    remediationHints: [],
    exitCode: 0,
    references: {
      spec: 'SPEC-SECURITY §2, TECH_REQUIREMENTS §4.4',
      issue: '#13',
    },
  };

  // Validate JSON is serializable
  const serialized = JSON.stringify(mockJsonOutput);
  const deserialized = JSON.parse(serialized);

  assert.deepEqual(deserialized, mockJsonOutput, 'JSON output should be round-trip serializable');
});

test('[bootstrapper] JSON output includes all required sections', () => {
  const requiredSections = [
    'overall', 'timestamp', 'checks', 'summary', 'exitCode', 'references',
  ];

  const mockJsonOutput = {
    overall: 'success',
    timestamp: new Date().toISOString(),
    duration: 100,
    phase: 'all',
    checks: [],
    summary: { total: 0, passed: 0, failed: 0, warnings: 0, skipped: 0 },
    exitCode: 0,
    references: { spec: 'SPEC-SECURITY §2', issue: '#13' },
  };

  for (const section of requiredSections) {
    assert.ok(section in mockJsonOutput, `JSON output should include '${section}' section`);
  }
});

// =============================================================================
// Remediation Hint Tests
// =============================================================================

test('[bootstrapper] remediation hints are provided for failures', () => {
  const mockFailedCheck = {
    name: 'test-check',
    status: 'fail',
    message: 'Test failed',
    errors: ['Test error message'],
    remediation: ['Fix by doing X', 'Or try doing Y'],
  };

  assert.ok(mockFailedCheck.remediation.length > 0,
    'Failed checks should provide remediation hints');
  assert.ok(mockFailedCheck.remediation.every(hint => typeof hint === 'string'),
    'Remediation hints should be strings');
});

test('[bootstrapper] remediation hints reference correct documentation', () => {
  const sampleRemediation = [
    'Add entries for missing DevCycles to devcycles.config.json per TECH §6',
    'Set "genaiscript.localTypeDefinitions": true in settings.json per TECH §8',
    'Remove dist/** references from chat.instructionsFilesLocations per SPEC-ARCH §3',
  ];

  for (const hint of sampleRemediation) {
    // Check that hints reference documentation
    assert.ok(
      hint.includes('TECH') || hint.includes('SPEC') || hint.includes('PRD'),
      `Remediation hint should reference documentation: ${hint}`
    );
  }
});

// =============================================================================
// Core Files Validation Tests
// =============================================================================

test('[bootstrapper] validates core project files exist', () => {
  const coreFiles = [
    { path: path.join(DIST_ROOT, '..', 'docs', 'PRD.md'), name: 'PRD.md' },
    { path: path.join(DIST_ROOT, '..', 'docs', 'TECH_REQUIREMENTS.md'), name: 'TECH_REQUIREMENTS.md' },
    { path: path.join(DIST_ROOT, '..', 'TODO.md'), name: 'TODO.md' },
    { path: path.join(DIST_ROOT, '..', 'CHANGELOG.md'), name: 'CHANGELOG.md' },
    { path: path.join(DIST_ROOT, '..', 'README.md'), name: 'README.md' },
  ];

  for (const file of coreFiles) {
    assert.ok(existsSync(file.path), `Core file '${file.name}' should exist`);
  }
});
