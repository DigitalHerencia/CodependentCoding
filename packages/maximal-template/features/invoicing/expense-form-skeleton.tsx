import { FormLoadingTemplate } from "@/components/templates/shared-templates";

export function ExpenseFormSkeleton() {
  return <FormLoadingTemplate fields={4} />;
}
