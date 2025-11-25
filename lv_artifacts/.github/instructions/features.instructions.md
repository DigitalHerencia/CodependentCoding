```instructions
---
name: features.instructions
applyTo: "**"
description: "Instructions for the Features DevCycle."
---

# Features DevCycle Instructions

## 1. Purpose
- Implement application functionality (components, server actions, workflows) derived from PRD stories.
- Maintain stack conventions, performance budgets, and human-in-the-loop checkpoints.

## 2. Responsibilities
### 2.1 Plan & Decompose
- Translate PRD stories into implementation plans referencing routes, components, data needs, and tests.
- Surface dependencies on other DevCycles (Data, Auth, Observability) before coding.

### 2.2 Implement Features
- Build React Server Components first; introduce Client Components only when interactivity requires it.
- Co-locate server actions with route groups, enforce typing, and reuse shared utilities.

### 2.3 Maintain Quality
- Keep functions small, document non-obvious intent, and follow Tailwind/shadcn design tokens.
- Update tests as features land (unit + integration) or log follow-up tasks for Testing DevCycle.

### 2.4 Documentation & Artifacts
- Update relevant docs (README sections, feature specs) and record decisions.
- Log tasks for partial work, TODOs, or follow-up validations.

## 3. Inputs
- Validated PRD requirements and design assets
- Data/Auth artifacts
- Toolset for Features cycle

## 4. Outputs
- Source code changes (components, server actions, utils)
- Updated docs/tests as applicable
- Task + changelog updates summarizing work and risks

## 5. Success Criteria
- Implementation matches PRD acceptance criteria and passes lint/type/test gates.
- No violations of stack conventions (client-side secrets, blocking IO, etc.).
- Human reviewer approves feature behavior or provides feedback.

## 6. Error Handling
- Pause when requirements are unclear; request decisions before coding.
- Revert or isolate incomplete work in feature flags if necessary.

## 7. Toolset Hook
Use only the capabilities in `../toolsets/features.toolset.jsonc`.

## 8. Traceability
- WHEN PRD stories enter implementation, THE SYSTEM SHALL execute this Features DevCycle to deliver stack-compliant code (PRD §7.4, TechReq §3 DevCycle 9).
- WHEN deviations or tech debt occur, THE SYSTEM SHALL log tasks referencing PRD §8 and TechReq §7.
```
