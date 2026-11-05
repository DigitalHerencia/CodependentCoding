import { FormLoadingState } from "@/components/blocks/shared-blocks";

export function ExpenseFormSkeleton() {
  return <FormLoadingState fields={4} />;
}
