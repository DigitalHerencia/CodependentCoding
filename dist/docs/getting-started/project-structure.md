# Project Structure

> Understanding the anatomy of a Loaded Vibes project.

---

## Overview

When you install Loaded Vibes, your project gains a specific structure designed for clarity, traceability, and developer delight. This guide explains every directory and file you'll encounter.

---

## Directory Tree

A typical Loaded Vibes project looks like this:

```
my-project/
├── .github/                    # Copilot & GitHub automation
│   ├── agents/                 # Custom agent definitions
│   │   └── stack.agent.md
│   ├── instructions/           # DevCycle instruction files
│   │   ├── init.instructions.md
│   │   ├── scaffold.instructions.md
│   │   └── ...
│   ├── prompts/                # DevCycle entry prompts
│   │   ├── init.prompt.md
│   │   ├── scaffold.prompt.md
│   │   └── ...
│   ├── toolsets/               # Tool allowlists per DevCycle
│   │   ├── init.toolset.jsonc
│   │   ├── scaffold.toolset.jsonc
│   │   └── ...
│   ├── workflows/              # GitHub Actions
│   │   └── ci.yml
│   ├── copilot-instructions.md # Copilot global config
│   └── global.instructions.md  # Framework global rules
│
├── .loaded-vibes/              # Framework runtime
│   ├── logs/                   # NDJSON event logs
│   │   ├── init-20241128.ndjson
│   │   └── ...
│   ├── backup/                 # Upgrade backups
│   ├── state/                  # Orchestrator state
│   │   └── state.json
│   ├── manifest.json           # Project manifest
│   └── assets.json             # Asset checksums
│
├── .vscode/                    # VS Code configuration
│   ├── settings.json           # Editor settings
│   ├── extensions.json         # Recommended extensions
│   ├── mcp.json                # MCP server config
│   └── tasks.json              # Task definitions
│
├── src/                        # Your application code
│   ├── app/                    # Next.js app router
│   ├── components/             # React components
│   ├── lib/                    # Utilities and helpers
│   └── ...
│
├── package.json                # Node.js manifest
├── TODO.md                     # Running task list
├── CHANGELOG.md                # Version history
└── README.md                   # Project documentation
```

---

## `.loaded-vibes/` — Framework Runtime

This is where Loaded Vibes stores its operational data. Think of it as the framework's "brain."

### `manifest.json`

The project manifest tracks framework version and configuration:

```json
{
  "frameworkVersion": "1.0.0",
  "installedAt": "2024-11-28T12:34:56Z",
  "lastUpgrade": null,
  "stack": "next",
  "config": {
    "telemetry": true,
    "autoFix": false,
    "theme": "synthwave"
  }
}
```

### `assets.json`

Tracks checksums for upgrade diffing:

```json
{
  ".github/prompts/init.prompt.md": {
    "frameworkChecksum": "sha256:abc123...",
    "localChecksum": "sha256:abc123...",
    "frameworkVersion": "1.0.0",
    "lastModified": "2024-11-28T12:34:56Z",
    "status": "pristine"
  }
}
```

| Status     | Meaning                                 |
| ---------- | --------------------------------------- |
| `pristine` | File matches upstream exactly           |
| `modified` | You've customized this file             |
| `conflict` | Upstream changed a file you've modified |

### `logs/`

NDJSON event logs from DevCycle executions:

```ndjson
{"timestamp":"2024-11-28T12:34:56Z","devCycleId":"init","phase":"analyze","event":"start","requirementId":"PRD-5.1"}
{"timestamp":"2024-11-28T12:34:57Z","devCycleId":"init","phase":"analyze","event":"complete","duration":1234}
```

→ **[Log format reference](../reference/logs.md)**

### `state/state.json`

Orchestrator state persistence:

```json
{
  "currentDevCycle": null,
  "lastRun": {
    "devCycleId": "init",
    "status": "success",
    "timestamp": "2024-11-28T12:34:56Z"
  },
  "checkpoints": [],
  "context": {}
}
```

### `backup/`

Automatic backups created during upgrades:

```
backup/
├── v1.0.0-20241128T123456/
│   ├── .github/
│   └── manifest.backup.json
└── v1.0.1-20241129T091011/
    └── ...
```

---

## `.github/` — Copilot & Automation

This directory contains all GitHub-related configuration, including the core Loaded Vibes assets.

### `global.instructions.md`

Framework-wide rules that apply to all DevCycles:

- Canonical DevCycle names (18 total)
- Layer boundaries
- Artifact taxonomy
- TODO/CHANGELOG requirements

### `agents/`

Custom agent definitions for specialized AI behavior:

```markdown
---
name: stack
description: Technology stack specialist
---

# Stack Agent

You are a specialist in the project's technology stack...
```

### `prompts/`

Entry points for each DevCycle. Each prompt:

- Defines the DevCycle context
- References the matching instruction and toolset
- Captures environment variables

Example `init.prompt.md`:

```markdown
---
description: Initialize project environment
instruction: init.instructions.md
toolset: init.toolset.jsonc
---

# Initialization DevCycle

WHEN triggered, THE SYSTEM SHALL:

1. Validate prerequisites
2. Synchronize extensions
3. Configure MCP servers
   ...
```

### `instructions/`

Domain-specific rules for each DevCycle:

- Acceptance criteria
- Security guardrails
- Performance budgets
- TODO/CHANGELOG expectations

### `toolsets/`

Tool allowlists in JSONC format:

```jsonc
{
  "$schema": "../schemas/toolset.schema.json",
  "name": "init",
  "description": "Initialization DevCycle tools",
  "tools": {
    "mcpServers": ["filesystem", "git", "memory"],
    "vscodeCommands": ["workbench.action.reloadWindow"],
    "cliCommands": ["pnpm", "npx"],
    "destructive": false
  }
}
```

### `workflows/`

GitHub Actions for CI/CD:

- `ci.yml` — Lint, test, build
- `deploy.yml` — Deployment pipeline
- `release.yml` — Release automation

---

## `.vscode/` — Editor Configuration

VS Code settings synchronized by Loaded Vibes.

### `settings.json`

Editor preferences:

```json
{
  "genaiscript.localTypeDefinitions": true,
  "editor.formatOnSave": true,
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### `extensions.json`

Recommended extensions:

```json
{
  "recommendations": [
    "genaiscript.genaiscript-vscode",
    "github.copilot",
    "esbenp.prettier-vscode",
    "ms-playwright.playwright"
  ]
}
```

### `mcp.json`

MCP server configuration:

```json
{
  "mcpServers": {
    "filesystem": { "command": "npx", "args": ["@anthropic/mcp-fs"] },
    "git": { "command": "npx", "args": ["@anthropic/mcp-git"] },
    "memory": { "command": "npx", "args": ["@anthropic/mcp-memory"] }
  }
}
```

### `tasks.json`

VS Code task definitions:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Run DevCycle",
      "type": "shell",
      "command": "npx loaded-vibes devcycle ${input:devCycle}"
    }
  ]
}
```

---

## `src/` — Your Application

This is where your code lives. Structure depends on your stack:

### Next.js (Default)

```
src/
├── app/                    # App router pages
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/
├── components/             # React components
│   ├── ui/                 # UI primitives
│   └── features/           # Feature components
├── lib/                    # Utilities
│   ├── db.ts               # Database client
│   └── utils.ts            # Helpers
└── styles/                 # CSS/Tailwind
```

### Other Stacks

Loaded Vibes adapts `src/` structure based on your stack preset:

| Stack     | Structure                         |
| --------- | --------------------------------- |
| `next`    | App Router with server components |
| `react`   | Standard React with Vite          |
| `node`    | Express/Fastify API               |
| `library` | npm package structure             |

---

## Root Files

### `package.json`

Your project manifest. Loaded Vibes adds scripts:

```json
{
  "scripts": {
    "vibes": "loaded-vibes",
    "vibes:dashboard": "loaded-vibes dashboard",
    "vibes:doctor": "loaded-vibes doctor"
  }
}
```

### `TODO.md`

Running task list, updated by DevCycles:

```markdown
# TODO

## Active

- [ ] Implement user authentication (Features DevCycle)
- [ ] Add API rate limiting (Security DevCycle)

## Completed

- [x] Initialize project (Init DevCycle) - 2024-11-28
- [x] Scaffold base components (Scaffold DevCycle) - 2024-11-28
```

### `CHANGELOG.md`

Version history, updated by DevCycles:

```markdown
# Changelog

## [Unreleased]

### Added

- Initial project scaffolding
- User authentication flow

### Changed

- Updated database schema

## [0.1.0] - 2024-11-28

### Added

- Project initialization
```

---

## File Ownership

Understanding who "owns" each file helps prevent conflicts:

| File/Directory                   | Owner     | Editable By User?  |
| -------------------------------- | --------- | ------------------ |
| `.loaded-vibes/logs/`            | Framework | No                 |
| `.loaded-vibes/manifest.json`    | Framework | Via CLI only       |
| `.github/global.instructions.md` | Framework | With caution       |
| `.github/prompts/*`              | Framework | Yes (customizable) |
| `.github/instructions/*`         | Framework | Yes (customizable) |
| `.github/toolsets/*`             | Framework | Yes (customizable) |
| `.vscode/*`                      | Framework | Yes                |
| `src/*`                          | User      | Yes                |
| `TODO.md`                        | Shared    | Yes                |
| `CHANGELOG.md`                   | Shared    | Yes                |

---

## What Not to Touch

Some files are managed by Loaded Vibes and should not be edited manually:

1. **`.loaded-vibes/logs/*`** — Will be overwritten
2. **`.loaded-vibes/state/*`** — Orchestrator state
3. **`.loaded-vibes/assets.json`** — Checksum tracking

Editing these files may cause:

- Upgrade conflicts
- Lost execution history
- Orchestrator confusion

---

## Customization Points

Files you **should** customize:

1. **`.github/prompts/*`** — Adjust DevCycle behavior
2. **`.github/instructions/*`** — Add domain rules
3. **`.vscode/settings.json`** — Editor preferences
4. **`TODO.md`** — Add your own tasks
5. **`package.json`** — Your dependencies

→ **[Customization Guide](../guides/customization.md)**

---

Now that you understand the structure, let's dive into **[DevCycles](../concepts/devcycles.md)** — the heart of Loaded Vibes.
