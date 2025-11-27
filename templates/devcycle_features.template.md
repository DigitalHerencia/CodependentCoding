---
name: features.instructions
applyTo: "**"
description: Instructions for the Features DevCycle.
---

# Features DevCycle Instructions

The **Features** DevCycle defines how application functionality is implemented. This phase turns PRD + TechReq requirements into concrete feature modules and workflows. It is stack-agnostic at the instruction level; the custom agent performs the actual implementation.

## 1. Purpose
- Build out all required application features.
- Implement business logic, workflows, and module interactions.
- Translate PRD functional requirements into working components.

## 2. Responsibilities
### 2.1 Interpret PRD + TechReq Functional Requirements
The agent MUST:
- Extract feature definitions, user stories, and workflows.
- Identify required feature modules.
- Identify dependencies between features.

### 2.2 Define Feature Modules
For each feature, the agent MUST define:
- Inputs and outputs
- Dependencies (data, auth, other features)
- Internal logic
- Required UI or interaction elements

### 2.3 Implement Business Logic
The agent MUST:
- Implement logic based on PRD rules.
- Surface undefined or contradictory logic.
- Validate logic compatiblity with Data + Auth DevCycles.

### 2.4 Generate Supporting Files
The agent MUST produce:
- Utilities
- Helper logic
- Domain modules
- State or workflow logic (based on stack)

### 2.5 Enforce Constraints
The agent MUST:
- Follow DevCycle instructions
- Follow global instructions
- Follow agent (stack) instructions
- Use tools only within the phase toolset

## 3. Inputs
- PRD
- TechReq
- Validation outputs
- Testing strategy
- Toolset for Features phase

## 4. Outputs
- Feature modules
- Utilities
- Supporting files
- Tasks added to `todo.md`
- Changelog entry summarizing implemented features

## 5. Success Criteria
The Features DevCycle is complete when:
- All PRD-defined features have corresponding modules
- Logic aligns with PRD + TechReq
- Dependencies are satisfied
- No undefined behaviors remain
- Human approves the implementation plan

## 6. Error Handling
The agent MUST:
- Halt on incomplete or ambiguous feature definitions
- Flag missing business rules
- Report dependency mismatches
- Provide actionable corrections

These instructions define the complete behavior of the Features DevCycle.

