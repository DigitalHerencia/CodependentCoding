# Deterministic Contract Source Traceability

This matrix supports `DEF-HIGH-005`. It maps the three required normative machine contracts to the human-readable canonical owners and reconciled source families that justify their deterministic claims. Exact mandatory-source fingerprints remain in `provenance/source-provenance-ledger.md`; repository-wide atomic claim provenance remains the separate `DEF-HIGH-009` remediation concern.

## Product contract

| Contract section | Canonical human owner | Primary source evidence | Deterministic responsibility |
|---|---|---|---|
| `system` | `README.md`; `docs/01-knowledge-system-definition.md` | `Codependent-Coding-Knowledge-System.txt`; engineering-system definition | Identifies Codependent Coding™, Loaded Vibes™, Hipster Stack™, and their hierarchy without collapsing knowledge system, architecture, and technology substrate. |
| `identity.tenant` | `docs/05-terminology-nomenclature.md`; `docs/10-loaded-vibes-architecture.md` | engineering-system definition; ontology/taxonomy reference; first-person doctrine | Tenant remains an architecture abstraction; Organization is the reference noun; renaming requires an approved coherent reset. |
| `identity.sample_domain` | architecture/domain documentation | controlling remediation/project contract; engineering-system definition | Project remains removable sample domain and is forbidden from silently becoming tenant or billing boundary. |
| `identity.access_model` | `docs/14-security-model.md`; Pattern 005; supporting SP18-SP20 | Golden Auth/Authz Boundary; Golden Fetcher; first-person doctrine | Local User + Membership establishes tenant participation; Role aggregates Capabilities; resource/workflow policy evaluates actual facts/state. |
| `truth_ownership` | `docs/03-epistemology.md`; `docs/14-security-model.md` | first-person doctrine; Vouch implementation evidence; provider-boundary patterns | Clerk identity/session, application local/product truth, and Stripe provider truth are separated explicitly. |
| `billing` | architecture/security/provider documentation | engineering-system Stripe/provider sections; first-person doctrine; Vouch implementation evidence | Subscription billing is tenant-owned; Checkout/Portal require server-derived authority; webhook-normalized local entitlement state is authoritative; Connect remains separate, optional, scoped, recoverable. |
| `application_surfaces` | architecture and route/feature canon | engineering-system route/surface model; first-person doctrine | Encodes surface classes while keeping catalog isolated from default production routes. |
| `presentation` | presentation architecture; Pattern 007; supporting SP05-SP08 | engineering-system Presentation System; first-person doctrine | Encodes tokens → primitives → shared/domain presentation → blocks → features → routes and server-first/client-island rules. |
| `security_invariants` / `prohibited_assumptions` | security model; layer contracts; governance | Golden Auth/Authz, Layer, Workflow, Webhook, Governance patterns; controlling remediation contract | Encodes durable negative boundaries agents/generators must not reinterpret. |

## Architecture contract

| Contract section | Canonical human owner | Primary source evidence | Deterministic responsibility |
|---|---|---|---|
| `core_rule` | `docs/10-loaded-vibes-architecture.md` | engineering-system definition; first-person doctrine | Canonical ownership sentence across routes/features/components/fetchers/actions/schemas/authz/workflows/transactions/integrations/webhooks. |
| `layers.*` | `docs/12-layer-contracts.md`; Patterns 001-010; SP01-SP20 | Golden Layer Contract plus individual Golden patterns | Declares roots, responsibilities, permitted dependencies, forbidden imports/responsibilities, and specialized requirements such as `use server` and transaction-client input. |
| `server_operation_paths` | lifecycle spec; Fetcher/Action/Workflow/Webhook patterns | Golden request paths and completed `RL-*` lifecycle canon | Deterministically records protected-read, user-mutation, and provider-webhook entry/sequence rules. |
| `trust_boundaries` | security model; ontology | Golden Auth/Authz; Layer Contract trust progression; first-person doctrine | Separates browser, Clerk identity, local Actor, Membership context, provider events, and normalized provider truth. |
| `database` | security model; transaction/lifecycle canon | Golden Transaction Helper; Auth/Authz RLS section; first-person RLS doctrine | Encodes direct migration role, restricted pooled runtime role, no BYPASSRLS, transaction-local tenant context, all-command policies, and real attack-test obligation. |
| `provider_consistency` | Workflow/Integration/lifecycle canon | Golden Application Workflow; Integration supporting pattern | Rejects distributed-ACID fiction; requires network outside DB tx, stable idempotency, durable operation state, recovery/reconciliation. |
| `webhook_event_ledger` | Pattern 006; lifecycle RL-08/RL-09 | Golden Webhook Processor | Encodes receipt/processing/terminal states, atomic claim, lease/retry semantics, bounded failure metadata, and the rule that row existence is not completion. |
| `stripe` | security/provider canon; product contract | engineering-system Stripe section; first-person doctrine; Vouch implementation evidence | Encodes separate billing/Connect modules, tenant ownership, server-derived sensitive provider identifiers, local normalized authorization state, optional removable Connect. |
| `presentation` | presentation architecture; Pattern 007; SP05-SP08 | engineering-system Presentation System | Encodes hierarchy, server-first behavior, isolated catalog, asset contract, and rejection of giant copied prototypes as reusable recipes. |
| `forbidden_shortcuts` | `AGENTS.md`; governance/security/layer contracts | controlling remediation contract and canonical governance pattern | Machine-readable negative rules against unsafe casts, client authority, BYPASSRLS, scattered roles, weak webhook idempotency, provider leakage, fake completion, and unrelated rewrites. |

## Validation contract

| Contract section | Canonical human owner | Primary source evidence | Deterministic responsibility |
|---|---|---|---|
| `evidence_states` | `docs/17-validation-conformance.md`; lifecycle RL-12/RL-13 | engineering-practice evidence discipline; Codependent knowledge-system requirements | Distinguishes passed, failed, skipped, blocked, and inferred so static/inferred work cannot masquerade as execution. |
| `required_evidence_fields` | validation/conformance and agent-execution docs | Golden Governance System; remediation evidence rules | Requires command/check, environment, revision/artifact identity, time/run identity, result, scope, limitations. |
| `repository_validation` | repository scripts/package/workflow; conformance report | merged lifecycle/pattern remediation; current Actions evidence | Encodes the canonical `npm run validate` surface, actual current subgates, explicit proof limits, exact-PR and post-merge-main acceptance, and CI artifact evidence. |
| `generated_application_quality_gates` | engineering-system Validation and Enforcement; first-person doctrine | Hipster Stack system definition; How-I-Build testing/CI | Encodes expected application gate classes without claiming this knowledge repository executes product E2E/database/provider suites. |
| `real_database_evidence` | security/transaction canon | Golden Transaction Helper; RLS sections | Specifies claims that require real PostgreSQL/runtime-role proof rather than mocks/static inspection. |
| `provider_and_webhook_evidence` | webhook/workflow/security canon | Golden Webhook Processor; provider integration doctrine | Specifies replay/concurrency/lease/out-of-order/Connect/failure-recovery evidence obligations. |
| `validator_requirements` | validation/conformance; supporting SP16 | Golden Governance System; validation-script pattern | Requires real structured parsing when semantic validation is claimed, negative fixtures, non-mutating validation, and no implication of unimplemented checks. |
| `independent_verification` | final verification issue contract; conformance doctrine | Codependent knowledge-system final verification requirements | Separates producer self-conformance from final independent verification and rejects manufactured requirement counts. |
| `historical_baseline` | historical audit evidence only | independent verification baseline | Preserves 323/190/133/0 FAILED as immutable historical evidence while explicitly forbidding its use as a current expected-count constant. |
| `completion_rules` / `prohibited_claims` | governance/conformance/remediation contract | Golden Governance System and autonomous remediation goal | Encodes fail-closed completion semantics and disallows common evidence substitutions. |

## Cross-contract consistency

The contracts share canonical vocabulary rather than redefining it:

- `Tenant` is the abstraction; `Organization` is the reference implementation noun.
- Clerk owns identity/session truth; local application state owns Membership/Role/Capability/resource/workflow truth.
- Stripe owns provider truth; application authorization reads normalized local state under explicit mapping.
- Protected reads enter through Fetchers; UI mutations enter through Server Actions and Workflows; provider events enter through verified durable webhook processing.
- RLS is tenant containment under restricted runtime credentials; application authorization still decides business legality.
- Provider network calls remain outside database transactions.
- Validation evidence is exact-revision and execution-grounded; a merged PR or green unrelated status is not completion proof.

`product.yaml`, `architecture.yaml`, and `validation.yaml` reference each other and `.agents/contracts/ontology.yaml` so deterministic vocabulary can be compared without copying the entire ontology into each file.

## Executed branch syntax evidence

The three proposed YAML files were parsed with Ruby's standard YAML implementation before upload. The exact GitHub branch copies were then fetched back, decoded, parsed again, and byte-compared with the validated drafts. This proves syntax for the proposed branch bytes; it does **not** claim that the repository's current Node validator performs real YAML schema/semantic validation. That broader validator defect remains `DEF-HIGH-001` (#5).

## Scope boundary

This remediation completes the content of the three required normative machine contracts. It does not claim:

- full JSON/YAML schema validation of every machine artifact;
- bidirectional manifest/dependency reconciliation;
- repository-wide claim-level provenance;
- truthful/schematized execution JSON;
- the final independent 323-requirement verification.

Those remain separately tracked remediation issues and must not be inferred complete from these contracts.