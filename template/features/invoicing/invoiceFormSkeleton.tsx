import { FormLoadingState } from "@/components/blocks/loading-states";

export function InvoiceFormSkeleton() {
  return <FormLoadingState fields={6} width="5xl" />;
}
