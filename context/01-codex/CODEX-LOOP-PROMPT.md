# CODEX LOOP PROMPT — Codependent Coding Consolidation Build

You are receiving two inputs:

1. the current local consolidation workspace from `TheCodependentCodingWebAppArchitecture.zip`;
2. `Codependent-Coding-Codex-Handoff-Governance-v0.1.0`, which is the controlling governance/authority package for this build.

## Mission

Reconcile and complete the local Codependent Coding system according to the governance package. **Do not redesign the system. Do not start over because older files use older names. Migrate working implementation into the current canonical identities and boundaries.**

The local workspace is disposable as a repository identity. Do **not** create a new remote, push, or deploy. When the local build is accepted, the owner will create a new repository/remote/deployment separately.

## Read first, in this order

1. `00-governance/00-TypeScripture-Canonical-Doctrine.md`
2. `00-governance/01-Authority-and-Precedence.md`
3. `00-governance/02-Canonical-System-Manifest.md`
4. `00-governance/03-Repository-Reconciliation-Contract.md`
5. `00-governance/04-Segmented-Build-Spec.md`
6. `00-governance/05-Mockup-to-Function-Contract.md`
7. `00-governance/06-Validation-and-Completion-Contract.md`
8. `00-governance/07-Loaded-Vibes-Plugin-Disposition.md`
9. `00-governance/08-Handoff-Prerequisites-and-Observed-State.md`
10. only the canonical source extracts required by the current segment.

Then inspect the actual workspace files named by that segment.

## Non-negotiable interpretation rules

- The latest name wins. A stale name is a rename/migration task, not a reason to stop.
- `Codependent Coding Knowledge System` as docs authority becomes **TypeScripture™ Canonical Doctrine**.
- `Loaded Vibes WebApp Architecture` becomes **Codependent Coding™ Web App Architecture**.
- **Loaded Vibes™** is the post-generation Codex plugin; **Hipster Stack™** owns resolver/generator/materializer behavior.
- `The Constituter™` becomes **The Anthimeria™ Workbench**.
- Canonical defaults are the **nine Ontology™ Normalized Defaults**, not the old four generic presets.
- **Simples™ = PureUI Blocks™ + BusinessLogic Blocks™**. Constituents are not extra Simple families.
- **Virgule™** is the dependency-closed resolved Application Definition authority for preview/materialization.
- There is one authoritative **Maximal Template™** superset and one active semantics engine.
- Existing semantically matching code should be moved/renamed/adapted before you write a replacement.
- Mockups are visual/interaction references; adapt labels and controls to real functionality.
- Do not create a second resolver/rules engine in the web UI.
- Do not create a remote or deploy.

## Execution loop

Work through `00-governance/04-Segmented-Build-Spec.md` **in order, one segment at a time**.

For each segment:

### A. Inspect

- read only the relevant canonical authority and affected implementation;
- search the entire consolidation workspace for semantic equivalents before declaring anything missing;
- identify old names/paths and the current destination/owner;
- identify the smallest complete change for this segment.

### B. Plan

Before mutation, write a short segment plan containing:

```text
Segment:
Outcome:
Existing implementation to reuse:
Files/owners to change:
Compatibility adapters (if any):
Focused validation:
Deletion/removal deferred until:
```

Do not propose a new architecture unless the canonical sources are genuinely insufficient.

### C. Implement

- migrate/rename/adapt before rewriting;
- preserve architecture boundaries;
- keep one owner for each behavior;
- update contracts/tests/docs together when a public machine boundary changes;
- remove obsolete duplicate code only after the replacement path is working.

### D. Verify

Run the narrowest sufficient checks for the segment, then any build required to prove the changed surface integrates. Use the exact final repository scripts where available.

Report evidence as:

```text
Executed:
Skipped:
Blocked:
Inferred:
```

Never call a check passed if it did not run.

### E. Checkpoint

At the end of each segment, update a durable checkpoint using `01-codex/SEGMENT-CHECKPOINT-TEMPLATE.md` and state:

- what changed;
- what old source was migrated/reused;
- what was deleted and why;
- executed evidence;
- remaining compatibility debt;
- exact next segment.

Then **continue automatically to the next segment** unless one of the escalation conditions below is met.

## Escalate only for real decisions

Stop and ask the owner only if:

- two equally current canonical sources require materially incompatible behavior;
- the requested result requires a new product behavior not specified anywhere;
- an authority/security/tenant/payment/provider boundary would need to change;
- a destructive/irreversible data or migration action is required;
- a secret/credential is required;
- the only path forward would intentionally discard unique working source with no recoverable copy.

Do **not** stop for routine renames, file moves, stale imports, old route names, package-name migration, or other mechanically implied reconciliation.

## Final state

After Segment 9:

- run the final coherent repository validation gate;
- prove a representative Ontology → Virgule → Anthimeria preview → generation plan → Maximal Template materialization → Arrangement smoke chain;
- run resolver coverage for all nine Ontology defaults;
- run Loaded Vibes package validation and Arrangement smoke against representative generated output;
- perform representative desktop/narrow UI checks against the mockups;
- produce `01-codex/FINAL-HANDOFF-TEMPLATE.md` as the final report;
- leave the result local with **no remote creation and no deployment**.

Begin with Segment 0 now.
