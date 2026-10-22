---
name: loaded-vibes-review
description: Review Arrangement code or a diff for Codependent Coding architecture drift, incorrect responsibility placement, security/tenancy violations, provider leakage, transaction misuse, webhook mistakes, and unsupported abstraction. Use for architecture review, code review, or pre-merge inspection.
---


# Loaded Vibes: Review

Review skeptically and report evidence, not style preferences.

1. Establish the change scope and repository-local authority.
2. Run the mechanical architecture validator when the working tree is available.
3. Inspect changed code for semantic issues mechanical checks cannot prove.
4. Prioritize:
   - tenant/resource scope and authorization before data access;
   - provider secret and SDK boundaries;
   - webhook signature/idempotency/reconciliation;
   - network I/O inside DB transactions;
   - fetcher writes or unscoped reads;
   - action/provider/workflow responsibility confusion;
   - block/feature presentation-boundary violations;
   - unnecessary generic abstraction layers;
   - incorrect server/client boundary movement.
5. Do not report a theoretical preference as a defect when the repository's adopted contract allows the code.
6. Report findings by severity with file/line evidence, architectural rule, consequence, and minimal remediation.
7. If there are no material findings, say what was actually inspected and which checks ran.
