# Chapter 05: Ontology Contract

**The Book of Knowledge™**

## Definition

- Ontology defines what exists in the system, the relationships among those things, their cardinalities and states, and the constraints that make combinations legal or illegal. It is not a folder taxonomy or persistence schema.

## Core entities

- System, Application, Architecture, TechStack, Repository, Product, Tenant, Organization, User, Membership, Role, Capability, Actor, Resource, Workflow, Lifecycle, Provider, ProviderMirror, Specification, Contract, Evidence, Decision, Exception.

## Key relationships

- Organization is the reference Tenant entity. User participates in Organization through Membership. Membership has one Role; Role aggregates Capabilities.
- Actor is a trusted server-side identity representation; it does not carry tenant authority until membership/scope is established.
- Workflow coordinates a use case over authorized facts and may invoke transactions/integrations.
- ProviderMirror is bounded local state derived from provider-owned truth; it is not the provider object itself.

## Constraints

- IDs identify candidate records; they do not prove membership, ownership, authority, price, entitlement, or provider scope.
- Persistence models, DTOs, provider objects, and domain entities are different representations and must not be conflated.
- Every lifecycle state and transition requires one authoritative owner.
