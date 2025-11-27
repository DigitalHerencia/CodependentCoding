```instructions
---
name: scaffolding.instructions
applyTo: "**"
description: "Instructions for the Scaffolding DevCycle."
---

# Scaffolding DevCycle Instructions

## 1. Purpose
- Translate validated PRD + Tech Requirements into a concrete project scaffold.
- Define directory layouts, entrypoints, and baseline files that honor the Loaded Vibes stack.
- Produce a project map that subsequent DevCycles can extend without rework.

## 2. Responsibilities
### 2.1 Interpret PRD + Tech Requirements
- Extract structural requirements, route groups, feature modules, and cross-cutting assets (PRD §6, TechReq §3 DevCycle 2).
- Identify dependencies between domains (auth, data, shared UI) to plan folder topology.

### 2.2 Generate Project Structure
- Create top-level directories: `app/`, `features/`, `components/`, `lib/`, `public/`, `styles/`, and any additional stack-specific folders.
- Ensure layout aligns with Next.js 15 conventions (app router, route groups, server components by default).

### 2.3 Establish Boilerplate Files
- Create placeholder files for layout, error/loading templates, environment exemplars, README stubs, and documentation hooks required by later DevCycles.
- Scaffold shared config files (e.g., `tsconfig.json`, `package.json` placeholders) without yet specifying tooling details (reserved for Configuration).

### 2.4 Produce Project Map & Task List
- Document directories and files created along with their intended responsibilities.
- Add follow-up tasks to `todo.md` for items deferred to later DevCycles.

### 2.5 Enforce Guardrails
- Keep runtime `src/` artifacts out of the workspace; only update directories sanctioned in PRD §6.2.
- Use only the tools authorized for Scaffolding, requesting human approval for destructive operations.

## 3. Inputs
- Initialization readiness report
- `docs/PRD.md`
- `docs/TECH_REQUIREMENTS.md`
- Templates from `templates/`
- Active branch state

## 4. Outputs
- Created directory tree and baseline files
- Project map summarizing structure and future extensions
- Logged tasks plus changelog entry referencing Scaffolding

## 5. Success Criteria
- Directory layout matches stack conventions and PRD expectations.
- No business logic implemented; only structure and placeholders exist.
- Human reviewer approves scaffold and recorded project map.

## 6. Error Handling
- Halt if required source documents or templates are missing.
- Roll back partial scaffolds if structural conflicts appear (e.g., name collisions, invalid routing hierarchy).
- Surface blockers (file permissions, tooling gaps) with actionable remediation steps.

## 7. Toolset Hook
Use only the capabilities listed in `../toolsets/scaffolding.toolset.jsonc`.

## 8. Traceability
- WHEN PRD + Tech Requirements call for a new application, THE SYSTEM SHALL execute this Scaffolding DevCycle to realize the prescribed structure (PRD §7.4, TechReq §3 DevCycle 2).
- WHEN scaffolding completes, THE SYSTEM SHALL document the resulting map and open tasks so Configuration can proceed deterministically (PRD §8, TechReq §7).
```
