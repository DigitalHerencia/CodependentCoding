# Epistemology and Sources of Truth

## Claim classes

| Class | Meaning | May create doctrine? |
|---|---|---:|
| Source-documented | Direct statement in an authoritative source | Yes, subject to precedence |
| Human-confirmed | Explicit current instruction or accepted decision | Yes |
| Implementation-observed | Behavior in code, tests, or production evidence | Only after promotion |
| Inferred | Necessary implication of accepted rules | Only when recorded as synthesis |
| Externally-supported | General engineering knowledge filling a genuine gap | Only when compatible and recorded |
| Unverified | Plausible claim without adequate evidence | No |

## Truth ownership

Truth is fact-specific. Clerk owns authentication and external identity. PostgreSQL owns local user status, tenant membership, capabilities, product entities, normalized entitlements, and workflow state. Stripe owns provider customers, charges, payment intents, subscriptions, connected accounts, and settlement facts. The application owns the mapping from provider facts to product consequences. Repository contracts own architectural requirements. Tests and validators provide evidence; they do not own the underlying requirement.

## Reconciliation

When sources disagree, resolve in this order: controlling identity and task instruction; explicit first-person doctrine; integrative system definitions; canonical security and lifecycle invariants; complete implementation documentation as evidence; pattern references; maps and indexes; external knowledge; recency only when explicit supersession is shown.

A resolution MUST select one outcome, state rejected alternatives, name affected artifacts, and record consequences. Two incompatible rules MUST NOT remain simultaneously canonical.

## From evidence to canon

Observed code becomes doctrine only when it is intentional, consistent with system-wide invariants, reusable beyond its project, and accepted through a decision. A successful implementation can still be accidental, legacy, insecure, or project-specific. Conversely, a declared rule without executable or reviewable proof remains an unproven requirement.

## Canonicalization and deprecation

An accepted decision updates its canonical owner and relevant deterministic contracts. Superseded definitions receive a pointer to the replacement and are removed from active indexes. Historical records remain immutable. Execution records do not permanently own architecture.

## Conformance claims

Every claim states evidence and limits. Static inspection proves presence and certain shapes, not runtime behavior. Unit tests prove selected logic, not database isolation. Integration tests prove behavior in their configured environment, not production availability. Builds prove compilation and framework integration, not authorization completeness. Deployment checks prove a deployed surface responds, not that every workflow is correct. Semantic review is always required for consequential trust, money, lifecycle, and product decisions.
