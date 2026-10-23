import { FormLoadingState } from "@/components/blocks/loading-states";

export function CampaignFormSkeleton() {
  return <FormLoadingState fields={5} />;
}
