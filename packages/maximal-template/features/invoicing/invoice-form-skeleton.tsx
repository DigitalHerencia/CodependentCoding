import { FormLoadingTemplate } from "@/components/templates/shared-templates";

export function InvoiceFormSkeleton() {
  return <FormLoadingTemplate fields={6} width="5xl" />;
}
