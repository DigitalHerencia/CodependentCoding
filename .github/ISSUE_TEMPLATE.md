---
title: '[<type>] <short description>'
labels: []
---

<!--
  Loaded Vibes Framework Development Issue Template

  This template is for the DEVELOPMENT TEAM working on the Loaded Vibes framework.
  It is NOT shipped with the framework—it governs internal feature development,
  bug fixes, and spec-driven enhancements per SPEC-DEV.

  Before filing: review PRD.md and TECH_REQUIREMENTS.md for context.
-->

## Issue Type

- [ ] **Feature** — New capability or enhancement
- [ ] **Bug** — Something isn't working as specified
- [ ] **Spec Update** — PRD, Tech Requirements, or spec file change
- [ ] **DevCycle Asset** — Prompt, instruction, or toolset authoring
- [ ] **Infrastructure** — CI/CD, tooling, dependencies
- [ ] **Documentation** — README, CONTRIBUTING, guides

## Summary

<!-- Describe the feature, bug, or task. Be specific about the desired outcome. -->

## DevCycle Alignment

<!-- Which DevCycle(s) does this issue relate to? (per Tech Requirements §6) -->

- [ ] Initialization
- [ ] Scaffolding
- [ ] Configuration
- [ ] Verification
- [ ] Data
- [ ] Auth
- [ ] Testing
- [ ] Validation
- [ ] Features
- [ ] Debug
- [ ] Security
- [ ] Performance
- [ ] Observability
- [ ] Code Review
- [ ] Documentation
- [ ] CI/CD
- [ ] Deploy
- [ ] Updates
- [ ] Framework Core / Infrastructure

## Requirements Traceability

<!-- Link to the authoritative sources (required per SPEC-DEV §2): -->

| Document          | Section | Requirement Summary                                                                 |
| ----------------- | ------- | ----------------------------------------------------------------------------------- |
| PRD               | §       |                                                                                     |
| Tech Requirements | §       |                                                                                     |
| Spec ID           |         | SPEC-ARCH, SPEC-CLI, SPEC-ENGINE, SPEC-OBS, SPEC-SECURITY, SPEC-ARTIFACTS, SPEC-DEV |

## Acceptance Criteria

<!-- Define what "done" looks like using EARS notation where applicable: -->

1. WHEN ... THE SYSTEM SHALL ...
2.
3.

## Implementation Notes

<!-- Optional: architecture considerations, affected files, dependencies -->

**Affected Directories:**

- [ ] `.github/` — Dev governance assets
- [ ] `.vscode/` — Maintainer IDE profile
- [ ] `docs/` — PRD, Tech Requirements, specs
- [ ] `templates/` — Gold master templates
- [ ] `dist/` — Shipped product assets
- [ ] `spec/` — Specification files

**Dependencies:**

<!-- List any blocking issues or external dependencies -->

## Definition of Done

<!-- Per SPEC-DEV §4 and global.instructions.md Spec-Driven Workflow: -->

- [ ] Implementation matches acceptance criteria
- [ ] PRD/Tech Requirements updated if behavior changed
- [ ] Relevant spec file(s) updated if scope changed
- [ ] `TODO.md` updated with completed/new items
- [ ] `CHANGELOG.md` updated with action log entry
- [ ] Tests added/updated (`genaiscript test`)
- [ ] Manifest parity verified (prompts → instructions → toolsets)
- [ ] Layer boundaries respected (SPEC-ARCH §2)

## Additional Context

<!-- Related issues, design mockups, reference materials, or prior art: -->

---

**Pre-Submit Checklist:**

- [ ] Searched existing issues to avoid duplicates
- [ ] Linked to PRD/Tech Requirements sections
- [ ] Cited relevant spec ID(s)
- [ ] Defined clear acceptance criteria
