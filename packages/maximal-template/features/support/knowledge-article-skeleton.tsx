import { WorkspaceLoadingTemplate } from "@/components/templates/shared-templates";

export function KnowledgeArticleSkeleton() {
  return (
    <WorkspaceLoadingTemplate route="/support/knowledge-base/[articleId]" />
  );
}
