---
name: "Verification DevCycle"
description: "Perform static checks on the environment, scaffold, and configuration to ensure structural correctness."
applyTo: ""
---

## Purpose

Run non‑destructive checks to confirm the initialization, scaffolding, and configuration phases produced a valid project. This is a sanity check before any feature work begins.

## Responsibilities

1. **Run static checks** – Invoke linting, type checking, and build steps using `#tool:verification-toolset`. Catch any errors early.
2. **Validate files** – Confirm that instruction files, toolset files, configuration files, and other core assets are present and referenced correctly.
3. **Check connectivity** – Verify that MCP servers and other services are reachable from the environment. Ensure no missing API keys or unreachable hosts.

## Success Criteria

- Lint, type check, and basic build tasks complete without errors.
- All essential files and folders are present.
- The environment is declared “structurally ready” or issues are surfaced for correction.