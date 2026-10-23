import { FormLoadingState } from "@/components/blocks/loading-states";

export function ProjectFormSkeleton() {
  return <FormLoadingState fields={4} />;
}
