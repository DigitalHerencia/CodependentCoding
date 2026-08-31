# Chapter 17: Governance System

**The Book of Implementation™**

## Minimal project package

```text
README.md                     # identity and scope
context/                      # durable product/architecture/security docs
context/specs/                # active consequential change specifications
.agents/contracts/            # deterministic subsets where automation benefits
.agents/execution/            # temporary task state only
AGENTS.md                     # compact operating rules
```

## PR/change record

- A meaningful change record states why, behavior changed, affected contracts/migrations, security/tenant impact, evidence executed/skipped, rollout/rollback where relevant, and remaining risk.

## Rule

- Do not reproduce a parallel “documentation test harness” whose purpose is only proving that Markdown exists. Validate runtime behavior in the actual application.
