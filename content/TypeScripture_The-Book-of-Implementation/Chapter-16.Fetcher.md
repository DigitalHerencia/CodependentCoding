# Chapter 16: Fetcher

**The Book of Implementation™**

## Placement

Fetchers are domain-organized read operations under `lib/fetchers/`.

```text
lib/fetchers/
  adminFetchers.ts
  crmFetchers.ts
  projectsFetchers.ts
  ...
```

The naming convention is `<domain>Fetchers.ts`.

## What a Fetcher does

A Fetcher owns an application read. Protected reads authenticate and authorize, enter the appropriate tenant/RLS database context, query only the required data, and return an application-safe shape.

## Golden pattern

```ts
import "server-only";

export async function getAdminMemberships() {
  return withAuthenticatedRead(async (tx, access) => {
    assertPermission(access, "admin:users");

    const rows = await tx.membership.findMany({
      where: { organizationId: access.organizationId },
      select: adminMembershipSelect,
    });

    return rows.map(toAdminMembershipDTO);
  });
}
```

Prisma selects keep reads explicit and typed; DTO mappers keep persistence-shaped records from casually leaking across the data boundary. Read criteria may also use Zod validation when they cross an untrusted runtime boundary.

## Rules

Fetchers do not own mutations. They do not call provider SDKs merely to assemble a page. They may perform the reads necessary to answer their read use case, including multiple bounded reads when that is genuinely the read being requested.

Protected tenant reads should use the tenant/RLS-scoped database context rather than casually calling the root Prisma client.
