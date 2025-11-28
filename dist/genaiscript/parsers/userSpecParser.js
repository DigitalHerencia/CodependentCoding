/**
 * User Spec Parser
 * Parses Markdown templates (PRD, Tech Requirements) into structured JSON using GenAIScript.
 * Validates output against JSON Schemas.
 */

import { validate } from './validator.js';
import * as fs from 'fs';
import * as path from 'path';

// Helper to load schema
function loadSchema(name) {
  // Try to resolve path relative to this file or workspace root
  // In GenAIScript execution, CWD might vary.
  const possiblePaths = [
    path.join('dist', 'genaiscript', 'parsers', 'schema', name),
    path.join('genaiscript', 'parsers', 'schema', name),
    path.join('.', 'schema', name),
    `d:/LoadedVibes/dist/genaiscript/parsers/schema/${name}`, // Fallback for this env
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf8'));
    }
  }
  throw new Error(`Schema ${name} not found in paths: ${possiblePaths.join(', ')}`);
}

export async function parsePRD(content, runPrompt) {
  const schema = loadSchema('prd.schema.json');

  const res = await runPrompt((_) => {
    _.def('PRD_CONTENT', content);
    _.defSchema('PRD_SCHEMA', schema);
    _.task('You are an expert system analyst.');
    _.task('Parse the PRD_CONTENT into a JSON object that strictly matches PRD_SCHEMA.');
    _.task('Extract all requirements, features, and goals.');
    _.task('Ensure EARS syntax is preserved in requirements.');
    _.task('Return ONLY the JSON object.');
  });

  if (res.error) {
    throw new Error('LLM Parsing Error: ' + res.error);
  }

  const json = res.json;
  if (!json) {
    throw new Error('LLM failed to return JSON');
  }

  const errors = validate(json, schema);
  if (errors.length > 0) {
    throw new Error('PRD Validation Failed:\n' + errors.join('\n'));
  }
  return json;
}

export async function parseTech(content, runPrompt) {
  const schema = loadSchema('tech.schema.json');

  const res = await runPrompt((_) => {
    _.def('TECH_CONTENT', content);
    _.defSchema('TECH_SCHEMA', schema);
    _.task('You are an expert software architect.');
    _.task('Parse the TECH_CONTENT into a JSON object that strictly matches TECH_SCHEMA.');
    _.task('Extract stack choices, architecture patterns, and database schema details.');
    _.task('Return ONLY the JSON object.');
  });

  if (res.error) {
    throw new Error('LLM Parsing Error: ' + res.error);
  }

  const json = res.json;
  if (!json) {
    throw new Error('LLM failed to return JSON');
  }

  const errors = validate(json, schema);
  if (errors.length > 0) {
    throw new Error('Tech Validation Failed:\n' + errors.join('\n'));
  }
  return json;
}
