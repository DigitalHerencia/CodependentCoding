# Troubleshooting Guide

> When things go sideways, this is your survival kit.

---

## Quick Fixes

Before diving deep, try these:

```bash
# 1. Run the doctor
npx loaded-vibes doctor --fix

# 2. Check logs
npx loaded-vibes logs --severity error --last 5

# 3. Verify prerequisites
npx loaded-vibes doctor --check prerequisites
```

---

## Common Issues

### Installation Issues

#### `EACCES: permission denied`

**Cause:** npm doesn't have write permissions.

**Fix:**

```bash
# Option 1: Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Option 2: Use npx (recommended)
npx create-loaded-vibes@latest my-app
```

#### `Command not found: loaded-vibes`

**Cause:** CLI not in PATH or not installed.

**Fix:**

```bash
# Use npx instead
npx loaded-vibes <command>

# Or install globally
npm install -g loaded-vibes
```

#### `SHA256 verification failed`

**Cause:** Download was corrupted or tampered with.

**Fix:**

```bash
# Clear cache and retry
npm cache clean --force
npx create-loaded-vibes@latest --force
```

---

### Prerequisites Issues

#### `Node version too old`

**Cause:** Loaded Vibes requires Node.js ≥ 20.

**Fix:**

```bash
# Using nvm
nvm install 20
nvm use 20

# Verify
node --version  # Should be v20.x.x
```

#### `GenAIScript extension not found`

**Cause:** VS Code extension not installed.

**Fix:**

1. Open VS Code
2. Press `Ctrl+Shift+X` (Extensions)
3. Search "GenAIScript"
4. Install the official extension
5. Reload VS Code

Or via CLI:

```bash
code --install-extension genaiscript.genaiscript-vscode
```

#### `pnpm not found`

**Cause:** pnpm not installed.

**Fix:**

```bash
# Install pnpm
npm install -g pnpm

# Or use corepack (Node 16.13+)
corepack enable
corepack prepare pnpm@latest --activate
```

---

### DevCycle Issues

#### `DevCycle failed: Manifest entry not found`

**Cause:** The manifest doesn't have an entry for this DevCycle.

**Fix:**

```bash
# Check manifest
cat .github/devcycles.config.json | jq '.devCycles | keys'

# Verify DevCycle name
npx loaded-vibes devcycle --list
```

#### `DevCycle stuck at checkpoint`

**Cause:** Waiting for approval.

**Fix:**

```bash
# Option 1: Respond to the prompt
# (Press Enter in the terminal)

# Option 2: Skip checkpoints (CI mode)
npx loaded-vibes devcycle features --skip-checkpoints

# Option 3: Cancel and restart
Ctrl+C
npx loaded-vibes devcycle features
```

#### `Context hydration failed`

**Cause:** PRD or Tech Requirements file is invalid or missing.

**Fix:**

```bash
# Check files exist
ls docs/PRD.md docs/TECH_REQUIREMENTS.md

# Verify they're valid Markdown
npx markdownlint docs/PRD.md

# Reinitialize if needed
npx loaded-vibes init --force
```

---

### MCP Server Issues

#### `MCP server not available: filesystem`

**Cause:** MCP server isn't configured or running.

**Fix:**

```bash
# Check MCP config
cat .vscode/mcp.json

# Test server manually
npx -y @anthropic/mcp-filesystem --help

# Reinstall if needed
npm install -g @anthropic/mcp-filesystem
```

#### `MCP server timeout`

**Cause:** Server took too long to respond.

**Fix:**

```bash
# Check if server is running
ps aux | grep mcp

# Kill stuck processes
pkill -f mcp-filesystem

# Restart VS Code
code --disable-extensions
code .
```

#### `DATABASE_URL not set`

**Cause:** PostgreSQL MCP server needs connection string.

**Fix:**

```bash
# Create .env file
echo 'DATABASE_URL=postgresql://user:pass@localhost:5432/db' >> .env

# Or set environment variable
export DATABASE_URL='postgresql://user:pass@localhost:5432/db'
```

---

### Dashboard Issues

#### `Dashboard won't start`

**Cause:** Terminal doesn't support TUI features.

**Fix:**

```bash
# Try minimal mode
npx loaded-vibes dashboard --minimal

# Or disable colors
npx loaded-vibes dashboard --no-color

# Check terminal
echo $TERM  # Should be xterm-256color or similar
```

#### `Dashboard is unresponsive`

**Cause:** CPU throttling or too much log output.

**Fix:**

```bash
# Reduce log verbosity
npx loaded-vibes dashboard --log-level warn

# Clear old logs
rm -rf .loaded-vibes/logs/*

# Restart
npx loaded-vibes dashboard
```

#### `Garbled output in terminal`

**Cause:** Font or encoding issues.

**Fix:**

```bash
# Check encoding
echo $LANG  # Should be en_US.UTF-8 or similar

# Set if needed
export LANG=en_US.UTF-8

# Use a nerd font (recommended)
# Install from: https://www.nerdfonts.com/
```

---

### Upgrade Issues

#### `Conflict detected during upgrade`

**Cause:** You've modified files that upstream also changed.

**Fix:**

```bash
# Use sandbox strategy
npx loaded-vibes upgrade --strategy sandbox

# Review changes
ls .loaded-vibes/upgrade-sandbox/

# Apply selectively
cp .loaded-vibes/upgrade-sandbox/.github/prompts/init.prompt.md .github/prompts/
```

#### `Upgrade failed: Invalid manifest`

**Cause:** Manifest schema changed between versions.

**Fix:**

```bash
# Backup current
cp .loaded-vibes/manifest.json .loaded-vibes/manifest.backup.json

# Force mirror upgrade
npx loaded-vibes upgrade --strategy mirror

# Re-apply customizations manually
```

#### `Restore failed: Backup not found`

**Cause:** Backup doesn't exist or was corrupted.

**Fix:**

```bash
# List available backups
npx loaded-vibes restore --list

# If no backups, reinitialize
npx loaded-vibes init --force
```

---

### Log Issues

#### `Logs are empty`

**Cause:** No DevCycles have run yet.

**Fix:**

```bash
# Run a DevCycle first
npx loaded-vibes devcycle init

# Then check logs
npx loaded-vibes logs
```

#### `Log file is corrupted`

**Cause:** Interrupted write or disk issue.

**Fix:**

```bash
# Find corrupted file
find .loaded-vibes/logs -type f -name "*.ndjson" -exec sh -c 'jq . "{}" > /dev/null 2>&1 || echo "{}"' \;

# Remove corrupted files
rm .loaded-vibes/logs/corrupted-file.ndjson

# Future logs will be clean
```

#### `Logs taking too much space`

**Cause:** Log rotation not triggered.

**Fix:**

```bash
# Check log sizes
du -sh .loaded-vibes/logs/*

# Manual cleanup (keeps last 5)
cd .loaded-vibes/logs
ls -t *.ndjson | tail -n +6 | xargs rm -f
```

---

## Diagnostic Commands

### Full Health Check

```bash
npx loaded-vibes doctor --verbose
```

### Check Specific Category

```bash
# Prerequisites
npx loaded-vibes doctor --check prerequisites

# MCP servers
npx loaded-vibes doctor --check mcp

# Assets
npx loaded-vibes doctor --check assets

# Manifest
npx loaded-vibes doctor --check manifest
```

### Debug Mode

```bash
# Run with debug output
LOADED_VIBES_LOG_LEVEL=debug npx loaded-vibes devcycle init

# Or
npx loaded-vibes devcycle init --debug
```

### Export Diagnostics

```bash
# Export full diagnostics
npx loaded-vibes doctor --verbose > diagnostics.txt 2>&1

# Include system info
echo "=== SYSTEM INFO ===" >> diagnostics.txt
node --version >> diagnostics.txt
npm --version >> diagnostics.txt
pnpm --version >> diagnostics.txt 2>/dev/null
cat .loaded-vibes/manifest.json >> diagnostics.txt
```

---

## Getting Help

### In-CLI Help

```bash
# General help
npx loaded-vibes --help

# Command help
npx loaded-vibes devcycle --help

# Contextual hints
npx loaded-vibes hint troubleshooting
```

### Documentation

```bash
# Open docs
npx loaded-vibes docs

# Specific topic
npx loaded-vibes docs troubleshooting
```

### GitHub Issues

When filing an issue, include:

1. **Loaded Vibes version:** `npx loaded-vibes --version`
2. **Node version:** `node --version`
3. **OS:** Windows/macOS/Linux + version
4. **Error output:** Full terminal output
5. **Repro steps:** How to reproduce

**Issue template:**

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
1. Run `npx loaded-vibes ...`
2. See error

**Expected behavior**
What you expected to happen.

**Environment**
- Loaded Vibes: X.X.X
- Node: vX.X.X
- OS: Windows 11 / macOS 14 / Ubuntu 22.04
- Terminal: PowerShell / bash / zsh

**Logs**
```
<paste relevant logs here>
```

**Additional context**
Any other relevant information.
```

---

## Recovery Procedures

### Full Reset

When nothing else works:

```bash
# Backup your customizations
cp -r .github/prompts ~/.backup-prompts
cp -r .github/instructions ~/.backup-instructions

# Remove Loaded Vibes
rm -rf .loaded-vibes .github .vscode

# Reinstall
npx create-loaded-vibes@latest --attach .

# Restore customizations
cp ~/.backup-prompts/* .github/prompts/
cp ~/.backup-instructions/* .github/instructions/

# Verify
npx loaded-vibes doctor
```

### Rollback to Previous Version

```bash
# List backups
npx loaded-vibes restore --list

# Restore specific backup
npx loaded-vibes restore --from v1.0.0-20241128T123456
```

### Clean Slate

For a completely fresh start:

```bash
# Create new project
npx create-loaded-vibes@latest my-new-project
cd my-new-project

# Copy your source code
cp -r ../old-project/src ./src

# Verify
npx loaded-vibes doctor
```

---

## FAQ

### Q: Why does `doctor` say my manifest is invalid?

**A:** The manifest schema may have changed. Run `npx loaded-vibes upgrade --strategy mirror` to get the latest schema.

### Q: Can I use npm instead of pnpm?

**A:** Yes, but pnpm is recommended for faster installs and better disk usage. Loaded Vibes will work with npm.

### Q: Why are my customizations being overwritten?

**A:** Make sure to use `--strategy merge` or `--strategy sandbox` during upgrades. The `mirror` strategy replaces all files.

### Q: How do I completely disable telemetry?

**A:**

```bash
npx loaded-vibes config set telemetry false
# or
export LOADED_VIBES_TELEMETRY=false
```

### Q: Why is the dashboard slow?

**A:** Try minimal mode: `npx loaded-vibes dashboard --minimal`. Also check if log files are very large.

---

## Still Stuck?

1. **Check the docs:** `npx loaded-vibes docs`
2. **Search issues:** [GitHub Issues](https://github.com/DigitalHerencia/LoadedVibes/issues)
3. **File a bug:** Include diagnostics export
4. **Discord:** (if available) Real-time help

---

> "The only bug-free code is the code that was never written. But we're here to help with the rest."
