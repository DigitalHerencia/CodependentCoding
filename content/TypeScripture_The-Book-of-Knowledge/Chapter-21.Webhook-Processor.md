# Chapter 21: Webhook Processor

**The Book of Knowledge™**

## Definition

- A Webhook Processor is a durable reconciliation system for provider-owned external events. A webhook event is notification/evidence of provider change, not automatically a trusted command to mutate product state.

## Lifecycle

- Raw request → signature verification → bounded parsed event → durable unique receipt → atomic claim/lease → authoritative provider retrieval when needed → reconciliation Workflow/Transaction → token-checked finalization → safe acknowledgement.

## Invariants

- Verify signature against the raw body before parsing.
- Events are replayable, concurrent, duplicated, and out of order.
- Receipt is durably unique; claim is atomic; stale workers cannot finalize a newer lease.
- Important local state is reconciled from current provider truth rather than trusting arbitrary event payload fields.
- Raw unrestricted payload retention is prohibited; retain only bounded sanitized evidence required by policy.

## Exactly-once language

- Do not claim exactly-once external delivery. Build idempotent effects and durable processing so repeated delivery converges on one logical result.
