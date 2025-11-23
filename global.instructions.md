---
name: "Global-Framework-Instructions"
description: "Universal, language‑agnostic guidelines governing the Loaded Vibes development framework. These instructions describe the high‑level structure of the system, list the development phases (DevCycles), identify the types of artifacts produced, and explain how they interact. No technology or language specifics are mentioned here; everything applies equally whether you are building with JavaScript, Python, Go, or any other stack."
applyTo: "**"
---

# Loaded Vibes Framework Overview

## Development Phases

The framework is organized into eighteen DevCycles. Each cycle encapsulates a distinct stage
of the development process. The names of these cycles are listed here for reference:

1. initialization
2. scaffolding
3. configuration
4. verification
5. data
6. auth
7. testing
8. validation
9. features
10. debug
11. security
12. performance
13. observability
14. code‑review
15. documentation
16. ci‑cd
17. deploy
18. updates

## Artifact Types

The framework produces and utilizes several types of artifacts. Each one plays a specific role in the
workflow:

- **GenAIScript Orchestrators** – Executable scripts (`.genai.js`) that drive each DevCycle.
  These replace static prompts as the primary entry point, allowing for dynamic context
  gathering, validation, and tool execution.
- **Prompts** – Markdown files used by the GenAIScripts to guide the LLM.
- **Instructions** – Markdown files containing detailed, domain‑agnostic guidelines for
  completing a DevCycle. Instructions reference an appropriate toolset and define
  responsibilities, inputs, outputs, and success metrics.
- **Toolsets** – JSONC files describing the tools and resources available during execution.
  Toolsets declare which extensions, Model Context Protocol (MCP) servers, and other
  capabilities are permitted.
- **Settings, MCP, and Extensions** – Configuration files that determine which tools and
  resources are installed or available.
- **Profile** – A grouping of settings, extensions, and MCP server definitions.
- **Custom Agent (Mode)** – A custom agent definition for a specific tech stack. The
  global layer is agnostic, but each project loads one agent according to its stack.
- **PRD and Tech Spec** – Product Requirements Document (PRD) and Technical
  Specification (Tech Spec). These documents are the source of truth.

## Workflow

The framework operates through a defined sequence, orchestrated by GenAIScript:

1. The **Orchestrator Script** (`orchestrator.genai.js`) is triggered (manually or via task).
2. It identifies the current **DevCycle** and loads the corresponding **Phase Script**.
3. The Phase Script gathers context (PRD, code, state), loads the **Instruction** file,
   and configures the **Toolset**.
4. The Agent (driven by the script) performs the tasks, utilizing MCP tools for
   filesystem access, git operations, and database management.
5. The script validates the output against the success metrics defined in the instructions.
6. **Human-in-the-loop**: The script pauses for critical reviews (e.g., plan approval,
   code review) before committing changes or moving to the next phase.
7. State is persisted to `memory.json` and `todo.md`.

This global instructions file does not specify any language, framework, or implementation
details. All technology‑specific patterns, coding standards, and architectural rules live
in the custom agent and lower layers of the framework.
