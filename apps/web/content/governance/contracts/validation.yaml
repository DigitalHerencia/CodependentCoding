version: 1
status: final
scope: generated-application-validation

principles:
  - validation-proves-only-what-executed
  - inspection-is-not-runtime-proof
  - failures-block-the-claim-they-protect
  - security-critical-properties-require-representative-real-boundary-tests
  - generated-applications-own-their-own-test-suites

product_fast:
  required_steps:
    - format-check
    - lint
    - typecheck
    - architecture-boundary-checks
    - unit-tests

product_ci:
  required_steps:
    - product-fast
    - prisma-validate
    - contract-validation
    - affected-integration-tests
    - production-build

product_release:
  required_steps:
    - product-ci
    - database-rls-tests
    - critical-e2e
    - accessibility
    - security-scans
    - migration-review
    - deployment-smoke

proof_limits:
  static-analysis: does-not-prove-runtime-data-isolation
  mocked-tests: do-not-prove-real-provider-or-database-behavior
  browser-tests: do-not-prove-backend-tenant-containment-by-themselves
  green-ci: proves-only-the-configured-gates-on-the-tested-revision

manual_review_required_for:
  - authentication-or-authorization
  - tenant-or-rls
  - money-or-provider-state
  - migration-or-data-loss
  - lifecycle-transition
  - secret-or-privileged-configuration
  - public-contract-change
