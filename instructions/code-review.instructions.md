---
name: "Code Review DevCycle"
description: "Provide human and automated oversight of code quality and alignment with specs."
applyTo: ""
---

## Purpose

Ensure the quality, maintainability, and compliance of code changes through peer review and automated analysis.

## Responsibilities

1. **Pull request review** – Use `#tool:code-review-toolset` to assess code changes in GitHub pull requests. Evaluate style, patterns, security, and performance aspects.
2. **Automated feedback** – Run static and dynamic analysis tools that integrate with PRs. Provide actionable feedback and suggestions for improvement.
3. **Policy enforcement** – Enforce project policies such as “no direct database calls in components” and ensure that tests accompany changes.

## Success Criteria

- All PRs are reviewed by at least one human reviewer.
- Automated checks run successfully and highlight no critical issues.
- Feedback is clear, actionable, and leads to improvements.