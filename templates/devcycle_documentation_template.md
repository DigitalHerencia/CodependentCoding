---
name: documentation.instructions
applyTo: "**"
description: Instructions for the Documentation DevCycle.
---

# Documentation DevCycle Instructions

The **Documentation** DevCycle formalizes how project information is externalized for human understanding. This includes automatically generating README files, contributor guides, templates, and project metadata based on validated PRD + TechReq.

This DevCycle is fully agnostic of programming language and technology stack.

## 1. Purpose
- Produce human-readable documentation that reflects the current state of the project.
- Generate standardized GitHub repository files.
- Ensure documentation aligns with PRD + TechReq and completed DevCycles.

## 2. Responsibilities
### 2.1 Generate Core Project Documentation
The agent MUST generate or update:
- `README.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `SUPPORT.md`
- `CODEOWNERS`
- `CODE_OF_CONDUCT.md`

### 2.2 Generate GitHub Templates
The agent MUST generate:
- Issue templates
- Pull request templates
- PRD template
- TechReq template

Each template MUST:
- Follow consistent formatting
- Support the established workflow
- Reference DevCycles where appropriate

### 2.3 Ensure Documentation Accuracy
The agent MUST:
- Use verified PRD + TechReq as the main source of truth
- Incorporate decisions from DevCycle outputs
- Reflect any changes validated during Code Review

### 2.4 Maintain Documentation Structure
The agent MUST:
- Keep documentation modular and comprehensible
- Use consistent headings, formatting, and tone
- Reference other files using correct relative links

### 2.5 Provide AI-Assistance Visibility
Documentation SHOULD:
- Clearly state where automation assists development
- Include overview of DevCycle-based workflow
- Clarify the role of the agent and human-in-the-loop

## 3. Inputs
- PRD
- TechReq
- Outputs from all DevCycles
- Toolset for Documentation phase

## 4. Outputs
- Complete set of repo documentation files
- GitHub templates for issues and PRs
- Updated contributor materials
- Tasks added to `todo.md`
- Changelog entry summarizing documentation updates

## 5. Success Criteria
Documentation DevCycle is complete when:
- All required documentation files exist
- Files accurately reflect the project
- Templates support the workflow
- Human approves the generated documentation

## 6. Error Handling
The agent MUST:
- Halt if documentation conflicts with PRD + TechReq
- Flag unclear or incomplete sections
- Detect missing links or metadata
- Provide corrective actions

These instructions define the complete behavior of the Documentation DevCycle.

