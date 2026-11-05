import { FormLoadingState } from "@/components/blocks/shared-blocks";

export function CampaignFormSkeleton() {
  return <FormLoadingState fields={5} />;
}
