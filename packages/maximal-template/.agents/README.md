# Agent contracts and execution state

- [`contracts/application.yaml`](contracts/application.yaml): application boundaries and implementation linkage.
- [`contracts/design.yaml`](contracts/design.yaml): UX constraints and design applicability.
- [`contracts/validation.yaml`](contracts/validation.yaml): acceptance, checks, and evidence.
- [`execution/progress.json`](execution/progress.json): ledger initialized for all 100 specifications without fabricated passes.
- [`execution/handoff.json`](execution/handoff.json): current and next spec, risks, and evidence.
- [`execution/decisions.json`](execution/decisions.json): append-only decisions linked to spec IDs.

The YAML contracts are **derived from** the five docs and contain all 100 trace bindings. Their generic integrity rules are not substitutes for product requirements still to be authored. Existing live agent contracts and execution state must be reconciled rather than overwritten.
