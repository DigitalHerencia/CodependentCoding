# Chapter 20: Transaction Helper

**The Book of Knowledge™**

## Definition

- A Transaction Helper defines database facts that must succeed or fail together. It is deliberately narrower than a Workflow.

## Responsibilities

- Accept the transaction-scoped database client first.
- Perform only the atomic reads/writes required for one invariant-preserving local operation.
- Assert expected tenant/state/version.
- Write audit/outbox data atomically when required.
- Return minimal selected persistence result.

## Non-responsibilities

- No root database-client fallback, identity-provider concerns, presentation/framework concerns, network/provider calls, messaging, cache invalidation, transport parsing, user-facing formatting, or broad multi-step use-case orchestration.

## RLS rule

- The canonical RLS transaction runner establishes transaction-local tenant/actor context and then invokes a Transaction Helper with only the transaction client. Network work never occurs inside that transaction.
