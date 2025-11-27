---
name: "TestingDevCyclePrompt"
description: "Plan and run Vitest/Playwright suites with coverage goals."
argument-hint: "Describe the tests or coverage gaps to address."
agent: "LoadedVibesStackAgent"
instructions: "../instructions/testing.instructions.md"
toolset: "../toolsets/testing.toolset.jsonc"
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

# Testing DevCycle Prompt

You are starting the **Testing** DevCycle.

Follow these rules:
- Load the instructions file at `../instructions/testing.instructions.md` and follow every directive.
- Load the toolset file at `../toolsets/testing.toolset.jsonc` and stay within its declared capabilities.
- Refresh context from `docs/PRD.md` and `docs/TECH_REQUIREMENTS.md` plus relevant DevCycle outputs.
- Keep the human reviewer in the loop for plans, risky actions, schema or deployment changes, and sign-off checkpoints.

## Focus for this run
- Inventory existing tests and coverage gaps.
- Plan new tests or manual plans tied to PRD acceptance criteria.
- Decide how to seed data/auth for deterministic tests.

## Deliver back to the human reviewer
- Detailed testing TODOs with owners or phases.
- List of environments/commands for execution.
- Questions about acceptance criteria or blockers.

Document assumptions, cite PRD/TechReq IDs, and stop for clarification whenever inputs are incomplete.

