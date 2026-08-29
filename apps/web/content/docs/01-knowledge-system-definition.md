# Knowledge-System Definition

## Identity

The Codependent Coding™ Knowledge System is the authoritative model of the Loaded Vibes™ WebApp Architecture using the Hipster Stack™ TechStack. It is a connected system of concepts, definitions, decisions, patterns, constraints, procedures, and evidence—not a handbook-shaped rule list.

It defines:

- what entities and artifacts exist;
- what each term means and what it excludes;
- how parts relate, depend, compose, and own state;
- how truth and source authority are established;
- how applications are decomposed, built, tested, deployed, operated, and changed;
- how humans and agents may act;
- how violations, exceptions, decisions, and evidence are recorded;
- how conformance is demonstrated.

## Intended users

Product owners use it to express intent without reopening platform decisions. Engineers use it to locate responsibilities and implement safely. Reviewers use it to evaluate architecture and evidence. Operators use it to understand truth, recovery, and observability. Agents use it as bounded authority for planning and execution. Generator maintainers use it to derive Loaded Vibes™ output.

## Scope

Included: opinionated server-first TypeScript SaaS architecture; product and engineering doctrine; knowledge modeling; multi-tenancy; identity; authorization; RLS; data, integration, presentation, lifecycle, testing, delivery, governance, and agent execution.

Excluded: generic tutorials; universal framework advice; product-specific business doctrine; secret values; production credentials; a promise that every supported technology is mandatory in every product; and implementation details without architectural consequence.

## Canonical states

Artifacts are either `canonical`, `supporting`, `implementation-evidence`, `project-specific`, `legacy`, `superseded`, or `operational`. Only canonical artifacts and accepted decisions create doctrine. Supporting references explain it. Evidence tests it. Legacy and superseded material remain traceable but non-authoritative.

## Change rule

A canonical change MUST identify the owner artifact, reason, affected terms/contracts/lifecycles/tests, migration impact, and evidence. It MUST update one canonical definition rather than creating a competing definition. Exceptions MUST be narrow, time-bounded when possible, owned, and detectable.

## Sufficiency standard

The system is sufficient when a technically capable reader or constrained agent can predict and reproduce the architecture's decisions, implement a product-specific change without inventing a competing structure, and prove the result. Surface similarity without boundary, authority, lifecycle, or validation fidelity is non-conforming.
