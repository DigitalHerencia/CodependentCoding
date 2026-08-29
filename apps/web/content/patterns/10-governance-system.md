# Pattern 010: Governance System

**Purpose/context.** Preserve durable intent, deterministic constraints, scoped change, mutable execution state, decisions, and proof across humans, agents, branches, and time.

**Responsibilities.** Separate canonical Markdown, machine YAML contracts, scoped specs, execution JSON, decisions, validators, CI, archives, and source precedence. Detect drift and promote durable discoveries.

**Non-responsibilities.** Governance does not contain secrets, runtime product behavior, unapproved product invention, or temporary notes masquerading as architecture.

**Contract.** Humans approve context/specs/decisions. Agents read and mutate within scope. Validators consume contracts. Execution references real specs/files/commands and cannot override canon.

**Failure/security.** Conflicts are classified and resolved/escalated; validation failures block completion; evidence distinguishes inspected/implemented/executed/skipped. Secrets and raw payload patterns are rejected.

**Transaction/cache/tenant.** Not a runtime data transaction pattern. Governance explicitly owns tenant/security rules but stores no tenant production data. Generated indexes may cache discovery only and are reproducible.

**Naming/placement.** `AGENTS.md`, canonical `docs/`, `.agents/contracts/*.yaml`, `.agents/execution/*.json`, `provenance/`, `scripts/`.

**Lifecycle/tests.** context → contract → spec → execution → validation → decision/handoff → promotion/archive. Validate presence, syntax, cross-references, implementation conformance, runtime properties, secret absence.

**Anti-patterns/adjacent.** duplicate sources of truth, execution JSON redefining architecture, CI duplicating script lists, archived docs in active indexes. Adjacent: layer contract, lifecycle, validation, agent execution.
