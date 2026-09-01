# Chapter 20: Transaction Helper

**The Book of Implementation™**

## The three database helper concerns

```text
lib/db/
  selects/       # exact typed Prisma retrieval shapes
  dto/           # persistence record -> application DTO
  transactions/  # atomic local database operations
```

### Prisma Selects

A Prisma select defines exactly what data an operation needs instead of retrieving an entire model by default. The benefit is not only efficiency: the select is also a typed persistence contract because Prisma can derive the result type from the exact projection.

### DTO Mappers

A DTO mapper is the boundary between persistence-shaped data and application-shaped data. It deliberately chooses what crosses the boundary and normalizes database/runtime representations such as `Date` values into transport-safe forms when required.

### Transaction Helpers

A transaction helper groups database facts that must succeed or fail together. The key property is **atomicity**. Atomicity means all-or-nothing; idempotency is a different property meaning repeated execution converges without unintended duplicate effects. Transactions can participate in idempotent designs, especially around provider/webhook work, but a transaction is not automatically idempotent.

## Golden pattern

```ts
export async function updateMembershipAdministrationTx(
  tx: Prisma.TransactionClient,
  input: UpdateMembershipAdministrationInput,
) {
  const updated = await tx.membership.update({
    where: { id: input.membershipId },
    data: input.data,
    select: adminMembershipSelect,
  });

  await tx.auditEvent.create({
    data: {
      organizationId: input.organizationId,
      actorUserId: input.actorUserId,
      action: "admin.membership.updated",
      resourceType: "Membership",
      resourceId: updated.id,
    },
  });

  return updated;
}
```

If the update succeeds but the audit write fails, the logical operation should not be left half-complete. Both writes belong to the same transaction.

## Tenant runners

`lib/db/tenant.ts` establishes authenticated local user/membership context and transaction-local tenant/RLS context before protected work runs. `lib/db/provider.ts` provides transaction context for provider/external operations, including organization context when supplied by the trusted provider-side flow. `lib/db/client.ts` owns the Prisma client configured with the Neon adapter.

Network/provider calls do not belong inside long-lived database transactions.
