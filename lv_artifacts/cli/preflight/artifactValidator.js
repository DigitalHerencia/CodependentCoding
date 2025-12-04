/**
 * Loaded Vibes Artifact Validator Module
 *
 * Validates artifact presence, schema compliance, and manifest references
 * during bootstrap before DevCycles run.
 *
 * @module dist/cli/preflight/artifactValidator
 * @see docs/TECH_REQUIREMENTS.md §4.4 - Bootstrapper Flow
 * @see spec/artifact.spec.md §4 - Validation & Tagging
 * @see Issue #28 - Validate artifact presence/schema during bootstrap
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = path.resolve(CURRENT_DIR, '..');
const DIST_ROOT = path.resolve(CLI_ROOT, '..');
const REPO_ROOT = path.resolve(DIST_ROOT, '..');

/** Paths to key artifact directories */
const PATHS = {
  manifest: path.resolve(DIST_ROOT, 'genaiscript', 'devcycles.config.json'),
  instructions: path.resolve(DIST_ROOT, '.github', 'instructions'),
  prompts: path.resolve(DIST_ROOT, '.github', 'prompts'),
  toolsets: path.resolve(DIST_ROOT, '.github', 'toolsets'),
  globalInstructions: path.resolve(DIST_ROOT, '.github', 'global.instructions.md'),
  prd: path.resolve(REPO_ROOT, 'docs', 'PRD.md'),
  techReq: path.resolve(REPO_ROOT, 'docs', 'TECH_REQUIREMENTS.md'),
};

/**
 * @typedef {Object} ArtifactValidationResult
 * @property {boolean} valid - Whether validation passed
 * @property {string[]} errors - Array of error messages
 * @property {string[]} warnings - Array of warning messages
 * @property {Object} details - Detailed validation results
 */

/**
 * @typedef {Object} FrontmatterSchema
 * @property {string[]} required - Required frontmatter fields
 * @property {string[]} optional - Optional frontmatter fields
 * @property {Object.<string, string>} types - Expected types for fields
 */

/**
 * Schema definitions for each artifact type per SPEC-ARTIFACTS §4.
 */
const ARTIFACT_SCHEMAS = {
  instruction: {
    filePattern: /\.instructions\.md$/,
    frontmatter: {
      required: ['name', 'applyTo', 'description'],
      optional: [],
      types: {
        name: 'string',
        applyTo: 'string',
        description: 'string',
      },
    },
    requiredSections: ['Purpose', 'Responsibilities'],
    validateApplyTo: true,
  },
  prompt: {
    filePattern: /\.prompt\.md$/,
    frontmatter: {
      required: ['name', 'description'],
      optional: ['argument-hint', 'agent', 'instructions', 'toolset', 'tools'],
      types: {
        name: 'string',
        description: 'string',
        'argument-hint': 'string',
        agent: 'string',
        instructions: 'string',
        toolset: 'string',
        tools: 'array',
      },
    },
    requiredSections: [],
    validateApplyTo: false,
  },
  toolset: {
    filePattern: /\.toolset\.jsonc?$/,
    jsonSchema: {
      required: ['name', 'description', 'tools'],
      optional: ['contextFiles', 'allowedOperations', 'deniedOperations', 'security'],
      nested: {
        tools: {
          optional: ['mcpServers', 'extensions', 'cli'],
        },
        security: {
          optional: ['allowFileWrite', 'allowNetwork', 'restrictedPaths'],
        },
      },
    },
  },
  globalInstructions: {
    filePattern: /global\.instructions\.md$/,
    frontmatter: {
      required: ['name', 'description', 'applyTo'],
      optional: [],
      types: {
        name: 'string',
        description: 'string',
        applyTo: 'string',
      },
    },
    requiredSections: ['Development Phases', 'Artifact Types', 'Workflow'],
    validateApplyTo: true,
  },
};

/**
 * Parses YAML frontmatter from a markdown file.
 * Handles both standard frontmatter and code-fence wrapped formats.
 * @param {string} content - File content
 * @returns {{frontmatter: Object|null, body: string}}
 */
function parseFrontmatter(content) {
  // Try standard frontmatter format first
  let fmRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  let match = content.match(fmRegex);

  // If not found, try code-fence wrapped format (```instructions\n---\n...---\n)
  if (!match) {
    // Match content inside code fence with frontmatter
    const codeFenceRegex = /^```[a-z]*\s*\n---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*?)```\s*$/;
    const codeFenceMatch = content.match(codeFenceRegex);
    if (codeFenceMatch) {
      const fmContent = codeFenceMatch[1];
      const body = codeFenceMatch[2];
      const frontmatter = parseYamlContent(fmContent);
      return { frontmatter, body };
    }

    // Also try just code fence without closing (if body continues after)
    const partialFenceRegex = /^```[a-z]*\s*\n---\s*\n([\s\S]*?)\n---\s*\n/;
    const partialMatch = content.match(partialFenceRegex);
    if (partialMatch) {
      const fmContent = partialMatch[1];
      const body = content.slice(partialMatch[0].length);
      const frontmatter = parseYamlContent(fmContent);
      return { frontmatter, body };
    }

    return { frontmatter: null, body: content };
  }

  const fmContent = match[1];
  const body = content.slice(match[0].length);
  const frontmatter = parseYamlContent(fmContent);
  return { frontmatter, body };
}

/**
 * Parses YAML content into an object.
 * @param {string} fmContent - YAML content string
 * @returns {Object} Parsed frontmatter object
 */
function parseYamlContent(fmContent) {
  const frontmatter = {};

  // Simple YAML parsing for common patterns
  const lines = fmContent.split('\n');
  let currentKey = null;
  let arrayBuffer = [];

  for (const line of lines) {
    // Handle array items
    if (line.match(/^\s+-\s+/)) {
      const value = line.replace(/^\s+-\s+/, '').trim().replace(/^["']|["']$/g, '');
      arrayBuffer.push(value);
      continue;
    }

    // Flush array buffer if we have accumulated items
    if (arrayBuffer.length > 0 && currentKey) {
      frontmatter[currentKey] = arrayBuffer;
      arrayBuffer = [];
      currentKey = null;
    }

    // Handle key-value pairs
    const kvMatch = line.match(/^(\S+):\s*(.*)$/);
    if (kvMatch) {
      const key = kvMatch[1];
      let value = kvMatch[2].trim();

      // Handle inline arrays like: tools: ["a", "b"]
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          frontmatter[key] = JSON.parse(value);
        } catch {
          // Remove brackets and split by comma
          value = value.slice(1, -1);
          frontmatter[key] = value.split(',').map((s) => s.trim().replace(/^["']|["']$/g, ''));
        }
        continue;
      }

      // Handle empty value (start of array)
      if (value === '' || value === '[]') {
        currentKey = key;
        arrayBuffer = [];
        continue;
      }

      // Remove quotes from strings
      value = value.replace(/^["']|["']$/g, '');
      frontmatter[key] = value;
    }
  }

  // Flush any remaining array buffer
  if (arrayBuffer.length > 0 && currentKey) {
    frontmatter[currentKey] = arrayBuffer;
  }

  return frontmatter;
}

/**
 * Validates frontmatter against a schema.
 * @param {Object} frontmatter - Parsed frontmatter
 * @param {FrontmatterSchema} schema - Schema to validate against
 * @param {string} filePath - Path for error messages
 * @returns {{valid: boolean, errors: string[], warnings: string[]}}
 */
function validateFrontmatter(frontmatter, schema, filePath) {
  const errors = [];
  const warnings = [];
  const fileName = path.basename(filePath);

  if (!frontmatter) {
    errors.push(`${fileName}: Missing YAML frontmatter (required per SPEC-ARTIFACTS §4)`);
    return { valid: false, errors, warnings };
  }

  // Check required fields
  for (const field of schema.required) {
    if (!(field in frontmatter)) {
      errors.push(`${fileName}: Missing required frontmatter field '${field}'`);
    }
  }

  // Check field types
  for (const [field, expectedType] of Object.entries(schema.types)) {
    if (field in frontmatter) {
      const value = frontmatter[field];
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (actualType !== expectedType) {
        warnings.push(`${fileName}: Field '${field}' expected ${expectedType}, got ${actualType}`);
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validates applyTo glob pattern.
 * @param {string} applyTo - The applyTo pattern
 * @param {string} filePath - Path for error messages
 * @returns {{valid: boolean, errors: string[], warnings: string[]}}
 */
function validateApplyToPattern(applyTo, filePath) {
  const errors = [];
  const warnings = [];
  const fileName = path.basename(filePath);

  if (!applyTo) {
    errors.push(`${fileName}: Missing 'applyTo' pattern`);
    return { valid: false, errors, warnings };
  }

  // Valid patterns: "**", "*.md", "src/**/*.ts", etc.
  const validPatterns = [/^\*\*$/, /^\*\.[a-z]+$/, /^[a-z/_-]+\/\*\*/, /^\*\*\/\*\.[a-z]+$/];

  const isValid = validPatterns.some((pattern) => pattern.test(applyTo)) || applyTo === '**';

  if (!isValid) {
    warnings.push(`${fileName}: Unusual 'applyTo' pattern '${applyTo}'. Common patterns: "**", "*.md", "src/**/*.ts"`);
  }

  return { valid: true, errors, warnings };
}

/**
 * Validates required sections exist in markdown body.
 * @param {string} body - Markdown body content
 * @param {string[]} requiredSections - Required section headings
 * @param {string} filePath - Path for error messages
 * @returns {{valid: boolean, errors: string[], warnings: string[]}}
 */
function validateRequiredSections(body, requiredSections, filePath) {
  const errors = [];
  const warnings = [];
  const fileName = path.basename(filePath);

  for (const section of requiredSections) {
    // Match heading patterns: # Section, ## Section, ### Section
    // Also match numbered sections like ## 1. Purpose, ## 2. Responsibilities
    const escapedSection = section.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const headingPattern = new RegExp(`^#{1,3}\\s+(?:\\d+\\.\\s+)?${escapedSection}`, 'im');
    if (!headingPattern.test(body)) {
      warnings.push(`${fileName}: Missing recommended section '${section}'`);
    }
  }

  return { valid: true, errors, warnings };
}

/**
 * Validates a JSONC toolset file.
 * @param {string} filePath - Path to the toolset file
 * @returns {{valid: boolean, errors: string[], warnings: string[]}}
 */
function validateToolsetFile(filePath) {
  const errors = [];
  const warnings = [];
  const fileName = path.basename(filePath);

  if (!existsSync(filePath)) {
    errors.push(`${fileName}: File not found`);
    return { valid: false, errors, warnings };
  }

  let content;
  try {
    content = readFileSync(filePath, 'utf8');
  } catch (err) {
    errors.push(`${fileName}: Failed to read file: ${err.message}`);
    return { valid: false, errors, warnings };
  }

  // Remove JSONC comments for parsing
  const jsonContent = content
    .replace(/\/\/.*$/gm, '') // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments

  let parsed;
  try {
    parsed = JSON.parse(jsonContent);
  } catch (err) {
    errors.push(`${fileName}: Invalid JSON/JSONC syntax: ${err.message}`);
    return { valid: false, errors, warnings };
  }

  const schema = ARTIFACT_SCHEMAS.toolset.jsonSchema;

  // Check required fields
  for (const field of schema.required) {
    if (!(field in parsed)) {
      errors.push(`${fileName}: Missing required field '${field}'`);
    }
  }

  // Validate nested 'tools' object
  if (parsed.tools && schema.nested && schema.nested.tools) {
    if (typeof parsed.tools !== 'object') {
      errors.push(`${fileName}: Field 'tools' must be an object`);
    }
  }

  // Validate nested 'security' object if present
  if (parsed.security && schema.nested && schema.nested.security) {
    if (typeof parsed.security !== 'object') {
      warnings.push(`${fileName}: Field 'security' should be an object`);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validates a markdown artifact (instruction, prompt, global instructions).
 * @param {string} filePath - Path to the markdown file
 * @param {'instruction'|'prompt'|'globalInstructions'} type - Artifact type
 * @returns {{valid: boolean, errors: string[], warnings: string[]}}
 */
function validateMarkdownArtifact(filePath, type) {
  const errors = [];
  const warnings = [];
  const fileName = path.basename(filePath);
  const schema = ARTIFACT_SCHEMAS[type];

  if (!existsSync(filePath)) {
    errors.push(`${fileName}: File not found`);
    return { valid: false, errors, warnings };
  }

  let content;
  try {
    content = readFileSync(filePath, 'utf8');
  } catch (err) {
    errors.push(`${fileName}: Failed to read file: ${err.message}`);
    return { valid: false, errors, warnings };
  }

  const { frontmatter, body } = parseFrontmatter(content);

  // Validate frontmatter
  const fmResult = validateFrontmatter(frontmatter, schema.frontmatter, filePath);
  errors.push(...fmResult.errors);
  warnings.push(...fmResult.warnings);

  // Validate applyTo pattern if required
  if (schema.validateApplyTo && frontmatter && frontmatter.applyTo) {
    const applyToResult = validateApplyToPattern(frontmatter.applyTo, filePath);
    errors.push(...applyToResult.errors);
    warnings.push(...applyToResult.warnings);
  }

  // Validate required sections
  if (schema.requiredSections && schema.requiredSections.length > 0) {
    const sectionsResult = validateRequiredSections(body, schema.requiredSections, filePath);
    errors.push(...sectionsResult.errors);
    warnings.push(...sectionsResult.warnings);
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validates artifact presence - checks that all required artifact directories and files exist.
 * @returns {ArtifactValidationResult}
 */
export function validateArtifactPresence() {
  const errors = [];
  const warnings = [];
  const details = {
    directories: {},
    files: {},
  };

  // Check required directories
  const requiredDirs = [
    { path: PATHS.instructions, name: 'instructions' },
    { path: PATHS.prompts, name: 'prompts' },
    { path: PATHS.toolsets, name: 'toolsets' },
  ];

  for (const dir of requiredDirs) {
    const exists = existsSync(dir.path);
    details.directories[dir.name] = { exists, path: dir.path };
    if (!exists) {
      errors.push(`Required directory missing: ${dir.name} (${dir.path})`);
    }
  }

  // Check required files
  const requiredFiles = [
    { path: PATHS.manifest, name: 'devcycles.config.json' },
    { path: PATHS.globalInstructions, name: 'global.instructions.md' },
  ];

  for (const file of requiredFiles) {
    const exists = existsSync(file.path);
    details.files[file.name] = { exists, path: file.path };
    if (!exists) {
      errors.push(`Required file missing: ${file.name} (${file.path})`);
    }
  }

  // Check recommended documentation files
  const recommendedFiles = [
    { path: PATHS.prd, name: 'docs/PRD.md' },
    { path: PATHS.techReq, name: 'docs/TECH_REQUIREMENTS.md' },
  ];

  for (const file of recommendedFiles) {
    const exists = existsSync(file.path);
    details.files[file.name] = { exists, path: file.path };
    if (!exists) {
      warnings.push(`Recommended file missing: ${file.name}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    details,
  };
}

/**
 * Validates schema compliance for all artifacts.
 * @returns {ArtifactValidationResult}
 */
export function validateArtifactSchemas() {
  const errors = [];
  const warnings = [];
  const details = {
    instructions: [],
    prompts: [],
    toolsets: [],
    global: null,
  };

  // Validate instruction files
  if (existsSync(PATHS.instructions)) {
    const files = readdirSync(PATHS.instructions).filter((f) =>
      ARTIFACT_SCHEMAS.instruction.filePattern.test(f)
    );
    for (const file of files) {
      const filePath = path.join(PATHS.instructions, file);
      const result = validateMarkdownArtifact(filePath, 'instruction');
      details.instructions.push({ file, ...result });
      errors.push(...result.errors);
      warnings.push(...result.warnings);
    }
  }

  // Validate prompt files (skip template files which are meant to be copied and customized)
  if (existsSync(PATHS.prompts)) {
    const files = readdirSync(PATHS.prompts).filter((f) =>
      ARTIFACT_SCHEMAS.prompt.filePattern.test(f) && !f.startsWith('template.')
    );
    for (const file of files) {
      const filePath = path.join(PATHS.prompts, file);
      const result = validateMarkdownArtifact(filePath, 'prompt');
      details.prompts.push({ file, ...result });
      errors.push(...result.errors);
      warnings.push(...result.warnings);
    }
  }

  // Validate toolset files (skip template files which are meant to be copied and customized)
  if (existsSync(PATHS.toolsets)) {
    const files = readdirSync(PATHS.toolsets).filter((f) =>
      ARTIFACT_SCHEMAS.toolset.filePattern.test(f) && !f.startsWith('template.')
    );
    for (const file of files) {
      const filePath = path.join(PATHS.toolsets, file);
      const result = validateToolsetFile(filePath);
      details.toolsets.push({ file, ...result });
      errors.push(...result.errors);
      warnings.push(...result.warnings);
    }
  }

  // Validate global instructions
  if (existsSync(PATHS.globalInstructions)) {
    const result = validateMarkdownArtifact(PATHS.globalInstructions, 'globalInstructions');
    details.global = { file: 'global.instructions.md', ...result };
    errors.push(...result.errors);
    warnings.push(...result.warnings);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    details,
  };
}

/**
 * Validates manifest references - ensures all manifest entries point to existing files.
 * Reuses logic from Issue #26 manifest validation workflow.
 * @returns {ArtifactValidationResult}
 */
export function validateManifestReferences() {
  const errors = [];
  const warnings = [];
  const details = {
    manifest: null,
    devcycles: {},
  };

  // Load manifest
  if (!existsSync(PATHS.manifest)) {
    errors.push(`Manifest file not found: ${PATHS.manifest}`);
    return { valid: false, errors, warnings, details };
  }

  let manifest;
  try {
    const content = readFileSync(PATHS.manifest, 'utf8');
    manifest = JSON.parse(content);
    details.manifest = { valid: true, path: PATHS.manifest };
  } catch (err) {
    errors.push(`Failed to parse manifest: ${err.message}`);
    details.manifest = { valid: false, error: err.message };
    return { valid: false, errors, warnings, details };
  }

  const manifestDir = path.dirname(PATHS.manifest);

  // Validate each DevCycle entry
  for (const [key, entry] of Object.entries(manifest)) {
    const cycleResult = {
      valid: true,
      files: {},
    };

    // Required file references per TECH §4.1
    const fileRefs = [
      { field: 'instructions', path: entry.instructions },
      { field: 'toolset', path: entry.toolset },
      { field: 'prompt', path: entry.prompt },
    ];

    for (const ref of fileRefs) {
      if (!ref.path) {
        errors.push(`DevCycle '${key}': Missing required field '${ref.field}'`);
        cycleResult.files[ref.field] = { exists: false, missing: true };
        cycleResult.valid = false;
        continue;
      }

      const resolvedPath = path.resolve(manifestDir, ref.path);
      const exists = existsSync(resolvedPath);
      cycleResult.files[ref.field] = { exists, path: ref.path, resolvedPath };

      if (!exists) {
        errors.push(`DevCycle '${key}': ${ref.field} file not found: ${ref.path}`);
        cycleResult.valid = false;
      }
    }

    // Optional: validate context files if specified
    if (entry.contexts && Array.isArray(entry.contexts)) {
      cycleResult.files.contexts = [];
      for (const contextPath of entry.contexts) {
        const resolvedPath = path.resolve(manifestDir, contextPath);
        const exists = existsSync(resolvedPath);
        cycleResult.files.contexts.push({ path: contextPath, exists });
        if (!exists) {
          warnings.push(`DevCycle '${key}': Context file not found: ${contextPath}`);
        }
      }
    }

    details.devcycles[key] = cycleResult;
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    details,
  };
}

/**
 * Runs all artifact validation checks and returns a comprehensive result.
 * @returns {ArtifactValidationResult}
 */
export function validateAllArtifacts() {
  const allErrors = [];
  const allWarnings = [];
  const details = {};

  // 1. Validate artifact presence
  const presenceResult = validateArtifactPresence();
  allErrors.push(...presenceResult.errors);
  allWarnings.push(...presenceResult.warnings);
  details.presence = presenceResult.details;

  // 2. Validate schema compliance (only if presence checks pass)
  if (presenceResult.valid) {
    const schemaResult = validateArtifactSchemas();
    allErrors.push(...schemaResult.errors);
    allWarnings.push(...schemaResult.warnings);
    details.schemas = schemaResult.details;
  }

  // 3. Validate manifest references
  const manifestResult = validateManifestReferences();
  allErrors.push(...manifestResult.errors);
  allWarnings.push(...manifestResult.warnings);
  details.manifest = manifestResult.details;

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    details,
  };
}

/**
 * Formats validation results for console output with remediation guidance.
 * @param {ArtifactValidationResult} result - Validation result
 * @returns {string} Formatted output
 */
export function formatValidationResults(result) {
  const lines = [];

  lines.push('');
  lines.push('╔══════════════════════════════════════════════════════════════╗');
  lines.push('║              ARTIFACT VALIDATION RESULTS                     ║');
  lines.push('╚══════════════════════════════════════════════════════════════╝');
  lines.push('');

  if (result.errors.length > 0) {
    lines.push('❌ ERRORS (must fix before DevCycles can run):');
    for (const error of result.errors) {
      lines.push(`   • ${error}`);
    }
    lines.push('');
  }

  if (result.warnings.length > 0) {
    lines.push('⚠️  WARNINGS (recommended fixes):');
    for (const warning of result.warnings) {
      lines.push(`   • ${warning}`);
    }
    lines.push('');
  }

  if (result.valid) {
    lines.push('✅ All artifact validations passed!');
    lines.push('');
    lines.push('   Ready to proceed with DevCycle execution.');
  } else {
    lines.push('──────────────────────────────────────────────────────────────────');
    lines.push('');
    lines.push('📚 REMEDIATION GUIDANCE:');
    lines.push('');
    lines.push('   1. Ensure all required artifact directories exist:');
    lines.push('      - dist/.github/instructions/');
    lines.push('      - dist/.github/prompts/');
    lines.push('      - dist/.github/toolsets/');
    lines.push('');
    lines.push('   2. Verify manifest entries in devcycles.config.json');
    lines.push('      point to existing prompt/instruction/toolset files.');
    lines.push('');
    lines.push('   3. Add required YAML frontmatter to markdown artifacts:');
    lines.push('      - Instructions: name, applyTo, description');
    lines.push('      - Prompts: name, description');
    lines.push('');
    lines.push('   4. Ensure toolset JSONC files have required fields:');
    lines.push('      - name, description, tools');
    lines.push('');
    lines.push('   References:');
    lines.push('   • TECH_REQUIREMENTS §4.4 - Bootstrapper Flow');
    lines.push('   • SPEC-ARTIFACTS §4 - Validation & Tagging');
    lines.push('   • Issue #28 - Artifact validation during bootstrap');
  }

  lines.push('');

  return lines.join('\n');
}

/**
 * Main entry point for CLI execution.
 * Runs all artifact validations and outputs results.
 * @returns {Promise<void>}
 */
async function main() {
  const result = validateAllArtifacts();
  console.log(formatValidationResults(result));
  process.exit(result.valid ? 0 : 1);
}

// Export validation functions and paths for external use
export {
  PATHS,
  ARTIFACT_SCHEMAS,
  parseFrontmatter,
  validateFrontmatter,
  validateApplyToPattern,
  validateRequiredSections,
  validateToolsetFile,
  validateMarkdownArtifact,
};

/**
 * Checks if this module is being run directly.
 * @returns {boolean}
 */
function isRunningDirectly() {
  if (!process.argv[1]) {
    return false;
  }
  const scriptPath = fileURLToPath(import.meta.url);
  const invokePath = path.resolve(process.argv[1]);
  return (
    scriptPath === invokePath ||
    (path.basename(invokePath) === 'artifactValidator.js' &&
      path.basename(path.dirname(invokePath)) === 'preflight')
  );
}

// Run main if executed directly
if (isRunningDirectly()) {
  main().catch((error) => {
    console.error('Artifact validation failed:', error.message);
    process.exit(1);
  });
}
