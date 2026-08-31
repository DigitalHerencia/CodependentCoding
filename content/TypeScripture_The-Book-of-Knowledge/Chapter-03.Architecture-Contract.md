# Chapter 03: Architecture Contract

**The Book of Knowledge™**

## Definition

- Architecture defines significant responsibilities, boundaries, dependency direction, trust progression, and state ownership. It is not a dependency list or directory tree.

## Canonical grammar

- Routes adapt. Features orchestrate. Components render. Fetchers read. Actions write. Schemas validate. Authorization decides. Workflows coordinate use cases. Transactions preserve invariants. Integration adapters own provider semantics. Webhooks reconcile external truth.

## Hard ownership rules

- Pages and layouts adapt Next.js route concerns and render Features. They do not directly perform protected reads or mutations.
- Features own page/use-case presentation orchestration. They may call Fetchers for reads and compose Blocks/Primitives for rendering.
- Components are presentation. Protected I/O, authorization decisions, persistence, and provider SDKs do not belong in components.
- There is no canonical Query or Command application layer. Narrow private persistence helpers may exist inside approved data modules when a Fetcher, Workflow, Auth/AuthZ boundary, or Transaction Helper needs them, but those helpers do not become independently callable architectural roles.

## No escape clauses

- There is no “when trivial” bypass from a page to a Fetcher or Action. A boundary is useful precisely because humans and agents disagree about what counts as trivial.
- A Feature loader is not a mandatory architectural layer. A Feature may use local server-only helpers when complexity warrants them, but the helper does not acquire independent authority.

## Dependency direction

- Framework/presentation depends inward on stable application/data/provider boundaries. Data, domain, and integration code do not depend upward on routes, Features, or presentation.
