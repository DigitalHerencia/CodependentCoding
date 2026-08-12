# Loaded Vibes Governance Directory

Loaded Vibes is a developer-focused software factory: one repository-owned maximal white-label Hipster Stack template, one deterministic generation engine, one shared configuration contract, a CLI execution surface, a stateless visual Builder, browsable product Libraries, and end-user documentation.

This file is the governance directory. Read only the material relevant to the work in front of you.

## Authority

1. The GitHub Issue defines the current unit of work.
2. `context/specs/LV-*.md` defines the durable implementation scope for that Issue.
3. `context/docs/*.md` defines the human-readable product and architecture contract.
4. `.agents/contracts/*.yaml` encodes compact machine-readable boundaries derived from the controlling docs.
5. The implementation and live repository state establish what currently exists.
6. DevNotes is the canonical authority for Hipster Stack engineering doctrine.
7. `.agents/execution/*.json` records decisions, progress, and handoff state. Execution state never overrides the sources above.

When two sources conflict, do not invent a compromise. Prefer the higher authority and update stale lower-level governance as part of the same focused change when required.

## Read by task

### Any implementation Issue

Read:

1. this file;
2. `context/README.md`;
3. the matching `context/specs/LV-*.md`;
4. only the `context/docs/*` files named by that spec;
5. only the `.agents/contracts/*` files named by that spec;
6. the actual files being changed.

Do not inventory the entire repository again once the active spec identifies the relevant surface. Expand context only when an actual import, contract, failing check, or acceptance criterion requires it.

### Master template work

Read:

- `context/docs/template.md`
- `context/docs/architecture.md`
- `context/docs/repository-transition.md`
- `.agents/contracts/architecture.yaml`
- `.agents/contracts/transition.yaml`
- the relevant Hipster Stack references in DevNotes

### Generator or configuration work

Read:

- `context/docs/configuration.md`
- `context/docs/generator-cli.md`
- `context/docs/architecture.md`
- `.agents/contracts/product.yaml`
- `.agents/contracts/architecture.yaml`

### Website work

Read:

- the matching web spec first;
- `context/docs/web.md`;
- `context/docs/product.md` only when the spec names it;
- `context/docs/configuration.md` only when changing Builder semantics;
- `.agents/contracts/product.yaml`;
- the local `context/mockups/` subject named by the spec;
- only the affected `apps/web` files plus directly imported core/schema files needed to verify semantics.

`context/docs/web.md` already reconciles the applicable Codependent Coding / Loaded Vibes presentation and layer rules for this website. Do not repeatedly crawl CodependentCoding, DevNotes, `template/`, or unrelated generator internals during each visual Issue unless a concrete contradiction or missing semantic requires it.

### End-user documentation work

Read:

- `context/docs/documentation.md`
- `context/docs/product.md`
- the relevant docs spec

### Release and cleanup work

Read:

- `context/docs/repository-transition.md`
- `context/docs/release.md`
- `.agents/contracts/transition.yaml`

## Product model

```text
DevNotes
Hipster Stack doctrine
        │
        ▼
Loaded Vibes
repository-owned maximal template
        │
        ├──────────────┐
        │              │
        ▼              ▼
shared config      website Builder
schema/core             │
        │               │
        ├──────┬────────┘
        │      │
        ▼      ▼
       CLI  loadedvibes.json
        │      │
        └──┬───┘
           ▼
deterministic retain/remove + transforms
           │
           ▼
generated white-label application
           │
           ▼
Codependent Coding may take product-specific work further
```

Loaded Vibes does not depend on the Vibes repository. Loaded Vibes owns the executable template. DevNotes owns the engineering doctrine. Codependent Coding is downstream and is not a runtime or generation dependency.

## Fixed foundation

Do not ask users to choose architecture that Loaded Vibes has already decided.

The fixed foundation includes the supported repository-local implementation of:

- TypeScript;
- Next.js App Router;
- React Server Components by default;
- pnpm;
- Zod;
- Prisma;
- Neon/PostgreSQL;
- Clerk identity/session boundaries;
- application-owned users, organizations, memberships, roles/capabilities, and tenant authorization;
- RLS where the template uses it for tenant containment;
- Fetchers;
- Server Actions;
- Workflows;
- Transactions;
- Selects and DTO mappers;
- Integration Adapters;
- Webhook processors;
- shadcn-compatible presentation primitives;
- the Hipster Stack route → feature → presentation layering;
- the auth/authz and server-operation boundaries;
- Vercel-oriented deployment assumptions.

## Configurable surface

Expose a choice only when Loaded Vibes can produce the corresponding output correctly.

Useful configuration may include:

- project identity and destination;
- product identity;
- optional integrations;
- optional route groups or route surfaces;
- optional reusable product capabilities;
- bounded visual direction;
- install and git-init behavior;
- other configuration explicitly backed by template ownership and generator behavior.

Do not create decorative toggles that only change recipe metadata.

## Repository target

```text
LoadedVibes/
├── apps/
│   └── web/
├── packages/
│   ├── cli/
│   ├── core/
│   └── schema/
├── template/
├── docs/
├── context/
│   ├── docs/
│   └── specs/
├── .agents/
│   ├── contracts/
│   └── execution/
├── scripts/
├── .github/
└── AGENTS.md
```

`packages/recipes`, `templates/golden`, and `templates/modules` were migration-era structures and must not be reintroduced.

## Working rules

- Work one GitHub Issue/spec at a time.
- Make the smallest complete change that reaches the Issue outcome.
- Treat current mockups as visual acceptance artifacts where the active web spec says so; reproduce their design faithfully while adapting literal labels/content only when required for truthful product behavior.
- Preserve working code unless the Issue explicitly requires changing its ownership or location.
- Delete replaced UI/CSS/helpers after their last caller is gone; do not leave parallel old/new implementations.
- Do not redesign the Hipster Stack doctrine inside this repo.
- Do not invent modules, providers, routes, or architecture that the repository does not support.
- Do not create a generic framework generator, provider marketplace, hosted control plane, or enterprise governance product.
- Do not create new tests or validation systems unless a future Issue explicitly asks for them.
- Use existing checks only when they directly establish behavior changed by the current Issue.
- Never claim a check ran if it did not.
- Never collect, print, copy, or commit provider secrets.
- Keep Windows/PowerShell first-class.
- Keep the web Builder stateless unless a future product decision explicitly changes that.
- Keep the CLI and web Builder as adapters over the same core configuration semantics.
- Do not reintroduce `DigitalHerencia/Vibes` as an upstream, source, sync target, reference dependency, or provenance dependency.

## Delivery

For implementation work:

1. create or use the GitHub Issue corresponding to the active spec;
2. implement the Issue on a focused branch;
3. use proportional existing verification;
4. open a focused PR linked to the Issue;
5. update durable governance only if the product or architecture contract changed;
6. merge when the Issue's actual acceptance criteria are satisfied.

Governance exists to help ship Loaded Vibes. It is not the product.
