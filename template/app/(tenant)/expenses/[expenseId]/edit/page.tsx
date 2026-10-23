import { ExpenseEditFeature } from "@/features/invoicing/expenseEditFeature";

export default async function Page({
  params,
}: {
  params: Promise<{ expenseId: string }>;
}) {
  const { expenseId } = await params;
  return <ExpenseEditFeature expenseId={expenseId} />;
}
