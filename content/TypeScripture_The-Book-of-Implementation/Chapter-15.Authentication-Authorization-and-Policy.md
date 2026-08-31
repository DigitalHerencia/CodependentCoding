# Chapter 15: Authentication, Authorization, and Policy

**The Book of Implementation™**

## Canonical placement

```text
lib/auth/                  # Clerk → local Actor
lib/authz/                 # membership, capabilities, scopes, policies
lib/db/internal/identity.* # narrowly scoped identity/membership persistence helpers
lib/db/transactions/       # RLS-scoped transaction runner
prisma/                    # grants and RLS policies
```

## RLS runner

```ts
export async function withTenantTransaction<T>(
  scope: { organizationId: string; userId: string },
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.organization_id', ${scope.organizationId}, true)`;
    await tx.$executeRaw`SELECT set_config('app.user_id', ${scope.userId}, true)`;
    return operation(tx);
  });
}
```

## Implementation rule

- Auth/AuthZ modules may depend on narrowly approved private identity/membership persistence reads. This is an explicit security/data boundary, not permission for arbitrary Prisma access throughout `auth/`.
- Runtime credentials must own no protected table and must not have `BYPASSRLS`; RLS is enabled and forced on protected tables.
