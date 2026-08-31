# Chapter 13: Validation Contract

**The Book of Knowledge™**

## Definition

- Validation determines whether a defined property or requirement is satisfied. Verification confirms an expected property with evidence. Testing is one evidence mechanism. None is universal proof.

## Principles

- Evidence must be proportional to the claim and close to the failure mode.
- Documentation inspection cannot prove runtime behavior. Mocked tests cannot prove real PostgreSQL RLS, provider semantics, deployment state, or browser behavior.
- A completion claim names the command/review, environment, result, and limits of what it proves.

## Required classes

- Formatting/static structure.
- Type correctness.
- Unit behavior.
- Real database constraints/RLS/concurrency.
- Integration/provider behavior where material.
- Browser/accessibility critical paths.
- Production build.
- Deployment and post-deploy verification when shipping.
