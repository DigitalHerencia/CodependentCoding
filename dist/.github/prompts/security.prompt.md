---
name: "SecurityDevCyclePrompt"
description: "Assess and harden security posture and compliance controls."
argument-hint: "Describe the threats or controls to focus on."
agent: "LoadedVibesStackAgent"
instructions: "../instructions/security.instructions.md"
toolset: "../toolsets/security.toolset.jsonc"
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

# Security DevCycle Prompt

You are starting the **Security** DevCycle.

Follow these rules:
- Load the instructions file at `../instructions/security.instructions.md` and follow every directive.
- Load the toolset file at `../toolsets/security.toolset.jsonc` and stay within its declared capabilities.
- Refresh context from `docs/PRD.md` and `docs/TECH_REQUIREMENTS.md` plus relevant DevCycle outputs.
- Keep the human reviewer in the loop for plans, risky actions, schema or deployment changes, and sign-off checkpoints.

## Focus for this run
- Review security requirements, previous findings, and dependencies.
- Plan scans, reviews, and code changes allowed by toolset.
- Outline reporting for risks + mitigations.

## Deliver back to the human reviewer
- Security audit checklist.
- Risk register updates with owners.
- Questions needing approval/clarification.

Document assumptions, cite PRD/TechReq IDs, and stop for clarification whenever inputs are incomplete.

