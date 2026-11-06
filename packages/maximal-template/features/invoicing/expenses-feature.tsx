import { loadExpensesWorkflow } from "@/lib/workflows/invoicingWorkflows";
import { ExpensesFeatureClient } from "./expenses-feature.client";

export async function ExpensesFeature() {
  const { expenses } = await loadExpensesWorkflow();
  return <ExpensesFeatureClient expenses={expenses} />;
}
