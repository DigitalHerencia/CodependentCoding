---
name: "Documentation DevCycle"
description: "Generate human‑facing documentation and repository templates."
applyTo: ""
---

## Purpose

Produce comprehensive documentation for the project. Generate README, contributing guidelines, security policies, support information, and templates for PRD and Tech Specs. Document how to regenerate these artifacts.

## Responsibilities

1. **Generate docs** – Use `#tool:documentation-toolset` to convert the validated PRD and Tech Spec into human‑readable documents: `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `SUPPORT.md`, `CODEOWNERS`, `CODE_OF_CONDUCT.md`.
2. **Template generation** – Create templates for issues, pull requests, PRD, and Tech Spec that future work will reuse.
3. **Sync with changelog** – Ensure documentation reflects the current state of the codebase and features. Update change logs with notable documentation changes.

## Success Criteria

- Documentation files are complete, concise, and free of errors.
- Templates are available for future work.
- Documentation stays synchronized with the project’s evolution.