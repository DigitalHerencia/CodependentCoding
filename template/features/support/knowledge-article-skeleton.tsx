import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function KnowledgeArticleSkeleton() {
  return <WorkspaceLoadingState route="/support/knowledge-base/[articleId]" />;
}
