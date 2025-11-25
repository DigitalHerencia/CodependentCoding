---
name: "FeaturesDevCyclePrompt"
description: "Deliver user-facing features mapped to PRD stories."
argument-hint: "Outline the feature slice or acceptance criteria."
agent: "LoadedVibesStackAgent"
instructions: "../instructions/features.instructions.md"
toolset: "../toolsets/features.toolset.jsonc"
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

# Features DevCycle Prompt

You are starting the **Features** DevCycle.

Follow these rules:
- Load the instructions file at `../instructions/features.instructions.md` and follow every directive.
- Load the toolset file at `../toolsets/features.toolset.jsonc` and stay within its declared capabilities.
- Refresh context from `docs/PRD.md` and `docs/TECH_REQUIREMENTS.md` plus relevant DevCycle outputs.
- Keep the human reviewer in the loop for plans, risky actions, schema or deployment changes, and sign-off checkpoints.

## Focus for this run
- Summarize feature scope + dependencies.
- Plan sequence of server/client components, data hooks, and tests.
- Identify review checkpoints and fallback options.

## Deliver back to the human reviewer
- Step-by-step implementation plan.
- Potential risks or open decisions.
- Task list for tests/docs to update.

Document assumptions, cite PRD/TechReq IDs, and stop for clarification whenever inputs are incomplete.

