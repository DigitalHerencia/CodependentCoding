import { FormLoadingState } from "@/components/blocks/loading-states";

export function AudienceFormSkeleton() {
  return <FormLoadingState fields={3} />;
}
