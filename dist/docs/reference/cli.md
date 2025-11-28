# CLI Reference

> Complete command reference for the Loaded Vibes CLI. Your terminal, but make it synthwave.

---

## Overview

The Loaded Vibes CLI is your primary interface for managing DevCycles, viewing logs, and maintaining project health. It's designed to be powerful yet intuitive, with a retro aesthetic that makes debugging feel less like work.

```bash
# Global help
npx loaded-vibes --help

# Command-specific help
npx loaded-vibes <command> --help
```

---

## Installation

The CLI is included when you create a Loaded Vibes project:

```bash
# Via create command
npx create-loaded-vibes@latest my-app

# Or add to existing project
npx create-loaded-vibes@latest --attach .
```

After installation, you can use either:

```bash
# Via npx (recommended)
npx loaded-vibes <command>

# Via npm scripts
npm run vibes <command>
pnpm vibes <command>
```

---

## Commands

### `create`

Create a new Loaded Vibes project.

```bash
npx create-loaded-vibes@latest [project-name] [options]
```

**Arguments:**

| Argument       | Description                              |
| -------------- | ---------------------------------------- |
| `project-name` | Name of the project directory (optional) |

**Options:**

| Option            | Description                                           | Default     |
| ----------------- | ----------------------------------------------------- | ----------- |
| `--stack <type>`  | Project template (`next`, `react`, `node`, `library`) | Interactive |
| `--attach <path>` | Attach to existing project                            | —           |
| `--skip-install`  | Skip dependency installation                          | `false`     |
| `--skip-git`      | Skip git initialization                               | `false`     |
| `--force`         | Overwrite existing files                              | `false`     |

**Examples:**

```bash
# Interactive mode
npx create-loaded-vibes@latest

# Named project with stack
npx create-loaded-vibes@latest my-app --stack next

# Attach to existing
npx create-loaded-vibes@latest --attach ./existing-project

# Non-interactive CI mode
npx create-loaded-vibes@latest my-app --stack next --skip-install
```

---

### `init`

Initialize or reinitialize a Loaded Vibes project.

```bash
npx loaded-vibes init [options]
```

**Options:**

| Option              | Description                 | Default |
| ------------------- | --------------------------- | ------- |
| `--force`           | Force reinitialization      | `false` |
| `--skip-extensions` | Skip VS Code extension sync | `false` |
| `--skip-mcp`        | Skip MCP configuration      | `false` |

**Examples:**

```bash
# Standard init
npx loaded-vibes init

# Force reinit (useful after manual changes)
npx loaded-vibes init --force

# Quick init (skip heavy operations)
npx loaded-vibes init --skip-extensions --skip-mcp
```

---

### `dashboard`

Launch the interactive synthwave dashboard.

```bash
npx loaded-vibes dashboard [options]
```

**Options:**

| Option                | Description                                      | Default |
| --------------------- | ------------------------------------------------ | ------- |
| `--no-color`          | Disable colors                                   | `false` |
| `--minimal`           | Minimal UI (fewer panes)                         | `false` |
| `--log-level <level>` | Log verbosity (`debug`, `info`, `warn`, `error`) | `info`  |

**Dashboard Keybindings:**

| Key      | Action               |
| -------- | -------------------- |
| `Ctrl+P` | Command palette      |
| `d`      | Focus DevCycle queue |
| `l`      | Focus log pane       |
| `t`      | Focus TODO feed      |
| `m`      | Focus metrics        |
| `↑/↓`    | Navigate lists       |
| `Enter`  | Select/Execute       |
| `q`      | Quit                 |
| `?`      | Show help            |

**Examples:**

```bash
# Launch dashboard
npx loaded-vibes dashboard

# Minimal mode for slow terminals
npx loaded-vibes dashboard --minimal

# Debug mode
npx loaded-vibes dashboard --log-level debug
```

---

### `devcycle`

Run one or more DevCycles.

```bash
npx loaded-vibes devcycle <name> [options]
# Alias: npx loaded-vibes dc <name>
```

**Arguments:**

| Argument | Description                                  |
| -------- | -------------------------------------------- |
| `name`   | DevCycle name(s), comma-separated for chains |

**Available DevCycles:**

| Name       | Description                |
| ---------- | -------------------------- |
| `init`     | Bootstrap environment      |
| `scaffold` | Generate project structure |
| `config`   | Configure tooling          |
| `verify`   | Run validations            |
| `data`     | Design database schema     |
| `auth`     | Set up authentication      |
| `test`     | Configure testing          |
| `validate` | Confirm PRD compliance     |
| `features` | Implement features         |
| `debug`    | Resolve errors             |
| `security` | Security hardening         |
| `perf`     | Performance optimization   |
| `observe`  | Instrument observability   |
| `review`   | Code review automation     |
| `docs`     | Generate documentation     |
| `cicd`     | Configure pipelines        |
| `deploy`   | Execute deployment         |
| `updates`  | Post-launch fixes          |

**Options:**

| Option               | Description                                    | Default   |
| -------------------- | ---------------------------------------------- | --------- |
| `--mode <mode>`      | Execution mode (`plan`, `execute`, `validate`) | `execute` |
| `--chain`            | Continue to next DevCycle on success           | `false`   |
| `--resume`           | Resume a failed chain                          | `false`   |
| `--skip-checkpoints` | Skip approval prompts (CI mode)                | `false`   |
| `--dry-run`          | Preview without execution                      | `false`   |

**Examples:**

```bash
# Run single DevCycle
npx loaded-vibes devcycle init

# Run multiple in sequence
npx loaded-vibes devcycle init,scaffold,config

# Plan only (no execution)
npx loaded-vibes devcycle features --mode plan

# Dry run
npx loaded-vibes devcycle deploy --dry-run

# CI mode (no prompts)
npx loaded-vibes devcycle verify --skip-checkpoints

# Using alias
npx loaded-vibes dc features
```

---

### `logs`

View and filter execution logs.

```bash
npx loaded-vibes logs [options]
```

**Options:**

| Option               | Description                                           | Default |
| -------------------- | ----------------------------------------------------- | ------- |
| `--follow`, `-f`     | Follow logs in real-time                              | `false` |
| `--devcycle <name>`  | Filter by DevCycle                                    | All     |
| `--severity <level>` | Filter by severity (`debug`, `info`, `warn`, `error`) | All     |
| `--since <time>`     | Show logs since time (`1h`, `30m`, `2024-11-28`)      | All     |
| `--last <n>`         | Show last N runs                                      | All     |
| `--summary`          | Show run summary only                                 | `false` |
| `--format <type>`    | Output format (`text`, `json`, `markdown`)            | `text`  |
| `--out <path>`       | Write output to file                                  | stdout  |

**Examples:**

```bash
# Follow logs in real-time
npx loaded-vibes logs --follow

# Filter by DevCycle
npx loaded-vibes logs --devcycle features

# Errors only, last hour
npx loaded-vibes logs --severity error --since 1h

# Summary of recent runs
npx loaded-vibes logs --summary --last 5

# Export to Markdown
npx loaded-vibes logs --devcycle deploy --format markdown --out deploy-log.md

# JSON for processing
npx loaded-vibes logs --format json | jq '.[] | select(.severity == "error")'
```

---

### `doctor`

Diagnose and fix project issues.

```bash
npx loaded-vibes doctor [options]
```

**Options:**

| Option               | Description                    | Default |
| -------------------- | ------------------------------ | ------- |
| `--fix`              | Auto-fix issues where possible | `false` |
| `--check <category>` | Check specific category        | All     |
| `--verbose`, `-v`    | Show detailed output           | `false` |

**Check Categories:**

| Category        | Checks                              |
| --------------- | ----------------------------------- |
| `prerequisites` | Node, pnpm, Git, VS Code            |
| `extensions`    | GenAIScript, recommended extensions |
| `mcp`           | MCP server availability             |
| `permissions`   | File system permissions             |
| `manifest`      | Manifest validity                   |
| `assets`        | Asset checksums and drift           |
| `config`        | Configuration consistency           |

**Examples:**

```bash
# Full diagnostic
npx loaded-vibes doctor

# Auto-fix issues
npx loaded-vibes doctor --fix

# Check specific category
npx loaded-vibes doctor --check prerequisites

# Verbose output
npx loaded-vibes doctor -v
```

**Output Example:**

```
╭─────────────────────────────────────────────────────────────╮
│                   LOADED VIBES DOCTOR                       │
│                     Health Check                            │
╰─────────────────────────────────────────────────────────────╯

Prerequisites
  ✔ Node.js            v20.10.0       HEALTHY
  ✔ pnpm               8.15.0         HEALTHY
  ✔ Git                2.43.0         HEALTHY
  ✔ VS Code            1.86.0         HEALTHY

Extensions
  ✔ GenAIScript        1.72.0         HEALTHY
  ⚠ Prettier           Not installed  FIXABLE

MCP Servers
  ✔ filesystem         Running        HEALTHY
  ✔ git                Running        HEALTHY
  ✖ memory             Not found      ERROR

Manifest
  ✔ Schema             Valid          HEALTHY
  ✔ DevCycles          18/18          HEALTHY

Summary: 2 issues found (1 fixable)

Run `npx loaded-vibes doctor --fix` to auto-fix issues.
```

---

### `upgrade`

Upgrade the framework version.

```bash
npx loaded-vibes upgrade [options]
```

**Options:**

| Option              | Description                                        | Default     |
| ------------------- | -------------------------------------------------- | ----------- |
| `--check`           | Check for updates without applying                 | `false`     |
| `--strategy <type>` | Resolution strategy (`mirror`, `merge`, `sandbox`) | Interactive |
| `--version <ver>`   | Upgrade to specific version                        | Latest      |
| `--analyze`         | Generate upgrade hints                             | `false`     |

**Strategies:**

| Strategy  | Description                                         |
| --------- | --------------------------------------------------- |
| `mirror`  | Exact parity with upstream; backs up modifications  |
| `merge`   | Auto-merge non-conflicts; interactive for conflicts |
| `sandbox` | Extract to sandbox; selectively apply changes       |

**Examples:**

```bash
# Check for updates
npx loaded-vibes upgrade --check

# Interactive upgrade
npx loaded-vibes upgrade

# Force mirror strategy
npx loaded-vibes upgrade --strategy mirror

# Upgrade to specific version
npx loaded-vibes upgrade --version 1.2.0

# Analyze before upgrading
npx loaded-vibes upgrade --analyze
```

---

### `restore`

Restore from backup.

```bash
npx loaded-vibes restore [options]
```

**Options:**

| Option             | Description                  | Default |
| ------------------ | ---------------------------- | ------- |
| `--list`           | List available backups       | —       |
| `--from <version>` | Restore from specific backup | —       |
| `--asset <path>`   | Restore single asset only    | —       |

**Examples:**

```bash
# List available backups
npx loaded-vibes restore --list

# Restore entire backup
npx loaded-vibes restore --from v1.0.0-20241128T123456

# Restore single file
npx loaded-vibes restore --from v1.0.0-20241128T123456 --asset .github/prompts/init.prompt.md
```

---

### `config`

Manage configuration settings.

```bash
npx loaded-vibes config <action> [key] [value]
```

**Actions:**

| Action              | Description                      |
| ------------------- | -------------------------------- |
| `get [key]`         | Get config value (all if no key) |
| `set <key> <value>` | Set config value                 |
| `reset [key]`       | Reset to default (all if no key) |
| `path`              | Show config file location        |

**Config Keys:**

| Key           | Type    | Default     | Description        |
| ------------- | ------- | ----------- | ------------------ |
| `telemetry`   | boolean | `true`      | Enable telemetry   |
| `theme`       | string  | `synthwave` | CLI theme          |
| `logLevel`    | string  | `info`      | Default log level  |
| `autoFix`     | boolean | `false`     | Auto-fix in doctor |
| `checkpoints` | boolean | `true`      | Enable checkpoints |

**Examples:**

```bash
# View all config
npx loaded-vibes config get

# Get specific value
npx loaded-vibes config get theme

# Set value
npx loaded-vibes config set theme synthwave

# Reset all
npx loaded-vibes config reset
```

---

### `telemetry`

Manage telemetry and execution summaries.

```bash
npx loaded-vibes telemetry <action> [options]
```

**Actions:**

| Action          | Description            |
| --------------- | ---------------------- |
| `export`        | Export telemetry data  |
| `release-notes` | Generate release notes |
| `status`        | Show telemetry status  |

**Options:**

| Option            | Description                        | Default |
| ----------------- | ---------------------------------- | ------- |
| `--format <type>` | Output format (`json`, `markdown`) | `json`  |
| `--devcycle <id>` | Filter by DevCycle                 | All     |
| `--since <date>`  | Filter by date (ISO8601)           | All     |
| `--out <path>`    | Output file path                   | stdout  |

**Examples:**

```bash
# Export as JSON
npx loaded-vibes telemetry export --format json --out telemetry.json

# Generate release notes
npx loaded-vibes telemetry release-notes --format markdown --out RELEASE.md

# Check telemetry status
npx loaded-vibes telemetry status
```

---

### `tools`

Manage toolsets and MCP servers.

```bash
npx loaded-vibes tools <action> [options]
```

**Actions:**

| Action           | Description                      |
| ---------------- | -------------------------------- |
| `list`           | List available tools/MCP servers |
| `check`          | Verify tool availability         |
| `enable <tool>`  | Enable a tool                    |
| `disable <tool>` | Disable a tool                   |

**Examples:**

```bash
# List all tools
npx loaded-vibes tools list

# Check tool availability
npx loaded-vibes tools check

# Enable a tool
npx loaded-vibes tools enable postgres
```

---

### `docs`

Open documentation.

```bash
npx loaded-vibes docs [topic]
```

**Topics:**

| Topic       | Description         |
| ----------- | ------------------- |
| (none)      | Open main docs      |
| `devcycles` | DevCycles reference |
| `cli`       | CLI reference       |
| `config`    | Configuration guide |
| `api`       | API documentation   |

**Examples:**

```bash
# Open main docs
npx loaded-vibes docs

# Open specific topic
npx loaded-vibes docs devcycles
```

---

### `hint`

Get contextual help for a topic.

```bash
npx loaded-vibes hint <topic>
```

**Examples:**

```bash
# Get hints for features DevCycle
npx loaded-vibes hint features

# Get hints for troubleshooting
npx loaded-vibes hint troubleshooting
```

---

## Global Options

These options work with any command:

| Option            | Description                   |
| ----------------- | ----------------------------- |
| `--help`, `-h`    | Show help                     |
| `--version`, `-V` | Show version                  |
| `--no-color`      | Disable colored output        |
| `--quiet`, `-q`   | Suppress non-essential output |
| `--verbose`, `-v` | Enable verbose output         |
| `--debug`         | Enable debug mode             |

---

## Environment Variables

| Variable                 | Description         | Default         |
| ------------------------ | ------------------- | --------------- |
| `LOADED_VIBES_HOME`      | Framework directory | `.loaded-vibes` |
| `LOADED_VIBES_LOG_LEVEL` | Log verbosity       | `info`          |
| `LOADED_VIBES_NO_COLOR`  | Disable colors      | `false`         |
| `LOADED_VIBES_TELEMETRY` | Enable telemetry    | `true`          |
| `LOADED_VIBES_THEME`     | CLI theme           | `synthwave`     |

---

## Exit Codes

| Code | Meaning               |
| ---- | --------------------- |
| `0`  | Success               |
| `1`  | General error         |
| `2`  | Invalid arguments     |
| `3`  | Missing prerequisites |
| `4`  | DevCycle failure      |
| `5`  | Permission denied     |
| `6`  | Network error         |
| `7`  | Validation failure    |

---

## Shell Completion

Enable shell completion for faster CLI usage:

```bash
# Bash
npx loaded-vibes completion bash >> ~/.bashrc

# Zsh
npx loaded-vibes completion zsh >> ~/.zshrc

# Fish
npx loaded-vibes completion fish > ~/.config/fish/completions/loaded-vibes.fish

# PowerShell
npx loaded-vibes completion powershell >> $PROFILE
```

---

## Aliases

Add these to your shell profile for quicker access:

```bash
# Bash/Zsh
alias lv="npx loaded-vibes"
alias lvd="npx loaded-vibes dashboard"
alias lvdc="npx loaded-vibes devcycle"
alias lvdoc="npx loaded-vibes doctor"

# PowerShell
Set-Alias lv "npx loaded-vibes"
function lvd { npx loaded-vibes dashboard @args }
function lvdc { npx loaded-vibes devcycle @args }
function lvdoc { npx loaded-vibes doctor @args }
```

---

## Next Steps

- **[Configuration Reference](./configuration.md)** — All config options
- **[DevCycles](../concepts/devcycles.md)** — Understanding phases
- **[Troubleshooting](../guides/troubleshooting.md)** — Common issues

---

> "A good CLI is like a good friend: always there, never judges, and helps you fix your mistakes at 3 AM."
