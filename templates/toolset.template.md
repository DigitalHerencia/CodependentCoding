---

## name: toolset.template applyTo: "\*\*" description: Template for environment-specific toolset files.

# Toolset Template

This file defines the structure used by all environment-specific toolset JSONC files. Individual toolsets are generated per DevCycle, based on detected VS Code extensions, MCP servers, and workspace settings.

## Purpose

- Provide the agent with a bounded set of tools for each DevCycle.
- Enforce security by limiting access to only required capabilities.
- Serve as the middleware layer between instructions and available tools.

## Structure (JSONC Example)

```jsonc
{
  // Name of the toolset (per DevCycle)
  "name": "initialization.toolset",

  // List of VS Code extensions relevant for this DevCycle
  "extensions": [
    "github.copilot",
    "modelcontextprotocol.mcp",
    "editorconfig"
  ],

  // MCP servers available during this DevCycle
  "mcpServers": [
    "filesystem/*",
    "github/*",
    "memory/*"
  ],

  // Built-in or contributed tools the agent may invoke
  "tools": [
    "terminal",
    "workspace",
    "editor",
    "githubRepo"
  ],

  // Optional security boundaries
  "security": {
    "allowFileWrite": true,
    "allowNetwork": false,
    "restrictedPaths": [
      "node_modules",
      ".git"
    ]
  }
}
```

## Toolset Generation Rules

- Every DevCycle gets its own toolset.
- Toolsets are built from the environment’s:
  - `extensions.json`
  - `mcp.json`
  - Workspace settings
  - User settings
- Only required tools for that DevCycle are included.
- Access to tools is minimized for security.

## Toolset Responsibilities

- Provide the agent with the correct tools.
- Enforce limitations per DevCycle.
- Guarantee safe execution.
- Maintain predictable capabilities.

## Notes

- Toolsets are JSONC, not Markdown.
- This template defines how real toolset files are structured.
- Actual toolsets will vary per project environment.

