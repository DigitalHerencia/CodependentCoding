---
name: "VerificationDevCyclePrompt"
description: "Perform integration and UAT checks before release."
argument-hint: "Describe the end-to-end scenario that needs verification."
agent: "LoadedVibesStackAgent"
instructions: "../instructions/verification.instructions.md"
toolset: "../toolsets/verification.toolset.jsonc"
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

# Verification DevCycle Prompt

You are starting the **Verification** DevCycle.

Follow these rules:
- Load the instructions file at `../instructions/verification.instructions.md` and follow every directive.
- Load the toolset file at `../toolsets/verification.toolset.jsonc` and stay within its declared capabilities.
- Refresh context from `docs/PRD.md` and `docs/TECH_REQUIREMENTS.md` plus relevant DevCycle outputs.
- Keep the human reviewer in the loop for plans, risky actions, schema or deployment changes, and sign-off checkpoints.

## Focus for this run
- Load instructions/toolset and list commands you will run.
- Summarize expectations for pass/fail criteria.
- Plan how findings will be logged to todo/changelog.

## Deliver back to the human reviewer
- Execution plan for static checks.
- Questions about missing scripts or tooling gaps.
- Outline of reporting format for findings.

Document assumptions, cite PRD/TechReq IDs, and stop for clarification whenever inputs are incomplete.

