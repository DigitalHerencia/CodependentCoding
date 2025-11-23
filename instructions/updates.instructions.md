---
name: "Updates DevCycle"
description: "Handle post‑launch improvements, maintenance, and small feature enhancements."
applyTo: ""
---

## Purpose

Manage the application after its initial release. Fix bugs, improve quality of life, and handle scope changes from updated PRD or Tech Spec documents.

## Responsibilities

1. **Bug fixes** – Use `#tool:updates-toolset` to identify and resolve bugs reported by users or uncovered through monitoring.
2. **Enhancements** – Implement minor features and improvements that increase usability or performance without altering the core architecture.
3. **Scope alignment** – When the PRD or Tech Spec changes, regenerate issues or tasks as necessary. Maintain the `CHANGELOG.md` to document all updates.
4. **Patch notes** – Automatically generate patch notes from the changelog and PR diffs. Communicate updates to stakeholders.

## Success Criteria

- Bugs are resolved quickly and effectively.
- Enhancements are delivered without regressions.
- Documentation and changelog accurately reflect the current state of the project.