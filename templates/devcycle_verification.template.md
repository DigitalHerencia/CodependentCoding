---
name: verification.instructions
applyTo: "**"
description: Instructions for the Verification DevCycle.
---

# Verification DevCycle Instructions

The **Verification** DevCycle ensures that the project is structurally sound before any feature or logic implementation begins. This phase validates configuration, environment setup, and baseline project integrity.

Verification is language-agnostic and stack-agnostic. It does not generate code. It confirms the project is ready to proceed.

## 1. Purpose
- Perform static checks on project configuration and structure.
- Validate that previous DevCycles (Initialization, Scaffolding, Configuration) were completed correctly.
- Identify structural, configuration, or environment issues early.

## 2. Responsibilities
### 2.1 Validate Environment
- Confirm that configuration files generated in earlier phases exist and are valid.
- Validate workspace and user settings.
- Ensure the profile is active and recognized.

### 2.2 Validate Tools and MCP Servers
Using #tool:mcp:
- Confirm MCP connectivity.
- Validate required servers are active.
- Detect missing or misconfigured servers.

### 2.3 Validate Project Configuration
The agent MUST verify:
- Formatting configuration
- Linting configuration
- Testing framework configuration
- Environment variable templates
- Project metadata files

### 2.4 Run Static Analysis (Non-Execution)
The agent MUST run static checks such as:
- Linting dry run
- Type-check dry run (if applicable)
- Basic build dry run (stack-specific agent decides exact commands)

### 2.5 Report Issues
- List all configuration, structural, or tooling errors.
- Provide detailed remediation steps.
- Update `todo.md` with required fixes.

## 3. Inputs
- PRD
- TechReq
- Initialization findings
- Scaffolded project
- Configuration output
- Toolset for Verification phase

## 4. Outputs
- Verification summary report
- List of errors, warnings, and suggested fixes
- Updated tasks
- Changelog entry summarizing verification steps

## 5. Success Criteria
Verification is complete when:
- All static checks pass
- No critical configuration errors remain
- Tooling functions as expected
- MCP connections succeed
- Human approves the verification summary

## 6. Error Handling
The agent MUST:
- Halt progression on critical errors
- Report missing configs or corrupted files
- Detect incompatible tool versions
- Provide corrective instructions

These instructions define the complete behavior of the Verification DevCycle.

