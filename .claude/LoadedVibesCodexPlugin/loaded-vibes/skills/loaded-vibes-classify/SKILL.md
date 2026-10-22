---
name: loaded-vibes-classify
description: Classify a proposed file, import, feature, route, database operation, workflow, provider integration, webhook, presentation component, schema, or utility into the Codependent Coding Arrangement architecture. Use before creating new architectural boundaries or when placement is ambiguous.
---


# Loaded Vibes: Classify

Classify by **what the code does**.

1. Read `references/architecture-classifier.md`.
2. Identify the dominant responsibility, trust boundary, side effects, and callers.
3. Prefer the existing named responsibility over a new abstraction.
4. Check explicit exceptions: static public pages may compose blocks directly; React Hook Form feature forms may compose UI primitives directly.
5. If a proposed file performs multiple responsibilities, split only where those responsibilities are genuinely separable.
6. Do not create generic `services/`, `managers/`, `processors/`, `repositories/`, or deep hierarchy unless a repository-local contract gives that boundary a real meaning.
7. Return the owning layer/path, allowed dependencies, forbidden responsibilities, and any migration consequence.
