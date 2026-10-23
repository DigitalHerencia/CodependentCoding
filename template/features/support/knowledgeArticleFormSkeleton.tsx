import { FormLoadingState } from "@/components/blocks/loading-states";

export function KnowledgeArticleFormSkeleton() {
  return <FormLoadingState fields={3} width="4xl" />;
}
