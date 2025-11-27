```instructions
---
name: validation.instructions
applyTo: "**"
description: "Instructions for the Validation DevCycle."
---

# Validation DevCycle Instructions

## 1. Purpose
- Confirm that implemented features, UX flows, and data contracts match PRD intent.
- Validate business rules, content, and accessibility behaviors beyond static checks.

## 2. Responsibilities
### 2.1 Requirement Traceability
- Map delivered features back to PRD acceptance criteria and Tech Requirement references.
- Highlight deviations, partial completions, or assumptions needing stakeholder approval.

### 2.2 UX & Content Review
- Exercise primary flows end-to-end (including error states, loading skeletons, accessibility cues).
- Compare UI against vibe spec (palette, typography, microcopy) and log gaps for Documentation/Updates.

### 2.3 Data & API Validation
- Ensure client/server contracts, Prisma models, and API responses align; detect drift or serialization issues.
- Verify error handling paths produce actionable messaging without leaking secrets.

### 2.4 Evidence Capture
- Record screenshots, videos, or logs demonstrating validated flows.
- Update `todo.md`/`CHANGELOG.md` with validation outcomes and unresolved issues.

## 3. Inputs
- Feature branches or artifacts awaiting validation
- PRD + Tech Requirements
- Test results, static analysis reports
- Toolset for Validation

## 4. Outputs
- Validation report summarizing coverage, findings, and approvals
- Evidence artifacts linked in the report
- Tasks for unresolved validation items

## 5. Success Criteria
- Each PRD requirement in scope is marked accepted, deferred, or blocked with rationale.
- UX/UX guidelines, accessibility rules, and branding requirements are satisfied.
- Human reviewer (product/UX owner) acknowledges validation outcomes.

## 6. Error Handling
- Pause validation if prerequisites (tests, data migrations) are incomplete.
- Escalate requirements ambiguities to stakeholders before proceeding.

## 7. Toolset Hook
Use only tools listed in `../toolsets/validation.toolset.jsonc`.

## 8. Traceability
- WHEN implementation needs confirmation against business rules, THE SYSTEM SHALL run this Validation DevCycle (PRD §7.4, TechReq §3 DevCycle 8).
- WHEN validation uncovers misalignment, THE SYSTEM SHALL log actionable tasks referencing PRD §8 and TechReq §7.
```
