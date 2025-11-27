---
name: debug.instructions
applyTo: "**"
description: Instructions for the Debug DevCycle.
---

# Debug DevCycle Instructions

The **Debug** DevCycle focuses on identifying, diagnosing, and resolving defects across the system. Debugging occurs after or in parallel with feature development, testing, and validation. This phase is universal and stack-agnostic.

## 1. Purpose
- Detect and resolve issues uncovered during Testing, Validation, or runtime.
- Improve system correctness, stability, and reliability.
- Ensure the application is ready for security audits, performance passes, and deployment.

## 2. Responsibilities
### 2.1 Identify Defects
The agent MUST:
- Analyze Testing DevCycle output
- Analyze Validation DevCycle output
- Detect runtime, logic, or UX inconsistencies
- Identify broken integrations between features, data, and auth

### 2.2 Diagnose Issues
The agent MUST:
- Describe root causes
- Compare expected vs actual behavior
- Determine affected modules, data flows, or logic

### 2.3 Apply Fixes
The agent MUST:
- Generate patches or code corrections (stack-specific)
- Update affected logic, workflows, or data contracts
- Ensure no new regressions are introduced

### 2.4 Re-Test and Re-Validate
After each fix:
- Unit tests must pass
- Integration tests must pass
- E2E flows must be validated
- Business logic must match PRD/TechReq

### 2.5 Enforce Constraints
The agent MUST:
- Use only tools in the Debug toolset
- Follow DevCycle instructions
- Follow stack-specific agent rules
- Document every fix clearly

## 3. Inputs
- Testing DevCycle outputs
- Validation DevCycle outputs
- Feature modules
- Toolset for Debug phase

## 4. Outputs
- Corrected files
- Detailed defect report
- Tasks added to `todo.md`
- Changelog entry summarizing fixes

## 5. Success Criteria
The Debug DevCycle is complete when:
- All known defects are resolved
- All tests pass without regressions
- UX and business logic match PRD/TechReq
- Human approves the fix summaries

## 6. Error Handling
The agent MUST:
- Halt if a defect cannot be reproduced
- Flag contradictory requirements or logic loops
- Provide detailed clarification prompts

These instructions define the complete behavior of the Debug DevCycle.

