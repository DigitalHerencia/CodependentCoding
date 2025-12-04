# create-loaded-vibes

> CLI installer for the Loaded Vibes framework - provisions `.loaded-vibes/` with DevCycle automation assets

[![npm version](https://badge.fury.io/js/create-loaded-vibes.svg)](https://www.npmjs.com/package/create-loaded-vibes)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
# Create a new project
npx create-loaded-vibes my-app

# Attach to an existing repository
npx create-loaded-vibes --attach ./
```

## Features

- 🔍 **Preflight Checks**: Validates Node.js >= 20, git, pnpm, VS Code before installation
- 🔐 **SHA256 Verification**: Validates downloaded assets to ensure integrity
- 📦 **Asset Mirroring**: Copies `dist/**` into `.loaded-vibes/`
- 🔄 **Attach Strategies**: Mirror, Merge, or Sandbox modes for existing repositories
- 📝 **Install Logging**: Records all decisions to `.loaded-vibes/logs/install-YYYYMMDD.md`
- ✅ **Idempotent**: Re-running doesn't corrupt existing files

## Usage

### Create a New Project

```bash
npx create-loaded-vibes my-app
```

This will:
1. Run preflight checks (Node >= 20, git, pnpm, VS Code)
2. Create the project directory
3. Copy framework assets to `.loaded-vibes/`
4. Run `loaded-vibes init` for profile setup
5. Display next steps

### Attach to Existing Repository

```bash
npx create-loaded-vibes --attach ./
```

When attaching to an existing repository, you'll be prompted to choose a strategy:

| Strategy | Description |
|----------|-------------|
| **Merge** (default) | Merges shipped assets, prompts for conflicts |
| **Mirror** | Replaces all `.loaded-vibes/` assets with shipped versions |
| **Sandbox** | Extracts to `.loaded-vibes/sandbox/` for review |

### Command Line Options

```
Usage: npx create-loaded-vibes [project-dir] [options]

Arguments:
  project-dir       Directory to create/attach (default: current directory)

Options:
  --attach [path]   Attach to existing repository (retrofit mode)
  --strategy <s>    Attach strategy: mirror, merge (default), or sandbox
  --stack <name>    Project stack (default: next)
  -y, --yes         Auto-approve all prompts
  -v, --verbose     Verbose output
  --skip-preflight  Skip environment prerequisite checks
  -h, --help        Show this help message
```

## What Gets Installed

The installer provisions the following structure:

```
.loaded-vibes/
├── .github/          # Agents, instructions, prompts, toolsets
├── .vscode/          # VS Code settings and extensions
├── .genaiscript/     # GenAIScript configurations
├── cli/              # CLI tools
├── docs/             # Framework documentation
├── genaiscript/      # Orchestrator and phase scripts
├── scripts/          # Bootstrapper scripts
├── logs/             # Installation and activity logs
├── manifest.json     # Framework version tracking
└── assets.json       # Asset checksum tracking
```

## After Installation

```bash
cd my-app

# Verify installation
loaded-vibes doctor

# Open retro dashboard
loaded-vibes dashboard

# View available DevCycles
loaded-vibes devcycle --list
```

## Requirements Traceability

This installer implements:

- **PRD §5.1**: Distribution & Installation requirements
- **TECH §5.1**: Distribution Model and preflight checks
- **SPEC-CLI §3**: Distribution & Bootstrap Coupling
- **ADR-001**: Customization Versioning Strategy (Mirror/Merge/Sandbox)

## Security

- All downloaded assets undergo SHA256 verification
- Unsigned payloads are blocked with actionable guidance
- File writes are confined to `.loaded-vibes/**` by default
- Install decisions are logged for auditability

## License

MIT © Digital Herencia

## Links

- [Documentation](https://github.com/DigitalHerencia/LoadedVibes)
- [Issues](https://github.com/DigitalHerencia/LoadedVibes/issues)
- [Changelog](https://github.com/DigitalHerencia/LoadedVibes/blob/main/CHANGELOG.md)
