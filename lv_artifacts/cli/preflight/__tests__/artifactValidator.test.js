// @ts-nocheck
/**
 * Tests for Artifact Validator Module
 *
 * @see spec/artifact.spec.md §4 - Validation & Tagging
 * @see docs/TECH_REQUIREMENTS.md §4.4 - Bootstrapper Flow
 * @see Issue #28 - Artifact validation during bootstrap
 */
import { strict as assert } from 'node:assert';
import test from 'node:test';
import { mkdtemp, rm, mkdir, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';

import {
  parseFrontmatter,
  validateFrontmatter,
  validateApplyToPattern,
  validateRequiredSections,
  validateToolsetFile,
  validateMarkdownArtifact,
  ARTIFACT_SCHEMAS,
} from '../artifactValidator.js';

async function withTempDir(fn) {
  const base = await mkdtemp(path.join(tmpdir(), 'loaded-vibes-artifact-'));
  try {
    await fn(base);
  } finally {
    await rm(base, { recursive: true, force: true });
  }
}

// ============================================================================
// parseFrontmatter tests
// ============================================================================

test('[parseFrontmatter] parses standard YAML frontmatter', () => {
  const content = `---
name: "TestFile"
description: "A test file"
applyTo: "**"
---

# Test Content

Some markdown here.`;

  const { frontmatter, body } = parseFrontmatter(content);

  assert.ok(frontmatter, 'frontmatter should be parsed');
  assert.equal(frontmatter.name, 'TestFile');
  assert.equal(frontmatter.description, 'A test file');
  assert.equal(frontmatter.applyTo, '**');
  assert.ok(body.includes('# Test Content'), 'body should contain markdown content');
});

test('[parseFrontmatter] parses code-fence wrapped frontmatter', () => {
  const content = `\`\`\`instructions
---
name: initialization.instructions
applyTo: "**"
description: "Domain-agnostic rules"
---

# Initialization DevCycle Instructions

## 1. Purpose
Some purpose here.
\`\`\``;

  const { frontmatter, body } = parseFrontmatter(content);

  assert.ok(frontmatter, 'frontmatter should be parsed from code fence');
  assert.equal(frontmatter.name, 'initialization.instructions');
  assert.equal(frontmatter.applyTo, '**');
  assert.ok(body.includes('# Initialization'), 'body should contain content after frontmatter');
});

test('[parseFrontmatter] handles inline array syntax', () => {
  const content = `---
name: "TestPrompt"
tools: ["filesystem/*", "githubRepo", "memory/*"]
---

# Content`;

  const { frontmatter } = parseFrontmatter(content);

  assert.ok(Array.isArray(frontmatter.tools), 'tools should be an array');
  assert.equal(frontmatter.tools.length, 3);
  assert.ok(frontmatter.tools.includes('filesystem/*'));
});

test('[parseFrontmatter] returns null frontmatter for missing frontmatter', () => {
  const content = `# Just a markdown file

No frontmatter here.`;

  const { frontmatter, body } = parseFrontmatter(content);

  assert.equal(frontmatter, null, 'frontmatter should be null');
  assert.ok(body.includes('# Just a markdown file'), 'body should be entire content');
});

// ============================================================================
// validateFrontmatter tests
// ============================================================================

test('[validateFrontmatter] passes with all required fields', () => {
  const frontmatter = {
    name: 'test.instructions',
    applyTo: '**',
    description: 'A test instruction file',
  };
  const schema = ARTIFACT_SCHEMAS.instruction.frontmatter;

  const result = validateFrontmatter(frontmatter, schema, '/path/to/test.instructions.md');

  assert.ok(result.valid, 'should be valid');
  assert.equal(result.errors.length, 0, 'should have no errors');
});

test('[validateFrontmatter] fails with missing required fields', () => {
  const frontmatter = {
    name: 'test.instructions',
    // missing applyTo and description
  };
  const schema = ARTIFACT_SCHEMAS.instruction.frontmatter;

  const result = validateFrontmatter(frontmatter, schema, '/path/to/test.instructions.md');

  assert.ok(!result.valid, 'should be invalid');
  assert.ok(result.errors.some((e) => e.includes('applyTo')), 'should mention applyTo');
  assert.ok(result.errors.some((e) => e.includes('description')), 'should mention description');
});

test('[validateFrontmatter] fails with null frontmatter', () => {
  const schema = ARTIFACT_SCHEMAS.instruction.frontmatter;

  const result = validateFrontmatter(null, schema, '/path/to/test.instructions.md');

  assert.ok(!result.valid, 'should be invalid');
  assert.ok(result.errors.some((e) => e.includes('Missing YAML frontmatter')));
});

// ============================================================================
// validateApplyToPattern tests
// ============================================================================

test('[validateApplyToPattern] accepts ** pattern', () => {
  const result = validateApplyToPattern('**', '/path/to/file.md');
  assert.ok(result.valid);
  assert.equal(result.errors.length, 0);
});

test('[validateApplyToPattern] accepts *.md pattern', () => {
  const result = validateApplyToPattern('*.md', '/path/to/file.md');
  assert.ok(result.valid);
  assert.equal(result.errors.length, 0);
});

test('[validateApplyToPattern] warns on unusual patterns', () => {
  const result = validateApplyToPattern('foo/bar', '/path/to/file.md');
  assert.ok(result.valid); // Still valid, just a warning
  assert.ok(result.warnings.some((w) => w.includes('Unusual')));
});

test('[validateApplyToPattern] fails with missing pattern', () => {
  const result = validateApplyToPattern(null, '/path/to/file.md');
  assert.ok(!result.valid);
  assert.ok(result.errors.some((e) => e.includes("Missing 'applyTo'")));
});

// ============================================================================
// validateRequiredSections tests
// ============================================================================

test('[validateRequiredSections] passes with all sections present', () => {
  const body = `
# My Document

## Purpose
This is the purpose.

## Responsibilities
These are the responsibilities.
`;
  const result = validateRequiredSections(body, ['Purpose', 'Responsibilities'], '/path/to/file.md');
  assert.ok(result.valid);
  assert.equal(result.warnings.length, 0);
});

test('[validateRequiredSections] handles numbered sections', () => {
  const body = `
# My Document

## 1. Purpose
This is the purpose.

## 2. Responsibilities
These are the responsibilities.
`;
  const result = validateRequiredSections(body, ['Purpose', 'Responsibilities'], '/path/to/file.md');
  assert.ok(result.valid);
  assert.equal(result.warnings.length, 0);
});

test('[validateRequiredSections] warns on missing sections', () => {
  const body = `
# My Document

## Purpose
Just purpose, no responsibilities.
`;
  const result = validateRequiredSections(body, ['Purpose', 'Responsibilities'], '/path/to/file.md');
  assert.ok(result.valid); // Still valid, just warnings
  assert.ok(result.warnings.some((w) => w.includes('Responsibilities')));
});

// ============================================================================
// validateToolsetFile tests
// ============================================================================

test('[validateToolsetFile] passes with valid toolset', async () => {
  await withTempDir(async (dir) => {
    const filePath = path.join(dir, 'test.toolset.jsonc');
    const content = JSON.stringify({
      name: 'test.toolset',
      description: 'A test toolset',
      tools: {
        mcpServers: ['filesystem', 'git'],
        extensions: [],
        cli: ['node'],
      },
    }, null, 2);
    await writeFile(filePath, content, 'utf8');

    const result = validateToolsetFile(filePath);
    assert.ok(result.valid, 'should be valid');
    assert.equal(result.errors.length, 0);
  });
});

test('[validateToolsetFile] fails with missing required fields', async () => {
  await withTempDir(async (dir) => {
    const filePath = path.join(dir, 'test.toolset.jsonc');
    const content = JSON.stringify({
      // missing name, description
      tools: {},
    }, null, 2);
    await writeFile(filePath, content, 'utf8');

    const result = validateToolsetFile(filePath);
    assert.ok(!result.valid, 'should be invalid');
    assert.ok(result.errors.some((e) => e.includes('name')));
    assert.ok(result.errors.some((e) => e.includes('description')));
  });
});

test('[validateToolsetFile] handles JSONC comments', async () => {
  await withTempDir(async (dir) => {
    const filePath = path.join(dir, 'test.toolset.jsonc');
    const content = `{
  // This is a comment
  "name": "test.toolset",
  "description": "A test toolset with comments",
  /* Multi-line
     comment */
  "tools": {}
}`;
    await writeFile(filePath, content, 'utf8');

    const result = validateToolsetFile(filePath);
    assert.ok(result.valid, 'should handle JSONC comments');
    assert.equal(result.errors.length, 0);
  });
});

test('[validateToolsetFile] fails with invalid JSON', async () => {
  await withTempDir(async (dir) => {
    const filePath = path.join(dir, 'test.toolset.jsonc');
    await writeFile(filePath, '{ invalid json }', 'utf8');

    const result = validateToolsetFile(filePath);
    assert.ok(!result.valid, 'should fail with invalid JSON');
    assert.ok(result.errors.some((e) => e.includes('Invalid JSON')));
  });
});

test('[validateToolsetFile] fails for non-existent file', () => {
  const result = validateToolsetFile('/path/to/nonexistent.toolset.jsonc');
  assert.ok(!result.valid);
  assert.ok(result.errors.some((e) => e.includes('File not found')));
});

// ============================================================================
// validateMarkdownArtifact tests
// ============================================================================

test('[validateMarkdownArtifact] validates instruction file successfully', async () => {
  await withTempDir(async (dir) => {
    const filePath = path.join(dir, 'test.instructions.md');
    const content = `---
name: test.instructions
applyTo: "**"
description: "Test instruction file"
---

# Test Instructions

## Purpose
This is the purpose.

## Responsibilities
These are the responsibilities.
`;
    await writeFile(filePath, content, 'utf8');

    const result = validateMarkdownArtifact(filePath, 'instruction');
    assert.ok(result.valid, 'should be valid');
    assert.equal(result.errors.length, 0);
  });
});

test('[validateMarkdownArtifact] validates prompt file successfully', async () => {
  await withTempDir(async (dir) => {
    const filePath = path.join(dir, 'test.prompt.md');
    const content = `---
name: "TestPrompt"
description: "A test prompt"
tools: ["filesystem/*"]
---

# Test Prompt

Some prompt content.
`;
    await writeFile(filePath, content, 'utf8');

    const result = validateMarkdownArtifact(filePath, 'prompt');
    assert.ok(result.valid, 'should be valid');
    assert.equal(result.errors.length, 0);
  });
});

test('[validateMarkdownArtifact] fails for non-existent file', () => {
  const result = validateMarkdownArtifact('/path/to/nonexistent.md', 'instruction');
  assert.ok(!result.valid);
  assert.ok(result.errors.some((e) => e.includes('File not found')));
});

// ============================================================================
// Integration-style tests
// ============================================================================

test('[integration] validates code-fence wrapped instruction file', async () => {
  await withTempDir(async (dir) => {
    const filePath = path.join(dir, 'initialization.instructions.md');
    const content = `\`\`\`instructions
---
name: initialization.instructions
applyTo: "**"
description: "Domain-agnostic rules for the Initialization DevCycle."
---

# Initialization DevCycle Instructions

## 1. Purpose
- Establish the Loaded Vibes environment state.

## 2. Responsibilities
### 2.1 Audit Environment
- Check extensions and settings.
\`\`\``;
    await writeFile(filePath, content, 'utf8');

    const result = validateMarkdownArtifact(filePath, 'instruction');
    assert.ok(result.valid, `should be valid, errors: ${result.errors.join(', ')}`);
    assert.equal(result.errors.length, 0);
  });
});

console.log('All artifact validator tests completed!');
