---
name: testing.instructions
applyTo: "**"
description: Instructions for the Testing DevCycle.
---

# Testing DevCycle Instructions

The **Testing** DevCycle establishes the universal rules for defining how correctness is verified across the project. This phase is technology-agnostic; implementation details are handled by the stack‑specific agent.

## 1. Purpose
- Define the complete testing strategy for the project.
- Establish unit, integration, and end‑to‑end (E2E) testing requirements.
- Determine how acceptance criteria from the PRD + TechReq translate into tests.

## 2. Responsibilities
### 2.1 Interpret PRD + TechReq Acceptance Criteria
- Extract user stories and acceptance criteria.
- Identify feature flows requiring test coverage.
- Identify integration points requiring validation.
- Determine system‑wide behaviors that require E2E coverage.

### 2.2 Define Unit Testing Requirements
Unit testing should:
- Validate utilities, helpers, small functions.
- Validate domain logic where applicable.
- Mock external dependencies when relevant.
- Produce repeatable, deterministic outcomes.

### 2.3 Define Integration Testing Requirements
Integration testing should:
- Validate interactions between components/modules.
- Validate server/client interactions (where relevant).
- Ensure the data layer, auth layer, and feature logic interoperate correctly.

### 2.4 Define E2E Testing Requirements
E2E testing should:
- Validate end‑to‑end user flows across the entire system.
- Validate auth, data access, navigation, and workflows.
- Follow acceptance criteria step‑by‑step.

### 2.5 Establish Test Folder Structure
The agent MUST define an agnostic folder structure such as:
- `/tests/unit`
- `/tests/integration`
- `/tests/e2e`

The stack‑specific agent determines file extensions and implementation.

### 2.6 Produce Test Plan Templates
The agent MUST generate:
- A unit test plan template
- An integration test plan template
- An E2E test plan template

Each template MUST include:
- Test description
- Input conditions
- Expected output/behavior
- Edge cases

## 3. Inputs
- PRD
- TechReq
- Data DevCycle outputs
- Auth DevCycle outputs
- Toolset for Testing phase

## 4. Outputs
- Testing strategy specification
- Folder structure plan
- Test plan templates
- Tasks added to `todo.md`
- Changelog entry summarizing testing preparation

## 5. Success Criteria
The Testing DevCycle is complete when:
- All test types are fully defined
- Coverage expectations align with PRD + TechReq
- All test templates are generated
- Folder structure is validated
- Human approves the testing specification

## 6. Error Handling
The agent MUST:
- Halt if acceptance criteria are missing or underspecified
- Detect inconsistent feature flows
- Flag contradictions between UI/UX and backend expectations
- Provide clarification requests for incomplete scenarios

These instructions define the complete behavior of the Testing DevCycle.

