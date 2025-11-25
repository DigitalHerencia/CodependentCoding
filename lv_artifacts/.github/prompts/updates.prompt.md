---
name: "UpdatesDevCyclePrompt"
description: "Manage dependency, stack, and tooling updates."
argument-hint: "List the packages or tooling that need updates."
agent: "LoadedVibesStackAgent"
instructions: "../instructions/updates.instructions.md"
toolset: "../toolsets/updates.toolset.jsonc"
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

# Updates DevCycle Prompt

You are starting the **Updates** DevCycle.

Follow these rules:
- Load the instructions file at `../instructions/updates.instructions.md` and follow every directive.
- Load the toolset file at `../toolsets/updates.toolset.jsonc` and stay within its declared capabilities.
- Refresh context from `docs/PRD.md` and `docs/TECH_REQUIREMENTS.md` plus relevant DevCycle outputs.
- Keep the human reviewer in the loop for plans, risky actions, schema or deployment changes, and sign-off checkpoints.

## Focus for this run
- Review backlog + telemetry to prioritize updates.
- Plan DevCycle coverage for each work item.
- Define communication + documentation obligations.

## Deliver back to the human reviewer
- Prioritized update plan.
- Open questions for stakeholders.
- Task list/owner mapping for approved updates.

Document assumptions, cite PRD/TechReq IDs, and stop for clarification whenever inputs are incomplete.

