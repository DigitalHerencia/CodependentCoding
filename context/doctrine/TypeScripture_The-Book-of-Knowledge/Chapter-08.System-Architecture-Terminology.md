# Chapter 08: System Architecture Terminology

**The Book of Knowledge™**

## Core definitions

- **Role**: named bundle of stable capabilities in a scope.
- **Responsibility**: work or decisions owned by one role/module/layer.
- **Boundary**: separation controlling knowledge, authority, data, or dependency crossing.
- **Constraint**: rule limiting permitted structure or behavior.
- **Invariant**: condition that must remain true across legal operations.
- **Contract**: inputs, outputs, guarantees, errors, dependencies, and obligations at a boundary.
- **Interface**: exposed surface through which a module is used.
- **Layer**: responsibility group with controlled dependency direction, not merely a directory.

## Application terms

- **Route/Page**: Next.js/framework boundary and rendered surface; not the business layer.
- **Feature**: server-first product-experience orchestration.
- **Block**: reusable pure presentation composition.
- **Primitive**: lowest domain-agnostic UI element.
- **Fetcher**: self-securing server-only protected read use case returning DTOs.
- **Server Action**: thin Next.js mutation adapter.
- **Workflow**: named application use-case coordinator.
- **Transaction Helper**: atomic DB-invariant operation using a transaction client.

## Security/data terms

- **Actor**: trusted server-side caller identity. **Membership** establishes tenant participation. **Capability** is stable business-operation vocabulary. **Policy** evaluates authority over explicit facts. **Readiness** is an operational/provider prerequisite, not authorization.
- **Private DB helper** is an implementation detail inside an approved data owner. It is not a public architectural layer and must not compete with Fetcher, Server Action, Workflow, or Transaction Helper as an application boundary.

## Deprecated ambiguity

- Avoid generic canonical interfaces named `service`, `manager`, `helper`, `utils`, `getData`, `saveThing`, `admin user`, or bare `account` unless a narrower domain meaning is explicitly defined.
