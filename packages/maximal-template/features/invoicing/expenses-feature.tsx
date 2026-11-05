import { getExpenses } from "@/lib/fetchers/invoicingFetchers";
import { ExpensesFeatureClient } from "./expenses-feature.client";
export async function ExpensesFeature() {
  return <ExpensesFeatureClient expenses={await getExpenses()} />;
}
