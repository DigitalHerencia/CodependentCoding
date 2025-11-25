```instructions
---
name: documentation.instructions
applyTo: "**"
description: "Instructions for the Documentation DevCycle."
---

# Documentation DevCycle Instructions

## 1. Purpose
- Produce and maintain project documentation (README, CONTRIBUTING, SECURITY, templates, release notes) that mirrors the current implementation.
- Ensure documentation remains the single source of truth per Spec-Driven Workflow.

## 2. Responsibilities
### 2.1 Inventory & Gap Analysis
- Review existing docs against PRD + Tech Requirements to identify missing sections or outdated guidance.
- Confirm templates in `templates/` reflect shipped artifacts under `lv_artifacts/`.

### 2.2 Author & Update Content
- Revise README, SUPPORT, SECURITY, CONTRIBUTING, CODEOWNERS, templates, and supplementary guides.
- Include links to relevant DevCycles, toolsets, and validation evidence where needed.

### 2.3 Traceability Artifacts
- Update `todo.md`, `CHANGELOG.md`, action/decision logs per workflow instructions.
- Document assumptions, decisions, and validation logs for future DevCycles.

### 2.4 Review & Publication
- Validate Markdown formatting, lint docs if applicable, and ensure cross-links work.
- Coordinate with Code Review to confirm documentation changes land alongside code.

## 3. Inputs
- Latest PRD/Tech Requirements
- Outputs from previous DevCycles
- Template sources
- Toolset for Documentation cycle

## 4. Outputs
- Updated documentation files + templates
- Summary of changes, linked tasks, and release notes entries
- Evidence that docs were verified (lint, preview screenshots, etc.)

## 5. Success Criteria
- Documentation accurately reflects current state; no contradictions with PRD/Tech Requirements.
- Required artifacts listed in Spec-Driven Workflow (README, SUPPORT, SECURITY, etc.) exist and are current.
- Stakeholders approve documentation updates.

## 6. Error Handling
- Pause documentation updates if dependent DevCycles are incomplete.
- Flag conflicting content and propose remediation steps.

## 7. Toolset Hook
Use tools defined in `../toolsets/documentation.toolset.jsonc`.

## 8. Traceability
- WHEN the knowledge base must be updated, THE SYSTEM SHALL execute this Documentation DevCycle (PRD §7.4, TechReq §3 DevCycle 15).
- WHEN documentation changes occur, THE SYSTEM SHALL update changelog/task artifacts referencing PRD §8 and TechReq §7.
```
