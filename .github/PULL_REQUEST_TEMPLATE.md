# Summary

<!--
  Loaded Vibes Framework Development PR Template

  This template is for the DEVELOPMENT TEAM and GitHub Copilot coding agent.
  It is NOT shipped with the framework—it governs internal contributions.

  Optimized for automated workflows: links issues, enables agent review,
  and enforces Spec-Driven Workflow per SPEC-DEV.
-->

Closes #<!-- issue number -->

## Change Overview

<!-- Brief description of what this PR accomplishes. The coding agent will expand on this. -->

## Issue Alignment

<!-- This section links the PR to the originating issue for traceability. -->

| Field      | Value                                                                                  |
| ---------- | -------------------------------------------------------------------------------------- |
| Issue      | #<!-- number -->                                                                       |
| Issue Type | <!-- Feature / Bug / Spec Update / DevCycle Asset / Infrastructure / Documentation --> |
| DevCycle   | <!-- e.g., Initialization, Scaffolding, Features -->                                   |

## Requirements Fulfilled

<!-- From the linked issue's Requirements Traceability table: -->

| Document          | Section | Requirement                                     |
| ----------------- | ------- | ----------------------------------------------- |
| PRD               | §       |                                                 |
| Tech Requirements | §       |                                                 |
| Spec ID(s)        |         | <!-- SPEC-ARCH, SPEC-CLI, SPEC-ENGINE, etc. --> |

## Acceptance Criteria Verification

<!-- Check off the acceptance criteria from the linked issue: -->

- [ ] Criterion 1:
- [ ] Criterion 2:
- [ ] Criterion 3:

## Changes Made

### Files Modified

<!-- List key files changed, grouped by directory: -->

**Development Assets (`.github/`, `.vscode/`, `docs/`, `templates/`, `spec/`):**

-

**Shipped Assets (`dist/`):**

-

### Implementation Summary

<!-- Coding agent: describe the technical approach taken -->

## Definition of Done Checklist

<!-- Per SPEC-DEV §4 — all items must be checked before merge: -->

### Documentation

- [ ] `TODO.md` updated (completed items marked, new items added)
- [ ] `CHANGELOG.md` updated with action log entry
- [ ] Spec file(s) updated if scope changed
- [ ] PRD/Tech Requirements updated if behavior changed

### Validation

- [ ] Implementation matches issue acceptance criteria
- [ ] Tests added/updated (`genaiscript test`)
- [ ] Manifest parity verified (prompts → instructions → toolsets)
- [ ] Layer boundaries respected (SPEC-ARCH §2)

### Quality

- [ ] No secrets/credentials exposed
- [ ] Idempotent operations (SPEC-SECURITY §1)
- [ ] Code follows project conventions

## Test Results

<!-- Coding agent: paste relevant test output -->

<details>
<summary>Test Output</summary>

```
// Test results here
```

</details>

## Breaking Changes

<!-- If none, delete this section. Otherwise: -->

- **Impact:**
- **Migration:**

---

## Agent Review Instructions

<!--
  This PR will be reviewed by GitHub Copilot coding agent.
  The agent should verify:
-->

**Automated Checks:**

- [ ] Issue acceptance criteria satisfied
- [ ] TODO/CHANGELOG entries present and properly formatted
- [ ] Spec ID citations match issue requirements
- [ ] No references from shipped assets to dev assets (SPEC-ARCH §2)
- [ ] No secrets in diff

**Merge Criteria:**

- All Definition of Done items checked
- Tests passing
- No unresolved review comments
