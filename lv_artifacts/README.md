<div align="center">

<img src="https://raw.githubusercontent.com/DigitalHerencia/LoadedVibes/main/public/banner.png" alt="Loaded Vibes" width="100%" style="border-radius:12px;margin:1rem 0;">

<h1>Loaded Vibes</h1>
<h3>Enterprise-Grade Agentic TypeScript Web Development Framework</h3>
<h4>Bad Vibes – Clean Code – Solid Infra – Sharded Loads</h4>

---

<div>

  <img alt="Next.js 15" src="https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white&style=for-the-badge" />
  <img alt="React 19" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=061E26&style=for-the-badge" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white&style=for-the-badge" />
  <img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white&style=for-the-badge" />
  <img alt="shadcn/ui" src="https://img.shields.io/badge/shadcn%2Fui-Components-111827?style=for-the-badge" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white&style=for-the-badge" />
  <img alt="Clerk" src="https://img.shields.io/badge/Clerk-Auth-0B5FFF?style=for-the-badge" />
  <img alt="GenAIScript" src="https://img.shields.io/badge/GenAIScript-Engine-0EA5E9?style=for-the-badge" />
  <img alt="Copilot" src="https://img.shields.io/badge/GitHub_Copilot-Agent_Mode-000000?logo=github&logoColor=white&style=for-the-badge" />
  <img alt="MCP" src="https://img.shields.io/badge/MCP-Servers-111827?style=for-the-badge" />

</div>

</div>

---

## 🌎 About Loaded Vibes

Loaded Vibes is an **agentic development framework** that supercharges your TypeScript web development workflow. It combines GitHub Copilot Agent Mode, GenAIScript orchestration, and MCP servers to deliver AI-powered automation across your entire development lifecycle.

- 🤖 **Agentic Workflow:** 18 DevCycles automate everything from scaffolding to deployment
- 🎯 **Spec-Driven:** Requirements-first development with full traceability
- 🔒 **Enterprise Security:** Bad Vibes Firewall, ABAC/RBAC, secret redaction
- 📊 **Full Observability:** NDJSON telemetry, dashboard UI, requirement-linked logging
- ⚡ **Modern Stack:** Next.js 15, React 19, Tailwind CSS 4, Prisma, Clerk

---

## 🚀 Quickstart

### Fresh Install

```bash
# Create a new project
npx create-loaded-vibes my-app

# Navigate to your project
cd my-app

# Verify your environment
loaded-vibes doctor

# Open the dashboard
loaded-vibes dashboard
```

### Attach to Existing Repository

```bash
# From your project root
npx create-loaded-vibes --attach ./

# Choose your merge strategy (Mirror, Merge, or Sandbox)
# Review the diff hints before accepting

# Reconcile configurations
loaded-vibes doctor --auto-remediate
```

### What Gets Installed

```
.loaded-vibes/
├── .github/          # Copilot agents, prompts, instructions, toolsets
├── .vscode/          # VS Code settings & MCP configuration
├── genaiscript/      # DevCycle orchestrator & manifest
├── cli/              # CLI commands
├── docs/             # Framework documentation
├── logs/             # NDJSON telemetry traces
└── summaries/        # Execution summaries (JSON + Markdown)
```

---

## 🛠️ Tech Stack

| Category       | Technologies                                                   |
| -------------- | -------------------------------------------------------------- |
| **Frontend**   | Next.js 15 (App Router, RSC), React 19, Tailwind CSS 4, shadcn/ui, Radix |
| **Backend**    | Node.js, React Server Actions, Vercel Edge Functions           |
| **Data**       | PostgreSQL (Neon), Prisma ORM, Redis, Nivo & Recharts          |
| **Auth**       | Clerk, JWT, ABAC/RBAC, rate-limiting with Upstash              |
| **AI**         | GitHub Copilot Agent Mode, GenAIScript, MCP servers            |
| **Testing**    | Vitest, Playwright, Testing Library                            |
| **CI/CD**      | GitHub Actions, Vercel, automated workflows                    |

---

## 🧭 DevCycle System

Loaded Vibes orchestrates your development through **18 canonical DevCycles**:

```
┌─────────────────────────────────────────────────────────────────┐
│  🔄 Initialization    │  🏗️ Scaffolding     │  ⚙️ Configuration  │
├─────────────────────────────────────────────────────────────────┤
│  ✨ Features          │  🧪 Testing          │  ✅ Validation     │
├─────────────────────────────────────────────────────────────────┤
│  🐛 Debug             │  🔒 Security         │  ⚡ Performance    │
├─────────────────────────────────────────────────────────────────┤
│  📚 Documentation     │  📊 Observability    │  💾 Data           │
├─────────────────────────────────────────────────────────────────┤
│  👀 Code Review       │  🚀 Deploy           │  🔧 CI/CD          │
├─────────────────────────────────────────────────────────────────┤
│  📦 Updates           │  🔍 Verification     │                    │
└─────────────────────────────────────────────────────────────────┘
```

### Running DevCycles

```bash
# List available DevCycles
loaded-vibes devcycle --list

# Run a specific DevCycle
loaded-vibes devcycle features --task "implement-auth"

# Dry run (preview without changes)
loaded-vibes devcycle security --dry-run

# Auto-approve checkpoints
loaded-vibes devcycle testing --auto-approve
```

Each DevCycle follows the **Analyze → Design → Implement → Validate → Reflect → Handoff** workflow with full requirement traceability.

---

## 📊 Dashboard

Launch the synthwave-styled terminal dashboard for real-time monitoring:

```bash
loaded-vibes dashboard
```

### Features

- 📋 **DevCycle Queue:** Status of all 18 phases (○ pending, ▶ running, ✓ done, ✗ failed)
- 📝 **Live Logs:** Stream NDJSON entries with severity icons
- 💻 **System Metrics:** CPU/memory usage (updated every 2s)
- 📄 **TODO/CHANGELOG Feed:** Real-time governance artifact updates
- ⌨️ **Command Palette:** Fuzzy search for quick actions

### Keyboard Controls

| Key            | Action                              |
| -------------- | ----------------------------------- |
| `Ctrl+P`       | Open command palette                |
| `r`            | Refresh dashboard                   |
| `l`            | Toggle live log streaming           |
| `h` / `?`      | Show help                           |
| `q` / `Ctrl+C` | Quit                                |

---

## 🔧 CLI Reference

### `loaded-vibes init`

Initialize a new or existing project with Loaded Vibes configuration.

### `loaded-vibes doctor`

Verify environment prerequisites and fix common issues.

```bash
loaded-vibes doctor                    # Check environment
loaded-vibes doctor --auto-remediate   # Auto-fix issues
```

### `loaded-vibes devcycle <name>`

Execute a DevCycle with checkpoint approvals.

```bash
loaded-vibes devcycle <name> [options]

Options:
  --mode <mode>       Execution mode (plan-first, execute-first)
  --task <id>         Link to issue/ticket
  --dry-run           Preview without changes
  --skip-bootstrap    Skip prerequisite checks
  --auto-approve      Auto-approve checkpoints
  --verbose           Detailed output
  --list              List available DevCycles
```

### `loaded-vibes logs`

Inspect NDJSON telemetry traces.

```bash
loaded-vibes logs                                    # Show latest
loaded-vibes logs --devcycle features               # Filter by DevCycle
loaded-vibes logs --since 2025-01-01 --severity warn,error
loaded-vibes logs --follow                          # Stream live
loaded-vibes logs --export ./export.md              # Export to Markdown
```

### `loaded-vibes telemetry export`

Export sanitized telemetry for audits and PRs.

```bash
loaded-vibes telemetry export --format json
loaded-vibes telemetry export --format markdown --devcycle security
```

---

## 🔒 Security

### Bad Vibes Firewall

Destructive operations (file deletion, upgrades, migrations) are blocked until you approve with a logged signature:

```
⚠️  BAD VIBES DETECTED
    Action: Delete 47 files in src/legacy/
    Reason: Migration to new architecture

    [A]pprove  [R]eject  [V]iew details
```

### Built-in Protections

- 🔐 **SHA256 Verification:** All releases are cryptographically signed
- 🕵️ **Secret Redaction:** Telemetry exports sanitize sensitive data
- 🛡️ **ABAC/RBAC:** Attribute and role-based access control
- 📋 **Audit Logging:** Full traceability with requirement IDs

---

## 📝 TODO & CHANGELOG Workflow

Loaded Vibes automatically maintains governance artifacts:

### TODO.md

Tracks upcoming and in-progress items with requirement citations.

### CHANGELOG.md

Records actions in compressed format:

```
[Type][ISO8601] Goal → Action → Result → Next (Requirement IDs)
```

Example:

```
[Features][2025-11-28T10:30Z] Goal: Implement OAuth flow (PRD §3.2) → 
Action: Added Clerk integration with RBAC middleware → 
Result: Users can authenticate via GitHub/Google → 
Next: Add rate limiting (TECH §4.1)
```

---

## 🩺 Troubleshooting

| Issue                     | Command                                          |
| ------------------------- | ------------------------------------------------ |
| Environment drift         | `loaded-vibes doctor --auto-remediate`           |
| DevCycle failure          | `loaded-vibes logs --devcycle <id> --follow`     |
| Manifest mismatch         | `loaded-vibes devcycle <name> --dry-run`         |
| View system status        | `loaded-vibes dashboard`                         |
| Export evidence for PR    | `loaded-vibes telemetry export --format markdown`|

---

## 📚 Documentation

| Resource              | Description                                |
| --------------------- | ------------------------------------------ |
| [Getting Started](docs/getting-started/) | Installation & first steps     |
| [Concepts](docs/concepts/)               | Architecture & DevCycles       |
| [Guides](docs/guides/)                   | Customization & troubleshooting|
| [Reference](docs/reference/)             | CLI & configuration            |

---

## 🤝 Support

- 📧 **Issues:** [GitHub Issues](https://github.com/DigitalHerencia/LoadedVibes/issues)
- 📖 **Docs:** [loadedvibes.vercel.app/docs](https://loadedvibes.vercel.app/docs)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/DigitalHerencia/LoadedVibes/discussions)

---

<div align="center">

**Built with 💜 by [Digital Herencia](https://github.com/DigitalHerencia)**

*"Bad Vibes, Clean Code, Solid Infra, Sharded Loads."*

</div>
