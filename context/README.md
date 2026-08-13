# Hipster Stack Context

This directory tells Codex what Hipster Stack™ is, which contracts control this repository, and what active work remains.

## Product

Hipster Stack is an opinionated project initializer and deterministic application-constitution tool for modern TypeScript web applications built according to the Codependent Coding™ Knowledge System and the established WebApp architecture.

Its payoff is a standalone white-label repository that already contains the recurring architecture, boundaries, integrations, structure, tests, and development context the user would otherwise recreate by hand.

The CLI is the primary local execution adapter. The web app has four coherent branded surfaces:

```text
Product      /
Simples™     /libraries/*
Docs         /docs/*
Constituter™ /configure
```

Simples and Constituter are presentation vocabulary over existing route/application semantics. Constituter, CLI, and the portable configuration file must continue to use the same shared configuration authority.

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

The repository contains historical Loaded Vibes product/package identifiers that HS-302 will rename deliberately. The owner has already locked the pre-Codex web brand baseline: Product/Simples/Docs/Constituter vocabulary, semantic Tailwind v4 color/type tokens, mobile-first responsive overrides, supplied Crown/Banner/Desert assets, and required public copy. HS-303..HS-307 complete the mockup-faithful implementation without reopening unrelated generator migration work.

## Source map

- Product/architecture: `context/docs/product.md`, `architecture.md`, `configuration.md`, `template.md`, `generator-cli.md`
- Web/docs: `context/docs/web.md`, `documentation.md`, `context/mockups/`
- Machine boundaries: `.agents/contracts/product.yaml`, `.agents/contracts/architecture.yaml`
- Roadmap: `context/specs/README.md` and active `HS-*` specs

## Working rule

Make the real product look and operate like the approved mockups with the fewest correct edits. Read only active scope, preserve working semantics and the owner-approved brand baseline, remove replaced code, and do not let governance become a second software project.
