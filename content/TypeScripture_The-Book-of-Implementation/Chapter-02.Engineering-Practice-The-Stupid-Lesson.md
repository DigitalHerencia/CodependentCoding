# Chapter 02: Engineering Practice — The Stupid Lesson

**The Book of Implementation™**

## Assurance procedure

- For each material requirement: state the failure mode, choose the nearest practical observation, run it, record the result, and stop when the evidence is sufficient for the consequence.
- Do not create a validator solely to prove that another validator exists unless the meta-failure is itself consequential.

## Risk examples

- Presentation-only copy change: review/render evidence may be enough.
- Tenant isolation: real PostgreSQL cross-tenant attack tests under runtime credentials are required.
- Payment mutation: provider sandbox evidence, idempotency/reconciliation tests, and recovery-path evidence are required.
- Destructive migration: migration rehearsal, rollback/restore evidence, and explicit approval are required.

## Completion language

- Report exactly what was executed, skipped, blocked, or inferred. Do not upgrade an inspection into a runtime pass.
