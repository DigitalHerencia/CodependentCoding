---
name: "DeployDevCyclePrompt"
description: "Plan and execute deployment steps for Vercel and services."
argument-hint: "Outline the release or environment change required."
agent: "LoadedVibesStackAgent"
instructions: "../instructions/deploy.instructions.md"
toolset: "../toolsets/deploy.toolset.jsonc"
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

# Deploy DevCycle Prompt

You are starting the **Deploy** DevCycle.

Follow these rules:
- Load the instructions file at `../instructions/deploy.instructions.md` and follow every directive.
- Load the toolset file at `../toolsets/deploy.toolset.jsonc` and stay within its declared capabilities.
- Refresh context from `docs/PRD.md` and `docs/TECH_REQUIREMENTS.md` plus relevant DevCycle outputs.
- Keep the human reviewer in the loop for plans, risky actions, schema or deployment changes, and sign-off checkpoints.

## Focus for this run
- Verify readiness gates and dependencies before deployment.
- Plan deployment steps, smoke tests, and monitoring windows.
- Outline rollback triggers and communication plan.

## Deliver back to the human reviewer
- Deployment runbook for this release.
- Questions about timing or approvals.
- List of validation/smoke checks.

Document assumptions, cite PRD/TechReq IDs, and stop for clarification whenever inputs are incomplete.

