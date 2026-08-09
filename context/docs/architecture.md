---
title: Loaded Vibes Generator Architecture
artifact: architecture
status: approved-governance
product: Loaded Vibes
authority: source-of-truth
---

# Loaded Vibes Generator Architecture

## 1. System context

Loaded Vibes governs two systems:

1. the **generator product**, which interprets bounded creation intent and materializes a repository;
2. the **generated SaaS product**, which implements the Loaded Vibes WebApp Architecture.

They must not be conflated.

```text
User / Codex / package manager
            |
            v
    create-loaded-vibes CLI
            |
            v
 normalized configuration
            |
            v
 generation plan + preflight
            |
            v
 canonical template + approved modules
            |
            v
 staged generated repository
            |
            v
 install / git / validation lifecycle
            |
            v
 accepted golden SaaS prototype
```

## 2. Generator grammar

```text
CLI collects.
Config normalizes.
Preflight protects.
Planner decides files.
Materializer writes.
Transforms specialize.
Lifecycle installs and validates.
Evidence reports.
```

Every source file has one primary role.

## 3. Dependency direction

```text
cli/commands
  -> prompts
  -> config
  -> preflight
  -> generator
  -> lifecycle

generator
  -> config + safe filesystem utilities

lifecycle
  -> config + subprocess adapters + generated project

template
  X must not import generator runtime
```

Prohibited:

- prompt UI owning generation decisions;
- lifecycle code mutating application architecture;
- template source importing generator internals;
- module code bypassing the generation planner;
- shell-string execution of user-controlled values;
- generated application runtime depending on the generator package.

## 4. Canonical template boundary

`template/` becomes the one runnable source used for generated applications after Vibes absorption.

Rules:

- canonical application changes are made once in `template/`;
- generator tests instantiate the same source;
- no duplicate golden fixture may become a competing template;
- reference/workbench material is explicitly classified;
- every excluded Vibes artifact has an intentional disposition;
- provenance records the absorbed Vibes revision and later template revisions.

## 5. Generation plan

The planner produces complete intended output before irreversible mutation.

Conceptual plan:

```text
GenerationPlan
- target
- project identity
- preset
- selected modules
- template revision
- file copy set
- excluded paths
- structured transforms
- package changes
- environment-example changes
- validation gates
- provenance
```

`--dry-run` renders this plan without creating the target.

## 6. Configuration boundary

Prompts and flags are adapters over one configuration domain model.

The config schema owns:

- defaults;
- supported choices;
- compatibility;
- unknown-field behavior;
- serialization.

No prompt may expose a choice not supported by the schema and generated-output matrix.

## 7. Staging and rollback

```text
preflight
-> create sibling temp directory
-> materialize template
-> transform
-> module composition
-> structural validation
-> promote to target
-> install
-> git
-> generated-project acceptance
```

Failure before promotion deletes run-owned staging safely.

Failure after promotion reports incomplete state. V1 rejects pre-existing non-empty targets, so ownership of newly created output is unambiguous.

Never recursively delete paths the run did not create.

## 8. Project identity transforms

Identity transforms are explicit and structured.

Expected surfaces include:

- `package.json` name;
- canonical README/project title;
- generated provenance;
- explicitly designated metadata/config.

Do not rename domain concepts, route names, env names, authorization nouns, database entities, or provider contracts merely because they resemble a template name.

## 9. Optional module architecture

Do not build a general plugin system in the base release.

An optional module declares:

```text
Module
- id/version
- requires
- conflicts
- file contributions
- structured transforms
- dependencies
- env-example additions
- Prisma/migration contributions
- provider/webhook contributions
- docs/governance contributions
- validation additions
- removal proof
```

The first module proves this contract before further abstraction.

## 10. Generated application architecture

Generated output preserves:

```text
Routes adapt.
Features orchestrate.
Components render.
Fetchers read.
Actions write.
Schemas validate.
Authorization decides.
Transactions preserve invariants.
Webhooks reconcile external truth.
```

Canonical ownership:

- `app/`: routes/layouts/HTTP;
- `features/`: use-case/presentation orchestration;
- `components/`: presentation only;
- `lib/fetchers/`: authenticated/authorized reads;
- `lib/actions/`: thin mutation adapters;
- `lib/<domain>/workflows/`: use-case sequence;
- `lib/auth/`, `lib/authz/`: identity adaptation and local policy;
- `lib/db/`: selects, DTOs, queries/commands, transactions, Prisma boundary;
- `lib/integrations/`: provider SDK boundary;
- `lib/webhooks/`: durable verified reconciliation;
- `schemas/`: runtime trust-boundary validation;
- `types/`: stable transport/shared contracts;
- `prisma/`: schema, migrations, grants, RLS;
- `context/`, `.agents/`, `AGENTS.md`: downstream governance.

## 11. Trust boundaries

### Generator

Untrusted:

- CLI arguments;
- config-file content;
- destination path;
- environment state;
- subprocess exits/output;
- filesystem collisions.

Trusted but versioned:

- embedded template;
- repository-owned modules;
- generator source.

Rules:

- validate config with Zod;
- never interpolate user values into shell strings;
- reject unsafe destinations;
- never source arbitrary remote executable templates in V1;
- never ingest secrets.

### Generated application

Retains Clerk identity, local authorization, tenant/RLS, Zod, provider isolation, DTO, transaction, and webhook boundaries from canonical doctrine.

## 12. Provenance

Generated output contains stable `.loaded-vibes.json` with:

- schema version;
- generator version;
- template revision;
- preset;
- enabled modules;
- normalized non-secret product config.

No timestamp is required for canonical determinism.

## 13. Validation architecture

Two independent subjects must be proven.

### Generator correctness

Parsing, normalization, planning, safe materialization, transforms, rollback, packaging, determinism.

### Generated-project correctness

The output itself satisfies the canonical application gate.

Generator tests cannot substitute for output execution.

## 14. Release boundary

The repository release creates an npm package.

The package creates repositories.

V1 does not deploy generated repos or provision providers.

## 15. Durable-decision triggers

Require an explicit durable decision when changing:

- package/command identity;
- template source boundary;
- config schema compatibility;
- supported package manager;
- module model;
- determinism rules;
- overwrite behavior;
- provider provisioning;
- auto-deployment;
- generated application architecture/security invariants.
