#!/usr/bin/env node
// @ts-nocheck
/**
 * create-loaded-vibes CLI Entry Point
 *
 * This is the npm package entry point for `npx create-loaded-vibes <project>`.
 * It downloads/copies dist/** assets, verifies checksums, mirrors into .loaded-vibes/,
 * and invokes `loaded-vibes init` per PRD §5.1 and TECH §5.1.
 *
 * @module create-loaded-vibes/bin
 * @see docs/PRD.md §5.1 - Distribution & Installation
 * @see docs/TECH_REQUIREMENTS.md §5.1 - Distribution Model
 * @see spec/cli.spec.md §3 - Distribution & Bootstrap Coupling
 */

import { createLoadedVibes } from '../src/index.js';

// Parse command line arguments
const args = process.argv.slice(2);

createLoadedVibes(args).catch((error) => {
  console.error('Installation failed:', error.message);
  process.exit(1);
});
