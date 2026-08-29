# Pattern 006: Webhook Processor

**Purpose/context.** Safely reconcile provider-owned truth delivered at least once, concurrently, repeatedly, and out of order.

**Responsibilities.** Route verifies raw-body signature; processor records durable bounded inbox; atomically claims lease; dispatches supported event family; retrieves current provider truth when necessary; runtime-validates normalized values; transactionally updates mirrors/domain/audit/outbox; finalizes with lock token; recovery retries stale/failed work.

**Non-responsibilities.** No browser session assumptions, blind delivery-order commands, find-then-create idempotency, email controlling primary completion, or unrestricted payload/secret retention.

**Contract.** Input is verified provider event plus explicit system Actor and account scope. Output is processed/duplicate/busy/ignored or typed failure. Route owns HTTP acknowledgment. Existing ledger row is not proof of processing.

**Transaction/idempotency.** Unique `(provider,eventId)` receipt; atomic conditional lease; provider-object uniqueness/upsert; current-token finalization; primary state/audit/outbox commit together. Provider retrieval occurs outside DB transaction.

**Security/tenant/cache.** Signature before parse; provider metadata is mapped/validated; Organization mapping is server-owned; Connect account scope preserved. No decision cache.

**Naming/placement.** `lib/webhooks/<provider>/process-*.ts`; event-family reconcilers and `claim/finalize*.tx.ts`.

**Lifecycle/tests.** verify → receive → claim → reconcile → commit → finalize → acknowledge; failure sets bounded metadata/next attempt. Test invalid signature, duplicates, active/expired leases, stale worker, out-of-order truth, amount/currency/account mismatch, crash injection, outbox independence.

**Anti-patterns/adjacent.** exactly-once claim, receipt timestamp as lease, raw event blindly mutating domain, 200 without durable recovery. Adjacent: integration, transaction, lifecycle, outbox.
