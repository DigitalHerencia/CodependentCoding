# Chapter 12: Execution Contract

**The Book of Implementation™**

## Canonical contract

```yaml
execution:
  read_before_change:
    - active-specification
    - architecture
    - security
    - affected-lifecycle
    - affected-code-and-tests
  implement: smallest-contract-compliant-change
  evidence_states: [executed, skipped, blocked, inferred]
  evidence_scope:
    exact_artifact: required
    exact_property: required
    filtered_result_is_not: repository-wide-pass
    unrelated_baseline_failure_is_not: changed-scope-failure
  forbidden:
    - manufacture-evidence
    - silently-change-authority
    - expose-secrets
    - weaken-security-without-approval
  completion:
    - scope-implemented
    - public-contracts-synchronized
    - required-evidence-recorded
    - known-critical-contradictions-resolved
    - prose-machine-pattern-implementation-reconciled-bidirectionally
```
