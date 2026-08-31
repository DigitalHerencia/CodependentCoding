# Chapter 16: Fetcher

**The Book of Implementation™**

## Placement

- `lib/fetchers/<domain>/<verb>-<representation>.fetcher.ts`

## Canonical implementation

```ts
import "server-only";

export async function getProjectDetail(input: unknown): Promise<ProjectDto | null> {
  const criteria = projectDetailInputSchema.parse(input);
  const actor = await requireActor();
  const scope = await requireProjectReadScope(actor, criteria.organizationId);

  return withTenantTransaction(scope, async (tx) => {
    const record = await tx.project.findFirst({
      where: {
        id: criteria.projectId,
        organizationId: scope.organizationId,
        ...scope.projectWhere,
      },
      select: projectDetailSelect,
    });
    return record ? toProjectDto(record) : null;
  });
}
```

## Critical correction

- The older “Golden Fetcher” examples that call the root `prisma` client directly are not canonical for protected tenant reads. Protected tenant reads use the RLS-scoped transaction client.

## Testing

- Unit-test parsing, mapping, and policy composition. Use real PostgreSQL/runtime-role tests for cross-tenant containment. Architecture tests forbid writes, provider SDKs, and framework effects.
