---
name: "ScaffoldingDevCyclePrompt"
description: "Set up baseline folders, configs, and scripts for new work."
argument-hint: "Describe the scaffolding assets you need to create or adjust."
agent: "LoadedVibesStackAgent"
instructions: "../instructions/scaffolding.instructions.md"
toolset: "../toolsets/scaffolding.toolset.jsonc"
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

# Scaffolding DevCycle Prompt

You are starting the **Scaffolding** DevCycle.

Follow these rules:
- Load the instructions file at `../instructions/scaffolding.instructions.md` and follow every directive.
- Load the toolset file at `../toolsets/scaffolding.toolset.jsonc` and stay within its declared capabilities.
- Refresh context from `docs/PRD.md` and `docs/TECH_REQUIREMENTS.md` plus relevant DevCycle outputs.
- Keep the human reviewer in the loop for plans, risky actions, schema or deployment changes, and sign-off checkpoints.

## Focus for this run
- Review structure requirements from docs/PRD.md and docs/TECH_REQUIREMENTS.md.
- Load prior Initialization findings to ensure prerequisites exist.
- Prepare a project map describing directories, entrypoints, and placeholders.

## Deliver back to the human reviewer
- Implementation plan referencing key folders/files.
- Clarification questions for ambiguous modules.
- List of directories/files to create with rationale.

Document assumptions, cite PRD/TechReq IDs, and stop for clarification whenever inputs are incomplete.

