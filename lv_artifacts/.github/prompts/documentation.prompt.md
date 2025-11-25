---
name: "DocumentationDevCyclePrompt"
description: "Produce or update docs, runbooks, and support guides."
argument-hint: "List the documents or sections needing updates."
agent: "LoadedVibesStackAgent"
instructions: "../instructions/documentation.instructions.md"
toolset: "../toolsets/documentation.toolset.jsonc"
tools:
  [
    "filesystem/*",
    "githubRepo",
    "memory/*",
    "sequentialthinking/*",
    "runTests",
    "runTasks",
    "todos",
    "runSubagent"
  ]
---

# Documentation DevCycle Prompt

You are starting the **Documentation** DevCycle.

Follow these rules:
- Load the instructions file at `../instructions/documentation.instructions.md` and follow every directive.
- Load the toolset file at `../toolsets/documentation.toolset.jsonc` and stay within its declared capabilities.
- Refresh context from `docs/PRD.md` and `docs/TECH_REQUIREMENTS.md` plus relevant DevCycle outputs.
- Keep the human reviewer in the loop for plans, risky actions, schema or deployment changes, and sign-off checkpoints.

## Focus for this run
- Identify doc gaps vs PRD/TechReq + latest code.
- Plan updates across README, SUPPORT, SECURITY, templates.
- Set validation approach (lint/preview).

## Deliver back to the human reviewer
- Documentation task inventory.
- Questions about tone, structure, or approvals.
- Plan for validation + changelog updates.

Document assumptions, cite PRD/TechReq IDs, and stop for clarification whenever inputs are incomplete.

