# Hipster Stack Governance Directory

Hipster Stack™ is the opinionated project initializer implemented in this repository: one repository-owned maximal white-label application, one deterministic composition/generation engine, one shared configuration contract, a CLI execution surface, a stateless visual Builder, and interactive end-user documentation.

This file is the governance directory. Read only the material relevant to the active Issue.

## Authority

1. The current GitHub Issue defines the unit of work.
2. The matching `context/specs/HS-*.md` defines durable implementation scope for new work. Historical `LV-*` specs remain provenance, not current direction unless an Issue explicitly names one.
3. `context/docs/*.md` defines human-readable product and architecture contracts.
4. `.agents/contracts/*.yaml` encodes compact deterministic boundaries derived from the controlling docs.
5. The live repository establishes current implementation state.
6. The Codependent Coding™ Knowledge System in DevNotes is the canonical reusable engineering authority.
7. `.agents/execution/*.json` records operational state and never overrides canon.

When sources conflict, do not invent a compromise. Prefer the higher authority and update stale lower-level governance as part of the focused change when required.

## Ecosystem boundary

```text
Codependent Coding Knowledge System
  reusable engineering doctrine
        │
        ▼
Hipster Stack
  deterministic application composition
        │
        ▼
standalone generated application
        │
        ▼
Loaded Vibes
  adaptive specification-driven development
        │
        ▼
product-specific MVP
```

Hipster Stack owns deterministic generation and the executable template. Codependent Coding owns reusable knowledge. Loaded Vibes is downstream adaptive tooling and is not a generation/runtime dependency.

## Engineering grammar

The generated application and this repository follow the applicable subset of the canonical method:

> Routes adapt. Features orchestrate. Components render. Fetchers read. Actions write. Schemas validate. Authorization decides. Transactions preserve invariants. Webhooks reconcile external truth.

Apply the grammar proportionally. Static website presentation does not need ceremonial fetchers/actions/workflows.

## Fixed method, configurable composition

The opinionated foundation is the engineering method, responsibility boundaries, trust model, and supported architecture. Concrete providers, modules, capabilities, route surfaces, or policies become editable only when the shared schema and generator can produce the corresponding repository correctly.

Never expose a decorative option that only changes metadata. Current implementation constraints remain real until an implementation Issue changes them.

## Template boundary

`template/` is the standalone maximal white-label application. It must make sense if extracted from this monorepo.

Generator-specific ownership catalogs, pruning rules, Builder state, CLI implementation, and generation instructions belong outside `template/`. Application-local context, tests, CI, and agent contracts may remain when they govern the standalone application itself.

## Read by task

### Any implementation Issue

Read:

1. this file;
2. `context/README.md`;
3. the matching active spec;
4. only docs/contracts named by that spec;
5. only actual files being changed and direct imports needed to satisfy acceptance.

Do not inventory the whole repository once the spec identifies the surface.

### Website work

Read the active web spec first, then `context/docs/web.md`, the named mockup(s), and only affected `apps/web` files plus directly required shared configuration code. The mockups control presentation; repository-supported behavior controls semantics.

### Generator/configuration work

Read `context/docs/configuration.md`, `context/docs/generator-cli.md`, `context/docs/architecture.md`, `.agents/contracts/product.yaml`, and `.agents/contracts/architecture.yaml`.

### Template work

Read `context/docs/template.md`, `context/docs/architecture.md`, the relevant machine contract, and only the required Codependent Coding/Hipster Stack references from DevNotes.

## Web-overhaul rules

- Current mockups in `context/mockups/` are visual acceptance artifacts.
- Reproduce their structure, hierarchy, density, spacing, and Hipster Stack/Digital Herencia aesthetic faithfully; adapt literal labels only when needed for truthful behavior.
- Primary navigation target is `Product | Docs | Builder`; the old Libraries surface folds into interactive Docs with minimal compatibility redirects.
- Use actual locally owned BoldKit source for UI primitives and selected blocks; BoldKit is an implementation source, not visual authority.
- TanStack may inform compact interaction hierarchy, inspectable configuration, and generated-plan ergonomics only. Do not copy its visual design or introduce unrelated TanStack technology.
- Keep the Builder stateless and over the same shared configuration semantics as CLI/config file.
- Delete replaced UI/CSS/helpers after their final caller is gone.
- Do not add a backend, CMS, hosted generator, analytics project, visual-regression harness, or broad design-system abstraction merely to reproduce the mockups.

## Delivery

Work one Issue/spec at a time on a short-lived Issue branch. Make the smallest complete change, run only focused existing checks named by the spec, open an Issue-linked PR, delete replaced code, and report executed/skipped/blocked validation truthfully. Merge only when actual acceptance and required CI are satisfied.

Governance exists to reduce ambiguity and token use. It is not the product.
