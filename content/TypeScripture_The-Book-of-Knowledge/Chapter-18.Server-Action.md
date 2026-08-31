# Chapter 18: Server Action

**The Book of Knowledge™**

## Definition

- A Server Action is a thin Next.js mutation adapter. It receives untrusted UI intent, validates it, establishes the server Actor, delegates one application use case to a Workflow, maps errors/results, and owns successful framework effects.

## Responsibilities

- Own the framework mutation entry boundary. Normalize untrusted mutation input, run runtime validation, resolve Actor, invoke one Workflow, apply successful framework effects, and return a transport-safe result when the framework does not redirect.

## Non-responsibilities

- No persistence mechanics, provider mechanics, database transaction ownership, resource transition policy, multi-step business sequence, webhook processing, or rendering. Resource authorization remains near authoritative current facts in the Workflow.

## Rule

- Actions write in the architectural grammar by adapting mutation intent into the authoritative write use case. They do not personally own persistence mechanics.
