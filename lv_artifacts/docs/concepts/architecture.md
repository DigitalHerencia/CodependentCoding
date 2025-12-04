# Architecture

> The three-layer model that keeps your code, framework, and runtime isolated.

---

## Overview

Loaded Vibes implements a **strict three-layer architecture** that prevents the chaos of mixed concerns. Each layer has clear boundaries, ownership rules, and communication protocols.

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEVELOPMENT LAYER                          │
│  (Maintainers Only - Framework Authoring)                      │
│  ├── .github/          ← Workspace governance                  │
│  ├── docs/             ← PRD, Tech Requirements                │
│  ├── spec/             ← Architecture specs                    │
│  └── templates/        ← Gold master assets                    │
├─────────────────────────────────────────────────────────────────┤
│                      FRAMEWORK LAYER                           │
│  (Shipped Product - dist/**)                                   │
│  ├── dist/.github/     ← User-facing Copilot assets            │
│  ├── dist/cli/         ← CLI commands                          │
│  ├── dist/genaiscript/ ← Orchestrator & phases                 │
│  └── dist/.loaded-vibes/← Shipped logs/state template          │
├─────────────────────────────────────────────────────────────────┤
│                      GENERATED LAYER                           │
│  (End User Projects)                                           │
│  ├── .loaded-vibes/    ← Runtime logs, state, manifests        │
│  ├── .github/          ← Mirrored Copilot assets               │
│  ├── .vscode/          ← Mirrored IDE config                   │
│  └── src/              ← Application code                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## The Three Layers

### 1. Development Layer (Maintainers Only)

> Where the framework is authored. You'll never see this unless you're contributing to Loaded Vibes itself.

**Contains:**

- PRD and Technical Requirements
- Architecture specifications
- Gold master templates
- Maintainer tooling

**Rules:**

- Only maintainers can edit
- Never imports from `dist/**`
- Changes flow through templates → shipped assets

### 2. Framework Layer (Shipped Product)

> The packaged framework delivered via `create-loaded-vibes`.

**Contains:**

- CLI implementation
- GenAIScript orchestrator
- Phase runners
- Copilot assets (prompts, instructions, toolsets)
- Default configurations

**Rules:**

- Immutable once released
- Downloaded as signed tarball
- SHA256 verified before extraction

### 3. Generated Layer (Your Project)

> Your project after Loaded Vibes installation.

**Contains:**

- `.loaded-vibes/` runtime directory
- Mirrored `.github/` assets
- Mirrored `.vscode/` settings
- Your application code in `src/`

**Rules:**

- Logs and state managed by framework
- Assets are customizable (with tracking)
- `src/` is entirely yours

---

## Layer Communication

Layers communicate through well-defined protocols:

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  Development │   →→→   │  Framework   │   →→→   │  Generated   │
│    Layer     │ publish │    Layer     │ install │    Layer     │
└──────────────┘         └──────────────┘         └──────────────┘
       ↓                        ↓                        ↓
   Templates              Signed Tarball           Your Project
   ADRs                   Orchestrator             Runtime State
   Specs                  CLI                      Logs
```

### Direction of Flow

| From                    | To                        | Mechanism                 |
| ----------------------- | ------------------------- | ------------------------- |
| Development → Framework | `templates/` regeneration | Maintainer DevCycles      |
| Framework → Generated   | `create-loaded-vibes`     | Installation              |
| Generated → Framework   | Never                     | One-way only              |
| Development → Generated | Never                     | Must go through Framework |

---

## Boundaries & Enforcement

### Import Rules

```javascript
// ❌ FORBIDDEN: Development importing from Framework
import { orchestrator } from '../dist/genaiscript/orchestrator';

// ❌ FORBIDDEN: Framework importing from Development
import { template } from '../templates/global_instructions.template.md';

// ✅ ALLOWED: Generated using Framework assets
// (happens via manifest resolution, not direct import)
```

### File System Rules

| Operation | Development       | Framework         | Generated                        |
| --------- | ----------------- | ----------------- | -------------------------------- |
| Read      | Own files + specs | Own files         | Own files + `.loaded-vibes/`     |
| Write     | Own files         | Via DevCycle only | `.loaded-vibes/` + `src/`        |
| Delete    | With approval     | Never             | `.loaded-vibes/logs/` (rotation) |

### The Bad Vibes Firewall

When an operation violates layer boundaries:

```
╭─────────────────────────────────────────────────────────────────╮
│                     ⚠️ BAD VIBES DETECTED                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Operation:   Write to dist/.github/global.instructions.md     │
│  Violation:   Framework layer is immutable                     │
│  Impact:      Would corrupt signed release                     │
│                                                                 │
│  Remediation Options:                                           │
│  1. Edit .github/global.instructions.md in your project        │
│  2. Fork and rebuild the framework                             │
│  3. Request change via GitHub Issue                            │
│                                                                 │
│  ┌────────────────┐  ┌────────────────┐                        │
│  │    Cancel      │  │  View Docs     │                        │
│  └────────────────┘  └────────────────┘                        │
╰─────────────────────────────────────────────────────────────────╯
```

---

## Directory Ownership Matrix

| Directory             | Layer       | Owner       | Purpose                |
| --------------------- | ----------- | ----------- | ---------------------- |
| `docs/`               | Development | Maintainers | PRD, Tech Requirements |
| `spec/`               | Development | Maintainers | Architecture specs     |
| `templates/`          | Development | Maintainers | Gold masters           |
| `.agent_work/`        | Development | Automation  | Scratch space          |
| `dist/.github/`       | Framework   | Release     | Shipped Copilot assets |
| `dist/cli/`           | Framework   | Release     | CLI implementation     |
| `dist/genaiscript/`   | Framework   | Release     | Orchestrator           |
| `dist/.loaded-vibes/` | Framework   | Release     | Shipped template       |
| `.loaded-vibes/`      | Generated   | Runtime     | User project state     |
| `.github/`            | Generated   | User        | Mirrored assets        |
| `src/`                | Generated   | User        | Application code       |

---

## Component Architecture

Within the Framework layer, components are organized by responsibility:

### Bootstrap Layer

```
dist/scripts/
├── bootstrapper.ps1          # PowerShell entry point
├── bootstrapper.genaiscript.ts # GenAIScript entry point
└── validators/               # Preflight checks
```

**Responsibilities:**

- Detect profile gaps
- Sync MCP and extensions
- Expose CLI entry points

### Orchestration Layer

```
dist/genaiscript/
├── orchestrator.genai.js     # Main orchestrator
├── devcycles.config.json     # Manifest
├── phases/                   # Phase runners
│   ├── init.genai.js
│   ├── scaffold.genai.js
│   └── ...
├── shared/                   # Utilities
│   └── contextLoader.js
└── tools/                    # Helpers
    ├── summaryWriter.js
    ├── todoUpdater.js
    └── changelogUpdater.js
```

**Responsibilities:**

- Load manifest
- Hydrate context
- Coordinate Analyze → Handoff lifecycle

### Governance Layer

```
dist/.github/
├── global.instructions.md    # Universal rules
├── agents/                   # Custom agents
├── prompts/                  # DevCycle prompts
├── instructions/             # DevCycle rules
└── toolsets/                 # Tool allowlists
```

**Responsibilities:**

- Define constraints
- Enforce acceptance criteria
- Control tool access

### CLI Layer

```
dist/cli/
├── commands/                 # CLI commands
│   ├── create.js
│   ├── dashboard.js
│   ├── devcycle.js
│   ├── doctor.js
│   └── logs.js
├── ui/                       # Ink components
│   ├── Dashboard.jsx
│   └── LogViewer.jsx
└── security/                 # Validation
    └── fileGuard.js
```

**Responsibilities:**

- User-facing interface
- Synthwave UI
- Security enforcement

---

## Data Flow

### DevCycle Execution

```
┌──────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────┐
│  Prompt  │ ──▶ │ Orchestrator │ ──▶ │ Phase Runner│ ──▶ │  Output  │
└──────────┘     └──────────────┘     └─────────────┘     └──────────┘
     │                  │                    │                  │
     ▼                  ▼                    ▼                  ▼
  Context           Manifest            Instruction          Logs
  Capture           Binding             Execution            State
                                                            TODO/CL
```

### State Persistence

```
DevCycle Run
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│  .loaded-vibes/state/state.json                            │
│  {                                                          │
│    "currentDevCycle": "features",                           │
│    "phase": "implement",                                    │
│    "checkpoints": ["plan-approved"],                        │
│    "context": { ... }                                       │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────────────────────────┐
│  .loaded-vibes/logs/features-20241128.ndjson                │
│  {"event":"start","phase":"implement",...}                  │
│  {"event":"tool-invoke","tool":"filesystem",...}            │
│  {"event":"complete","duration":1234,...}                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Validation & Enforcement

### CI Checks

The framework includes CI workflows that verify:

1. **No cross-layer imports** — `dist/` never references `docs/` or `templates/`
2. **Manifest coherence** — All prompt/instruction/toolset triples exist
3. **Checksum integrity** — Released assets match expected SHA256
4. **Ownership compliance** — Files exist in correct directories

### Runtime Checks

The `doctor` command validates:

1. **Prerequisites** — Node, Git, VS Code, GenAIScript
2. **MCP availability** — All configured servers respond
3. **File permissions** — Can write to `.loaded-vibes/`
4. **Drift detection** — Local vs. upstream checksums

---

## Why Three Layers?

### Separation of Concerns

| Layer       | Concern                    |
| ----------- | -------------------------- |
| Development | How the framework is built |
| Framework   | What the framework does    |
| Generated   | What the user builds       |

### Upgrade Safety

With clear boundaries:

- Framework updates don't overwrite user code
- User customizations are tracked and preserved
- Conflicts are detected, not silently merged

### Security Isolation

- Downloaded code is verified before execution
- Write operations are confined to allowed directories
- Destructive operations require explicit approval

---

## Next Steps

Now that you understand the architecture, explore:

- **[DevCycles](./devcycles.md)** — The 18 phases of development
- **[Spec-Driven Workflow](./spec-driven-workflow.md)** — The Analyze→Handoff loop
- **[Artifact Taxonomy](./artifacts.md)** — Prompts, instructions, toolsets

---

> "Any sufficiently separated architecture is indistinguishable from sanity."
> — Probably someone at 3 AM
