import { FormLoadingState } from "@/components/blocks/shared-blocks";

export function CrmFormSkeleton() {
  return <FormLoadingState fields={4} />;
}
