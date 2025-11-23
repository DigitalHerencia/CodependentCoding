# Loaded Vibes Framework Artifacts (Redesigned)

This directory contains the artifacts for the Loaded Vibes development framework, redesigned to leverage **GenAIScript** and **MCP** for enhanced automation and determinism.

## New Structure

- **`genaiscript/`**: Contains the executable logic for the framework.
  - `orchestrator.genai.js`: The main entry point. Run this to start or resume a DevCycle.
  - `phases/`: Individual scripts for each DevCycle (e.g., `scaffolding.genai.js`).
- **`global.instructions.md`**: The master rulebook, updated to reference the GenAIScript workflow.
- **`agents/custom.agent.md`**: The agent definition, now aware of GenAIScript tools.
- **`mcp.config.json`**: Recommended configuration for Model Context Protocol servers.

## Getting Started

1. **Install GenAIScript**: Ensure you have the GenAIScript CLI or VS Code extension installed.
2. **Configure MCP**: Use `mcp.config.json` to set up your MCP servers in VS Code or your agent runtime.
3. **Run the Orchestrator**:
   ```bash
   genaiscript run genaiscript/orchestrator.genai.js
   ```
   Or use the VS Code interface to run the script.

## Key Enhancements

- **Automation First**: Replaced static prompts with dynamic scripts that can read files, validate state, and execute tools.
- **Context Awareness**: Scripts automatically pull in PRD, Tech Spec, and relevant code before prompting the agent.
- **Tool Integration**: Explicit support for MCP servers like `filesystem`, `git`, and `postgres` for robust operations.
