import { WorkspaceLoadingTemplate } from "@/components/templates/shared-templates";

export function AudienceSkeleton() {
  return <WorkspaceLoadingTemplate route="/marketing/audiences/[audienceId]" />;
}
