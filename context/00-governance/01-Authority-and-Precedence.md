# Authority, Precedence, and Conflict Resolution

## 1. Precedence

Codex MUST resolve contradictions in this order:

1. **Current explicit handoff instruction from the owner**, including `00-TypeScripture-Canonical-Doctrine.md`.
2. **The TypeScripture™ Canonical Doctrine** included in this package.
3. **Current canonical product/domain authority** included here for Ontologies, Simples, Anthimeria, the generation system, Maximal Template, Arrangement, Virgule, and Loaded Vibes.
4. **The current workspace implementation** as evidence of what already works and should be migrated/reused.
5. **The supplied mockups** as visual/interaction references.
6. **Historical or superseded material** only as provenance or implementation clues.

Repository-local files that predate this handoff remain useful implementation evidence, but a stale local name or identity statement does not outrank this package.

## 2. Naming-only discrepancies are migration work, not blockers

If an older file uses an old name and the newer authority provides the replacement, Codex MUST apply the newer name coherently and continue. Do not stop to report the mere existence of a rename as an architectural contradiction.

Examples:

| Older / transitional wording                                          | Current canonical wording / disposition                                                                                                                 |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Codependent Coding™ Knowledge System` as the documentation authority | **TypeScripture™ Canonical Doctrine**                                                                                                                   |
| `Loaded Vibes™ WebApp Architecture`                                   | **Codependent Coding™ Web App Architecture**                                                                                                            |
| Loaded Vibes as generator/materializer                                | **The Hipster Stack™** owns resolver/generation/materialization; **Loaded Vibes™** is post-generation Codex operations/enforcement                      |
| `The Constituter™`                                                    | **The Anthimeria™ Workbench**                                                                                                                           |
| public `Libraries` surface                                            | **Simples™**; Ontologies are a separate first-class surface                                                                                             |
| four generic product presets as canonical defaults                    | **nine Ontology™ Normalized Defaults**                                                                                                                  |
| Maximal Template `main` + `demo` as separate long-lived products      | consolidate into **one authoritative Maximal Template™ Domain Library** plus any demo/explorer surface over that source                                 |
| Codebase Context Utility as standalone product                        | reuse its file-tree/code-preview capabilities inside the Codependent Coding product where useful; do not preserve a competing standalone app by default |

## 3. Semantic conflict rule

Escalate only when a conflict changes a real decision the current authority does not resolve, such as:

- incompatible product behavior;
- an authority/security/tenant boundary change;
- destructive data or migration behavior;
- provider/money movement semantics;
- an irreversible repository transformation with no recoverable source;
- two equally current canonical sources prescribing materially different behavior.

Do **not** escalate ordinary file moves, package renames, route renames, identifier migrations, or compatibility shims when the intended newer identity is clear.

## 4. Preserve behavior while migrating names

A rename is not permission to discard working logic. Prefer:

```text
inspect old implementation
→ identify semantic owner
→ move/rename/adapt
→ update imports/contracts/tests/docs
→ delete superseded duplicate only after the replacement works
```

Do not solve nomenclature drift by starting over unless the implementation is actually unusable.

## 5. Evidence vocabulary

Use the Codependent Coding execution vocabulary:

- **executed** — a command/review actually ran;
- **skipped** — intentionally not run;
- **blocked** — could not run due to a prerequisite;
- **inferred** — concluded from inspection, not execution.

Expected/configured/inferred is never reported as passed execution.
