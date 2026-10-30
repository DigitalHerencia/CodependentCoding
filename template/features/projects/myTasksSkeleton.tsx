// Why: Skeleton: matches the my-tasks layout so streaming does not shift the page.
import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function MyTasksSkeleton() {
  return <WorkspaceLoadingState route="/my-tasks" />;
}
