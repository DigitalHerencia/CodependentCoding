```instructions
---
name: ci-cd.instructions
applyTo: "**"
description: "Instructions for the CI/CD DevCycle."
---

# CI/CD DevCycle Instructions

## 1. Purpose
- Define, implement, and validate automation pipelines that build, test, and deploy the Loaded Vibes stack.
- Ensure CI/CD workflows enforce DevCycle contracts and security gates.

## 2. Responsibilities
### 2.1 Pipeline Design
- Map required stages (lint, type, test, build, e2e, deploy, smoke) to GitHub Actions or equivalent tooling per TechReq §3 DevCycle 16.
- Encode environment guardrails (secrets, required approvals, branch protections).

### 2.2 Implementation
- Author/update workflow files, reusable actions, caching strategies, and secrets references.
- Provide local scripts or `npx genaiscript` tasks for reproducing CI steps.

### 2.3 Validation
- Run pipelines (or dry-run) to confirm they pass with current codebase.
- Capture logs/artifacts demonstrating success or document blockers.

### 2.4 Documentation & Governance
- Document pipeline stages, triggers, required approvals, and rollback procedures.
- Coordinate with Security/Deploy DevCycles to ensure compliance and readiness.

## 3. Inputs
- Outputs from Testing, Validation, Performance DevCycles
- Existing workflow files
- GitHub environment/secrets configuration
- Toolset for CI/CD

## 4. Outputs
- Updated workflow files and scripts
- Validation evidence (successful runs, logs)
- Docs describing pipeline behavior and required manual steps

## 5. Success Criteria
- Pipelines cover required stages and enforce policy gates.
- Secrets and tokens referenced securely (no plaintext values committed).
- Human reviewer approves pipeline updates after validation evidence is provided.

## 6. Error Handling
- Stop rollout if pipelines introduce regressions; coordinate rollback with Deploy DevCycle.
- Escalate when required secrets or permissions are missing.

## 7. Toolset Hook
Use only `../toolsets/ci-cd.toolset.jsonc` capabilities.

## 8. Traceability
- WHEN automation needs to be defined or changed, THE SYSTEM SHALL run this CI/CD DevCycle (PRD §7.4, TechReq §3 DevCycle 16).
- WHEN CI/CD issues arise, THE SYSTEM SHALL log remediation tasks referencing PRD §8 and TechReq §7.
```
