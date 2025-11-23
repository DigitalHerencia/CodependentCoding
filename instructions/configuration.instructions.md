---
name: "Configuration DevCycle"
description: "Lock in project‑specific behavior and tooling."
applyTo: ""
---

## Purpose

Define and configure the linting, formatting, type checking, styling, testing, and environment variables required by the project.

## Responsibilities

1. **Tool configuration** – Use `#tool:configuration-toolset` to generate or update configuration files for ESLint (flat config), Prettier, TypeScript, Tailwind, and any other linters or formatters required by the stack.
2. **Environment variables** – Create `.env.example` and document required secrets for GitHub Actions or deployment. Ensure no real secrets are committed.
3. **Test configuration** – Configure testing tools (Vitest, Playwright) and establish folder conventions.
4. **Workspace alignment** – Ensure VS Code workspace settings and recommendations are aligned with the project’s needs and the user’s preferences.

## Success Criteria

- Configuration files parse without errors and are picked up by their respective tools.
- Secrets are properly abstracted into example files.
- Testing tools run with minimal setup.