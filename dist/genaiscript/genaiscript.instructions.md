---
applyTo: '**/*.genai.*'
description: 'GenAIScript runtime conventions for executing DevCycles in end-user projects'
---

## GenAIScript Runtime Instructions (End-User Project)

**Context:** These instructions apply to GenAIScript scripts **executing inside an end-user's Loaded Vibes project**, not during framework development. Scripts here implement DevCycle phases and generate application code.

### Script Execution Model

1. **Orchestrator-Driven**

   - All DevCycle execution flows through `orchestrator.genai.js`
   - Phase scripts in `phases/*.genai.js` are invoked by orchestrator
   - Never bypass orchestrator for DevCycle operations

2. **Context Sources**

   - User's project specs: `docs/project-prd.md`, `docs/tech-requirements.md`
   - Existing code: `src/**` (read-only unless implementing changes)
   - Framework state: `genaiscript/state/state.json`, TODO.md, CHANGELOG.md
   - DevCycle config: `genaiscript/devcycles.config.json`

3. **Tool Access**
   - Use only tools listed in active DevCycle's toolset (`.github/toolsets/*.toolset.jsonc`)
   - MCP servers: filesystem, git, memory, postgres (via Prisma), todos
   - Built-in helpers: `def`, `defData`, `defSchema`, `workspace.readText()`, etc.
   - Custom tools must be registered in toolset before use

### Code Generation Guidelines

1. **Target Directory: `src/**` Only\*\*

   - All application code belongs in `src/**`
   - Never modify `genaiscript/**`, `.github/**`, or framework tooling
   - Use `workspace.writeText(path, content)` for file creation
   - Honor existing file structure and naming conventions

2. **Spec-Driven Workflow Compliance**

   - Analyze: Read user PRD, extract EARS requirements
   - Design: Create implementation plan, get approval
   - Implement: Generate code, run tests
   - Validate: Check against acceptance criteria
   - Reflect: Update TODO/CHANGELOG with requirement IDs
   - Handoff: Commit, document, prepare next phase

3. **State Management**

   - Persist execution snapshots to `genaiscript/state/state.json`
   - Log events to `.loaded-vibes/logs/*.ndjson` with `devCycleId`, `requirementId`
   - Update TODO.md with task status, CHANGELOG.md with summaries
   - Use `memory` MCP for cross-phase context

4. **Safety & Security**
   - Trigger Bad Vibes Firewall for destructive operations
   - Redact secrets/env vars from logs
   - Validate inputs against schemas before processing
   - Request human approval for database migrations, deployments

### API Reference Hierarchy

- **This file:** Runtime behavior, DevCycle execution model, state/logging
- **`.genaiscript/instructions/llms-full.txt`:** Complete GenAIScript API syntax reference
- **DevCycle instructions:** Domain-specific rules in `.github/instructions/*.instructions.md`
- **Toolsets:** Available tools in `.github/toolsets/*.toolset.jsonc`

When uncertain about GenAIScript syntax (e.g., `defTool`, `defAgent`, `$` templates), consult `llms-full.txt`. For DevCycle workflow or project requirements, reference instruction files.
