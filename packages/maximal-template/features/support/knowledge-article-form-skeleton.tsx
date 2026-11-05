import { FormLoadingState } from "@/components/blocks/shared-blocks";

export function KnowledgeArticleFormSkeleton() {
  return <FormLoadingState fields={3} width="4xl" />;
}
