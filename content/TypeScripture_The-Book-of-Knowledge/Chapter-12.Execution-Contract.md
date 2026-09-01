# Chapter 12: Execution Contract

**The Book of Knowledge™**

## Definition

- Execution contracts bound what a human or agent is allowed to change, which authorities must be read first, what evidence must be produced, and which decisions require escalation. Execution state is operational evidence, not durable architecture.

## Authority

- Humans own product intent, approval, legal/financial discretion, risk acceptance, production authority, and changes to doctrine.
- Agents may inspect, propose, implement, test, document, and prepare reviewable changes inside granted scope.

## Evidence vocabulary

- `executed`: actually ran/was reviewed.
- `skipped`: known check deliberately not run.
- `blocked`: required check could not run because a prerequisite failed.
- `inferred`: conclusion from inspection/reasoning rather than execution.

Executed evidence identifies the exact artifact and property inspected. A repository-wide command that fails on an unrelated baseline does not prove the changed scope failed; a filtered review does not prove the whole repository passed. Tool incompatibility, missing scripts, absent credentials, and provider/database prerequisites are reported as blockers rather than rewritten as successful checks.

## Escalation

- Conflicting equal authority, new privileged roles/routes, provider money movement, weakened tenant/auth/RLS/idempotency, destructive production action, secrets, legal/compliance choices, or irreversible migration risk require human authority.
