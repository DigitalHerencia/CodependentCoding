---
name: "ObservabilityDevCyclePrompt"
description: "Instrument logging, metrics, and tracing for the stack."
argument-hint: "Explain the telemetry gaps or signals to implement."
agent: "LoadedVibesStackAgent"
instructions: "../instructions/observability.instructions.md"
toolset: "../toolsets/observability.toolset.jsonc"
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

# Observability DevCycle Prompt

You are starting the **Observability** DevCycle.

Follow these rules:
- Load the instructions file at `../instructions/observability.instructions.md` and follow every directive.
- Load the toolset file at `../toolsets/observability.toolset.jsonc` and stay within its declared capabilities.
- Refresh context from `docs/PRD.md` and `docs/TECH_REQUIREMENTS.md` plus relevant DevCycle outputs.
- Keep the human reviewer in the loop for plans, risky actions, schema or deployment changes, and sign-off checkpoints.

## Focus for this run
- Review instrumentation requirements and existing gaps.
- Plan logging/tracing/metrics updates within toolset limits.
- Define validation steps for emitted telemetry.

## Deliver back to the human reviewer
- Instrumentation plan with components + owners.
- Alert/dashboard requirements.
- Questions about retention, privacy, or tooling.

Document assumptions, cite PRD/TechReq IDs, and stop for clarification whenever inputs are incomplete.

