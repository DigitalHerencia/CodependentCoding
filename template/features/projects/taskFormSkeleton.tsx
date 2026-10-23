import { FormLoadingState } from "@/components/blocks/loading-states";

export function TaskFormSkeleton() {
  return <FormLoadingState fields={4} />;
}
