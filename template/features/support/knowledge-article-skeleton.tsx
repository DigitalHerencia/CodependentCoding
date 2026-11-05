import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function KnowledgeArticleSkeleton() {
  return <WorkspaceLoadingState route="/support/knowledge-base/[articleId]" />;
}
