import { FormLoadingState } from "@/components/blocks/loading-states";

export function CrmFormSkeleton() {
  return <FormLoadingState fields={4} />;
}
