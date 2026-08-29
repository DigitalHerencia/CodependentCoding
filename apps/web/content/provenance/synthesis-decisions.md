# Synthesis Decision Register

This register owns durable consequential decisions made while reconciling the source corpus. It records *why* the canonical system says what it says without requiring a second operational mirror or validator.

| ID | Subject | Final decision | Status |
|---|---|---|---|
| SYN-001 | System identity | Codependent Coding™ is the knowledge system, Loaded Vibes™ the architecture, Hipster Stack™ the implementation substrate. | Canonical |
| SYN-002 | Tenant naming | Tenant is the abstraction; Organization is the reference noun unless an ADR coherently renames the boundary. | Canonical |
| SYN-003 | Workflow placement | Domain workflows own application use cases; reference placement is `lib/<domain>/workflows`. | Canonical |
| SYN-004 | DTO naming | Canonical persistence-to-transport placement is `lib/db/dto`; mapper remains the function role. | Canonical |
| SYN-005 | Pattern catalog | Preserve ten major patterns and twenty supporting patterns under a common pattern contract. | Canonical |
| SYN-006 | RLS | Protected tenant tables use RLS with a restricted non-owning runtime role and transaction-local tenant context. | Canonical |
| SYN-007 | Webhook payloads | Persist bounded sanitized event evidence by default; unrestricted raw provider payloads require explicit policy. | Canonical |
| SYN-008 | Source conflicts | Resolve by authority/precedence and record consequential decisions; escalate only unresolved equal-authority/product questions. | Canonical |
| SYN-009 | Caching | Fresh security/payment/tenant state is the default; persistent caches require explicit scope, freshness, invalidation, failure, and proof rules. | Canonical |
| SYN-010 | Knowledge-repository validator | A repository self-validation harness was introduced during remediation, then deliberately retired because the repository's product is the knowledge itself. Generated applications own runtime validation. | Superseded |
| SYN-011 | Historical repository identity | Current knowledge-system identity controls; legacy CodependentCoding material is provenance/reference evidence rather than active doctrine. | Canonical |
| SYN-012 | Initially unavailable sources | Later recovered mandatory sources were read and reconciled; historical unavailability is no longer a content blocker. | Resolved |
| SYN-013 | Workflow framework effects | Workflows stay framework-neutral and return intent; Server Actions/routes own cache/navigation effects. | Canonical refinement |
| SYN-014 | Vouch specificity | Vouch is implementation evidence. Generic trust, reconciliation, lifecycle, DTO, and idempotency lessons may be adopted; Vouch-specific roles/routes/state machines do not become universal doctrine. | Canonical |
| SYN-015 | Formal completeness | Broad topic coverage is not enough for dense domains; ontology, lifecycle, pattern, and contract definitions must be explicit where the knowledge model requires them. | Canonical |
| SYN-016 | Machine repository manifest | The remediation-era checksum/dependency manifest was useful for defect verification but is not necessary to operate the knowledge system; `MANIFEST.md` is now a simple human repository map. | Superseded |
| SYN-017 | Release checksum system | Deterministic release/checksum machinery satisfied the historical artifact defect, but it is not retained as permanent knowledge-repository infrastructure. | Superseded |
| SYN-018 | Repository simplicity | Preserve doctrine, architecture, patterns, contracts, decisions, and source provenance. Do not maintain CI/checksum/validator machinery whose primary purpose is proving that the documentation repository exists. | Canonical |
