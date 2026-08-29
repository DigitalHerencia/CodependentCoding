---
name: loaded-vibes-inspect
description: Inspect an Arrangement repository before substantial implementation, debugging, review, or planning. Use when Codex needs to map repository-local instructions, generated provenance, architecture ownership, affected files, tests, providers, tenancy/security boundaries, and current Git state without changing code.
---


# Loaded Vibes: Inspect

Inspect the actual repository before substantial work. Do not create ceremony or documentation unless the user asked for it.

1. Read repository-local `AGENTS.md` / scoped instructions first.
2. Run `scripts/inspect-arrangement.mjs` from this skill when useful.
3. Read generation provenance (`hipsterstack.json`, `.hipsterstack/manifest.json`) when present.
4. Map the request to the architecture classifier and identify likely owners.
5. Search direct dependencies, tests, similar local patterns, provider boundaries, and Git state.
6. Distinguish normative architecture from observed repository state. Do not silently “fix” divergence before understanding whether it is intentional/stale.
7. Return a compact context map: files, ownership, dependencies, risks, validation candidates, unresolved blockers.

Read `references/architecture-classifier.md` and `references/provenance.md` when classification or generated provenance matters.
