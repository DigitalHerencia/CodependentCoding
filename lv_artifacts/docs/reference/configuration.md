# Configuration Reference

> Every knob, toggle, and secret setting in Loaded Vibes.

---

## Overview

Loaded Vibes configuration is organized across multiple files and locations. This reference covers everything you can customize.

---

## Configuration Hierarchy

Configuration is loaded in this order (later overrides earlier):

```
1. Framework defaults (built-in)
2. Project manifest (.loaded-vibes/manifest.json)
3. Environment variables
4. CLI flags
```

---

## Project Manifest

**Location:** `.loaded-vibes/manifest.json`

The manifest tracks project-level configuration and framework state.

```json
{
  "frameworkVersion": "1.0.0",
  "installedAt": "2024-11-28T12:34:56Z",
  "lastUpgrade": null,
  "stack": "next",
  "config": {
    "telemetry": true,
    "autoFix": false,
    "theme": "synthwave",
    "logLevel": "info",
    "checkpoints": true
  }
}
```

### Manifest Fields

| Field              | Type            | Description                 |
| ------------------ | --------------- | --------------------------- |
| `frameworkVersion` | string          | Installed framework version |
| `installedAt`      | ISO8601         | Installation timestamp      |
| `lastUpgrade`      | ISO8601 \| null | Last upgrade timestamp      |
| `stack`            | string          | Project template used       |
| `config`           | object          | User configuration          |

### Config Options

| Key           | Type    | Default       | Description                 |
| ------------- | ------- | ------------- | --------------------------- |
| `telemetry`   | boolean | `true`        | Send anonymous usage data   |
| `autoFix`     | boolean | `false`       | Auto-fix issues in doctor   |
| `theme`       | string  | `"synthwave"` | CLI color theme             |
| `logLevel`    | string  | `"info"`      | Logging verbosity           |
| `checkpoints` | boolean | `true`        | Enable approval checkpoints |

**Setting via CLI:**

```bash
npx loaded-vibes config set telemetry false
npx loaded-vibes config set theme minimal
```

---

## DevCycles Manifest

**Location:** `.github/devcycles.config.json` (mirrored from `.loaded-vibes/`)

Defines all DevCycles and their mappings.

```json
{
  "$schema": "./schemas/devcycles.schema.json",
  "version": "1.0.0",
  "devCycles": {
    "init": {
      "instruction": "init.instructions.md",
      "prompt": "init.prompt.md",
      "toolset": "init.toolset.jsonc",
      "description": "Bootstrap environment and validate prerequisites",
      "displayName": "Initialization",
      "riskLevel": "low",
      "checkpoints": ["plan", "reflect"],
      "defaultTools": ["filesystem", "git", "memory"]
    },
    "features": {
      "instruction": "features.instructions.md",
      "prompt": "features.prompt.md",
      "toolset": "features.toolset.jsonc",
      "description": "Implement application logic with performance budgets",
      "displayName": "Features",
      "riskLevel": "medium",
      "checkpoints": ["plan", "implement", "reflect"],
      "defaultTools": ["filesystem", "git", "memory", "postgres"]
    }
  }
}
```

### DevCycle Entry Schema

| Field          | Type     | Required | Description                   |
| -------------- | -------- | -------- | ----------------------------- |
| `instruction`  | string   | ✓        | Path to instruction file      |
| `prompt`       | string   | ✓        | Path to prompt file           |
| `toolset`      | string   | ✓        | Path to toolset file          |
| `description`  | string   | ✓        | Short description             |
| `displayName`  | string   | ✓        | Human-readable name           |
| `riskLevel`    | enum     | ✓        | `"low"`, `"medium"`, `"high"` |
| `checkpoints`  | string[] |          | Approval gates                |
| `defaultTools` | string[] |          | Default MCP servers           |

---

## Toolset Configuration

**Location:** `.github/toolsets/<devcycle>.toolset.jsonc`

Defines allowed operations per DevCycle.

```jsonc
{
  "$schema": "../schemas/toolset.schema.json",
  "name": "features",
  "description": "Features DevCycle tools",
  "tools": {
    "mcpServers": ["filesystem", "git", "memory", "postgres"],
    "vscodeCommands": [
      "workbench.action.files.save",
      "editor.action.formatDocument",
      "workbench.action.terminal.runSelectedText"
    ],
    "cliCommands": ["pnpm", "npx", "prisma", "vitest"],
    "destructive": false,
    "requiresApproval": ["database.migrate", "database.reset"]
  },
  "constraints": {
    "maxFileSize": "1MB",
    "allowedPaths": ["src/**", "prisma/**"],
    "blockedPaths": [".loaded-vibes/logs/**"]
  }
}
```

### Toolset Schema

| Field                      | Type     | Description                         |
| -------------------------- | -------- | ----------------------------------- |
| `tools.mcpServers`         | string[] | Allowed MCP servers                 |
| `tools.vscodeCommands`     | string[] | Allowed VS Code commands            |
| `tools.cliCommands`        | string[] | Allowed CLI tools                   |
| `tools.destructive`        | boolean  | Whether destructive ops are allowed |
| `tools.requiresApproval`   | string[] | Operations needing approval         |
| `constraints.maxFileSize`  | string   | Max file size to read/write         |
| `constraints.allowedPaths` | string[] | Glob patterns for allowed paths     |
| `constraints.blockedPaths` | string[] | Glob patterns for blocked paths     |

---

## VS Code Configuration

### Settings

**Location:** `.vscode/settings.json`

```json
{
  "genaiscript.localTypeDefinitions": true,
  "genaiscript.cli.version": "latest",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.associations": {
    "*.prompt.md": "markdown",
    "*.instructions.md": "markdown",
    "*.toolset.jsonc": "jsonc"
  },
  "[markdown]": {
    "editor.wordWrap": "on",
    "editor.quickSuggestions": false
  }
}
```

### Key Settings

| Setting                            | Value      | Purpose                       |
| ---------------------------------- | ---------- | ----------------------------- |
| `genaiscript.localTypeDefinitions` | `true`     | Enable local type definitions |
| `genaiscript.cli.version`          | `"latest"` | GenAIScript CLI version       |
| `editor.formatOnSave`              | `true`     | Auto-format on save           |

### Extensions

**Location:** `.vscode/extensions.json`

```json
{
  "recommendations": [
    "genaiscript.genaiscript-vscode",
    "github.copilot",
    "github.copilot-chat",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-playwright.playwright"
  ]
}
```

### MCP Servers

**Location:** `.vscode/mcp.json`

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-filesystem", "--root", "."]
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-git"]
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-memory"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-postgres"],
      "env": {
        "DATABASE_URL": "${env:DATABASE_URL}"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-github"],
      "env": {
        "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
      }
    }
  }
}
```

### MCP Server Schema

| Field     | Type     | Description           |
| --------- | -------- | --------------------- |
| `command` | string   | Command to run        |
| `args`    | string[] | Command arguments     |
| `env`     | object   | Environment variables |

### Tasks

**Location:** `.vscode/tasks.json`

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Loaded Vibes: Dashboard",
      "type": "shell",
      "command": "npx loaded-vibes dashboard",
      "problemMatcher": []
    },
    {
      "label": "Loaded Vibes: Run DevCycle",
      "type": "shell",
      "command": "npx loaded-vibes devcycle ${input:devCycle}",
      "problemMatcher": []
    },
    {
      "label": "Loaded Vibes: Doctor",
      "type": "shell",
      "command": "npx loaded-vibes doctor",
      "problemMatcher": []
    }
  ],
  "inputs": [
    {
      "id": "devCycle",
      "type": "pickString",
      "description": "Select DevCycle",
      "options": [
        "init",
        "scaffold",
        "config",
        "verify",
        "data",
        "auth",
        "test",
        "validate",
        "features",
        "debug",
        "security",
        "perf",
        "observe",
        "review",
        "docs",
        "cicd",
        "deploy",
        "updates"
      ]
    }
  ]
}
```

---

## Environment Variables

### Framework Variables

| Variable                 | Description          | Default         |
| ------------------------ | -------------------- | --------------- |
| `LOADED_VIBES_HOME`      | Framework directory  | `.loaded-vibes` |
| `LOADED_VIBES_LOG_LEVEL` | Log level            | `info`          |
| `LOADED_VIBES_NO_COLOR`  | Disable colors       | `false`         |
| `LOADED_VIBES_TELEMETRY` | Enable telemetry     | `true`          |
| `LOADED_VIBES_THEME`     | CLI theme            | `synthwave`     |
| `LOADED_VIBES_CI`        | CI mode (no prompts) | Auto-detected   |

### Application Variables

| Variable           | Description                  |
| ------------------ | ---------------------------- |
| `DATABASE_URL`     | PostgreSQL connection string |
| `GITHUB_TOKEN`     | GitHub API token             |
| `CLERK_SECRET_KEY` | Clerk authentication         |

### Example `.env`

```bash
# Framework
LOADED_VIBES_LOG_LEVEL=debug
LOADED_VIBES_TELEMETRY=false

# Application
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxx
```

---

## Orchestrator State

**Location:** `.loaded-vibes/state/state.json`

Runtime state persistence (managed by framework).

```json
{
  "currentDevCycle": null,
  "lastRun": {
    "devCycleId": "features",
    "status": "success",
    "timestamp": "2024-11-28T12:34:56Z",
    "duration": 142000,
    "phase": "handoff"
  },
  "checkpoints": [],
  "context": {
    "prdVersion": "abc123",
    "techReqVersion": "def456"
  },
  "chain": {
    "active": false,
    "queue": [],
    "completed": []
  }
}
```

> ⚠️ **Warning:** Do not manually edit this file. Use the CLI instead.

---

## Asset Tracking

**Location:** `.loaded-vibes/assets.json`

Tracks file checksums for upgrade management.

```json
{
  ".github/prompts/init.prompt.md": {
    "frameworkChecksum": "sha256:abc123...",
    "localChecksum": "sha256:abc123...",
    "frameworkVersion": "1.0.0",
    "lastModified": "2024-11-28T12:34:56Z",
    "status": "pristine"
  },
  ".github/instructions/features.instructions.md": {
    "frameworkChecksum": "sha256:def456...",
    "localChecksum": "sha256:xyz789...",
    "frameworkVersion": "1.0.0",
    "lastModified": "2024-11-28T14:00:00Z",
    "status": "modified"
  }
}
```

### Status Values

| Status     | Meaning                         |
| ---------- | ------------------------------- |
| `pristine` | Matches upstream exactly        |
| `modified` | User has customized             |
| `conflict` | Upstream changed, user modified |
| `orphaned` | Removed from upstream           |

---

## Telemetry Configuration

### Opt-Out

```bash
# Via CLI
npx loaded-vibes config set telemetry false

# Via environment
export LOADED_VIBES_TELEMETRY=false
```

### Data Collected

When telemetry is enabled, we collect:

- Framework version
- DevCycle execution counts
- Error frequencies (no stack traces)
- Feature usage patterns

**We never collect:**

- Source code
- Personal information
- File contents
- Environment variables

---

## Themes

Available CLI themes:

| Theme       | Description                        |
| ----------- | ---------------------------------- |
| `synthwave` | Neon pink/cyan gradients (default) |
| `minimal`   | Monochrome, reduced animations     |
| `light`     | Light theme for bright terminals   |
| `matrix`    | Green-on-black Matrix style        |

**Setting theme:**

```bash
npx loaded-vibes config set theme matrix
```

---

## Log Configuration

### Log Levels

| Level   | Description                     |
| ------- | ------------------------------- |
| `debug` | Everything, including internals |
| `info`  | Normal operation (default)      |
| `warn`  | Warnings and errors only        |
| `error` | Errors only                     |

### Log Format

Logs are stored as NDJSON in `.loaded-vibes/logs/`:

```ndjson
{"timestamp":"2024-11-28T12:34:56Z","level":"info","devCycleId":"features","phase":"analyze","message":"Loading context"}
{"timestamp":"2024-11-28T12:34:57Z","level":"debug","devCycleId":"features","phase":"analyze","message":"PRD loaded","bytes":4096}
```

### Log Rotation

Logs are automatically rotated:

- **Max file size:** 10MB
- **Max files:** 10
- **Retention:** 30 days

---

## Security Settings

### Bad Vibes Firewall

Configured in toolsets:

```jsonc
{
  "tools": {
    "destructive": false,
    "requiresApproval": ["database.migrate", "database.reset", "file.delete", "git.push --force"]
  }
}
```

### Path Restrictions

```jsonc
{
  "constraints": {
    "allowedPaths": ["src/**", "prisma/**", "public/**"],
    "blockedPaths": [".loaded-vibes/logs/**", ".loaded-vibes/state/**", "node_modules/**", ".env*"]
  }
}
```

---

## Next Steps

- **[CLI Reference](./cli.md)** — Command reference
- **[Customization Guide](../guides/customization.md)** — Modifying behavior
- **[Troubleshooting](../guides/troubleshooting.md)** — Common issues

---

> "Configuration is just code you haven't abstracted yet."
