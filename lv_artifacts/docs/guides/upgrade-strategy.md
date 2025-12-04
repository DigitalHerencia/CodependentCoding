# Upgrade Strategy Guide

> Keeping your customizations safe through framework updates.

---

## Overview

Loaded Vibes uses a **three-tier versioning strategy** to handle upgrades safely:

1. **Framework Version** — Semantic versioning in manifest
2. **Asset Tracking** — Checksum-based change detection
3. **Conflict Resolution** — Mirror/Merge/Sandbox strategies

---

## Version Scheme

### Semantic Versioning

| Version           | Scope            | Upgrade Impact               |
| ----------------- | ---------------- | ---------------------------- |
| **Major** (X.0.0) | Breaking changes | Manual review required       |
| **Minor** (1.X.0) | New features     | Auto-merge safe for pristine |
| **Patch** (1.2.X) | Bug fixes        | Silent update for pristine   |

### Breaking Changes Include

- Manifest schema changes
- Toolset API changes
- DevCycle contract changes
- Removed DevCycles

---

## Checking for Updates

### Manual Check

```bash
npx loaded-vibes upgrade --check

# Output:
# Current version: 1.0.0
# Latest version:  1.2.0
#
# Changes:
# - Added: Performance DevCycle improvements
# - Fixed: Dashboard rendering issues
# - Changed: Toolset schema v2 (minor)
```

### Automated Checks

Add to your CI:

```yaml
- name: Check for updates
  run: npx loaded-vibes upgrade --check
```

---

## Upgrade Strategies

### 1. Mirror Strategy

**Behavior:** Exact parity with upstream. Overwrites all assets.

**Best for:**

- Projects with no customizations
- When you want a clean slate
- After major version updates

```bash
npx loaded-vibes upgrade --strategy mirror
```

**What happens:**

1. Backs up current `.github/` and `.vscode/`
2. Downloads new version
3. Replaces all framework assets
4. Preserves `src/`, `TODO.md`, `CHANGELOG.md`

### 2. Merge Strategy

**Behavior:** Auto-merges non-conflicting changes. Interactive for conflicts.

**Best for:**

- Projects with light customizations
- Minor/patch updates
- When you want to review changes

```bash
npx loaded-vibes upgrade --strategy merge
```

**What happens:**

1. Analyzes asset checksums
2. Auto-merges pristine files
3. Prompts for each conflicting file
4. Applies your choices

**Conflict Resolution UI:**

```
╭─────────────────────────────────────────────────────────────╮
│ CONFLICT: .github/prompts/features.prompt.md                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Your changes:                                               │
│ + Added custom context variables                            │
│ + Modified trigger conditions                               │
│                                                             │
│ Upstream changes:                                           │
│ + Improved performance hints                                │
│ + Added new checkpoint                                      │
│                                                             │
│ Options:                                                    │
│ [k]eep yours  [t]ake theirs  [m]erge  [d]iff  [s]kip       │
╰─────────────────────────────────────────────────────────────╯
```

### 3. Sandbox Strategy

**Behavior:** Extracts to sandbox. You selectively apply changes.

**Best for:**

- Heavily customized projects
- Major version updates
- When you want full control

```bash
npx loaded-vibes upgrade --strategy sandbox
```

**What happens:**

1. Downloads new version to `.loaded-vibes/upgrade-sandbox/`
2. Shows summary of changes
3. You manually copy what you want
4. No automatic file changes

**Sandbox structure:**

```
.loaded-vibes/upgrade-sandbox/
├── .github/
│   ├── prompts/
│   ├── instructions/
│   └── toolsets/
├── .vscode/
├── UPGRADE_NOTES.md       # What changed
└── MIGRATION_GUIDE.md     # How to migrate
```

---

## Pre-Upgrade Analysis

### Generate Upgrade Hints

Before upgrading, analyze what will change:

```bash
npx loaded-vibes upgrade --analyze
```

**Output:**

```json
// .loaded-vibes/upgrade-hints/v1.2.0.json
{
  "currentVersion": "1.0.0",
  "targetVersion": "1.2.0",
  "summary": {
    "added": 2,
    "modified": 5,
    "removed": 0,
    "conflicts": 3
  },
  "files": {
    ".github/prompts/perf.prompt.md": {
      "status": "added",
      "description": "New performance DevCycle prompt"
    },
    ".github/prompts/features.prompt.md": {
      "status": "conflict",
      "yourChanges": ["Added context vars"],
      "upstreamChanges": ["Improved hints"]
    }
  },
  "breakingChanges": [],
  "migrationSteps": []
}
```

### Review Hints

```bash
# View in terminal
cat .loaded-vibes/upgrade-hints/v1.2.0.json | jq

# Or open in editor
code .loaded-vibes/upgrade-hints/v1.2.0.json
```

---

## The Upgrade Workflow

### Recommended Process

```bash
# Step 1: Check what's available
npx loaded-vibes upgrade --check

# Step 2: Analyze impact
npx loaded-vibes upgrade --analyze

# Step 3: Review the hints
code .loaded-vibes/upgrade-hints/

# Step 4: Backup your state
git add -A && git commit -m "chore: pre-upgrade state"

# Step 5: Perform upgrade
npx loaded-vibes upgrade --strategy merge

# Step 6: Validate
npx loaded-vibes doctor

# Step 7: Test
pnpm test

# Step 8: Commit upgrade
git add -A && git commit -m "chore: upgrade loaded-vibes to v1.2.0"
```

### For Major Versions

```bash
# Use sandbox for major versions
npx loaded-vibes upgrade --strategy sandbox

# Review migration guide
cat .loaded-vibes/upgrade-sandbox/MIGRATION_GUIDE.md

# Apply changes manually
cp .loaded-vibes/upgrade-sandbox/.github/prompts/new-devcycle.prompt.md .github/prompts/

# Then mirror the rest
npx loaded-vibes upgrade --strategy mirror
```

---

## Backup & Rollback

### Automatic Backups

Every upgrade creates a backup:

```
.loaded-vibes/backup/
├── v1.0.0-20241128T123456/
│   ├── .github/
│   ├── manifest.backup.json
│   └── assets.backup.json
└── v1.1.0-20241129T091011/
    └── ...
```

### Listing Backups

```bash
npx loaded-vibes restore --list

# Output:
# Available backups:
# v1.0.0-20241128T123456  (2 days ago)  5 files
# v1.1.0-20241129T091011  (1 day ago)   8 files
```

### Full Rollback

```bash
npx loaded-vibes restore --from v1.0.0-20241128T123456
```

### Partial Rollback

```bash
# Restore single file
npx loaded-vibes restore --from v1.0.0-20241128T123456 \
  --asset .github/prompts/features.prompt.md
```

### Backup Retention

By default, last 5 backups are kept. Configure:

```bash
npx loaded-vibes config set backupRetention 10
```

---

## Asset Status Reference

Each asset has a status:

| Status     | Meaning                 | Upgrade Behavior    |
| ---------- | ----------------------- | ------------------- |
| `pristine` | Unchanged from upstream | Auto-updated        |
| `modified` | You've customized       | Conflict possible   |
| `conflict` | Both changed            | Requires resolution |
| `orphaned` | Removed from upstream   | Kept locally        |
| `new`      | Added by upgrade        | Auto-added          |

### Viewing Asset Status

```bash
npx loaded-vibes doctor --check assets

# Output:
# Asset Status Report
# ───────────────────────────────────────────
# .github/prompts/init.prompt.md         pristine
# .github/prompts/features.prompt.md     modified
# .github/instructions/auth.instructions.md  pristine
# .github/toolsets/custom.toolset.jsonc  orphaned
```

---

## Handling Conflicts

### Manual Resolution

When merge prompts you:

```
[k]eep yours  [t]ake theirs  [m]erge  [d]iff  [s]kip
```

- **k (keep)** — Keep your version, ignore upstream
- **t (take)** — Take upstream, lose your changes
- **m (merge)** — Open in merge tool
- **d (diff)** — Show side-by-side diff
- **s (skip)** — Decide later

### Merge Tool

If you choose merge:

```bash
# Opens in VS Code merge editor
# You see:
# LEFT:  Your version
# RIGHT: Upstream version
# BOTTOM: Result

# Save and close when done
```

### After Conflicts

Validate your resolution:

```bash
npx loaded-vibes doctor --check manifest
npx loaded-vibes devcycle verify
```

---

## Best Practices

### 1. Upgrade Often

Small, frequent upgrades are easier than large jumps:

```bash
# Good: v1.0.0 → v1.1.0 → v1.2.0
# Bad:  v1.0.0 → v2.3.0
```

### 2. Read Changelogs

Before upgrading:

```bash
npx loaded-vibes upgrade --check
# Then visit GitHub releases
```

### 3. Use Git

Always commit before upgrading:

```bash
git add -A && git commit -m "chore: pre-upgrade state"
```

### 4. Test After Upgrade

Run your tests and a DevCycle:

```bash
pnpm test
npx loaded-vibes devcycle verify
```

### 5. Document Custom Assets

Track what you've customized:

```markdown
## Custom Assets

| File                   | Reason                 |
| ---------------------- | ---------------------- |
| `features.prompt.md`   | Added team context     |
| `custom.toolset.jsonc` | Project-specific tools |
```

---

## Troubleshooting

### "Upgrade blocked: Breaking changes"

Major version detected. Use sandbox:

```bash
npx loaded-vibes upgrade --strategy sandbox
cat .loaded-vibes/upgrade-sandbox/MIGRATION_GUIDE.md
```

### "Manifest validation failed after upgrade"

Schema changed. Re-run with mirror:

```bash
npx loaded-vibes upgrade --strategy mirror
```

### "Lost my customizations"

Restore from backup:

```bash
npx loaded-vibes restore --list
npx loaded-vibes restore --from <backup-name>
```

### "Merge tool not opening"

Set your merge tool:

```bash
git config merge.tool vscode
git config mergetool.vscode.cmd 'code --wait $MERGED'
```

---

## CI/CD Integration

### Automated Upgrade PRs

```yaml
# .github/workflows/upgrade-check.yml
name: Check for Updates

on:
  schedule:
    - cron: '0 9 * * 1' # Mondays at 9 AM

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Check for updates
        run: |
          UPDATE=$(npx loaded-vibes upgrade --check --json)
          if [ "$UPDATE" != "null" ]; then
            echo "Update available: $UPDATE"
            # Create PR or notification
          fi
```

---

## Next Steps

- **[Customization Guide](./customization.md)** — What can be customized
- **[Troubleshooting](./troubleshooting.md)** — Common issues
- **[CLI Reference](../reference/cli.md)** — Command details

---

> "An upgrade a week keeps the technical debt from getting too bleak."
