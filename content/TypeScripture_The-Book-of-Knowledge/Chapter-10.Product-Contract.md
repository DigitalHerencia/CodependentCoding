# Chapter 10: Product Contract

**The Book of Knowledge™**

## Definition

- A Product Contract defines the class of product being built, its domain nouns, actors, state owners, required capabilities, prohibited assumptions, and non-negotiable product invariants. It does not prescribe every implementation detail.

## Required knowledge

- Product identity and intended users.
- Tenant noun and participation model.
- Core entities, actors, roles/capabilities, and state owners.
- Major workflows and lifecycle states.
- Provider boundaries and which truths remain external.
- Security, data, validation, operations, and acceptance obligations.

## Rule

- Product-specific behavior must not silently become reusable architecture. A product may specialize the architecture only through explicit product-owned specifications or decisions.
