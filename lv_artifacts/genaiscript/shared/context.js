// @ts-nocheck

import path from 'path';
import { fileURLToPath } from 'url';
import { readFile, writeFile, access, mkdir } from 'fs/promises';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const GENAI_ROOT = path.resolve(CURRENT_DIR, '..');
const ARTIFACTS_ROOT = path.resolve(GENAI_ROOT, '..');
const REPO_ROOT = path.resolve(ARTIFACTS_ROOT, '..');
const MANIFEST_PATH = path.resolve(GENAI_ROOT, 'devcycles.config.json');
const STATE_DIR = path.resolve(GENAI_ROOT, 'state');
const STATE_PATH = path.resolve(STATE_DIR, 'state.json');

async function readOptional(filePath) {
  try {
    await access(filePath);
    return await readFile(filePath, 'utf8');
  } catch (error) {
    return '';
  }
}

async function loadManifest() {
  const raw = await readFile(MANIFEST_PATH, 'utf8');
  return JSON.parse(raw);
}

function resolveFromGenai(relativePath) {
  return path.resolve(GENAI_ROOT, relativePath);
}

async function loadCoreDocuments() {
  const prd = await readOptional(path.resolve(REPO_ROOT, 'docs', 'PRD.md'));
  const tech = await readOptional(path.resolve(REPO_ROOT, 'docs', 'TECH_REQUIREMENTS.md'));
  const readme = await readOptional(path.resolve(REPO_ROOT, 'README.md'));
  const changelog = await readOptional(path.resolve(REPO_ROOT, 'CHANGELOG.md'));
  const todoLower = await readOptional(path.resolve(REPO_ROOT, 'todo.md'));
  const todoUpper = await readOptional(path.resolve(REPO_ROOT, 'TODO.md'));

  return {
    prd,
    tech,
    readme,
    changelog,
    todo: todoLower || todoUpper,
  };
}

async function loadState() {
  try {
    await access(STATE_PATH);
    const raw = await readFile(STATE_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    return {
      lastPhase: null,
      completedPhases: [],
      history: [],
    };
  }
}

async function saveState(state) {
  await mkdir(STATE_DIR, { recursive: true });
  const serialized = JSON.stringify(state, null, 2);
  await writeFile(STATE_PATH, serialized, 'utf8');
}

export {
  loadManifest,
  resolveFromGenai,
  loadCoreDocuments,
  loadState,
  saveState,
  readOptional,
  GENAI_ROOT,
  ARTIFACTS_ROOT,
  REPO_ROOT,
};
