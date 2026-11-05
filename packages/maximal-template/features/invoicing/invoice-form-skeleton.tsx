import { FormLoadingState } from "@/components/blocks/shared-blocks";

export function InvoiceFormSkeleton() {
  return <FormLoadingState fields={6} width="5xl" />;
}
