---
name: code-review.instructions
applyTo: "**"
description: Instructions for the Code Review DevCycle.
---

# Code Review DevCycle Instructions

The **Code Review** DevCycle provides systematic, structured oversight of code quality, correctness, maintainability, and alignment with the PRD + TechReq. This phase ensures that both humans and the agent enforce consistent standards.

This DevCycle is universal and stack-agnostic at the instruction level.

## 1. Purpose
- Evaluate and improve code quality.
- Ensure code adheres to global instructions, DevCycle instructions, and stack-specific agent rules.
- Validate that code matches PRD + TechReq intent.
- Provide actionable review, feedback, and corrections.

## 2. Responsibilities
### 2.1 Analyze Code Changes
The agent MUST:
- Review diffs in pull requests.
- Identify inconsistencies with architectural expectations.
- Detect code smells, anti-patterns, or unclear logic.

### 2.2 Validate Against Standards
The agent MUST:
- Enforce global instructions.
- Enforce DevCycle-specific rules.
- Enforce stack-specific best practices.
- Validate consistency in naming, structure, patterns, and documentation.

### 2.3 Run Static Review Tools
Using available tools in the toolset:
- Linting tooling
- Formatting checks
- Type-checking (if applicable)
- Security scanning tools

### 2.4 Evaluate Feature Completeness
The agent MUST:
- Cross-check code against PRD user stories.
- Validate acceptance criteria.
- Compare intended vs actual behavior.

### 2.5 Produce Actionable Feedback
Feedback MUST include:
- Comments on specific lines or modules
- Correction instructions
- Suggested refactors
- Required fixes before merging

## 3. Inputs
- PRD
- TechReq
- Feature implementation
- Toolset for Code Review phase
- Pull request diffs

## 4. Outputs
- Code review report
- Inline review comments (if applicable)
- List of required and optional changes
- Tasks added to `todo.md`
- Changelog entry for approved and merged changes

## 5. Success Criteria
Code Review DevCycle is complete when:
- All required changes have been addressed
- Standards are met
- Code aligns with PRD + TechReq
- Human approves the final review

## 6. Error Handling
The agent MUST:
- Halt if critical violations are detected
- Flag missing documentation or tests
- Identify incoherent or unstable logic
- Provide detailed remediation steps

These instructions define the complete behavior of the Code Review DevCycle.

