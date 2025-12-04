# Quick Start

> From zero to shipped feature in 5 minutes. Let's go.

---

## TL;DR for the Impatient

```bash
# Create project
npx create-loaded-vibes@latest my-app && cd my-app

# Run your first DevCycle
npx loaded-vibes devcycle init

# Watch the magic happen
npx loaded-vibes logs --follow
```

---

## The 5-Minute Walkthrough

### Step 1: Create Your Project

```bash
npx create-loaded-vibes@latest vibes-tutorial
cd vibes-tutorial
```

You'll see:

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ██╗      ██████╗  █████╗ ██████╗ ███████╗██████╗           ║
║   ██║     ██╔═══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗          ║
║   ██║     ██║   ██║███████║██║  ██║█████╗  ██║  ██║          ║
║   ██║     ██║   ██║██╔══██║██║  ██║██╔══╝  ██║  ██║          ║
║   ███████╗╚██████╔╝██║  ██║██████╔╝███████╗██████╔╝          ║
║   ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚══════╝╚═════╝           ║
║                                                              ║
║        ██╗   ██╗██╗██████╗ ███████╗███████╗                  ║
║        ██║   ██║██║██╔══██╗██╔════╝██╔════╝                  ║
║        ██║   ██║██║██████╔╝█████╗  ███████╗                  ║
║        ╚██╗ ╚██╗██║██╔══██╗██╔══╝  ╚════██║                  ║
║         ╚████╔╝██║██████╔╝███████╗███████║                   ║
║          ╚═══╝ ╚═╝╚═════╝ ╚══════╝╚══════╝                   ║
║                                                              ║
║              Bad Vibes · Clean Code · Solid Infra            ║
╚══════════════════════════════════════════════════════════════╝

✔ Preflight checks passed
✔ Downloaded loaded-vibes@1.0.0 (SHA256 verified)
✔ Extracted to .loaded-vibes/
✔ Initialized project manifest
✔ VS Code profile synchronized

Welcome to the vibes. Your project is ready.
```

### Step 2: Explore Your Project Structure

```bash
# See what Loaded Vibes created
ls -la

# Output:
# .loaded-vibes/      → Framework state and logs
# .github/            → Copilot instructions, prompts, toolsets
# .vscode/            → IDE configuration
# src/                → Your application code (empty for now)
# package.json        → Project manifest
```

Key directories:

| Directory               | Purpose                                    |
| ----------------------- | ------------------------------------------ |
| `.loaded-vibes/`        | Framework runtime (logs, state, manifests) |
| `.loaded-vibes/logs/`   | NDJSON event logs                          |
| `.github/prompts/`      | DevCycle entry points                      |
| `.github/instructions/` | Domain rules per DevCycle                  |
| `.github/toolsets/`     | MCP servers and allowed operations         |

### Step 3: Launch the Dashboard

```bash
npx loaded-vibes dashboard
```

You'll see the synthwave console:

```
┌─────────────────────────────────────────────────────────────────┐
│                        LOADED VIBES                             │
│                    DevCycle Dashboard                           │
├─────────────────────────┬───────────────────────────────────────┤
│    DevCycle Queue       │           Live Logs                   │
├─────────────────────────┤                                       │
│ ● Initialization   IDLE │  [12:34:56] Ready for action          │
│ ○ Scaffolding      IDLE │  [12:34:57] Waiting for DevCycle...   │
│ ○ Configuration    IDLE │                                       │
│ ○ Verification     IDLE │                                       │
│ ○ Features         IDLE │                                       │
├─────────────────────────┼───────────────────────────────────────┤
│       Metrics           │          TODO Feed                    │
├─────────────────────────┤                                       │
│ Memory:    124MB        │  No TODO items yet                    │
│ CPU:       2.3%         │                                       │
│ Uptime:    00:01:23     │                                       │
└─────────────────────────┴───────────────────────────────────────┘
 Ctrl+P: Command Palette  │  q: Quit  │  ↑↓: Navigate
```

### Step 4: Run Your First DevCycle

Let's run the **Initialization** DevCycle:

```bash
npx loaded-vibes devcycle init
```

Or from the dashboard, press `Ctrl+P` and type `init`.

You'll see the orchestrator execute:

```
╭─────────────────────────────────────────────────────────────╮
│ DevCycle: Initialization                                    │
│ Status: RUNNING                                             │
╰─────────────────────────────────────────────────────────────╯

▶ ANALYZE
  ├─ Loading PRD excerpts...
  ├─ Loading Tech Requirements...
  ├─ Scanning workspace structure...
  └─ ✔ Context hydrated (2.3s)

▶ DESIGN
  ├─ Generating initialization plan...
  ├─ Validating manifest entries...
  └─ ✔ Plan approved (1.1s)

▶ IMPLEMENT
  ├─ Checking prerequisites...
  ├─ Synchronizing extensions...
  ├─ Validating MCP configuration...
  └─ ✔ Environment initialized (4.7s)

▶ VALIDATE
  ├─ Running health checks...
  ├─ Verifying file permissions...
  └─ ✔ All checks passed (0.8s)

▶ REFLECT
  ├─ Updating TODO.md...
  ├─ Updating CHANGELOG.md...
  └─ ✔ Documentation updated (0.4s)

╭─────────────────────────────────────────────────────────────╮
│ DevCycle: Initialization                                    │
│ Status: ✔ COMPLETE                                          │
│ Duration: 9.3s                                              │
│ Artifacts: 3 files updated                                  │
╰─────────────────────────────────────────────────────────────╯
```

### Step 5: Check the Results

```bash
# See what changed
cat TODO.md

# Output:
# ## Initialization DevCycle - 2024-11-28
# - [x] Environment validated
# - [x] Extensions synchronized
# - [x] MCP configuration verified
# - [ ] Ready for Scaffolding DevCycle
```

```bash
# View the execution log
npx loaded-vibes logs --devcycle init --last 1
```

---

## What Just Happened?

You ran a **DevCycle** — one of 18 canonical development phases. Each DevCycle:

1. **Loads context** from PRD, Tech Requirements, and your project state
2. **Generates a plan** based on the associated instruction file
3. **Executes the plan** using only tools allowed by the toolset
4. **Validates results** against acceptance criteria
5. **Updates documentation** (TODO.md, CHANGELOG.md)

→ **[Learn more about DevCycles](../concepts/devcycles.md)**

---

## Next Steps

### Run the Scaffolding DevCycle

Now that your environment is initialized, scaffold your project structure:

```bash
npx loaded-vibes devcycle scaffold
```

This will create your base components, layouts, and server actions based on your PRD.

### Chain Multiple DevCycles

Run a sequence of DevCycles:

```bash
# Run init → scaffold → config
npx loaded-vibes devcycle init,scaffold,config

# Or use the chain flag
npx loaded-vibes devcycle scaffold --chain
```

### Explore the Dashboard

The dashboard offers more than pretty colors:

| Key      | Action                         |
| -------- | ------------------------------ |
| `Ctrl+P` | Command palette (fuzzy search) |
| `l`      | Focus log pane                 |
| `d`      | Focus DevCycle queue           |
| `t`      | Focus TODO feed                |
| `q`      | Quit dashboard                 |
| `?`      | Show help                      |

### Run the Doctor

If anything seems off:

```bash
npx loaded-vibes doctor
```

---

## Common First-Day Tasks

### "I want to add a feature"

```bash
# Run the Features DevCycle
npx loaded-vibes devcycle features

# Follow the prompts to describe your feature
```

### "I need to fix a bug"

```bash
# Run the Debug DevCycle
npx loaded-vibes devcycle debug

# The orchestrator will analyze errors and suggest fixes
```

### "I want to see my logs"

```bash
# Follow logs in real-time
npx loaded-vibes logs --follow

# Filter by DevCycle
npx loaded-vibes logs --devcycle features

# Filter by severity
npx loaded-vibes logs --severity error
```

### "Something is broken"

```bash
# Run diagnostics
npx loaded-vibes doctor

# Auto-fix issues
npx loaded-vibes doctor --fix
```

---

## The Learning Path

| Day       | Goal                                   | Commands                          |
| --------- | -------------------------------------- | --------------------------------- |
| **Day 1** | Install, init, explore dashboard       | `create`, `init`, `dashboard`     |
| **Day 2** | Scaffold project, understand structure | `scaffold`, `ls .github/`         |
| **Day 3** | Configure tooling, customize prompts   | `config`, edit `.github/prompts/` |
| **Day 4** | Run features, debug issues             | `features`, `debug`, `logs`       |
| **Day 5** | Deploy, set up CI                      | `deploy`, `cicd`                  |

---

## Getting Help

Stuck? Here's how to get unstuck:

```bash
# In-CLI help
npx loaded-vibes --help
npx loaded-vibes devcycle --help

# Context-aware hints
npx loaded-vibes hint features

# Full documentation
npx loaded-vibes docs
```

Or check the **[Troubleshooting Guide](../guides/troubleshooting.md)**.

---

You're now officially loaded with vibes. Go build something dope. 🎸
