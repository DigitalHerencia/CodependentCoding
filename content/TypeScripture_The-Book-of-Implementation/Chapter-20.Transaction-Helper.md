# Chapter 20: Transaction Helper

**The Book of Implementation™**

## Runner and helper

```ts
export async function withTenantTransaction<T>(
  scope: TenantScope,
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await setTenantContext(tx, scope);
    return operation(tx);
  });
}

export async function archiveProjectTx(
  tx: Prisma.TransactionClient,
  input: { projectId: string; expectedVersion: number },
) {
  const result = await tx.project.updateMany({
    where: { id: input.projectId, version: input.expectedVersion, status: "ACTIVE" },
    data: { status: "ARCHIVED", version: { increment: 1 } },
  });
  if (result.count !== 1) throw new DomainConflict("CONFLICT");
  return tx.project.findUniqueOrThrow({ where: { id: input.projectId }, select: projectDetailSelect });
}
```

## Critical correction

- The older generic `prisma.$transaction(operation)` wrapper is insufficient as the canonical protected-tenant runner because it does not establish tenant/actor RLS context.
