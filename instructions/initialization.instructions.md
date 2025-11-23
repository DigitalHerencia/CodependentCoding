---
name: "Initialization DevCycle"
description: "Bootstrap the development environment and load the world model for the project."
applyTo: ""
---

## Purpose

Initialize the environment and validate that everything required for the project exists and is configured correctly. This includes auditing extensions, MCP servers, settings, and the repository baseline. Ensure the Product Requirements Document (PRD) and Technical Specification (Tech Spec) are present and well formed.

## Responsibilities

1. **Detect available tools** – Use the toolset defined for initialization (`#tool:initialization-toolset`) to audit installed VS Code extensions, available MCP servers, workspace settings, and user settings.
2. **Validate repository baseline** – Confirm that the expected folder structure and core files exist, including `global.instructions.md`, `extensions.json`, `mcp.json`, and any required scaffold files.
3. **Process PRD and Tech Spec** – Parse the PRD and Tech Spec, ensuring they contain architecture definitions, data modelling, service descriptions, feature lists, branding guidelines, roadmap, security requirements, testing strategies, observability plans, deployment strategies, and update policies.
4. **Produce outputs** – Generate an “environment readiness” summary detailing the status of the environment, and a validated PRD and Tech Spec. These outputs will be referenced by subsequent DevCycles.

## Success Criteria

- All required configuration and baseline files are present and syntactically correct.
- The PRD and Tech Spec pass validation with no missing sections.
- A human‑readable readiness summary is generated and added to the changelog.
