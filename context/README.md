# Hipster Stack Context

This directory tells Codex what Hipster Stack™ is, which contracts control this repository, and what active work remains.

## Product

Hipster Stack is an opinionated project initializer and deterministic application-composition tool for modern TypeScript web applications built according to the Codependent Coding™ Knowledge System and the established WebApp architecture.

Its payoff is a standalone white-label repository that already contains the recurring architecture, boundaries, integrations, structure, tests, and development context the user would otherwise recreate by hand.

The CLI is the primary local execution adapter. The web app has three coherent surfaces:

```text
Product   /
Docs      /docs/*      # canonical docs + interactive building-block/config views
Builder   /configure
```

The Builder, CLI, and portable configuration file must use the same shared semantics.

## Ecosystem

```text
Codependent Coding Knowledge System
        ↓
Hipster Stack generator
        ↓
standalone generated application
        ↓
Loaded Vibes adaptive spec-driven tool
        ↓
product-specific MVP
```

The Knowledge System is authority, not a runtime dependency. Hipster Stack deterministically materializes the starting application. Loaded Vibes may later adapt that application through governed specifications and agents.

## Current implementation versus approved direction

The live repository still contains historical Loaded Vibes product/package identifiers and the completed LV-201..LV-210 implementation. HS-301..HS-307 are the approved next roadmap and intentionally reconcile that state without pretending the rename/redesign already exists.

Do not reopen unrelated generator migration work during the web overhaul. Change non-web behavior only when the active HS spec explicitly requires it.

## Source map

- Product/architecture: `context/docs/product.md`, `architecture.md`, `configuration.md`, `template.md`, `generator-cli.md`
- Web/docs: `context/docs/web.md`, `documentation.md`, `context/mockups/`
- Machine boundaries: `.agents/contracts/product.yaml`, `.agents/contracts/architecture.yaml`
- Roadmap: `context/specs/README.md` and active `HS-*` specs

## Working rule

Make the real product look and operate like the approved mockups with the fewest correct edits. Read only active scope, preserve working semantics, remove replaced code, and do not let governance become a second software project.
