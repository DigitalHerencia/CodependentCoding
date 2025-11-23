---
name: "Scaffolding DevCycle"
description: "Translate the PRD and Tech Spec into a concrete, stack‑specific project scaffold."
applyTo: ""
---

## Purpose

Generate the foundational project structure based on the PRD and Tech Spec. The scaffold should reflect the conventions of the chosen tech stack (e.g. Next.js, React, Prisma, Tailwind, Clerk) without including any specific code patterns in these instructions.

## Responsibilities

1. **Create project structure** – Using `#tool:scaffolding-toolset`, create the base directories and files: `app/`, `features/`, `components/`, `lib/`, and `layout/`. Establish server actions and entry points appropriate for the tech stack.
2. **Apply conventions** – Ensure the scaffold adheres to stack‑specific conventions (handled by the custom agent) and honors the structure defined in the PRD and Tech Spec.
3. **Separate concerns** – When complexity grows, separate UI components from domain fetchers and actions to maintain clear boundaries.

## Success Criteria

- The scaffolded project builds without errors using the stack’s tools.
- Directories and files follow the prescribed organization.
- No domain logic is implemented; only structure is produced.