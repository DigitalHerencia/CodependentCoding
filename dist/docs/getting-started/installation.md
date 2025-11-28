# Installation

> Get Loaded Vibes running on your machine in minutes.

---

## Prerequisites

Before installing Loaded Vibes, ensure your system meets the following requirements:

| Requirement               | Version | Notes                           |
| ------------------------- | ------- | ------------------------------- |
| **Node.js**               | ≥ 20.x  | LTS recommended                 |
| **pnpm**                  | ≥ 8.x   | Or npm/yarn (pnpm preferred)    |
| **Git**                   | ≥ 2.x   | For version control integration |
| **VS Code**               | ≥ 1.85  | For full IDE experience         |
| **GenAIScript Extension** | Latest  | Required for AI orchestration   |

### Verifying Prerequisites

```bash
# Check Node.js version
node --version  # Should output v20.x.x or higher

# Check pnpm
pnpm --version  # Should output 8.x.x or higher

# Check Git
git --version   # Should output 2.x.x or higher
```

> 💡 **Pro tip:** If any checks fail, `loaded-vibes doctor` will guide you through remediation.

---

## Installation Methods

### Method 1: Create a New Project (Recommended)

The fastest way to start is with `create-loaded-vibes`:

```bash
# Interactive mode — you'll be prompted for options
npx create-loaded-vibes@latest

# Non-interactive with project name
npx create-loaded-vibes@latest my-app

# With stack preset
npx create-loaded-vibes@latest my-app --stack next
```

#### What Happens During Installation

1. **Discovery** — Checks for latest stable release
2. **Preflight** — Validates prerequisites (Node, Git, pnpm, VS Code, GenAIScript)
3. **Download** — Fetches signed release tarball
4. **Extract** — Unpacks to `.loaded-vibes/` directory
5. **Init** — Runs `loaded-vibes init` for profile setup
6. **Complete** — ASCII success banner with next steps

### Method 2: Attach to Existing Project

Already have a project? No problem:

```bash
# Navigate to your project
cd my-existing-project

# Attach Loaded Vibes
npx create-loaded-vibes@latest --attach .

# Or with explicit path
npx create-loaded-vibes@latest --attach ./my-project
```

#### Conflict Resolution

When attaching to an existing project, Loaded Vibes checks for conflicts in:

- `.github/` — Copilot instructions, workflows
- `.vscode/` — IDE settings, extensions
- `src/` — Source code (if any)

You'll be prompted to choose a resolution strategy:

| Strategy    | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| **Mirror**  | Exact parity with upstream; backs up your files                |
| **Merge**   | Auto-merges non-conflicting changes; interactive for conflicts |
| **Sandbox** | Extracts to sandbox; you selectively apply changes             |

### Method 3: Binary Installation (Air-Gapped)

For environments without internet access:

```bash
# Download the binary for your platform
# (Linux/macOS/Windows binaries available on GitHub Releases)

# Install globally
./loaded-vibes-linux-x64 install

# Or add to PATH manually
mv loaded-vibes-linux-x64 /usr/local/bin/loaded-vibes
```

---

## Post-Installation Setup

### 1. Initialize the Project

```bash
# Run init to set up your profile
npx loaded-vibes init
```

This command:

- Creates/updates `.loaded-vibes/manifest.json`
- Syncs VS Code settings to `.vscode/`
- Installs recommended extensions
- Validates GenAIScript configuration

### 2. Verify Installation

```bash
# Run the doctor to verify everything is working
npx loaded-vibes doctor
```

Expected output:

```
╭─────────────────────────────────────────────────────╮
│                  LOADED VIBES DOCTOR                │
│                    Health Check                     │
╰─────────────────────────────────────────────────────╯

✔ Node.js          v20.10.0        HEALTHY
✔ pnpm             8.15.0          HEALTHY
✔ Git              2.43.0          HEALTHY
✔ VS Code          1.86.0          HEALTHY
✔ GenAIScript      1.72.0          HEALTHY
✔ Manifest         Valid           HEALTHY
✔ Assets           Synchronized    HEALTHY
✔ Permissions      Writable        HEALTHY

All systems operational. Ready to vibe.
```

### 3. Launch the Dashboard

```bash
# Fire up the synthwave console
npx loaded-vibes dashboard
```

You should see the retro dashboard with:

- DevCycle queue panel
- Real-time log stream
- System metrics
- TODO/CHANGELOG feed

---

## Upgrading

### Check for Updates

```bash
# See available updates
npx loaded-vibes upgrade --check
```

### Perform Upgrade

```bash
# Interactive upgrade with strategy selection
npx loaded-vibes upgrade

# Force a specific strategy
npx loaded-vibes upgrade --strategy mirror
npx loaded-vibes upgrade --strategy merge
npx loaded-vibes upgrade --strategy sandbox
```

### Rollback

If something goes wrong:

```bash
# See available backups
npx loaded-vibes restore --list

# Restore from a specific backup
npx loaded-vibes restore --from v1.0.0-20241127

# Restore a single asset
npx loaded-vibes restore --from v1.0.0-20241127 --asset .github/prompts/init.prompt.md
```

---

## Uninstalling

To remove Loaded Vibes from a project:

```bash
# Remove all Loaded Vibes files
npx loaded-vibes uninstall

# Or manually delete
rm -rf .loaded-vibes/
# Plus any .github/ or .vscode/ files added by Loaded Vibes
```

---

## Troubleshooting Installation

### Common Issues

#### `EACCES: permission denied`

```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

#### `GenAIScript extension not found`

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "GenAIScript"
4. Install the official extension
5. Reload VS Code

#### `Preflight check failed: Node version`

```bash
# Use nvm to manage Node versions
nvm install 20
nvm use 20
```

#### `SHA256 verification failed`

This means the download was corrupted or tampered with:

```bash
# Clear npm cache and retry
npm cache clean --force
npx create-loaded-vibes@latest --force
```

→ **[More troubleshooting](./troubleshooting.md)**

---

## What's Next?

Now that you're installed, head to the **[Quick Start](./quickstart.md)** to run your first DevCycle.
