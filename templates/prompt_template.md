---

## name: prompt.template applyTo: "\*\*/\*.prompt.md" description: Template for DevCycle prompt files.

# Prompt File Template

This file defines the standard structure and behavior of **DevCycle prompt files**. Prompts are the entry points to each DevCycle, triggering the agent to execute the correct instructions with the proper toolset.

Prompts are fully language‑agnostic and stack‑agnostic.

## Purpose

- Trigger a specific DevCycle.
- Load the corresponding instructions file.
- Bind the correct toolset to the agent.
- Route execution to the custom agent.
- Keep the workflow deterministic and predictable.

## Frontmatter Structure

Each prompt file uses YAML frontmatter:

```yaml
---
description: Short description of what this prompt triggers.
name: Human‑friendly prompt name.
argument-hint: Instruction shown in the chat input field.
agent: Name of the custom agent to run (default: agent).
model: Optional model override.
tools:
  - filesystem/*
  - github/*
---
```

## Body Structure

The body of the prompt contains the **exact instructions sent to the LLM** when the prompt is invoked.

### Required Elements

- Identify the DevCycle being initiated.
- Instruct the agent to load that DevCycle’s instruction file.
- Instruct the agent to use the corresponding toolset.
- Instruct the agent to keep the human in the loop.

### Example Template Body

```markdown
# ${name} DevCycle Prompt

You are starting the **${name}** DevCycle.

Follow these rules:
- Load the instructions file located at `../instructions/${name}.instructions.md`.
- Load the toolset file located at `../toolsets/${name}.toolset.jsonc`.
- Use only the tools declared in this DevCycle’s toolset.
- Follow global instructions.
- Follow the stack‑specific custom agent instructions.
- Surface decisions for human approval.

Output:
- Summary of planned actions
- Any clarification questions
- A breakdown of tasks derived from PRD + TechReq
```

## Prompt Responsibilities

- Provide clear DevCycle initiation.
- Point to the correct instruction file.
- Point to the correct toolset file.
- Activate the correct custom agent.
- Define behavior for deterministic execution.

## Notes

- Prompts are Markdown files.
- Prompts must reside in `/prompts`.
- Prompts do not include stack‑specific logic.
- Prompts must be one‑to‑one with DevCycles.

