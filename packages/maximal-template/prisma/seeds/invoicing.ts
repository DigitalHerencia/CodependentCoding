import { Prisma } from "@/generated/prisma/client";
import type { SeedContext } from "@/prisma/seeds/base";
import { calculateInvoiceTotals } from "@/lib/utils/invoicingMoney";
import { seedIds as uploadsSeedIds } from "@/prisma/seeds/uploads";

export const seedIds = {
  invoice: "00000000-0000-4000-8000-000000000070",
  invoiceLine: "00000000-0000-4000-8000-000000000071",
  expense: "00000000-0000-4000-8000-000000000072",
} as const;

export async function seed({
  tx,
  organization,
  ownerMembership,
}: SeedContext): Promise<void> {
  // Seed reruns preserve existing financial history instead of rewriting records.
  const calculated = calculateInvoiceTotals([
    { quantity: "1", unitPrice: "1000.00", taxRate: "0.0825" },
  ]);
  const lineSubtotal = calculated.subtotal;
  const lineTax = calculated.taxTotal;
  const lineTotal = calculated.total;
  const receipt = await tx.asset.findFirst({
    where: { id: uploadsSeedIds.asset, organizationId: organization.id },
    select: { id: true },
  });
  if (!receipt)
    throw new Error("Seed receipt is unavailable in the seed organization.");

  const invoice = await tx.invoice.upsert({
    where: {
      id: seedIds.invoice,
    },
    update: {},
    create: {
      id: seedIds.invoice,
      organizationId: organization.id,
      createdByMembershipId: ownerMembership.id,
      number: 1,
      customerName: "Acme Client",
      customerEmail: "billing@example.test",
      currency: "USD",
      subtotal: lineSubtotal,
      taxTotal: lineTax,
      total: lineTotal,
      status: "OPEN",
      approvedAt: new Date("2026-08-01T00:00:00.000Z"),
      approvedByMembershipId: ownerMembership.id,
      issuedAt: new Date("2026-08-01T00:00:00.000Z"),
      dueAt: new Date("2026-08-31T00:00:00.000Z"),
    },
  });

  if (invoice.organizationId !== organization.id)
    throw new Error("Seed invoice is unavailable in the seed organization.");

  await tx.invoiceLine.upsert({
    where: {
      id: seedIds.invoiceLine,
    },
    update: {},
    create: {
      id: seedIds.invoiceLine,
      organizationId: organization.id,
      invoiceId: invoice.id,
      position: 1,
      description: "Maximal Template Implementation",
      quantity: new Prisma.Decimal("1"),
      unitPrice: new Prisma.Decimal("1000.00"),
      taxRate: new Prisma.Decimal("0.0825"),
      lineSubtotal,
      lineTax,
      lineTotal,
    },
  });

  await tx.expense.upsert({
    where: {
      id: seedIds.expense,
    },
    update: {},
    create: {
      id: seedIds.expense,
      organizationId: organization.id,
      submittedByMembershipId: ownerMembership.id,
      receiptAssetId: uploadsSeedIds.asset,
      vendor: "Example Vendor",
      description: "Seed project expense",
      amount: new Prisma.Decimal("125.00"),
      currency: "USD",
      incurredAt: new Date("2026-08-05T00:00:00.000Z"),
      status: "APPROVED",
    },
  });
}
