---
name: "PerformanceDevCyclePrompt"
description: "Profile and optimize performance hotspots."
argument-hint: "Share the metrics or user flows that need tuning."
agent: "LoadedVibesStackAgent"
instructions: "../instructions/performance.instructions.md"
toolset: "../toolsets/performance.toolset.jsonc"
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

# Performance DevCycle Prompt

You are starting the **Performance** DevCycle.

Follow these rules:
- Load the instructions file at `../instructions/performance.instructions.md` and follow every directive.
- Load the toolset file at `../toolsets/performance.toolset.jsonc` and stay within its declared capabilities.
- Refresh context from `docs/PRD.md` and `docs/TECH_REQUIREMENTS.md` plus relevant DevCycle outputs.
- Keep the human reviewer in the loop for plans, risky actions, schema or deployment changes, and sign-off checkpoints.

## Focus for this run
- Gather baseline metrics and tooling scripts.
- Plan optimizations (bundles, queries, caching).
- Coordinate with Observability for metrics capture.

## Deliver back to the human reviewer
- Benchmark/optimization plan.
- Potential trade-offs or risks.
- Questions about targets or constraints.

Document assumptions, cite PRD/TechReq IDs, and stop for clarification whenever inputs are incomplete.

