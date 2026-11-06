// Why: Skeleton: matches the my-tasks layout so streaming does not shift the page.
import { WorkspaceLoadingTemplate } from "@/components/templates/shared-templates";

export function MyTasksSkeleton() {
  return <WorkspaceLoadingTemplate route="/my-tasks" />;
}
