version: 1
status: final
owner: docs/18-agent-execution.md
scope: agent-execution-principles

principles:
  execution_state_is_operational_not_canonical: true
  completion_requires-truthful-evidence: true
  confidence-cannot-substitute-for-execution: true
  known-blockers-must-remain-visible: true
  smallest-correct-change: true

workflow:
  - read-governing-context
  - identify-contradictions-and-scope
  - define-files-interfaces-migrations-and-tests
  - implement-smallest-correct-change
  - run-affected-application-gates
  - update-docs-and-contracts-for-public-boundary-changes
  - report-executed-skipped-blocked-and-inferred-work-truthfully

escalate_when:
  - human-product-decision-required
  - authority-or-security-boundary-would-change
  - destructive-production-action-required
  - secret-disclosure-required
  - financial-or-legal-discretion-required
