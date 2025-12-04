# Artifacts Reference

> Understanding prompts, instructions, and toolsets — the building blocks of DevCycles.

---

## Overview

Every DevCycle is composed of three artifact types that work together:

```
┌─────────────┐     ┌────────────────┐     ┌──────────┐
│   Prompt    │ ──▶ │  Instruction   │ ──▶ │ Toolset  │
│ (Entry)     │     │  (Rules)       │     │ (Tools)  │
└─────────────┘     └────────────────┘     └──────────┘
```

| Artifact        | Purpose                           | File Pattern                             |
| --------------- | --------------------------------- | ---------------------------------------- |
| **Prompt**      | Entry point, context capture      | `.github/prompts/*.prompt.md`            |
| **Instruction** | Domain rules, acceptance criteria | `.github/instructions/*.instructions.md` |
| **Toolset**     | Allowed operations, MCP servers   | `.github/toolsets/*.toolset.jsonc`       |

---

## Prompts

### Purpose

Prompts are the entry points for DevCycles. They:

- Define the objective
- Capture environment context
- Reference the instruction and toolset
- Trigger the orchestrator

### Location

```
.github/prompts/
├── init.prompt.md
├── scaffold.prompt.md
├── features.prompt.md
└── ...
```

### Structure

```markdown
---
description: One-line description of the DevCycle
instruction: features.instructions.md
toolset: features.toolset.jsonc
---

# DevCycle Name

Brief description of what this DevCycle accomplishes.

## Context Capture

Variables and environment context to capture.

## Trigger Conditions

WHEN triggered, THE SYSTEM SHALL:

1. First action
2. Second action
3. ...

## Success Criteria

What defines successful completion.
```

### Example: Features Prompt

```markdown
---
description: Implement application features with performance budgets
instruction: features.instructions.md
toolset: features.toolset.jsonc
---

# Features DevCycle

Implement application logic based on PRD requirements.

## Context Capture

- `env.vars.prd` — Current PRD content
- `env.vars.techReq` — Technical requirements
- `env.vars.todoItems` — Active TODO items

## Trigger Conditions

WHEN triggered, THE SYSTEM SHALL:

1. Load PRD feature requirements
2. Analyze existing codebase structure
3. Generate implementation plan
4. Execute with performance budgets
5. Validate against acceptance criteria
6. Update TODO.md and CHANGELOG.md

## Success Criteria

- All acceptance criteria met
- Test coverage ≥ 80%
- No linting errors
- Performance budgets respected
```

### Best Practices

1. **Keep prompts focused** — One DevCycle, one prompt
2. **Reference correctly** — Ensure instruction/toolset paths are accurate
3. **Use EARS notation** — For trigger conditions
4. **Be specific** — About success criteria

---

## Instructions

### Purpose

Instructions define the domain-specific rules for a DevCycle:

- Acceptance criteria
- Security guardrails
- Performance budgets
- Coding conventions
- Documentation requirements

### Location

```
.github/instructions/
├── init.instructions.md
├── scaffold.instructions.md
├── features.instructions.md
└── ...
```

### Structure

```markdown
---
description: Domain rules for [DevCycle Name]
applyTo: '[DevCycle]'
---

# [DevCycle] Instructions

## Objectives

What this DevCycle should accomplish.

## Acceptance Criteria

- Specific, testable criteria
- Written in EARS notation

## Security Guardrails

Rules for safe operation.

## Performance Budgets

Limits and thresholds.

## Conventions

Coding and documentation standards.

## TODO/CHANGELOG Requirements

How to update documentation.
```

### Example: Features Instructions

```markdown
---
description: Domain rules for Features DevCycle
applyTo: 'features'
---

# Features DevCycle Instructions

## Objectives

Implement application features from PRD requirements with clean, testable code.

## Acceptance Criteria

- WHEN implementing a component, THE SYSTEM SHALL:

  - Keep components under 200 lines
  - Use TypeScript strict mode
  - Include JSDoc comments for public APIs

- WHEN creating server actions, THE SYSTEM SHALL:

  - Validate all inputs with Zod
  - Include error handling
  - Log operations for observability

- WHEN writing tests, THE SYSTEM SHALL:
  - Achieve ≥80% coverage
  - Test happy path and error cases
  - Use meaningful test descriptions

## Security Guardrails

- NEVER expose internal IDs in URLs
- ALWAYS validate user input
- NEVER store secrets in code
- ALWAYS use parameterized queries

## Performance Budgets

| Metric              | Budget  |
| ------------------- | ------- |
| Initial bundle      | < 200KB |
| Time to Interactive | < 3s    |
| Component render    | < 16ms  |
| API response        | < 200ms |

## Conventions

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Tests: `*.test.ts` or `*.spec.ts`

### Code Style

- Use functional components
- Prefer composition over inheritance
- Extract reusable logic to hooks
- Keep side effects at edges

## TODO/CHANGELOG Requirements

After completing features:

1. Mark relevant TODO items as complete
2. Add entry to CHANGELOG under `### Added`
3. Reference PRD requirement IDs
```

### Best Practices

1. **Be specific** — Vague rules are useless
2. **Use EARS** — For testable criteria
3. **Include examples** — Show, don't just tell
4. **Stay maintainable** — Update when rules change

---

## Toolsets

### Purpose

Toolsets define what operations are allowed during a DevCycle:

- MCP servers
- VS Code commands
- CLI tools
- Path restrictions
- Approval requirements

### Location

```
.github/toolsets/
├── init.toolset.jsonc
├── scaffold.toolset.jsonc
├── features.toolset.jsonc
└── ...
```

### Schema

```jsonc
{
  "$schema": "../schemas/toolset.schema.json",
  "name": "toolset-name",
  "description": "What this toolset enables",
  "tools": {
    "mcpServers": ["list", "of", "servers"],
    "vscodeCommands": ["list.of.commands"],
    "cliCommands": ["list", "of", "cli", "tools"],
    "destructive": false,
    "requiresApproval": ["dangerous.operations"]
  },
  "constraints": {
    "maxFileSize": "1MB",
    "allowedPaths": ["src/**"],
    "blockedPaths": ["node_modules/**"]
  }
}
```

### Example: Features Toolset

```jsonc
{
  "$schema": "../schemas/toolset.schema.json",
  "name": "features",
  "description": "Tools for implementing application features",

  "tools": {
    "mcpServers": [
      "filesystem", // Read/write files
      "git", // Version control
      "memory", // Session state
      "postgres", // Database operations
      "sequentialthinking" // Reasoning
    ],

    "vscodeCommands": [
      "workbench.action.files.save",
      "editor.action.formatDocument",
      "editor.action.organizeImports",
      "workbench.action.terminal.runSelectedText"
    ],

    "cliCommands": ["pnpm", "npx", "prisma", "vitest", "eslint", "prettier"],

    "destructive": false,
    "requiresApproval": ["prisma db push", "prisma migrate reset", "rm -rf"]
  },

  "constraints": {
    "maxFileSize": "1MB",
    "allowedPaths": ["src/**", "prisma/**", "public/**", "__tests__/**"],
    "blockedPaths": [".loaded-vibes/**", "node_modules/**", ".git/**", ".env*"]
  }
}
```

### MCP Servers Reference

| Server               | Purpose          | Common DevCycles     |
| -------------------- | ---------------- | -------------------- |
| `filesystem`         | Read/write files | All                  |
| `git`                | Version control  | All                  |
| `memory`             | Session state    | All                  |
| `postgres`           | Database ops     | data, auth, features |
| `github`             | GitHub API       | cicd, deploy, review |
| `fetch`              | HTTP requests    | features, deploy     |
| `sequentialthinking` | Reasoning        | complex DevCycles    |
| `playwright`         | Browser testing  | test, perf           |

### Best Practices

1. **Least privilege** — Only enable needed tools
2. **Explicit approvals** — For destructive operations
3. **Path restrictions** — Block sensitive directories
4. **Document constraints** — Explain why restrictions exist

---

## Artifact Relationships

### Dependency Chain

```
┌─────────────────────────────────────────────────────────────────┐
│                        Manifest                                 │
│                 (devcycles.config.json)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Prompt                                  │
│              (captures context, triggers cycle)                 │
│                              │                                  │
│   References: instruction: "xxx.md", toolset: "xxx.jsonc"       │
└─────────────────────────────────────────────────────────────────┘
                     │                    │
                     ▼                    ▼
┌────────────────────────────┐  ┌────────────────────────────────┐
│       Instruction          │  │           Toolset              │
│   (domain rules)           │  │    (allowed operations)        │
└────────────────────────────┘  └────────────────────────────────┘
```

### Validation Rules

The orchestrator validates before execution:

1. ✓ Prompt exists and is valid Markdown
2. ✓ Instruction file referenced by prompt exists
3. ✓ Toolset file referenced by prompt exists
4. ✓ Toolset JSON is valid
5. ✓ MCP servers in toolset are available
6. ✓ Manifest entry matches file triplet

---

## Customization

### Modifying Prompts

To change how a DevCycle captures context:

```bash
# Edit the prompt
code .github/prompts/features.prompt.md

# Your changes are tracked in assets.json
npx loaded-vibes doctor --check assets
```

### Modifying Instructions

To add domain rules:

```bash
# Edit the instruction file
code .github/instructions/features.instructions.md
```

### Modifying Toolsets

To enable/disable tools:

```bash
# Edit the toolset
code .github/toolsets/features.toolset.jsonc
```

### Upgrade Impact

| Change               | Upgrade Behavior        |
| -------------------- | ----------------------- |
| Prompt modified      | Merge conflict possible |
| Instruction modified | Merge conflict possible |
| Toolset modified     | Merge conflict possible |
| New DevCycle added   | Added automatically     |
| DevCycle removed     | Orphaned (kept locally) |

---

## Creating Custom Artifacts

### New DevCycle

1. **Create the prompt:**

```bash
touch .github/prompts/custom.prompt.md
```

```markdown
---
description: My custom DevCycle
instruction: custom.instructions.md
toolset: custom.toolset.jsonc
---

# Custom DevCycle

...
```

2. **Create the instruction:**

```bash
touch .github/instructions/custom.instructions.md
```

3. **Create the toolset:**

```bash
touch .github/toolsets/custom.toolset.jsonc
```

4. **Add to manifest:**

```json
{
  "devCycles": {
    "custom": {
      "instruction": "custom.instructions.md",
      "prompt": "custom.prompt.md",
      "toolset": "custom.toolset.jsonc",
      "description": "My custom DevCycle",
      "displayName": "Custom",
      "riskLevel": "low",
      "checkpoints": ["plan", "reflect"]
    }
  }
}
```

5. **Validate:**

```bash
npx loaded-vibes doctor --check manifest
```

---

## Troubleshooting

### "Prompt not found"

```bash
# Check file exists
ls .github/prompts/

# Check manifest reference
cat .github/devcycles.config.json | jq '.devCycles.init'
```

### "Toolset validation failed"

```bash
# Validate JSON syntax
npx jsonlint .github/toolsets/features.toolset.jsonc

# Check schema compliance
npx ajv validate -s schemas/toolset.schema.json -d .github/toolsets/features.toolset.jsonc
```

### "MCP server not available"

```bash
# Check MCP config
cat .vscode/mcp.json

# Test server
npx @anthropic/mcp-filesystem --help
```

---

## Next Steps

- **[Customization Guide](../guides/customization.md)** — Detailed customization
- **[DevCycles](../concepts/devcycles.md)** — Understanding phases
- **[Configuration](./configuration.md)** — Config reference

---

> "An artifact is just a file until someone reads it. Then it's a bug waiting to happen."
