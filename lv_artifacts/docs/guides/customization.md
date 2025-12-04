# Customization Guide

> Make Loaded Vibes yours without breaking everything.

---

## Overview

Loaded Vibes is designed to be customized. You can modify:

- **Prompts** — How DevCycles capture context
- **Instructions** — Domain rules and acceptance criteria
- **Toolsets** — Allowed operations and tools
- **Configuration** — Runtime behavior

All customizations are tracked for safe upgrades.

---

## What Can Be Customized

| Asset                         | Customizable | Tracked | Upgrade Impact           |
| ----------------------------- | ------------ | ------- | ------------------------ |
| `.github/prompts/*`           | ✓            | ✓       | Merge conflicts possible |
| `.github/instructions/*`      | ✓            | ✓       | Merge conflicts possible |
| `.github/toolsets/*`          | ✓            | ✓       | Merge conflicts possible |
| `.loaded-vibes/manifest.json` | Via CLI      | ✓       | Preserved                |
| `.vscode/settings.json`       | ✓            | Partial | May drift                |
| `TODO.md`                     | ✓            | ✗       | Preserved                |
| `CHANGELOG.md`                | ✓            | ✗       | Preserved                |

---

## Customizing Prompts

Prompts define how DevCycles capture context and trigger execution.

### Why Customize?

- Add project-specific context variables
- Modify trigger conditions
- Change success criteria

### How to Customize

```bash
# Open the prompt
code .github/prompts/features.prompt.md
```

### Example: Add Custom Context

**Before:**

```markdown
---
description: Implement application features
instruction: features.instructions.md
toolset: features.toolset.jsonc
---

# Features DevCycle

WHEN triggered, THE SYSTEM SHALL:

1. Load PRD requirements
2. Analyze codebase
3. Generate plan
```

**After:**

```markdown
---
description: Implement application features
instruction: features.instructions.md
toolset: features.toolset.jsonc
---

# Features DevCycle

## Custom Context

- Team coding standards: `docs/CODING_STANDARDS.md`
- API contracts: `docs/api/*.yaml`
- Design system: `src/design-system/`

WHEN triggered, THE SYSTEM SHALL:

1. Load PRD requirements
2. Load team coding standards
3. Analyze existing API contracts
4. Analyze codebase
5. Generate plan aligned with design system
```

### Tracking Status

After saving, your change is tracked:

```bash
# Check asset status
npx loaded-vibes doctor --check assets

# Output:
# .github/prompts/features.prompt.md: modified
```

---

## Customizing Instructions

Instructions define domain-specific rules for DevCycles.

### Why Customize?

- Add project-specific acceptance criteria
- Enforce team conventions
- Set custom performance budgets
- Add security requirements

### How to Customize

```bash
# Open the instruction file
code .github/instructions/features.instructions.md
```

### Example: Add Custom Conventions

**Original:**

```markdown
## Conventions

### File Naming

- Components: `PascalCase.tsx`
```

**Customized:**

```markdown
## Conventions

### File Naming

- Components: `PascalCase.tsx`
- API routes: `route.ts` (Next.js convention)
- Server actions: `actions.ts` (grouped by domain)

### Our Team Rules

- Use `@/` import alias for src/
- Prefer named exports over default exports
- Always include loading states
- Use our design system components from `@/components/ui`

### Code Review Checklist

Before completing, verify:

- [ ] No magic numbers (use constants)
- [ ] Error boundaries for async components
- [ ] Accessibility attributes included
- [ ] Mobile-first responsive design
```

---

## Customizing Toolsets

Toolsets control what operations are allowed during DevCycles.

### Why Customize?

- Enable additional MCP servers
- Add CLI tools your project needs
- Restrict paths for safety
- Add approval requirements

### How to Customize

```bash
# Open the toolset
code .github/toolsets/features.toolset.jsonc
```

### Example: Add Custom Tools

**Original:**

```jsonc
{
  "tools": {
    "mcpServers": ["filesystem", "git", "memory"],
    "cliCommands": ["pnpm", "npx"]
  }
}
```

**Customized:**

```jsonc
{
  "tools": {
    "mcpServers": [
      "filesystem",
      "git",
      "memory",
      "postgres", // Added: database access
      "redis" // Added: cache access
    ],
    "cliCommands": [
      "pnpm",
      "npx",
      "prisma", // Added: database migrations
      "drizzle-kit", // Added: alternative ORM
      "tsx" // Added: TypeScript runner
    ],
    "requiresApproval": [
      "prisma migrate deploy", // Added: production migrations
      "redis-cli FLUSHALL" // Added: cache clear
    ]
  },
  "constraints": {
    "allowedPaths": [
      "src/**",
      "prisma/**",
      "drizzle/**", // Added: drizzle config
      "scripts/**" // Added: utility scripts
    ]
  }
}
```

### Validation

After modifying toolsets:

```bash
# Validate JSON syntax
npx loaded-vibes doctor --check manifest

# Test MCP availability
npx loaded-vibes tools check
```

---

## Creating Custom DevCycles

You can create entirely new DevCycles for your project.

### Step 1: Create the Prompt

```bash
touch .github/prompts/lint-fix.prompt.md
```

```markdown
---
description: Automatically fix linting issues across the codebase
instruction: lint-fix.instructions.md
toolset: lint-fix.toolset.jsonc
---

# Lint Fix DevCycle

Custom DevCycle to run ESLint with auto-fix across the project.

WHEN triggered, THE SYSTEM SHALL:

1. Run ESLint with --fix flag
2. Run Prettier for formatting
3. Commit fixes with descriptive message
4. Update TODO.md with remaining manual fixes
```

### Step 2: Create the Instruction

```bash
touch .github/instructions/lint-fix.instructions.md
```

```markdown
---
description: Rules for Lint Fix DevCycle
applyTo: 'lint-fix'
---

# Lint Fix Instructions

## Objectives

Automatically fix linting issues while preserving code functionality.

## Acceptance Criteria

- WHEN fixing, THE SYSTEM SHALL preserve existing functionality
- WHEN unable to auto-fix, THE SYSTEM SHALL log the issue
- WHEN committing, THE SYSTEM SHALL use conventional commit format

## Safety Rules

- NEVER change logic, only formatting and style
- ALWAYS run tests after fixing
- IF tests fail, THEN rollback changes
```

### Step 3: Create the Toolset

```bash
touch .github/toolsets/lint-fix.toolset.jsonc
```

```jsonc
{
  "$schema": "../schemas/toolset.schema.json",
  "name": "lint-fix",
  "description": "Tools for automated linting",
  "tools": {
    "mcpServers": ["filesystem", "git"],
    "cliCommands": ["eslint", "prettier", "git"],
    "destructive": false
  },
  "constraints": {
    "allowedPaths": ["src/**", "app/**", "lib/**"]
  }
}
```

### Step 4: Add to Manifest

Edit `.github/devcycles.config.json`:

```json
{
  "devCycles": {
    "lint-fix": {
      "instruction": "lint-fix.instructions.md",
      "prompt": "lint-fix.prompt.md",
      "toolset": "lint-fix.toolset.jsonc",
      "description": "Auto-fix linting issues",
      "displayName": "Lint Fix",
      "riskLevel": "low",
      "checkpoints": ["reflect"]
    }
  }
}
```

### Step 5: Validate and Run

```bash
# Validate
npx loaded-vibes doctor --check manifest

# Run your custom DevCycle
npx loaded-vibes devcycle lint-fix
```

---

## Configuration Settings

Customize runtime behavior via the manifest.

### Available Settings

```bash
# View all settings
npx loaded-vibes config get

# Set specific settings
npx loaded-vibes config set telemetry false
npx loaded-vibes config set theme minimal
npx loaded-vibes config set logLevel debug
npx loaded-vibes config set checkpoints false  # Disable approvals (careful!)
```

### Settings Reference

| Setting       | Type    | Default       | Description               |
| ------------- | ------- | ------------- | ------------------------- |
| `telemetry`   | boolean | `true`        | Send anonymous usage data |
| `theme`       | string  | `"synthwave"` | CLI theme                 |
| `logLevel`    | string  | `"info"`      | Logging verbosity         |
| `checkpoints` | boolean | `true`        | Enable approval prompts   |
| `autoFix`     | boolean | `false`       | Auto-fix in doctor        |

---

## VS Code Customization

### Settings

Add project-specific VS Code settings:

```json
// .vscode/settings.json
{
  // Loaded Vibes adds these, you can extend:
  "genaiscript.localTypeDefinitions": true,

  // Your additions:
  "editor.fontSize": 14,
  "editor.tabSize": 2,
  "files.autoSave": "onWindowChange"
}
```

### Tasks

Add custom tasks:

```json
// .vscode/tasks.json
{
  "tasks": [
    // Loaded Vibes tasks...

    // Your custom tasks:
    {
      "label": "Full CI Check",
      "type": "shell",
      "command": "pnpm lint && pnpm typecheck && pnpm test",
      "problemMatcher": []
    }
  ]
}
```

---

## Upgrade Safety

### How Tracking Works

Every customization is tracked in `.loaded-vibes/assets.json`:

```json
{
  ".github/prompts/features.prompt.md": {
    "frameworkChecksum": "sha256:original...",
    "localChecksum": "sha256:modified...",
    "status": "modified"
  }
}
```

### During Upgrades

When you upgrade:

1. **Pristine files** → Updated silently
2. **Modified files** → Conflict resolution needed
3. **New files** → Added automatically
4. **Removed upstream** → Marked as orphaned

### Conflict Resolution

When conflicts occur:

```bash
# See what's conflicting
npx loaded-vibes upgrade --analyze

# Choose strategy:
# 1. Mirror - Overwrites your changes (creates backup)
# 2. Merge - Interactive merge
# 3. Sandbox - Extract to sandbox, apply manually

npx loaded-vibes upgrade --strategy merge
```

---

## Best Practices

### 1. Document Your Customizations

Add a section to your README:

```markdown
## Framework Customizations

### Modified Prompts

- `features.prompt.md` - Added design system context

### Modified Instructions

- `features.instructions.md` - Added team conventions

### Custom DevCycles

- `lint-fix` - Auto-fix linting issues
```

### 2. Test Before Upgrading

```bash
# Always analyze first
npx loaded-vibes upgrade --analyze

# Review the diff hints
cat .loaded-vibes/upgrade-hints/v2.0.0.json
```

### 3. Use Version Control

```bash
# Commit customizations
git add .github/
git commit -m "feat: customize DevCycle prompts for team conventions"

# Tag your customization state
git tag "customizations-v1"
```

### 4. Keep a Changelog

Track what you've customized:

```markdown
## Customization Log

### 2024-11-28

- Modified `features.instructions.md` to add team code review checklist
- Added custom `lint-fix` DevCycle

### 2024-11-15

- Modified `scaffold.prompt.md` to include design system
```

### 5. Don't Over-Customize

Signs you're over-customizing:

- Modified 10+ files
- Changed core framework behavior
- Breaking upgrade compatibility frequently

Consider forking instead.

---

## Resetting Customizations

### Reset Single File

```bash
# Restore from upstream
npx loaded-vibes restore --from latest --asset .github/prompts/features.prompt.md
```

### Reset All

```bash
# Full reset (keeps your source code)
npx loaded-vibes init --force
```

### Reset with Backup

```bash
# Backup first
cp -r .github ~/.github-backup

# Reset
npx loaded-vibes init --force

# Restore what you need
cp ~/.github-backup/prompts/custom.prompt.md .github/prompts/
```

---

## Next Steps

- **[Upgrade Strategy](./upgrade-strategy.md)** — Managing upgrades
- **[DevCycles](../concepts/devcycles.md)** — Understanding phases
- **[Artifacts](../concepts/artifacts.md)** — Prompt/instruction/toolset details

---

> "Customization is a feature. Over-customization is a lifestyle choice."
