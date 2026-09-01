# Chapter 24: Route and Feature Orchestration

**The Book of Knowledge™**

## Core rule

- **Page adapts. Feature orchestrates. Block renders. Primitive supports.**
- A Page owns route/framework concerns. A Feature owns the page/use-case presentation composition and acquires the read state it needs through Fetchers. Blocks and Primitives remain pure presentation.

## Page ownership

- URL params/search params, metadata, route-segment boundaries, Suspense/loading shell, and rendering the Feature. The Page adapts framework input without acquiring application orchestration.
- A Page does not perform protected reads, mutations, workflows, persistence, provider operations, or application authorization directly.

## Feature ownership

- Compose one page/use-case experience. Call one or more Fetchers. Interpret authorized DTO/null/list results into presentation state, including page-level not-found/redirect outcomes when those outcomes depend on fetched application state. Compose Blocks and provide action references to interactive UI.
- Own presentation-only view models such as localized timestamps, display labels, badges, and visual risk classifications. Those transformations must not be hidden in persistence DTO mappers.
- A Feature is server-first by default. A deliberate Client Feature may exist only for browser interaction and receives safe state/actions from the server boundary.

## No loader layer

- A separate Feature Loader is not a canonical architectural layer. A Feature may extract a local server-only helper when orchestration is complex, but the Feature remains the owner and the helper is not a new authority boundary.

## Presentation

- Primitives → Blocks → Features → Pages. “Shared component” and “domain component” do not sit between these as mandatory layers.
