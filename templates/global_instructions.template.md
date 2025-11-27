---
name: global.instructions
applyTo: "**"
description: Universal framework rules and workflow orchestration
---

# Global Instructions

These instructions define the universal, language‑agnostic, framework‑agnostic behavior of the development system. They establish how DevCycles, prompts, instructions, toolsets, profiles, and the custom agent interact.

## 1. Single‑Agent Rule
- Only **one** agent is active during development.
- The specific agent used is determined by the project's declared tech stack.
- All execution flows through this single agent.

## 2. DevCycles (Canonical List)
The system recognizes the following development phases:
- initialization
- scaffolding
- configuration
- verification
- data
- auth
- testing
- validation
- features
- debug
- security
- performance
- observability
- code-review
- documentation
- ci-cd
- deploy
- updates

Global instructions **only** define their names. Their behaviors are defined in the DevCycle instruction files.

## 3. Artifact Types
The framework uses the following artifact categories:

### Prompts (Agnostic)
- Each DevCycle is triggered by a corresponding **prompt**.
- Prompts are agnostic and do not contain stack-specific logic.
- A prompt points to its associated instructions.

### Instructions (Agnostic)
- Each DevCycle has a corresponding **instruction file**.
- Instructions define:
  - the DevCycle's purpose
  - detailed requirements
  - goals and success metrics
  - security boundaries
  - constraints and expectations
  - the **toolset** used for that DevCycle
- Instructions are language-agnostic and framework-agnostic.

### Toolsets (Environment-Specific)
- Toolsets define which tools the agent may use during a DevCycle.
- Toolsets are generated from:
  - `extensions.json`
  - `mcp.json`
  - VS Code workspace/user settings
- Toolsets enforce:
  - capability limits
  - available MCP servers
  - security boundaries per phase

### Profile (Environment + Stack Specific)
- The profile includes:
  - VS Code settings
  - Extensions
  - MCP server configurations
  - Task automation

### Bootstrapper
- Automates creation and updating of the profile.
- Detects existing configuration and modifies or generates it.
- Configures GenAI Script extension behavior.
- Enables memory and cross-agent context.

### Custom Agent (Stack-Specific)
- Defines stack conventions, architecture patterns, coding rules.
- Strictly follows global instructions, DevCycle instructions, and toolsets.
- Maintains tech-stack best practices.

### PRD & TechReq
- Serve as the project source of truth.
- Define requirements, constraints, workflows, and acceptance criteria.

## 4. Framework Workflow
1. A prompt triggers a DevCycle.
2. The DevCycle's instructions become active.
3. Instructions define:
   - responsibilities
   - constraints
   - tasks
   - success metrics
   - toolset
4. The custom agent executes the DevCycle steps according to instructions.
5. Toolset determines which tools are available.
6. Agent keeps the human-in-the-loop throughout.

## 5. Human-in-the-Loop
- Tasks are derived from PRD + TechReq and tracked in:
  - `todo.md` or
  - GitHub Issues
- Completed tasks update:
  - CHANGELOG
  - project milestones
- Human approval or revision is required before progressing.

## 6. Universal Behavioral Rules
- All artifacts must follow:
  - deterministic execution
  - explicit inputs/outputs
  - bounded tasks
  - security-first workflow
  - incremental iteration
- Nothing proceeds unless the DevCycle is initiated via its prompt.

## 7. Delegation Model
- The global layer DOES NOT:
  - implement stack conventions
  - generate code
  - manage architecture
- The global layer DOES:
  - define system rules
  - define DevCycle boundaries
  - define how artifacts interact

These global instructions serve as the foundation for all other artifacts in the framework.

