export function determineInvoiceStatus({
  status,
  dueAt,
  paidAt,
  now = new Date(),
}: {
  status: "DRAFT" | "OPEN" | "PAID" | "VOID" | "OVERDUE";
  dueAt: Date | null;
  paidAt: Date | null;
  now?: Date;
}) {
  if (status === "VOID") return "VOID" as const;
  if (paidAt || status === "PAID") return "PAID" as const;
  if (dueAt && dueAt < now && status !== "DRAFT") return "OVERDUE" as const;
  return status === "OVERDUE" ? ("OPEN" as const) : status;
}

