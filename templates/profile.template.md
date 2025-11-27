---

## name: profile.template applyTo: "\*\*" description: Template for project profile files (settings, extensions, MCP servers, tasks).

# Profile Template

This file defines the unified structure of a **project profile**, combining settings, extensions, MCP servers, and tasks into a single environment definition. The profile determines how the agent operates inside VS Code.

Profiles are environment-specific and stack-aware.

## Purpose

- Represent the active development environment.
- Declare all installed and required VS Code extensions.
- Define all MCP servers available for agents.
- Configure workspace and user settings.
- Provide automation tasks used by prompts and DevCycles.

## Structure (JSONC Example)

```jsonc
{
  "name": "project.profile",

  "settings": {
    "editor.formatOnSave": true,
    "files.exclude": {
      "node_modules": true,
      ".git": true
    }
  },

  "extensions": [
    "github.copilot",
    "modelcontextprotocol.mcp",
    "esbenp.prettier-vscode"
  ],

  "mcpServers": [
    {
      "name": "filesystem",
      "command": "mcp-filesystem",
      "args": []
    },
    {
      "name": "github",
      "command": "mcp-github",
      "args": []
    }
  ],

  "tasks": {
    "scaffold": "powershell ./scripts/scaffold.ps1",
    "configure": "powershell ./scripts/configure.ps1",
    "verify": "powershell ./scripts/verify.ps1"
  }
}
```

## Profile Generation Rules

- The Bootstrapper creates or updates the profile.
- The profile must merge user settings, workspace settings, and extension requirements.
- Only extensions listed in the environment are included.
- MCP server definitions must match `mcp.json`.
- Tasks should correspond to DevCycles.

## Profile Responsibilities

- Provide the agent with a stable environment configuration.
- Ensure all required tools and servers are available.
- Define how automation tasks are executed.
- Align with the active technology stack.

## Notes

- Profiles are JSONC files.
- The Bootstrapper updates profiles automatically.
- Profile changes may trigger DevCycle regeneration.

