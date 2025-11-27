---
name: phase_runner.template
applyTo: "**/phases/*.genai.js"
description: Template for DevCycle phase runner scripts implementing Spec-Driven Workflow.
---

# Phase Runner Template

This file defines the structure and behavior of **DevCycle phase runner scripts**. Phase runners execute the Analyze → Design → Implement → Validate → Reflect workflow sequence per `[TECH §4.3]` and `[SPEC-ENGINE §4]`.

Phase runners are reusable across all DevCycles and enforce Spec-Driven Workflow gates.

## Purpose

- Execute DevCycle-specific logic with manifest-provided instructions and toolsets.
- Enforce the five-stage workflow: Analyze → Design → Implement → Validate → Reflect.
- Log requirement IDs using NDJSON schema per `[SPEC-OBS §3]`.
- Provide hooks for destructive action approvals (Bad Vibes Firewall) per `[SPEC-SECURITY §3]`.
- Update TODO/CHANGELOG with requirement citations per `[TECH §7]`.
- Export metadata for orchestrator consumption.

## Authoritative References

- `[PRD §5.2-5.4]` DevCycle orchestration, CLI parity, observability.
- `[TECH §4.3]` Phase runner template requirements.
- `[TECH §4.5]` State & telemetry persistence.
- `[TECH §7]` Governance for prompts → instructions → toolsets.
- `[SPEC-DEV §2]` DevCycle authoring rules.
- `[SPEC-ENGINE §4]` Execution guarantees.
- `[SPEC-OBS §1-3]` Required signals and NDJSON format.
- `[SPEC-SECURITY §3]` DevCycle hardening checklist.

## Metadata Export Structure

Each phase runner MUST export metadata for orchestrator consumption:

```javascript
export const metadata = {
  name: 'phase-template',
  description: 'Reusable phase runner template for DevCycles',
  requiredInputs: ['phase', 'mode'],
  specReferences: ['TECH §4.3', 'SPEC-ENGINE §4', 'SPEC-DEV §2'],
  requirementIds: ['REQ-PHASE-001', 'REQ-PHASE-002'],
};
```

## Stage Responsibilities

### 1. Analyze Stage

**Purpose:** Summarize relevant PRD/TechReq excerpts and instructions with EARS citations.

**Requirements:**
- Load core documents (PRD, TechReq, TODO, CHANGELOG) using shared context loader.
- Extract and cite relevant requirement sections using EARS notation.
- Log stage entry with requirement IDs to NDJSON.
- Return structured analysis summary.

**NDJSON Event Example:**
```json
{"devCycleId":"scaffolding","phase":"analyze","requirementId":"TECH §4.3","severity":"info","checkpointId":"analyze-start","timestamp":"2025-11-27T12:00:00Z"}
```

### 2. Design Stage

**Purpose:** Produce ordered plan referencing manifest and risk register.

**Requirements:**
- Generate implementation plan with step ordering.
- Identify risks and mitigation strategies.
- Reference manifest checkpoints.
- Require human approval before proceeding.
- Log stage with requirement citations.

**Output Structure:**
```json
{
  "requirements": ["REQ-001", "REQ-002"],
  "plan": ["Step 1: ...", "Step 2: ..."],
  "risks": ["Risk A: ..."],
  "approvals": ["design-approval"],
  "citations": ["TECH §4.3", "PRD §5.2"]
}
```

### 3. Implement Stage

**Purpose:** Execute allowed commands/tools with destructive action approvals.

**Requirements:**
- Execute only commands allowed by the active toolset.
- Require explicit Bad Vibes Firewall approval for destructive actions.
- Log all tool invocations with requirement IDs.
- Capture outputs for validation stage.

**Destructive Action Approval (Bad Vibes Firewall):**
```javascript
async function requireApproval(action, affectedPaths, rollbackSteps) {
  console.log('⚠️ BAD VIBES FIREWALL: Destructive action detected');
  console.log(`Action: ${action}`);
  console.log(`Affected paths: ${affectedPaths.join(', ')}`);
  console.log(`Rollback steps: ${rollbackSteps.join(', ')}`);
  // Return approval status from checkpoint
  return { approved: false, approver: null, timestamp: new Date().toISOString() };
}
```

### 4. Validate Stage

**Purpose:** Run tests/verifications and capture acceptance evidence.

**Requirements:**
- Execute automated tests as defined in toolset.
- Perform manual check prompts.
- Capture validation outputs.
- Log validation results with pass/fail status.
- Fail fast on critical validation failures.

**Validation Output:**
```json
{
  "automatedTests": { "passed": true, "details": "..." },
  "manualChecks": ["Check A: passed", "Check B: pending"],
  "acceptanceCriteria": ["Criteria 1: met"],
  "followUps": []
}
```

### 5. Reflect/Handoff Stage

**Purpose:** Update TODO/CHANGELOG, memory, and prepare handoff package.

**Requirements:**
- Update TODO.md with completed items and new follow-ups.
- Update CHANGELOG.md with DevCycle summary entry.
- Persist state snapshot.
- Log reflect stage completion.
- Provide handoff summary for next DevCycle.

**CHANGELOG Entry Format:**
```
[Feature][TIMESTAMP] Goal: <description> → Action: <what was done> → Result: <outcome> → Next: <follow-up>. Closes #<issue>.
```

## GenAIScript Structure

```javascript
// @ts-nocheck
/**
 * Phase Runner Template
 *
 * Implements the Spec-Driven Workflow: Analyze → Design → Implement → Validate → Reflect.
 *
 * @see TECH §4.3, SPEC-ENGINE §4, SPEC-DEV §2
 */

import { loadCoreDocuments, loadManifest } from '../shared/context.js';
import { addChangelogEntry, getTimestamp } from '../shared/changelogUpdater.js';
import { markTodoComplete, addTodoItem } from '../shared/todoUpdater.js';

// Metadata export for orchestrator
export const metadata = {
  name: 'phase-template',
  description: 'Reusable phase runner template',
  requiredInputs: ['phase', 'mode'],
  specReferences: ['TECH §4.3', 'SPEC-ENGINE §4'],
  requirementIds: [],
};

script({
  title: 'Phase Runner Template',
  description: 'Executes DevCycle with five-stage workflow',
  parameters: {
    phase: { type: 'string', description: 'DevCycle key' },
    mode: { type: 'string', default: 'plan-first' },
    task: { type: 'string', description: 'Task description' },
  },
  tools: ['filesystem/*', 'memory/*', 'sequentialthinking/*'],
});

// Stage execution functions
async function analyzeStage(docs, entry) { /* ... */ }
async function designStage(analysis) { /* ... */ }
async function implementStage(plan, toolset) { /* ... */ }
async function validateStage(implementation) { /* ... */ }
async function reflectStage(validation, entry) { /* ... */ }

// Main execution
const manifest = await loadManifest();
const docs = await loadCoreDocuments();
// ... stage orchestration
```

## NDJSON Logging Schema

All stages MUST log events using this schema per `[SPEC-OBS §3]`:

```typescript
interface NDJSONEvent {
  devCycleId: string;      // e.g., "scaffolding"
  phase: string;           // e.g., "analyze", "design", "implement", "validate", "reflect"
  requirementId: string;   // e.g., "TECH §4.3"
  severity: 'info' | 'warn' | 'error';
  checkpointId: string;    // e.g., "analyze-start", "design-approval"
  timestamp: string;       // ISO 8601
  message?: string;        // Optional details
  artifacts?: string[];    // Optional file paths
}
```

## Bad Vibes Firewall Integration

Destructive actions MUST trigger approval prompts per `[SPEC-SECURITY §3]`:

1. **Detection:** Identify operations that modify/delete files, run migrations, or execute external commands.
2. **Prompt:** Display affected paths, action description, and rollback steps.
3. **Logging:** Record approval decision in NDJSON with approver and timestamp.
4. **Enforcement:** Block execution until explicit approval received.

## Usage Instructions

### Creating a New Phase Runner

1. Copy `phase-template.genai.js` to `phases/<devcycle>.genai.js`.
2. Update metadata with DevCycle-specific values.
3. Customize stage logic for DevCycle requirements.
4. Register in `devcycles.config.json` manifest.
5. Test with `npx genaiscript run dist/genaiscript/phases/<devcycle>.genai.js --dry-run`.

### Running a Phase

```bash
# Plan-only mode (default)
npx genaiscript run dist/genaiscript/phases/phase-template.genai.js --phase scaffolding

# Execute mode
npx genaiscript run dist/genaiscript/phases/phase-template.genai.js --phase scaffolding --mode execute

# Validate mode
npx genaiscript run dist/genaiscript/phases/phase-template.genai.js --phase scaffolding --mode validate
```

### Orchestrator Integration

The orchestrator calls phase runners via:

```javascript
await runPromptWithVars('./phases/phase-template.genai.js', {
  phase: 'scaffolding',
  mode: 'plan-first',
  task: 'Execute the standard DevCycle scope.',
});
```

## Validation Checklist

- [ ] Template contains all five stages (Analyze, Design, Implement, Validate, Reflect).
- [ ] Requirement IDs logged at each stage entry/exit.
- [ ] Destructive action approval hook present (Bad Vibes Firewall).
- [ ] Reflect stage updates TODO/CHANGELOG.
- [ ] Metadata exported for orchestrator consumption.
- [ ] Template reusable across DevCycles.
- [ ] NDJSON events follow schema per SPEC-OBS §3.
- [ ] Shared utilities integrated for context loading and TODO/CHANGELOG updates.

## Notes

- Phase runners are GenAIScript files (`.genai.js`).
- Phase runners MUST reside in `dist/genaiscript/phases/`.
- Phase runners are DevCycle-agnostic; configuration comes from manifest.
- Phase runners MUST use shared utilities for consistency.
- All stage transitions require checkpoint logging.
