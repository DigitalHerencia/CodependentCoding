---
title: The Hipster Stack™ CLI and Generator — Contract
type: execution-contract
scope: generation-system
project: Codependent Coding
domain: hipster-stack
artifact: cli-generator-contract
namespace: codependentcoding.hipster-stack.cli-generator
status: active
authority: canonical
created: 2026-08-22
updated: 2026-08-22
---

# The Hipster Stack™ CLI and Generator Contract

# 1. Public CLI

```text
hipster-stack create [directory]
hipster-stack add <supported-surface>
hipster-stack explain
hipster-stack doctor
```

Portable configuration:

```text
hipsterstack.json
```

The CLI is a human terminal adapter over the shared resolver.

---

# 2. `create`

`create` must:

1. acquire target directory;
2. load/collect supported input;
3. validate structural input;
4. normalize Ontology/defaults;
5. resolve dependency closure;
6. show a review where appropriate;
7. reject unsafe destination state;
8. create generation plan;
9. materialize through staging;
10. apply legal pruning/transforms;
11. write portable config/provenance;
12. run required acceptance gates where configured;
13. optionally install dependencies;
14. optionally initialize Git;
15. report truthful completion/handoff.

Dry run MUST NOT write project source.

---

# 3. `add`

`add` is deliberately narrow.

It may add only explicitly supported generator-owned optional surfaces with known ownership/dependency contracts.

It MUST NOT become:

- arbitrary source merge;
- template upgrade engine;
- generic code mod marketplace;
- mechanism for bypassing Virgule support boundaries.

---

# 4. `explain`

`explain` should read generated configuration/provenance and explain:

```text
what was selected
what was derived
what was required
what was generated
which providers are involved
what setup remains
which architecture rules govern the project
```

It must not infer successful provider setup merely from generated source presence.

---

# 5. `doctor`

`doctor` diagnoses actionable readiness.

Possible checks:

- configuration/manifest agreement;
- required files;
- environment variable presence;
- package/install readiness;
- provider configuration prerequisites;
- database migration/readiness prerequisites.

It is not a substitute for full application CI/release validation.

---

# 6. Generator Core Boundary

The generator core owns:

```text
parse
normalize
resolve
validate
plan
materialize
transform
manifest
```

CLI owns:

```text
prompt
review
progress
terminal output
```

Anthimeria owns:

```text
visual controls
preview
explanation
portable config export
```

All three meet at the same configuration semantics.

---

# 7. Materialization Safety

The materializer should stage output before promotion.

```text
Maximal Template
      ↓ copy
staging directory
      ↓ prune
      ↓ transform
      ↓ write provenance
      ↓ validate
      ↓ promote
Arrangement destination
```

On materialization failure, staged partial work must not be represented as a valid Arrangement.

---

# 8. Generator-Owned Metadata Boundary

Generator-internal artifacts:

```text
ownership catalog
pruning graph
transform registry
generator source
CLI source
Anthimeria component state
```

These are not required application runtime artifacts.

Portable handoff artifacts may be deliberately included:

```text
hipsterstack.json
.hipsterstack/manifest.json
generated README
AGENTS/rules
.env.example
```

---

# 9. Validation Claims

Generator status should distinguish at minimum:

```text
planned
materialized
accepted/validated
materialized-with-validation-skipped
failed
```

Exact implementation names may vary.

The CLI must never say “validated” when required validation did not execute.

---

# 10. Current Live Evidence

Current `packages/cli/src/cli.ts` already exposes:

```text
create
add
doctor
explain
```

Current `create` supports:

```text
--name
--yes
--config
--no-git
--skip-install
--dry-run
```

Current generator core implements staging materialization and source transforms.

These are source-backed implementation facts as of the inspected `master` branch.

---

# 11. Canonical Rule

> **CLI behavior is an adapter concern; configuration meaning is a core concern. A second rules engine in the CLI is non-conforming.**
