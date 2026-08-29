# Pattern 009: System Lifecycle

**Purpose/context.** Define how stateful concepts and consequential runtime processes enter, transition or advance, terminate, retry, recover, and remain observable under concurrency and partial failure.

**Responsibilities.** Define identity/tenant/truth owner where state persists; initial/active/recoverable/terminal states where applicable; named transitions/stages; actors/triggers; trust and authorization; guards vs invariants; canonical owners; transaction/atomic-write behavior; failure; idempotency; concurrency; recovery; outputs/completion; audit/observability; validation evidence and source traceability. Every durable state transition has one named authority, one legal transition definition, and one persistence strategy. One Workflow owns each authoritative product transition.

**Non-responsibilities.** Enum/status/switch alone is not a lifecycle. Provider state is not collapsed into domain state. Audit is not the sole canonical state. A runtime process lifecycle does not invent persistence states merely to resemble a state machine.

**Contract.** Durable transition requests supply expected state/version and authorized Actor/system trigger. Conditional database mutation produces the next legal state or conflict. Important transition timestamps are dedicated. Non-persisted runtime lifecycles use the same authority/failure/recovery/evidence grammar without fabricating entity states.

**Runtime lifecycle fields.** Every required runtime lifecycle defines: Purpose / identity; Entry conditions; Actors / triggers; Trust / authorization; Canonical owners; Ordered stages; Invariants; Transaction behavior; Failure behavior; Retry / recovery; Concurrency / idempotency; Outputs / completion; Observability; Validation / conformance evidence; Source traceability.

**Security/tenant.** Every lifecycle-bearing record has tenant ownership or explicit global scope; actors and legal cross-tenant operations are named. System transitions use narrow system actors. Runtime lifecycles identify every trust boundary and the layer that performs authoritative authorization.

**Transaction/cache.** State, audit, and required outbox commit together when they describe one atomic invariant. Provider work uses separate recoverable phases outside database transactions. Cached state never authorizes a transition without freshness proof. Runtime processes with no transaction say so explicitly instead of implying atomicity.

**Failure/recovery.** Every lifecycle explains what happens on invalid input/state, provider or infrastructure failure, interruption after each consequential stage, repetition, competing actors, stale leases/versions, and local/provider divergence where applicable. Expected, failed, blocked, retryable, terminal, and completed outcomes remain distinguishable.

**Naming/placement.** Lifecycle name is a domain or runtime-process noun; durable transitions are imperative; resulting events are past tense; stable lifecycle IDs are used where machine comparison is needed. `docs/13-system-lifecycles.md` owns the complete required runtime lifecycle set.

**Lifecycle/tests.** Test every allowed and forbidden source state where state persists, required invariant/timestamp/version, concurrent contender, idempotent retry, crash point, out-of-order event, recovery/dead-letter path, and required runtime field. Lifecycle completeness validation must fail when a mandatory runtime field is removed.

**Anti-patterns/adjacent.** Polluted status enum, multiple transition authorities, irreversible partial state with no recovery, combined lifecycles whose trust/transaction semantics differ, provider-delivery order as business authority, completion claims without executed evidence. Adjacent: Workflow, Transaction Helper, Webhook Processor, auth/authz policy, cache invalidation, error handling, validation/CI, deployment, governance release lifecycle.
