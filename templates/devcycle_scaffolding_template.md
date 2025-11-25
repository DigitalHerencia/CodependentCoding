---
name: scaffolding.instructions
applyTo: "**"
description: Instructions for the Scaffolding DevCycle.
---

# Scaffolding DevCycle Instructions

These instructions define the **Scaffolding** phase. Scaffolding transforms the validated PRD + TechReq into a concrete project structure using the rules of the project's technology stack. This phase remains language-agnostic at the instruction level; the stack-specific agent handles technical implementation.

## 1. Purpose
- Convert PRD + TechReq into an initial project skeleton.
- Establish high-level architecture, directory layout, and baseline files.
- Prepare the codebase for configuration and further DevCycles.

## 2. Responsibilities
### 2.1 Interpret PRD + TechReq
- Extract structural requirements.
- Identify modules, domains, features, and data flows.
- Identify required top-level project directories.

### 2.2 Define Core Project Structure
The agent MUST generate a coherent initial structure based on the stack, including:
- Top-level root folders
- Feature/module folders
- Libraries/utilities
- Public assets folder
- Basic entry points as defined by the stack

The specifics are implemented by the custom agent.

### 2.3 Establish Boilerplate Files
The agent prepares boilerplate files such as:
- Documentation placeholders
- Core configuration files
- Environment variable templates
- Minimal code files needed to begin configuration

### 2.4 Enforce Constraints
The agent MUST:
- Follow globalinstructions.md
- Follow all DevCycle instructions
- Follow stack conventions via custom agent
- Use only tools in the Scaffolding toolset

### 2.5 Generate Initial Project Map
The agent produces a project map describing:
- Directories created
- Files created
- Expected extensions in future DevCycles

## 3. Inputs
- PRD
- TechReq
- Initialization outputs
- Toolset for Scaffolding phase

## 4. Outputs
- Scaffolded project structure
- High-level architecture map
- Initial files and directories
- List of generated boilerplate
- Tasks added to todo.md
- Changelog entry summarizing actions

## 5. Success Criteria
Scaffolding is complete when:
- The base structure is created
- All expected directories exist
- Required boilerplate files exist
- The project can move to Configuration without errors
- Human approves the scaffold

## 6. Error Handling
The agent MUST:
- Stop on missing PRD/TechReq sections
- Report structural inconsistencies
- Flag illegal or unsupported architecture decisions
- Provide actionable corrections

These instructions define the complete behavior of the Scaffolding DevCycle.

