# Chapter 18: Server Action

**The Book of Implementation™**

## Placement

Actions are domain-organized mutation operations under `lib/actions/`.

```text
lib/actions/
  adminActions.ts
  crmActions.ts
  invoicingActions.ts
  projectsActions.ts
  ...
```

The naming convention is `<domain>Actions.ts`.

## What an Action does

Actions are the write side of the operational architecture. CRUD is a useful mental model, except reads belong to Fetchers. An Action may still read existing state when that read is necessary to authorize the mutation, enforce an invariant, decide what to change, or return the resulting state.

Protected mutations are authenticated and authorized. Tenant-owned writes execute inside the intended tenant/RLS context. Untrusted mutation input is validated with the appropriate domain Zod schema before it is trusted.

Actions may use the established database helpers: Prisma selects for precise result shapes, DTO mappers for application-safe output, and transaction helpers when multiple database facts must succeed or fail together.

## Golden pattern

```ts
"use server";

export async function changeAdminMembership(rawInput: unknown) {
  const input = changeAdminMembershipSchema.parse(rawInput);
  const identity = await requireIdentity();

  return withTenantTransaction(identity, async (tx, access) => {
    assertPermission(access, "admin:users");

    if (input.membershipId === access.membershipId) {
      throw new InvariantViolationError("An administrator cannot change their own role.");
    }

    const membership = await updateMembershipAdministrationTx(tx, {
      organizationId: access.organizationId,
      actorUserId: access.userId,
      membershipId: input.membershipId,
      role: input.role,
    });

    return toAdminMembershipDTO(membership);
  });
}
```

## Boundary

An Action owns mutation orchestration, not every business process in the application. When a named business operation requires composition across existing Actions, Fetchers, integrations, calculations, or other capabilities, that composition belongs in a domain Workflow rather than being duplicated inside the Action.
