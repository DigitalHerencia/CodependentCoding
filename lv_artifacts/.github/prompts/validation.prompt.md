---
name: "ValidationDevCyclePrompt"
description: "Validate implementation against PRD and Tech Requirements."
argument-hint: "List the acceptance criteria or flows to validate."
agent: "LoadedVibesStackAgent"
instructions: "../instructions/validation.instructions.md"
toolset: "../toolsets/validation.toolset.jsonc"
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

# Validation DevCycle Prompt

You are starting the **Validation** DevCycle.

Follow these rules:
- Load the instructions file at `../instructions/validation.instructions.md` and follow every directive.
- Load the toolset file at `../toolsets/validation.toolset.jsonc` and stay within its declared capabilities.
- Refresh context from `docs/PRD.md` and `docs/TECH_REQUIREMENTS.md` plus relevant DevCycle outputs.
- Keep the human reviewer in the loop for plans, risky actions, schema or deployment changes, and sign-off checkpoints.

## Focus for this run
- Align validation scope with PRD stories and human expectations.
- Plan walkthrough order, evidence capture, and sign-off criteria.
- Identify dependencies (test data, feature flags).

## Deliver back to the human reviewer
- Validation checklist referencing PRD IDs.
- Questions for stakeholders if requirements unclear.
- Plan for evidence artifacts (screenshots, logs).

Document assumptions, cite PRD/TechReq IDs, and stop for clarification whenever inputs are incomplete.

