script({
  title: 'Update Project Specs',
  description: 'Parses user specifications and generates Copilot instructions.',
  model: 'github_copilot_chat:current',
  system: ['system', 'system.files'],
  tools: ['fs_read_file', 'fs_write_file'],
});

import { parsePRD, parseTech } from '../parsers/userSpecParser.js';
import { generateCopilotInstructions } from '../tools/generateCopilotInstructions.js';
import * as fs from 'fs';
import * as path from 'path';

// Define paths
// In GenAIScript, paths are relative to the workspace root
const PRD_PATH = '.project-spec/PRD.template.md';
const TECH_PATH = '.project-spec/TECH-REQUIREMENTS.template.md';
const INSTRUCTIONS_PATH = '.github/copilot/project-spec.instructions.md';
const STATE_PATH = 'dist/genaiscript/state/specs.json';

async function main() {
  console.log('Updating Project Specs...');

  let prdContent = '';
  let techContent = '';

  try {
    if (fs.existsSync(PRD_PATH)) {
      prdContent = fs.readFileSync(PRD_PATH, 'utf8');
    } else {
      console.warn(`PRD not found at ${PRD_PATH}`);
    }
  } catch (e) {
    console.warn(`Error reading PRD: ${e.message}`);
  }

  try {
    if (fs.existsSync(TECH_PATH)) {
      techContent = fs.readFileSync(TECH_PATH, 'utf8');
    } else {
      console.warn(`Tech Requirements not found at ${TECH_PATH}`);
    }
  } catch (e) {
    console.warn(`Error reading Tech Requirements: ${e.message}`);
  }

  if (!prdContent && !techContent) {
    console.error('No spec files found.');
    return;
  }

  let prd = {
    product: { name: 'Unknown', description: '', version: '0.0.0' },
    goals: [],
    features: [],
  };
  let tech = {};

  if (prdContent) {
    console.log('Parsing PRD...');
    try {
      // runPrompt is available globally in the script scope
      prd = await parsePRD(prdContent, runPrompt);
      console.log('PRD Parsed Successfully.');
    } catch (e) {
      console.error('Failed to parse PRD:', e);
      // Fail hard if PRD is invalid, as it drives everything
      throw e;
    }
  }

  if (techContent) {
    console.log('Parsing Tech Requirements...');
    try {
      tech = await parseTech(techContent, runPrompt);
      console.log('Tech Requirements Parsed Successfully.');
    } catch (e) {
      console.error('Failed to parse Tech Requirements:', e);
      throw e;
    }
  }

  // Generate Instructions
  console.log('Generating Copilot Instructions...');
  const instructions = generateCopilotInstructions(prd, tech);

  // Ensure directory exists
  const instrDir = path.dirname(INSTRUCTIONS_PATH);
  if (!fs.existsSync(instrDir)) {
    fs.mkdirSync(instrDir, { recursive: true });
  }
  fs.writeFileSync(INSTRUCTIONS_PATH, instructions);
  console.log(`Instructions written to ${INSTRUCTIONS_PATH}`);

  // Save State
  const stateDir = path.dirname(STATE_PATH);
  if (!fs.existsSync(stateDir)) {
    fs.mkdirSync(stateDir, { recursive: true });
  }
  fs.writeFileSync(
    STATE_PATH,
    JSON.stringify({ prd, tech, lastUpdated: new Date().toISOString() }, null, 2)
  );
  console.log(`State saved to ${STATE_PATH}`);
}

await main();
