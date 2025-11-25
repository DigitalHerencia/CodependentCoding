```instructions
---
name: verification.instructions
applyTo: "**"
description: "Instructions for the Verification (static checks) DevCycle."
---

# Verification DevCycle Instructions

## 1. Purpose
- Run static checks to ensure the scaffolded and configured project is structurally sound before feature work begins.
- Detect lint, type, dependency, or configuration regressions early.
- Produce evidence for the Validation DevCycle and CI pipelines.

## 2. Responsibilities
### 2.1 Execute Static Analysis
- Run ESLint, TypeScript, Tailwind validations, and any additional static analyzers defined in TechReq §3 DevCycle 4.
- Capture outputs, exit codes, and summaries for the changelog.

### 2.2 Validate Configuration Consistency
- Confirm generated files (`tsconfig`, `next.config`, `tailwind.config`, etc.) resolve modules correctly and align with workspace settings.
- Detect missing scripts, dependencies, or conflicting versions.

### 2.3 Audit File Integrity
- Ensure required directories/files from Scaffolding + Configuration still exist and are not drifted.
- Compare against template manifests; log discrepancies as tasks.

### 2.4 Document Findings
- Classify findings (pass/blocker/warning) and map them to PRD acceptance criteria.
- Recommend next steps or remediation tasks for Debug/Updates DevCycles.

## 3. Inputs
- Configured codebase
- Lint/type/test scripts defined in `package.json`
- Tool outputs from Configuration
- PRD + Tech Requirements

## 4. Outputs
- Static analysis logs (lint/type/tailwind)
- Verification summary with pass/fail matrix
- Tasks for any violations + changelog entry

## 5. Success Criteria
- All required static checks pass or have documented remediation plans.
- Workspace structure matches expectations; no missing key assets.
- Human reviewer acknowledges verification status before feature work proceeds.

## 6. Error Handling
- Stop if tooling commands cannot execute; diagnose dependency or environment issues.
- Do not auto-fix findings without human approval; instead, recommend actions for relevant DevCycle.

## 7. Toolset Hook
Use capabilities defined in `../toolsets/verification.toolset.jsonc` only.

## 8. Traceability
- WHEN configuration completes, THE SYSTEM SHALL execute this Verification DevCycle to validate static integrity (PRD §7.4, TechReq §3 DevCycle 4).
- WHEN verification uncovers issues, THE SYSTEM SHALL record remediation tasks referencing PRD/TechReq clauses (PRD §8, TechReq §7).
```
