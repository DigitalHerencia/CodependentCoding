---
title: Core Software and System Terminology
type: reference
scope: domain
project:
domain: software-development
artifact: system-architecture-terminology
kind: reference
namespace: software-development.system-architecture.terminology.reference
status: active
authority: reference
parent: "[[tech-stack.map]]"
depends_on: []
supersedes: []
tags:
  - software-development/terminology
  - architecture/terminology
  - systems
  - status/active
created: 2026-08-05
updated: 2026-08-05
---

# Core Software and System Terminology

## Core software/system terms

* **Role** — The responsibility something performs in the system; what it is there to do.
* **Responsibility** — The specific work or decisions owned by a role, component, or module.
* **Boundary** — The separation between concerns, systems, trust levels, or ownership areas; defines what may cross and how.
* **Constraint** — A rule limiting what is permitted, required, or structurally possible.
* **Invariant** — A condition that must remain true regardless of the operation being performed.
* **Contract** — An explicit agreement describing inputs, outputs, guarantees, errors, and obligations between parts of a system.
* **Interface** — The exposed surface through which something is used, without requiring callers to know its internals.
* **Module** — A cohesive implementation unit that encapsulates related behavior and exposes a controlled interface.
* **Component** — A replaceable or composable system part with a defined responsibility; often used for UI, runtime, or architectural parts.
* **Layer** — A grouping of responsibilities at a particular abstraction level, usually with controlled dependency direction.
* **Abstraction** — A simplified model that exposes relevant behavior while hiding unnecessary implementation details.
* **Concern** — A distinct area of responsibility, such as authentication, persistence, billing, or presentation.
* **Separation of concerns** — Dividing responsibilities so unrelated concerns do not become entangled.

## Domain and data terms

* **Domain** — The subject area or problem space the software represents, such as billing, identity, or inventory.
* **Domain model** — The software representation of the domain’s concepts, relationships, rules, states, and invariants.
* **Entity** — A domain object defined primarily by persistent identity across time and state changes.
* **Value object** — A domain object defined by its values rather than identity, usually immutable.
* **Aggregate** — A cluster of domain objects treated as one consistency boundary.
* **Relationship** — A meaningful association between entities or concepts.
* **Schema** — A formal definition of valid structure, fields, types, relationships, or input shape.
* **Record** — A concrete stored representation of data, typically a database row or selected result.
* **DTO** — A deliberately constrained object used to transport data across a boundary.
* **Projection** — A selected subset or transformed view of a larger data model.
* **Mapper** — Code that translates one representation into another, such as a Prisma record into a DTO.

## Behavior and lifecycle terms

* **State** — The currently stored or observable condition of an entity or system.
* **Transition** — A permitted change from one state to another.
* **Lifecycle** — The complete sequence of states and transitions something may experience.
* **Workflow** — A coordinated application use case that sequences authorization, rules, persistence, providers, and outcomes.
* **Operation** — A discrete action performed by or upon a system element.
* **Command** — A request to change state.
* **Query** — A request to retrieve information without changing authoritative state.
* **Side effect** — An observable consequence beyond returning a value, such as writing data or calling a provider.
* **Idempotency** — The property that repeating the same logical operation does not create additional unintended effects.
* **Reconciliation** — Comparing local state with an authoritative external source and resolving differences.

## Architecture terms

* **Architecture** — The significant structure of a system: its elements, responsibilities, relationships, boundaries, and governing decisions.
* **Pattern** — A named, reusable solution structure for a recurring problem in a defined context.
* **Convention** — A standardized choice followed consistently to eliminate unnecessary decisions.
* **Topology** — The arrangement and connections among system elements.
* **Dependency** — A relationship where one element requires another to perform its responsibility.
* **Dependency direction** — The permitted direction in which system elements may know about or call one another.
* **Orchestration** — Coordinating several components or operations to complete a larger use case.
* **Composition** — Building larger behavior or structures by assembling smaller parts.
* **Encapsulation** — Keeping internal state and implementation hidden behind a controlled interface.
* **Coupling** — The degree to which one part depends on the details of another.
* **Cohesion** — How strongly the responsibilities inside a module belong together.

## Infrastructure and external-system terms

* **Infrastructure** — The runtime resources that support the application, such as databases, hosting, networking, queues, and storage.
* **Tooling** — Development-time tools used to build, validate, test, format, deploy, or operate the system.
* **Integration** — A controlled connection between the application and another system or provider.
* **Provider** — An external service supplying capabilities such as identity, payments, email, or storage.
* **Adapter** — A boundary module that translates between your application’s concepts and another system’s interface.
* **API** — A defined interface through which software systems or modules communicate.
* **Webhook** — A provider-initiated HTTP notification reporting that external state or an event has changed.
* **Runtime** — The environment and period in which the application is executing.
* **Deployment** — A runnable release of the application installed in a target environment.
* **Environment** — A configured execution context such as development, test, preview, or production.

## Security and authority terms

* **Authentication** — Establishing who or what is making a request.
* **Authorization** — Deciding what an authenticated actor may do in a particular context.
* **Actor** — A trusted representation of the user, system, provider, or process attempting an operation.
* **Capability** — A stable name for a class of action an actor may be permitted to perform.
* **Policy** — Logic that decides whether an operation is allowed under specific facts.
* **Trust boundary** — A point where data or control crosses between different levels or sources of trust.
* **Source of truth** — The authority whose state is considered canonical for a specific fact.
* **Validation** — Determining whether untrusted input satisfies a required schema and semantic rules.
* **Sanitization** — Removing, escaping, or normalizing unsafe or unwanted input content.
* **Tenant** — The architectural ownership and isolation boundary for a customer organization or equivalent account.

## Governance and quality terms

* **Specification** — A precise description of required behavior, structure, interfaces, and acceptance conditions.
* **Governance** — The rules and processes controlling how a system is designed, changed, validated, and maintained.
* **Enforcement** — The mechanism that detects, rejects, or prevents violations of a rule.
* **Quality gate** — A required validation checkpoint that must pass before work proceeds.
* **Static analysis** — Examining source code without executing it to identify violations or defects.
* **Test** — Executable evidence that behavior or an invariant holds under specified conditions.
* **Observability** — The ability to understand internal system behavior through logs, metrics, traces, and operational state.
* **Audit event** — A durable record of a significant action, decision, actor, and outcome.
* **Artifact** — Any durable engineering output, such as code, a specification, contract, test, migration, or diagram.

A useful compressed model is:

> **Roles own responsibilities. Modules implement roles. Interfaces expose modules. Contracts govern interfaces. Boundaries separate concerns. Constraints and invariants limit behavior. Patterns provide repeatable implementations.**
