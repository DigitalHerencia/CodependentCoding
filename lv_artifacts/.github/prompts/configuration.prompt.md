---
name: "ConfigurationDevCyclePrompt"
description: "Align workspace configs, env templates, and lint/test settings."
argument-hint: "List the configuration surfaces or tools requiring updates."
agent: "LoadedVibesStackAgent"
instructions: "../instructions/configuration.instructions.md"
toolset: "../toolsets/configuration.toolset.jsonc"
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

# Configuration DevCycle Prompt

You are starting the **Configuration** DevCycle.

Follow these rules:
- Load the instructions file at `../instructions/configuration.instructions.md` and follow every directive.
- Load the toolset file at `../toolsets/configuration.toolset.jsonc` and stay within its declared capabilities.
- Refresh context from `docs/PRD.md` and `docs/TECH_REQUIREMENTS.md` plus relevant DevCycle outputs.
- Keep the human reviewer in the loop for plans, risky actions, schema or deployment changes, and sign-off checkpoints.

## Focus for this run
- Re-read Scaffolding outputs to understand file locations.
- Apply instructions from configuration.instructions.md and reference the toolset for allowed commands.
- Plan lint/type/test validation runs and .env template updates.

## Deliver back to the human reviewer
- Ordered task list for configuration work.
- Risks or decisions needing human approval.
- Mapping of config files to PRD/TechReq requirements.

Document assumptions, cite PRD/TechReq IDs, and stop for clarification whenever inputs are incomplete.

