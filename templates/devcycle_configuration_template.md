---
name: configuration.instructions
applyTo: "**"
description: Instructions for the Configuration DevCycle.
---

# Configuration DevCycle Instructions

These instructions define the **Configuration** phase. Configuration finalizes project-level settings, tooling, and metadata required for reliable development. This phase remains language-agnostic; stack-specific implementation is handled by the custom agent.

## 1. Purpose
- Establish the project's configuration baseline.
- Set up formatting, linting, type systems, environment variables, and testing frameworks.
- Align project settings with the requirements of the PRD + TechReq.

## 2. Responsibilities
### 2.1 Apply Project Tooling
Configure necessary project-wide tools such as:
- Linters
- Formatters
- Type checkers
- Testing frameworks
- Documentation generators

The agent implements these based on the stack.

### 2.2 Generate Configuration Files
The agent MUST generate or update configuration files including:
- Formatting rules
- Linting configuration
- Test framework config
- Project metadata files

### 2.3 Establish Environment Variable Templates
- Create or update `.env.example` based on PRD + TechReq.
- Include required keys, secrets, or external service dependencies.

### 2.4 Align Workspace Settings
- Apply correct workspace configuration.
- Ensure settings support consistent development.

### 2.5 Ensure Consistency with PRD + TechReq
The agent MUST:
- Detect mismatches between configuration needs and specifications.
- Produce actionable corrections.
- Document all decisions.

## 3. Inputs
- PRD
- TechReq
- Scaffolded project
- Initialization findings
- Toolset for Configuration phase

## 4. Outputs
- Fully generated configuration files
- Updated `.env.example`
- Validated project toolchain
- Tasks added to `todo.md`
- Changelog entry summarizing configuration actions

## 5. Success Criteria
The Configuration DevCycle is complete when:
- All required config files exist and are valid
- Testing environment initializes without errors
- Linting/formatting tools run without issues
- Project is ready for verification
- Human approves the results

## 6. Error Handling
The agent MUST:
- Stop if critical config files fail validation
- Detect conflicting configurations
- Flag missing keys or unsupported files
- Produce fixes or recommendations

These instructions define the complete behavior of the Configuration DevCycle.

