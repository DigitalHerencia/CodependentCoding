# Loaded Vibes Governance Context

This directory is the human-readable governance surface for the Loaded Vibes generator.

## Authority

1. `context/docs/` owns durable human intent and product truth.
2. `context/specs/` decomposes that truth into bounded implementation work suitable for GitHub Issues and Codex tasks.
3. `.agents/contracts/` encodes deterministic subsets that can be mechanically validated.
4. `.agents/execution/` records mutable execution state and evidence. It is not architectural authority.

Implementation and tests are evidence. They do not silently override the governing docs.

## Reading order

1. `context/docs/prd.md`
2. `context/docs/tech-req.md`
3. `context/docs/architecture.md`
4. `context/docs/design.md`
5. `context/docs/auth.md`
6. `context/specs/README.md`
7. active specification
8. `.agents/contracts/*.yaml`
9. `.agents/execution/*.json`

## Product relationship

Loaded Vibes owns the deterministic starting state of a SaaS project.

It generates the canonical Loaded Vibes WebApp Architecture implemented with the Hipster Stack. Product-specific feature implementation after generation belongs to Codependent Coding, not to the generator.

## Source authority

When repository evidence conflicts, use this order:

1. explicit current user instruction;
2. current DevNotes Loaded Vibes project source-of-truth;
3. canonical Codependent Coding Knowledge System / Hipster Stack doctrine in DevNotes;
4. these Loaded Vibes governance docs;
5. the canonical template source embedded in this repository;
6. current official platform/tool documentation;
7. comparative generator implementations;
8. deprecated LoadedVibes implementation.

Any contradiction between equal or higher authority must be resolved before implementation.
