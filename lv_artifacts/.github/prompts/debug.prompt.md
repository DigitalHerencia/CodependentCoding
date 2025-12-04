---
name: "DebugDevCyclePrompt"
description: "Triage regressions and stabilize failing scenarios."
argument-hint: "Describe the bug, symptoms, or logs available."
agent: "LoadedVibesStackAgent"
instructions: "../instructions/debug.instructions.md"
toolset: "../toolsets/debug.toolset.jsonc"
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

# Debug DevCycle Prompt

You are starting the **Debug** DevCycle.

Follow these rules:
- Load the instructions file at `../instructions/debug.instructions.md` and follow every directive.
- Load the toolset file at `../toolsets/debug.toolset.jsonc` and stay within its declared capabilities.
- Refresh context from `docs/PRD.md` and `docs/TECH_REQUIREMENTS.md` plus relevant DevCycle outputs.
- Keep the human reviewer in the loop for plans, risky actions, schema or deployment changes, and sign-off checkpoints.

## Focus for this run
- Collect reproduction info, logs, and impacted areas.
- Plan diagnostic steps using toolset resources.
- Define validation steps to confirm fixes.

## Deliver back to the human reviewer
- Issue triage summary with hypotheses.
- Fix plan + test strategy.
- Questions for reporters or stakeholders.

Document assumptions, cite PRD/TechReq IDs, and stop for clarification whenever inputs are incomplete.

