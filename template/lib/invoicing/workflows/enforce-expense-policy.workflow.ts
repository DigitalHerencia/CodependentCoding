import { getExpenses } from "../../fetchers/invoicingFetchers";
export async function enforceExpensePolicyWorkflow(command: {
  expenseId: string;
  approvalLimit: string;
  receiptRequiredAt: string;
  hasReceipt: boolean;
}) {
  const expenses = await getExpenses(100);
  const expense = expenses.find((candidate) => candidate.id === command.expenseId);
  if (!expense) throw new Error("Expense was not found.");
  const amount = Number(expense.amount);
  if (!Number.isFinite(amount)) throw new Error("Expense amount is invalid.");
  return {
    requiresApproval: amount > Number(command.approvalLimit),
    receiptSatisfied:
      amount < Number(command.receiptRequiredAt) || command.hasReceipt,
  };
}
