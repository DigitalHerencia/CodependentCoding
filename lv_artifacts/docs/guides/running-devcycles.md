# Running DevCycles

> A complete guide to executing, chaining, and managing DevCycles.

---

## Basic Execution

### Run a Single DevCycle

```bash
npx loaded-vibes devcycle <name>

# Examples:
npx loaded-vibes devcycle init
npx loaded-vibes devcycle features
npx loaded-vibes devcycle deploy
```

### Using the Alias

```bash
npx loaded-vibes dc features  # Same as devcycle
```

### From the Dashboard

1. Launch dashboard: `npx loaded-vibes dashboard`
2. Press `Ctrl+P` to open command palette
3. Type the DevCycle name
4. Press Enter to execute

---

## Execution Modes

### Execute Mode (Default)

Runs the full DevCycle:

```bash
npx loaded-vibes devcycle features --mode execute
# or just
npx loaded-vibes devcycle features
```

### Plan Mode

Generates the plan without executing:

```bash
npx loaded-vibes devcycle features --mode plan
```

**Use when:**

- Previewing what will happen
- Reviewing changes before applying
- Documenting proposed changes

### Validate Mode

Runs only the validation phase:

```bash
npx loaded-vibes devcycle features --mode validate
```

**Use when:**

- Checking if acceptance criteria are met
- Verifying after manual changes
- Running quick health checks

### Dry Run

Preview without any file changes:

```bash
npx loaded-vibes devcycle features --dry-run
```

---

## Chaining DevCycles

### Sequential Execution

Run multiple DevCycles in order:

```bash
# Comma-separated list
npx loaded-vibes devcycle init,scaffold,config

# They run in sequence:
# 1. init → complete
# 2. scaffold → complete
# 3. config → complete
```

### Auto-Chain

Continue to the next logical DevCycle on success:

```bash
npx loaded-vibes devcycle scaffold --chain

# After scaffold completes, prompts:
# "Continue to 'config' DevCycle? [Y/n]"
```

### Resume Failed Chain

If a chain fails midway:

```bash
npx loaded-vibes devcycle --resume

# Resumes from the failed DevCycle
```

### Chain Status

View chain state:

```bash
npx loaded-vibes logs --summary

# Shows:
# Chain: init → scaffold ✓ → config ✖ (failed) → verify (pending)
```

---

## Checkpoints & Approvals

### Understanding Checkpoints

DevCycles have approval gates at key phases:

| Checkpoint  | When                   | Purpose                      |
| ----------- | ---------------------- | ---------------------------- |
| `plan`      | After DESIGN           | Review plan before execution |
| `implement` | Before destructive ops | Approve dangerous changes    |
| `reflect`   | After VALIDATE         | Confirm results              |

### Plan Checkpoint

```
╭─────────────────────────────────────────────────────────────╮
│ FEATURES DEVCYCLE - PLAN REVIEW                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Tasks:                                                      │
│ 1. Create UserProfile component                             │
│ 2. Add getUserProfile server action                         │
│ 3. Implement profile caching                                │
│ 4. Write unit tests                                         │
│                                                             │
│ Estimated: 15 minutes | Files: 6                            │
│                                                             │
│ [A]pprove  [M]odify  [S]kip  [C]ancel                      │
╰─────────────────────────────────────────────────────────────╯
```

**Options:**

- **Approve (a)** — Continue with the plan
- **Modify (m)** — Edit the plan interactively
- **Skip (s)** — Skip to next phase
- **Cancel (c)** — Abort the DevCycle

### Destructive Operation Checkpoint

```
╭─────────────────────────────────────────────────────────────╮
│ ⚠️  DESTRUCTIVE OPERATION                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Operation: prisma migrate reset                             │
│ Impact: Deletes all data in development database            │
│ Rollback: Restore from .loaded-vibes/backup/                │
│                                                             │
│ Type "yes" to confirm:                                      │
╰─────────────────────────────────────────────────────────────╯
```

### Skipping Checkpoints

For CI/CD pipelines:

```bash
npx loaded-vibes devcycle deploy --skip-checkpoints
```

> ⚠️ **Warning:** Only use in automated environments with proper safeguards.

---

## Monitoring Execution

### Real-Time Logs

Watch execution as it happens:

```bash
npx loaded-vibes logs --follow
```

### In Dashboard

The dashboard shows live execution:

```
┌─────────────────────────┬─────────────────────────────────────┐
│    DevCycle Queue       │           Live Logs                 │
├─────────────────────────┤                                     │
│ ● Features      RUNNING │ [12:34:56] ANALYZE: Loading PRD     │
│ ○ Testing       QUEUED  │ [12:34:57] ANALYZE: Context ready   │
│ ○ Deploy        IDLE    │ [12:34:58] DESIGN: Generating plan  │
│                         │ [12:34:59] DESIGN: Plan approved    │
│                         │ [12:35:00] IMPLEMENT: Starting...   │
└─────────────────────────┴─────────────────────────────────────┘
```

### Execution Summary

After completion:

```
╭─────────────────────────────────────────────────────────────╮
│ FEATURES DEVCYCLE COMPLETE                                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Duration: 12m 34s                                           │
│ Phases: 6/6 completed                                       │
│ Files: 8 created, 3 modified                                │
│ Tests: 24 passed, 0 failed                                  │
│                                                             │
│ Artifacts:                                                  │
│ • src/components/UserProfile.tsx                            │
│ • src/app/actions/profile.ts                                │
│ • src/__tests__/UserProfile.test.tsx                        │
│                                                             │
│ Documentation:                                              │
│ • TODO.md: 2 items completed                                │
│ • CHANGELOG.md: Added section                               │
│                                                             │
│ Log: .loaded-vibes/logs/features-20241128.ndjson            │
╰─────────────────────────────────────────────────────────────╯
```

---

## Handling Failures

### Understanding Failure Types

| Type           | Cause                 | Resolution                 |
| -------------- | --------------------- | -------------------------- |
| **Validation** | Prerequisites not met | Fix and retry              |
| **Execution**  | Task failed           | Check logs, fix, retry     |
| **Timeout**    | Operation too slow    | Increase timeout, optimize |
| **Approval**   | User cancelled        | Rerun when ready           |

### Retry After Failure

```bash
# Retry the same DevCycle
npx loaded-vibes devcycle features

# The orchestrator remembers:
# "Previous run failed at IMPLEMENT. Resume from there? [Y/n]"
```

### Partial Execution

If you want to start fresh:

```bash
# Clear state and run
npx loaded-vibes devcycle features --fresh
```

### Rollback Changes

If a DevCycle made unwanted changes:

```bash
# Git rollback
git checkout -- .

# Or use backup
npx loaded-vibes restore --from latest
```

---

## Advanced Patterns

### Conditional DevCycles

Run based on conditions:

```bash
# Only run if tests pass
pnpm test && npx loaded-vibes devcycle deploy

# Run with error handling
npx loaded-vibes devcycle features || npx loaded-vibes devcycle debug
```

### Parallel DevCycles (Careful!)

Some DevCycles can run in parallel:

```bash
# In separate terminals:
# Terminal 1:
npx loaded-vibes devcycle docs

# Terminal 2:
npx loaded-vibes devcycle cicd
```

> ⚠️ Only parallelize independent DevCycles. Check for file conflicts.

### Scheduled DevCycles

Using cron or scheduled tasks:

```bash
# .github/workflows/nightly.yml
on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM daily

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx loaded-vibes devcycle verify --skip-checkpoints
```

---

## DevCycle-Specific Tips

### Initialization

```bash
# First run in a new project
npx loaded-vibes devcycle init

# Re-initialize after manual changes
npx loaded-vibes devcycle init --force
```

### Scaffolding

```bash
# Preview structure first
npx loaded-vibes devcycle scaffold --mode plan

# Then execute
npx loaded-vibes devcycle scaffold
```

### Features

```bash
# Single feature
npx loaded-vibes devcycle features

# With specific context
echo "Feature: User Profile editing" | npx loaded-vibes devcycle features
```

### Deploy

```bash
# Dry run first!
npx loaded-vibes devcycle deploy --dry-run

# Then for real
npx loaded-vibes devcycle deploy
```

---

## Integration with CI/CD

### GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: pnpm install

      - name: Run Verification DevCycle
        run: npx loaded-vibes devcycle verify --skip-checkpoints
        env:
          LOADED_VIBES_CI: true
```

### Pre-commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
npx loaded-vibes devcycle verify --mode validate
```

---

## Best Practices

### 1. Always Preview First

```bash
npx loaded-vibes devcycle features --mode plan
```

### 2. Watch the Logs

```bash
# In a separate terminal
npx loaded-vibes logs --follow
```

### 3. Use Checkpoints

Don't skip them unless in CI:

```bash
# Good in CI
npx loaded-vibes devcycle verify --skip-checkpoints

# Bad locally
# npx loaded-vibes devcycle deploy --skip-checkpoints  # Don't!
```

### 4. Chain Strategically

Group related DevCycles:

```bash
# Feature development
npx loaded-vibes devcycle features,test,validate

# Release prep
npx loaded-vibes devcycle verify,docs,cicd,deploy
```

### 5. Check History

Review past runs:

```bash
npx loaded-vibes logs --summary --last 10
```

---

## Next Steps

- **[DevCycles Reference](../concepts/devcycles.md)** — The 18 phases
- **[Customization](./customization.md)** — Modifying behavior
- **[CLI Reference](../reference/cli.md)** — Full command reference

---

> "A DevCycle executed is worth two in the backlog."
