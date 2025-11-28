# DevCycles

> The 18 canonical phases of development, each with its own rules, tools, and vibes.

---

## What is a DevCycle?

A **DevCycle** is a self-contained development phase with:

- **A clear objective** — What you're trying to accomplish
- **A prompt** — The entry point that initiates the cycle
- **An instruction file** — Domain rules and acceptance criteria
- **A toolset** — Allowed operations and MCP servers
- **Checkpoints** — Human approval gates
- **Outputs** — Artifacts, logs, and documentation updates

Think of DevCycles as "rituals" — structured, repeatable processes that turn chaos into shipped code.

---

## The 18 DevCycles

| #   | DevCycle           | Purpose                                        | Risk Level |
| --- | ------------------ | ---------------------------------------------- | ---------- |
| 1   | **Initialization** | Bootstrap environment, validate prerequisites  | 🟢 Low     |
| 2   | **Scaffolding**    | Generate project structure and base components | 🟡 Medium  |
| 3   | **Configuration**  | Set up ESLint, Prettier, TypeScript, Tailwind  | 🟢 Low     |
| 4   | **Verification**   | Run lint, typecheck, config validation         | 🟢 Low     |
| 5   | **Data**           | Design Prisma schema, migrations, seeding      | 🟡 Medium  |
| 6   | **Auth**           | Integrate Clerk, configure ABAC/RBAC           | 🔴 High    |
| 7   | **Testing**        | Configure test infrastructure, generate plans  | 🟢 Low     |
| 8   | **Validation**     | Confirm implementation matches PRD intent      | 🟢 Low     |
| 9   | **Features**       | Implement application logic                    | 🟡 Medium  |
| 10  | **Debug**          | Resolve errors and failing tests               | 🟡 Medium  |
| 11  | **Security**       | Enforce CSP, HSTS, permissions, logging        | 🔴 High    |
| 12  | **Performance**    | Optimize bundle size, queries, tech debt       | 🟡 Medium  |
| 13  | **Observability**  | Instrument telemetry, logs, alerts             | 🟢 Low     |
| 14  | **Code Review**    | Automate PR reviews and static analysis        | 🟢 Low     |
| 15  | **Documentation**  | Generate README, CONTRIBUTING, SECURITY        | 🟢 Low     |
| 16  | **CI/CD**          | Define GitHub Actions pipelines                | 🟡 Medium  |
| 17  | **Deploy**         | Execute deployments and smoke tests            | 🔴 High    |
| 18  | **Updates**        | Post-launch fixes and QoL improvements         | 🟡 Medium  |

---

## DevCycle Anatomy

Each DevCycle consists of these files:

```
.github/
├── prompts/
│   └── features.prompt.md      # Entry point
├── instructions/
│   └── features.instructions.md # Domain rules
└── toolsets/
    └── features.toolset.jsonc   # Allowed tools
```

### The Prompt

Entry point for the DevCycle. Captures context and triggers the orchestrator.

```markdown
---
description: Implement application features
instruction: features.instructions.md
toolset: features.toolset.jsonc
---

# Features DevCycle

WHEN triggered, THE SYSTEM SHALL:

1. Load PRD feature requirements
2. Analyze existing codebase structure
3. Generate implementation plan
4. Execute with performance budgets
5. Validate against acceptance criteria
```

### The Instruction File

Domain-specific rules and constraints.

```markdown
# Features DevCycle Instructions

## Acceptance Criteria

- All features must have unit tests with >80% coverage
- Components must be under 200 lines
- Server actions must include error handling
- No direct DOM manipulation

## Security Guardrails

- Validate all user inputs
- Use parameterized queries
- Never expose internal IDs

## Performance Budgets

- Initial bundle < 200KB
- Time to Interactive < 3s
- No blocking renders
```

### The Toolset

Allowed operations and MCP servers.

```jsonc
{
  "$schema": "../schemas/toolset.schema.json",
  "name": "features",
  "description": "Features DevCycle tools",
  "tools": {
    "mcpServers": ["filesystem", "git", "memory", "postgres"],
    "vscodeCommands": ["workbench.action.files.save", "editor.action.formatDocument"],
    "cliCommands": ["pnpm", "npx", "prisma"],
    "destructive": false,
    "requiresApproval": ["database.migrate"]
  }
}
```

---

## Execution Phases

Every DevCycle follows the same 6-phase execution model:

```
┌─────────┐   ┌─────────┐   ┌───────────┐   ┌──────────┐   ┌─────────┐   ┌─────────┐
│ ANALYZE │ → │ DESIGN  │ → │ IMPLEMENT │ → │ VALIDATE │ → │ REFLECT │ → │ HANDOFF │
└─────────┘   └─────────┘   └───────────┘   └──────────┘   └─────────┘   └─────────┘
```

### Phase 1: ANALYZE

**Goal:** Understand the problem and gather context.

**Actions:**

- Load PRD excerpts
- Load Tech Requirements
- Scan workspace structure
- Identify dependencies
- Generate confidence score

**Output:** Context document with requirements in EARS notation

### Phase 2: DESIGN

**Goal:** Create a detailed implementation plan.

**Actions:**

- Define execution strategy based on confidence
- Document technical design
- Create error handling matrix
- Define testing strategy
- Order tasks by dependency

**Output:** Implementation plan with task ordering

### Phase 3: IMPLEMENT

**Goal:** Write production-quality code.

**Actions:**

- Execute tasks in order
- Code in small increments
- Add meaningful comments
- Update task status
- Request approval for destructive operations

**Output:** Code changes with test coverage

### Phase 4: VALIDATE

**Goal:** Verify implementation meets requirements.

**Actions:**

- Execute automated tests
- Perform manual verification (if needed)
- Test edge cases
- Verify performance
- Log execution traces

**Output:** Validation report with evidence

### Phase 5: REFLECT

**Goal:** Improve and document.

**Actions:**

- Refactor for maintainability
- Update documentation
- Identify improvements
- Validate success criteria
- Create technical debt issues

**Output:** Updated docs, backlog items

### Phase 6: HANDOFF

**Goal:** Package for review and deployment.

**Actions:**

- Generate executive summary
- Prepare pull request
- Archive intermediate files
- Update TODO.md and CHANGELOG.md
- Transition to next task

**Output:** PR-ready package with full traceability

---

## Running DevCycles

### Single DevCycle

```bash
# Run by name
npx loaded-vibes devcycle init
npx loaded-vibes devcycle features
npx loaded-vibes devcycle deploy

# Short alias
npx loaded-vibes dc features
```

### Chained DevCycles

```bash
# Run multiple in sequence
npx loaded-vibes devcycle init,scaffold,config

# Chain from current
npx loaded-vibes devcycle scaffold --chain

# Resume a failed chain
npx loaded-vibes devcycle --resume
```

### Mode Flags

```bash
# Plan only (no execution)
npx loaded-vibes devcycle features --mode plan

# Execute (default)
npx loaded-vibes devcycle features --mode execute

# Validate only
npx loaded-vibes devcycle features --mode validate
```

---

## Checkpoints & Approvals

Certain operations require human approval:

### Plan Approval

Before execution, you'll see the plan:

```
╭─────────────────────────────────────────────────────────────────╮
│  FEATURES DEVCYCLE - PLAN REVIEW                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Tasks:                                                         │
│  1. Create UserDashboard component       └── src/components/    │
│  2. Add getUserStats server action       └── src/app/actions/   │
│  3. Implement caching layer              └── src/lib/cache.ts   │
│  4. Write unit tests                     └── __tests__/         │
│                                                                 │
│  Estimated duration: 12 minutes                                 │
│  Files affected: 8                                              │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Approve    │  │    Modify    │  │    Cancel    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
╰─────────────────────────────────────────────────────────────────╯
```

### Destructive Operation Approval

```
╭─────────────────────────────────────────────────────────────────╮
│                    ⚠️ DESTRUCTIVE OPERATION                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Operation:  prisma db push --force-reset                       │
│  Impact:     Will delete all data in development database       │
│  Rollback:   Restore from backup at .loaded-vibes/backup/       │
│                                                                 │
│  Type "yes" to confirm:                                         │
╰─────────────────────────────────────────────────────────────────╯
```

### Reflect Sign-off

```
╭─────────────────────────────────────────────────────────────────╮
│  FEATURES DEVCYCLE - REFLECT SUMMARY                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Completed:                                                     │
│  ✓ UserDashboard component (147 lines)                          │
│  ✓ getUserStats action (42 lines)                               │
│  ✓ Cache layer (89 lines)                                       │
│  ✓ 12 unit tests (100% passing)                                 │
│                                                                 │
│  Documentation updated:                                         │
│  • TODO.md - 3 items completed                                  │
│  • CHANGELOG.md - Features section added                        │
│                                                                 │
│  Sign off to complete?                                          │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │   Sign Off   │  │  Add Notes   │                            │
│  └──────────────┘  └──────────────┘                            │
╰─────────────────────────────────────────────────────────────────╯
```

---

## DevCycle Configuration

### Manifest (`devcycles.config.json`)

Each DevCycle is registered in the manifest:

```json
{
  "devCycles": {
    "init": {
      "instruction": "init.instructions.md",
      "prompt": "init.prompt.md",
      "toolset": "init.toolset.jsonc",
      "description": "Bootstrap environment and validate prerequisites",
      "displayName": "Initialization",
      "riskLevel": "low",
      "checkpoints": ["plan", "reflect"]
    },
    "features": {
      "instruction": "features.instructions.md",
      "prompt": "features.prompt.md",
      "toolset": "features.toolset.jsonc",
      "description": "Implement application logic with performance budgets",
      "displayName": "Features",
      "riskLevel": "medium",
      "checkpoints": ["plan", "implement", "reflect"]
    }
  }
}
```

### Customizing DevCycles

You can modify DevCycle behavior by editing the files:

1. **Edit the prompt** — Change how context is captured
2. **Edit the instruction** — Add domain rules
3. **Edit the toolset** — Enable/disable tools

Your changes are tracked in `.loaded-vibes/assets.json` for upgrade management.

→ **[Customization Guide](../guides/customization.md)**

---

## DevCycle Dependencies

Some DevCycles have implicit dependencies:

```
init ──────┬──▶ scaffold ──▶ config ──▶ verification
           │
           └──▶ (any DevCycle)

data ──────▶ auth ──────▶ features
                             │
testing ◀──────────────────┘
```

The orchestrator warns if dependencies aren't met:

```
⚠ Warning: Running 'auth' without 'data' completion.
  User models may not exist. Continue? [y/N]
```

---

## Viewing DevCycle History

```bash
# List recent runs
npx loaded-vibes logs --summary

# Output:
# DevCycle        Status    Duration  Time
# ───────────────────────────────────────────
# init            ✔ pass    9.3s      2h ago
# scaffold        ✔ pass    2m 14s    1h ago
# features        ✖ fail    4m 22s    30m ago

# View specific run
npx loaded-vibes logs --devcycle features --last 1
```

---

## Best Practices

### 1. Run in Order (First Time)

For new projects, follow the canonical order:

```bash
npx loaded-vibes devcycle init,scaffold,config,verification
```

### 2. Use Plan Mode First

For complex DevCycles, preview the plan:

```bash
npx loaded-vibes devcycle features --mode plan
```

### 3. Chain Related DevCycles

Group related work:

```bash
# Feature development flow
npx loaded-vibes devcycle features,testing,validation
```

### 4. Review Checkpoints

Don't rush through approvals. The checkpoints exist because:

- Plans might be wrong
- Destructive ops can't be undone
- Documentation should be accurate

### 5. Check Logs on Failure

```bash
npx loaded-vibes logs --devcycle features --severity error
```

---

## Next Steps

- **[Running DevCycles](../guides/running-devcycles.md)** — Detailed execution guide
- **[Customization](../guides/customization.md)** — Modifying DevCycle behavior
- **[Spec-Driven Workflow](./spec-driven-workflow.md)** — The underlying methodology

---

> "A DevCycle a day keeps the chaos away. Or at least documents it properly."
