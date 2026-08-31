# Chapter 04: Engineering System Definition

**The Book of Knowledge™**

## Definition

- Codependent Coding™ explains and governs how software is understood and built. Loaded Vibes™ defines the reusable WebApp architectural form. Hipster Stack™ supplies the technologies used to realize that architecture.
- A generated template or product application instantiates the architecture; it is not the architecture itself.

## Target system

- Production-oriented, server-first, multi-tenant B2B SaaS.
- Explicit state ownership, tenant containment, typed boundaries, recoverable external operations, and narrow agent execution are defaults.
- Microservices, a generic service layer, client-side data authority, Clerk Organizations, Stripe Connect, persistent caching, and a sample Project domain are not mandatory.

## Server-first rule

- React Server Components are the default. Client Components exist only for browser interaction, local UI state, or browser APIs. Moving code client-side never moves authority into the browser.

## State ownership

- Clerk owns authentication/external identity truth. PostgreSQL owns local application state, membership, RBAC, and normalized entitlement state. Stripe owns provider payment truth. Workflows own interpretation and legal application transitions.

## Abstraction rule

- Prefer direct domain-named modules and local duplication over speculative generic layers. Extract only when a repeated concept has one stable meaning, one contract, and clear callers.
