---
name: "CiCdDevCyclePrompt"
description: "Build and refine CI/CD pipelines, caching, and policies."
argument-hint: "Specify the pipeline targets or automation changes."
agent: "LoadedVibesStackAgent"
instructions: "../instructions/ci-cd.instructions.md"
toolset: "../toolsets/ci-cd.toolset.jsonc"
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

# CI/CD DevCycle Prompt

You are starting the **CI/CD** DevCycle.

Follow these rules:
- Load the instructions file at `../instructions/ci-cd.instructions.md` and follow every directive.
- Load the toolset file at `../toolsets/ci-cd.toolset.jsonc` and stay within its declared capabilities.
- Refresh context from `docs/PRD.md` and `docs/TECH_REQUIREMENTS.md` plus relevant DevCycle outputs.
- Keep the human reviewer in the loop for plans, risky actions, schema or deployment changes, and sign-off checkpoints.

## Focus for this run
- Inventory existing pipelines + desired stages.
- Plan updates to workflow files, caching, secrets.
- Decide validation steps (dry-run, branch protection checks).

## Deliver back to the human reviewer
- Pipeline task breakdown.
- Risks or approvals required (secrets, permissions).
- Questions about deployment strategy.

Document assumptions, cite PRD/TechReq IDs, and stop for clarification whenever inputs are incomplete.

