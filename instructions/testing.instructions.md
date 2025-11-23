---
name: "Testing DevCycle"
description: "Establish and configure the testing strategy, including unit, integration, and E2E tests."
applyTo: ""
---

## Purpose

Define how correctness will be proven through testing. Configure the testing frameworks and generate templates for all test types.

## Responsibilities

1. **Configure test frameworks** – Use `#tool:testing-toolset` to set up Vitest for unit and integration tests and Playwright for end‑to‑end tests. Configure file patterns and test utilities.
2. **Generate test plans** – For each feature described in the PRD, produce test plan templates outlining unit, integration, and E2E checks. Map each test to acceptance criteria.
3. **Folder conventions** – Establish folders for tests, mocks, and fixtures. Ensure tests can be run in isolation and in CI pipelines.

## Success Criteria

- Test environments run without configuration errors.
- Test plan templates are comprehensive and align with acceptance criteria.
- Tests execute deterministically both locally and in CI.