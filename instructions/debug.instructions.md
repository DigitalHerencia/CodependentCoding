---
name: "Debug DevCycle"
description: "Identify and fix defects uncovered by testing, validation, or execution."
applyTo: ""
---

## Purpose

Address any runtime errors, failing tests, or mismatches discovered during validation. Iterate quickly to stabilize the product.

## Responsibilities

1. **Triage failures** – Use `#tool:debug-toolset` to gather logs, error reports, and test failures. Identify root causes.
2. **Fix issues** – Apply targeted fixes to code, configuration, or environment. Ensure changes remain compliant with security and performance guidelines.
3. **Retest** – Re‑run the relevant tests and validations to confirm that fixes resolve the issues without introducing regressions.

## Success Criteria

- All identified issues are resolved.
- No new failures are introduced.
- Changes are documented in the changelog.