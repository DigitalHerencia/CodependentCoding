```instructions
---
name: debug.instructions
applyTo: "**"
description: "Instructions for the Debug DevCycle."
---

# Debug DevCycle Instructions

## 1. Purpose
- Identify, reproduce, and resolve defects surfaced during Verification, Testing, Validation, or human feedback.
- Stabilize the codebase while preserving traceability and safety.

## 2. Responsibilities
### 2.1 Reproduction & Diagnostics
- Capture repro steps, environment details, logs, and data snapshots for each issue.
- Leverage sequential thinking/tooling to isolate root causes before applying fixes.

### 2.2 Fix Implementation
- Apply minimal, well-scoped fixes that respect stack conventions and do not introduce new risk.
- Update or add tests reproducing the bug to prevent regressions.

### 2.3 Regression Verification
- Re-run relevant lint/type/test suites plus any scenario-specific scripts to confirm resolution.
- Coordinate with Observability/Performance DevCycles if fixes touch instrumentation or budgets.

### 2.4 Documentation
- Record root cause, fix summary, and tests executed in `CHANGELOG.md` and/or issue trackers.
- Update runbooks or troubleshooting guides when appropriate.

## 3. Inputs
- Bug reports, failing tests, logs
- Current codebase + configs
- Toolset for Debug cycle

## 4. Outputs
- Code/config updates addressing the defect
- Updated tests covering the issue
- Documentation/log entries describing diagnosis and resolution

## 5. Success Criteria
- Reproduction steps now pass; automated tests confirm the fix.
- No unrelated files are modified; scope stays focused.
- Human reviewer acknowledges the fix and residual risks.

## 6. Error Handling
- Stop when reproduction is unclear; request clarification.
- Avoid speculative changes; revert attempts that fail validation.

## 7. Toolset Hook
Use only `../toolsets/debug.toolset.jsonc` capabilities.

## 8. Traceability
- WHEN defects arise, THE SYSTEM SHALL execute this Debug DevCycle before resuming feature work (PRD §7.4, TechReq §3 DevCycle 10).
- WHEN fixes are applied, THE SYSTEM SHALL document outcomes referencing PRD §8 and TechReq §7.
```
