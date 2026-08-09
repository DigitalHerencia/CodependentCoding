# Loaded Vibes Context

This directory tells Codex what Loaded Vibes is building and why.

## Product definition

Loaded Vibes is an opinionated SaaS generator focused on developer and end-user experience. It combines a fast interactive CLI, a reusable recipe engine, a repository-owned maximal application template, product presets, design personalization, and a stateless visual configurator.

The generator should feel much simpler than the SaaS architecture it produces.

## Sources

- `context/docs/prd.md` — product outcome and scope
- `context/docs/architecture.md` — generator architecture and repository shape
- `context/docs/design.md` — CLI and web configurator experience
- `context/docs/tech-req.md` — implementation baseline and dependencies
- `context/docs/auth.md` — security/provider boundary
- `context/specs/` — issue-sized implementation slices
- `.agents/contracts/` — compact machine-readable fixed boundaries

## Template and doctrine authority

Loaded Vibes is the sole owner and source of its packaged application template. Canonical Hipster Stack material in DevNotes governs reusable engineering doctrine; no external application repository participates in generation, packaging, release, or maintenance.

## Working rule

The roadmap exists to ship a useful generator. Governance is supporting context, not the product.
