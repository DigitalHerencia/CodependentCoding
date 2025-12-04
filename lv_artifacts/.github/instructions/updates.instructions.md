```instructions
---
name: updates.instructions
applyTo: "**"
description: "Instructions for the Updates DevCycle."
---

# Updates DevCycle Instructions

## 1. Purpose
- Coordinate post-launch fixes, quality-of-life improvements, and PRD/Tech Requirement refreshes.
- Ensure updates remain traceable, documented, and aligned with roadmap priorities.

## 2. Responsibilities
### 2.1 Intake & Prioritization
- Review backlog items, customer feedback, and telemetry insights to determine scope.
- Map each update to PRD requirements or new change requests; capture acceptance criteria.

### 2.2 Planning
- Determine which DevCycles (Features, Testing, Deploy, etc.) must run for each update.
- Sequence work to minimize disruption and maintain human-in-the-loop checkpoints.

### 2.3 Execution Oversight
- Ensure dependent DevCycles complete successfully for the selected work items.
- Track status, blockers, and decisions in `todo.md`, `CHANGELOG.md`, or issue trackers.

### 2.4 Communication & Documentation
- Publish release notes or update summaries referencing tasks/issues addressed.
- Update PRD/Tech Requirements when scope changes become permanent.

## 3. Inputs
- Backlog, telemetry, customer feedback
- Latest PRD/Tech Requirements
- Outputs from recent DevCycles
- Toolset for Updates cycle

## 4. Outputs
- Prioritized update plan with associated DevCycles
- Documentation/release notes summarizing changes
- Logged tasks for remaining work or follow-ups

## 5. Success Criteria
- Updates are fully traced to requirements and validated DevCycles.
- Stakeholders agree on scope, status, and next steps.
- Change documentation (changelog, PRD revisions) is current.

## 6. Error Handling
- Pause updates if prerequisite DevCycles fail or requirements are unclear.
- Defer risky changes to future planning sessions with rationale.

## 7. Toolset Hook
Use `../toolsets/updates.toolset.jsonc` to manage planning artifacts and communication tools.

## 8. Traceability
- WHEN post-launch changes are requested, THE SYSTEM SHALL execute this Updates DevCycle to orchestrate required work (PRD §7.4, TechReq §3 DevCycle 18).
- WHEN updates complete, THE SYSTEM SHALL record revisions in PRD/Tech Requirements and changelog (PRD §8, TechReq §7).
```
