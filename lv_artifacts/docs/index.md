# Loaded Vibes Documentation

<p align="center">
  <img src="../assets/banner.png" alt="Loaded Vibes" width="600" />
</p>

<p align="center">
  <strong>Bad Vibes · Clean Code · Solid Infra · Sharted Loads</strong>
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="./getting-started/installation.md">Installation</a> •
  <a href="./guides/devcycles.md">DevCycles</a> •
  <a href="./reference/cli.md">CLI Reference</a> •
  <a href="./concepts/architecture.md">Architecture</a>
</p>

---

## Welcome to Loaded Vibes 🎸

> A synthwave-flavored dev framework that wires specs, AI, and infra into a single repeatable loop.

Loaded Vibes is a **spec-driven development framework** that transforms your chaotic backlog into deterministic, traceable, and surprisingly delightful development cycles. It's opinionated enough to prevent you from shooting yourself in the foot, but flexible enough to let you customize the color of the bullet casing.

### Why Loaded Vibes?

- **🎯 Spec-Driven Workflows** — PRDs, tech specs, and ADRs feed a single engine that outputs artifacts, not vibes
- **🔄 DevCycles** — 18 canonical development cycles from Init to Deploy, each with its own rules
- **🖥️ Retro Console** — An ink-powered CLI dashboard that feels like a synthwave terminal shrine
- **📊 Dual-Mode Summaries** — JSON for CI, Markdown for humans. One run, two artifacts
- **🛡️ Bad Vibes Firewall** — Your customizations survive upgrades via Mirror/Merge/Sandbox strategies
- **🤖 AI-Native** — Built for GitHub Copilot, GenAIScript, and the MCP protocol

---

## 🚀 Quick Start

Get Loaded Vibes running in 30 seconds or less:

```bash
# Create a new project
npx create-loaded-vibes@latest my-sick-app

# Or attach to an existing repo
npx create-loaded-vibes@latest --attach ./my-existing-app

# Launch the dashboard
cd my-sick-app
npx loaded-vibes dashboard
```

That's it. Your terminal should now look like a neon fever dream. Welcome to the vibes.

→ **[Full Installation Guide](./getting-started/installation.md)**

---

## 📚 Documentation Overview

### Getting Started

| Document                                                        | Description                                                    |
| --------------------------------------------------------------- | -------------------------------------------------------------- |
| **[Installation](./getting-started/installation.md)**           | System requirements, installation methods, and first-run setup |
| **[Quick Start](./getting-started/quickstart.md)**              | 5-minute guide to your first DevCycle                          |
| **[Project Structure](./getting-started/project-structure.md)** | Understanding the `.loaded-vibes/` directory                   |

### Core Concepts

| Document                                                       | Description                                   |
| -------------------------------------------------------------- | --------------------------------------------- |
| **[Architecture](./concepts/architecture.md)**                 | Three-layer architecture and asset boundaries |
| **[DevCycles](./concepts/devcycles.md)**                       | The 18 canonical development phases           |
| **[Spec-Driven Workflow](./concepts/spec-driven-workflow.md)** | EARS notation and the Analyze→Handoff loop    |
| **[Artifact Taxonomy](./concepts/artifacts.md)**               | Understanding prompts, instructions, toolsets |

### Guides

| Document                                               | Description                                   |
| ------------------------------------------------------ | --------------------------------------------- |
| **[Running DevCycles](./guides/running-devcycles.md)** | Executing, pausing, and chaining DevCycles    |
| **[Customization](./guides/customization.md)**         | Tailoring prompts, instructions, and toolsets |
| **[Upgrade Strategy](./guides/upgrade-strategy.md)**   | Mirror/Merge/Sandbox explained                |
| **[Troubleshooting](./guides/troubleshooting.md)**     | Common issues and the `doctor` command        |

### Reference

| Document                                          | Description                                |
| ------------------------------------------------- | ------------------------------------------ |
| **[CLI Commands](./reference/cli.md)**            | Complete command reference with examples   |
| **[Configuration](./reference/configuration.md)** | All config files and environment variables |
| **[Manifest Schema](./reference/manifest.md)**    | `devcycles.config.json` specification      |
| **[Toolsets](./reference/toolsets.md)**           | MCP servers and allowed operations         |

### API & Integration

| Document                                         | Description                               |
| ------------------------------------------------ | ----------------------------------------- |
| **[GitHub Copilot](./integrations/copilot.md)**  | Agent setup and custom instructions       |
| **[GenAIScript](./integrations/genaiscript.md)** | Orchestrator and phase runner integration |
| **[VS Code](./integrations/vscode.md)**          | Extension, MCP config, and keybindings    |
| **[CI/CD](./integrations/cicd.md)**              | GitHub Actions and pipeline integration   |

---

## 📖 Reading Order

If you're new to Loaded Vibes, we recommend this path:

1. **[Installation](./getting-started/installation.md)** — Get the CLI installed
2. **[Quick Start](./getting-started/quickstart.md)** — Run your first DevCycle
3. **[DevCycles](./concepts/devcycles.md)** — Understand the 18 phases
4. **[Architecture](./concepts/architecture.md)** — Grasp the three-layer model
5. **[CLI Reference](./reference/cli.md)** — Master the commands

---

## 🔗 Quick Links

- **GitHub:** [github.com/DigitalHerencia/LoadedVibes](https://github.com/DigitalHerencia/LoadedVibes)
- **Issues:** [Report a bug or request a feature](https://github.com/DigitalHerencia/LoadedVibes/issues)
- **Changelog:** [See what's new](./changelog.md)
- **Contributing:** [How to contribute](./contributing.md)

---

## 📄 License

Loaded Vibes is MIT licensed. See [LICENSE](../LICENSE) for details.

---

<p align="center">
  <sub>Built with 🎸 and questionable life choices by the Loaded Vibes team</sub>
</p>
