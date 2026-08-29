import { ExpensesFeature } from "@/features/invoicing/expensesFeature";

// URL ownership stops here; orchestration is delegated to the feature.
export default function Page() {
  return <ExpensesFeature />;
}
