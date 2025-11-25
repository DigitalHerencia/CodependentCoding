---
name: "DataDevCyclePrompt"
description: "Design and evolve Prisma + Neon data models and migrations."
argument-hint: "Explain the schema or data operations to implement."
agent: "LoadedVibesStackAgent"
instructions: "../instructions/data.instructions.md"
toolset: "../toolsets/data.toolset.jsonc"
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

# Data DevCycle Prompt

You are starting the **Data** DevCycle.

Follow these rules:
- Load the instructions file at `../instructions/data.instructions.md` and follow every directive.
- Load the toolset file at `../toolsets/data.toolset.jsonc` and stay within its declared capabilities.
- Refresh context from `docs/PRD.md` and `docs/TECH_REQUIREMENTS.md` plus relevant DevCycle outputs.
- Keep the human reviewer in the loop for plans, risky actions, schema or deployment changes, and sign-off checkpoints.

## Focus for this run
- Review domain requirements plus existing schema/migrations.
- Identify safety checks (backups, rollbacks, seeding).
- Plan validation commands (pnpm prisma format/validate) and Neon considerations.

## Deliver back to the human reviewer
- Schema/migration task list.
- Risk map (breaking changes, downtime).
- Questions for human approval (e.g., destructive migrations).

Document assumptions, cite PRD/TechReq IDs, and stop for clarification whenever inputs are incomplete.

